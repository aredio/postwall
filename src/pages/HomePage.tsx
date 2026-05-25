import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { MessageSquarePlus } from "lucide-react"
import { Link } from "react-router-dom"
import { QRCodeSVG } from "qrcode.react"

export function HomePage() {
  // Pega a URL exata de onde o site está rodando (localhost ou Vercel)
  const postUrl = `${window.location.origin}/post`

  return (
    <div className="container py-10 md:py-20 max-w-4xl">
      <div className="flex flex-col items-center text-center space-y-8">
        
        <div className="space-y-4">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">
            Semana da Indústria 2026
          </h1>
          <p className="text-xl text-muted-foreground max-w-[600px] mx-auto">
            Compartilhe suas fotos e experiências no nosso mural ao vivo.
          </p>
        </div>

        <Card className="w-full max-w-md overflow-hidden border-2 border-primary/10 bg-card/50 backdrop-blur">
          <CardContent className="p-8 flex flex-col items-center space-y-6">
            <div className="bg-white p-4 rounded-xl shadow-sm">
              <QRCodeSVG 
                value={postUrl} 
                size={192} 
                style={{ height: "auto", maxWidth: "100%", width: "100%" }}
              />
            </div>
            <p className="text-sm font-medium text-muted-foreground text-center">
              Escaneie o QR Code ou acesse:<br/>
              <span className="font-bold text-foreground break-all">
                {postUrl.replace('https://', '').replace('http://', '')}
              </span>
            </p>
            <Button asChild size="lg" className="w-full rounded-full font-semibold">
              <Link to="/post">
                <MessageSquarePlus className="mr-2 w-5 h-5" />
                Compartilhar Experiência
              </Link>
            </Button>
          </CardContent>
        </Card>

      </div>
    </div>
  )
}
