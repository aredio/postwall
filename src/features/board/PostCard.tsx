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
    <Card className="break-inside-avoid mb-6 overflow-hidden border-primary/5 shadow-md hover:shadow-lg transition-shadow duration-300 bg-card/80 backdrop-blur-sm">
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
  )
}
