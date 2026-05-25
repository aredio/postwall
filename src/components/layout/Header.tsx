import { Link } from "react-router-dom"
import { Sparkles } from "lucide-react"

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <Link to="/" className="flex items-center space-x-2">
          <Sparkles className="h-6 w-6 text-accent" />
          <span className="font-bold text-xl font-heading tracking-tight">PostWall</span>
        </Link>
        <div className="flex flex-1 items-center justify-end space-x-4">
          <nav className="flex items-center space-x-2">
            <Link to="/board" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
              Ver Mural
            </Link>
          </nav>
        </div>
      </div>
    </header>
  )
}
