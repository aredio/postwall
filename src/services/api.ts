import { supabase } from '../lib/supabase'

export const api = {
  async getDemoEvent() {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .eq('slug', 'demo-event')
      .single()
      
    if (error) {
       console.error("Erro ao buscar evento demo:", error)
       return null
    }
    return data
  },

  async uploadImage(eventId: string, postId: string, file: File): Promise<string | null> {
    const fileExt = file.name.split('.').pop()
    const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`
    const filePath = `${eventId}/${postId}/${fileName}`

    const { error } = await supabase.storage
      .from('event-media')
      .upload(filePath, file)

    if (error) {
      console.error('Error uploading image:', error)
      return null
    }

    const { data: { publicUrl } } = supabase.storage
      .from('event-media')
      .getPublicUrl(filePath)

    return publicUrl
  },

  async createPost(eventId: string, message: string, authorName: string, images: File[]) {
    // Gerar o ID no lado do cliente para não precisarmos fazer SELECT após o INSERT
    // Isso evita o erro de RLS "new row violates row-level security policy", 
    // já que o usuário anônimo não tem permissão para dar SELECT em um post approved: false
    const postId = crypto.randomUUID()

    // 1. Inserir a postagem
    const { error: postError } = await supabase
      .from('posts')
      .insert({
        id: postId,
        event_id: eventId,
        message,
        author_name: authorName || null,
        approved: false // Precisa de aprovação agora
      })

    if (postError) {
      throw new Error(postError.message || 'Erro ao criar a postagem')
    }

    // 2. Fazer o upload das imagens associadas
    if (images && images.length > 0) {
      const uploadPromises = images.map(async (file) => {
        const publicUrl = await this.uploadImage(eventId, postId, file)
        if (publicUrl) {
          await supabase
            .from('post_images')
            .insert({
              post_id: postId,
              image_url: publicUrl
            })
        }
      })
      
      await Promise.all(uploadPromises)
    }

    return { id: postId }
  },

  // Moderação
  async getPendingPosts(eventId: string) {
    const { data, error } = await supabase
      .from('posts')
      .select(`
        *,
        post_images (
          id,
          image_url
        )
      `)
      .eq('event_id', eventId)
      .eq('approved', false)
      .order('created_at', { ascending: true })

    if (error) {
      console.error('Erro ao buscar posts pendentes:', error)
      return []
    }
    return data
  },

  async getApprovedPosts(eventId: string) {
    const { data, error } = await supabase
      .from('posts')
      .select(`
        *,
        post_images (
          id,
          image_url
        )
      `)
      .eq('event_id', eventId)
      .eq('approved', true)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Erro ao buscar posts aprovados:', error)
      return []
    }
    return data
  },

  async approvePost(postId: string) {
    const { error } = await supabase
      .from('posts')
      .update({ approved: true })
      .eq('id', postId)
      
    if (error) throw new Error(error.message)
  },

  async deletePost(postId: string) {
    const { error } = await supabase
      .from('posts')
      .delete()
      .eq('id', postId)
      
    if (error) throw new Error(error.message)
  }
}
