import { usePosts } from "@/hooks/usePosts"
import { PostCard } from "@/features/board/PostCard"
import { Loader2, Sparkles, QrCode } from "lucide-react"

export function BoardPage() {
  const { posts, loading } = usePosts()

  if (loading) {
    return (
      <div className="flex h-[80vh] items-center justify-center flex-col space-y-4">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
        <p className="text-muted-foreground animate-pulse">Conectando ao mural ao vivo...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-muted/10">
      <div className="container py-8">
        
        {/* Board Header - Good for TV display */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-10 bg-card p-6 rounded-2xl shadow-sm border border-border/50">
          <div className="flex items-center space-x-4 mb-4 md:mb-0">
            <div className="p-3 bg-primary/10 rounded-xl text-primary">
              <Sparkles className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight">Demo Event 2026</h1>
              <p className="text-muted-foreground">O que está rolando agora</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3 bg-muted/50 p-3 rounded-xl border border-border">
            <QrCode className="w-10 h-10 text-foreground" />
            <div className="text-sm font-medium">
              <span className="text-muted-foreground block">Participe também:</span>
              <span className="font-bold">postwall.app/demo</span>
            </div>
          </div>
        </div>

        {/* Masonry Grid */}
        {posts.length === 0 ? (
          <div className="text-center py-20 flex flex-col items-center">
            <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-6">
              <Sparkles className="w-10 h-10 text-muted-foreground" />
            </div>
            <h2 className="text-2xl font-bold mb-2">O mural está vazio!</h2>
            <p className="text-muted-foreground">Seja o primeiro a compartilhar uma foto ou mensagem.</p>
          </div>
        ) : (
          <div className="columns-1 md:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6">
            {posts.map((post) => (
              <div key={post.id} className="animate-in fade-in zoom-in-95 duration-500 fill-mode-both">
                <PostCard post={post} />
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  )
}
