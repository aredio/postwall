import { usePosts } from "@/hooks/usePosts"
import { PostCard } from "@/features/board/PostCard"
import { Loader2, Sparkles } from "lucide-react"
import { QRCodeSVG } from "qrcode.react"
import { AnimatedBackground } from "@/components/AnimatedBackground"

export function BoardPage() {
  const { posts, loading } = usePosts()
  const postUrl = `${window.location.origin}/post`

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center flex-col space-y-4 bg-black text-white">
        <AnimatedBackground />
        <Loader2 className="w-12 h-12 animate-spin text-white/50" />
        <p className="text-white/70 animate-pulse font-medium">Conectando ao mural ao vivo...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen relative overflow-hidden text-white">
      <AnimatedBackground />
      
      <div className="container relative z-10 py-8">
        
        {/* Board Header - Adaptado para o fundo escuro com Glassmorphism */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-10 bg-black/40 backdrop-blur-md p-6 rounded-2xl shadow-2xl border border-white/10">
          <div className="flex items-center space-x-4 mb-6 md:mb-0">
            <div className="p-3 bg-white/10 rounded-xl text-white">
              <Sparkles className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight drop-shadow-md">
                Semana da Indústria 2026
              </h1>
              <p className="text-white/70 mt-1">Compartilhe conosco sua experiência no evento!</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4 bg-white/10 p-3 pr-6 rounded-xl border border-white/5 backdrop-blur-sm shadow-inner">
            <div className="bg-white p-2 rounded-lg">
              <QRCodeSVG 
                value={postUrl} 
                size={64} 
              />
            </div>
            <div className="text-sm">
              <span className="text-white/70 block mb-1">Participe do telão:</span>
              <span className="font-bold text-lg tracking-wide">
                {postUrl.replace('https://', '').replace('http://', '')}
              </span>
            </div>
          </div>
        </div>

        {/* Masonry Grid */}
        {posts.length === 0 ? (
          <div className="text-center py-32 flex flex-col items-center bg-black/20 backdrop-blur-sm rounded-3xl border border-white/5">
            <div className="w-24 h-24 bg-white/10 rounded-full flex items-center justify-center mb-6 shadow-inner">
              <Sparkles className="w-10 h-10 text-white/60" />
            </div>
            <h2 className="text-2xl md:text-3xl font-bold mb-3 drop-shadow-md">O mural está vazio!</h2>
            <p className="text-white/60 max-w-md">Seja o primeiro a compartilhar uma foto ou mensagem e aparecer aqui no telão.</p>
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
