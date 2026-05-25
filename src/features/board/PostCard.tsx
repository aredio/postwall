import { Card, CardContent, CardHeader } from "@/components/ui/card"
import type { PostWithImages } from "@/hooks/usePosts"
import { formatDistanceToNow } from "date-fns"
import { ptBR } from "date-fns/locale"

interface PostCardProps {
  post: PostWithImages
}

export function PostCard({ post }: PostCardProps) {
  const author = post.author_name || "Anônimo"
  const initials = author.substring(0, 2).toUpperCase()
  
  const timeAgo = formatDistanceToNow(new Date(post.created_at), { 
    addSuffix: true,
    locale: ptBR 
  })

  // Dynamic grid layout for images based on count
  const renderImages = () => {
    const images = post.post_images
    if (!images || images.length === 0) return null

    if (images.length === 1) {
      return (
        <img src={images[0].image_url} alt="Post" className="w-full h-auto max-h-[400px] object-cover rounded-xl" />
      )
    }

    if (images.length === 2) {
      return (
        <div className="grid grid-cols-2 gap-2">
          {images.map(img => (
            <img key={img.id} src={img.image_url} alt="Post" className="w-full aspect-square object-cover rounded-xl" />
          ))}
        </div>
      )
    }

    // 3 or 4 images
    return (
      <div className="grid grid-cols-2 gap-2">
        {images.slice(0, 4).map((img, idx) => (
          <img 
            key={img.id} 
            src={img.image_url} 
            alt="Post" 
            className={`w-full object-cover rounded-xl ${images.length === 3 && idx === 0 ? 'col-span-2 aspect-[2/1]' : 'aspect-square'}`} 
          />
        ))}
      </div>
    )
  }

  return (
    <div className="relative overflow-hidden rounded-xl p-[2px] group break-inside-avoid mb-6 shadow-[0_0_15px_rgba(57,255,20,0.1)] hover:shadow-[0_0_25px_rgba(57,255,20,0.2)] transition-shadow duration-300">
      {/* Elemento que faz a borda animada (girando no fundo) */}
      <div className="absolute top-1/2 left-1/2 w-[200%] h-[200%] md:w-[300%] md:h-[300%] -translate-x-1/2 -translate-y-1/2 animate-[spin_4s_linear_infinite] bg-[conic-gradient(from_0deg,transparent_70%,#39ff14_100%)] opacity-80" />
      
      {/* O card real que fica por cima do gradiente como uma máscara */}
      <Card className="relative h-full w-full border-none rounded-[10px] bg-card/90 backdrop-blur-md overflow-hidden z-10">
        <CardHeader className="p-4 pb-2 flex flex-row items-center space-x-3 space-y-0">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary to-accent flex items-center justify-center text-primary-foreground font-bold shadow-inner">
            {initials}
          </div>
          <div className="flex flex-col">
            <span className="font-semibold text-sm leading-tight">{author}</span>
            <span className="text-xs text-muted-foreground">{timeAgo}</span>
          </div>
        </CardHeader>
        
        <CardContent className="p-4 pt-2 space-y-4">
          <p className="text-base text-foreground/90 whitespace-pre-wrap leading-relaxed">
            {post.message}
          </p>
          
          {renderImages()}
        </CardContent>
      </Card>
    </div>
  )
}
