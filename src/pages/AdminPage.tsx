import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { supabase } from "@/lib/supabase"
import { api } from "@/services/api"
import type { PostWithImages } from "@/hooks/usePosts"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { toast } from "sonner"
import { Loader2, CheckCircle, Trash2, LogOut } from "lucide-react"

export function AdminPage() {
  const [posts, setPosts] = useState<PostWithImages[]>([])
  const [loading, setLoading] = useState(true)
  const [eventId, setEventId] = useState<string | null>(null)
  const navigate = useNavigate()

  useEffect(() => {
    async function checkAuthAndLoad() {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        navigate("/login")
        return
      }

      const event = await api.getDemoEvent()
      if (event) {
        setEventId(event.id)
        loadPosts(event.id)
      } else {
        setLoading(false)
      }
    }

    checkAuthAndLoad()
  }, [navigate])

  const loadPosts = async (evtId: string) => {
    setLoading(true)
    const pendingPosts = await api.getPendingPosts(evtId)
    setPosts(pendingPosts as unknown as PostWithImages[])
    setLoading(false)
  }

  const handleApprove = async (postId: string) => {
    try {
      await api.approvePost(postId)
      setPosts(posts.filter(p => p.id !== postId))
      toast.success("Post aprovado com sucesso!")
    } catch (error) {
      toast.error("Erro ao aprovar o post")
    }
  }

  const handleDelete = async (postId: string) => {
    try {
      await api.deletePost(postId)
      setPosts(posts.filter(p => p.id !== postId))
      toast.success("Post removido e rejeitado!")
    } catch (error) {
      toast.error("Erro ao deletar o post")
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate("/login")
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-80px)]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="container py-10 max-w-4xl">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Painel de Moderação</h1>
          <p className="text-muted-foreground mt-1">
            {posts.length} {posts.length === 1 ? 'post aguardando' : 'posts aguardando'} aprovação.
          </p>
        </div>
        <Button variant="outline" onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          Sair
        </Button>
      </div>

      {posts.length === 0 ? (
        <Card className="flex flex-col items-center justify-center py-16 bg-muted/50">
          <CheckCircle className="h-16 w-16 text-muted-foreground/50 mb-4" />
          <h3 className="text-xl font-medium">Tudo limpo por aqui!</h3>
          <p className="text-muted-foreground">Não há novos posts aguardando aprovação no momento.</p>
        </Card>
      ) : (
        <div className="grid gap-6">
          {posts.map(post => (
            <Card key={post.id} className="overflow-hidden">
              <CardHeader className="bg-muted/30 py-3 border-b">
                <CardTitle className="text-base flex justify-between items-center">
                  <span>Autor: <span className="font-semibold">{post.author_name || "Anônimo"}</span></span>
                  <span className="text-xs text-muted-foreground font-normal">
                    {new Date(post.created_at).toLocaleString('pt-BR')}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <p className="text-base mb-4 whitespace-pre-wrap">{post.message}</p>
                {post.post_images && post.post_images.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-4">
                    {post.post_images.map(img => (
                      <img 
                        key={img.id} 
                        src={img.image_url} 
                        alt="Anexo" 
                        className="w-full aspect-square object-cover rounded-md border" 
                      />
                    ))}
                  </div>
                )}
              </CardContent>
              <CardFooter className="bg-muted/10 flex justify-end gap-3 p-4 border-t">
                <Button variant="destructive" onClick={() => handleDelete(post.id)}>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Rejeitar
                </Button>
                <Button onClick={() => handleApprove(post.id)}>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Aprovar
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
