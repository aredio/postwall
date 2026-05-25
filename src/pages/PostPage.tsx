import { PostForm } from "@/features/post/PostForm"
import { Link } from "react-router-dom"
import { ArrowLeft } from "lucide-react"

export function PostPage() {
  return (
    <div className="container py-8 max-w-2xl animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-6">
        <Link to="/" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar para Home
        </Link>
      </div>
      <PostForm />
    </div>
  )
}
