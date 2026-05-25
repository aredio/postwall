import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { api } from "@/services/api"

export type PostWithImages = {
  id: string
  event_id: string
  author_name: string | null
  message: string
  approved: boolean
  created_at: string
  post_images: { id: string; image_url: string }[]
}

export function usePosts() {
  const [posts, setPosts] = useState<PostWithImages[]>([])
  const [loading, setLoading] = useState(true)
  const [eventId, setEventId] = useState<string | null>(null)

  const fetchPosts = async (evtId: string) => {
    const { data, error } = await supabase
      .from('posts')
      .select(`
        *,
        post_images (
          id,
          image_url
        )
      `)
      .eq('event_id', evtId)
      .eq('approved', true)
      .order('created_at', { ascending: false })

    if (!error && data) {
      setPosts(data as unknown as PostWithImages[])
    }
    setLoading(false)
  }

  useEffect(() => {
    let subscription: ReturnType<typeof supabase.channel>

    async function init() {
      const event = await api.getDemoEvent()
      if (event) {
        setEventId(event.id)
        await fetchPosts(event.id)

        // Subscribe to changes
        subscription = supabase
          .channel('public:posts')
          .on(
            'postgres_changes',
            { event: 'INSERT', schema: 'public', table: 'posts' },
            () => {
              // Quando um post é criado, nós refazemos o fetch em vez de só adicionar no state.
              // O motivo é que precisamos aguardar também a inserção das imagens na tabela `post_images`
              // que pode demorar alguns milisegundos a mais.
              setTimeout(() => {
                fetchPosts(event.id)
              }, 1000) // Delay de 1s para dar tempo das imagens subirem
            }
          )
          .subscribe()
      } else {
        setLoading(false)
      }
    }

    init()

    return () => {
      if (subscription) {
        supabase.removeChannel(subscription)
      }
    }
  }, [])

  return { posts, loading, eventId }
}
