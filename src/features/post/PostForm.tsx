import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ImagePlus, X, Send, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { api } from "@/services/api"
import { useNavigate } from "react-router-dom"

export function PostForm() {
  const [message, setMessage] = useState("")
  const [authorName, setAuthorName] = useState("")
  const [images, setImages] = useState<File[]>([])
  const [previews, setPreviews] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const navigate = useNavigate()

  const MAX_CHARS = 300
  const charsLeft = MAX_CHARS - message.length

  useEffect(() => {
    // Generate previews when images change
    const newPreviews = images.map(file => URL.createObjectURL(file))
    setPreviews(newPreviews)
    
    // Cleanup URLs
    return () => newPreviews.forEach(url => URL.revokeObjectURL(url))
  }, [images])

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files)
      // Limit to max 4 images to prevent abuse
      if (images.length + selectedFiles.length > 4) {
        toast.error("Você só pode enviar até 4 imagens por postagem.")
        return
      }
      setImages(prev => [...prev, ...selectedFiles])
    }
  }

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (message.trim().length === 0) {
      toast.error("Escreva uma mensagem antes de enviar!")
      return
    }

    if (message.length > MAX_CHARS) {
      toast.error("A mensagem excedeu o limite de caracteres.")
      return
    }

    setIsSubmitting(true)
    try {
      const event = await api.getDemoEvent()
      if (!event) {
        throw new Error("Evento não encontrado")
      }

      await api.createPost(event.id, message, authorName, images)
      
      toast.success("Postagem enviada com sucesso!")
      navigate("/board")
    } catch (error) {
      console.error(error)
      toast.error("Erro ao enviar a postagem. Tente novamente.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="w-full shadow-lg border-primary/10">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Compartilhe um momento</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6">
          
          <div className="space-y-2">
            <Label htmlFor="authorName" className="text-muted-foreground">Seu Nome (opcional)</Label>
            <Input 
              id="authorName" 
              placeholder="Como quer ser chamado?" 
              value={authorName}
              onChange={(e) => setAuthorName(e.target.value)}
              className="bg-muted/50 border-transparent focus-visible:bg-background"
              maxLength={50}
            />
          </div>

          <div className="space-y-2 relative">
            <Textarea 
              placeholder="O que está achando do evento? Escreva aqui..." 
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="min-h-[120px] resize-none bg-muted/50 border-transparent focus-visible:bg-background text-base"
              maxLength={MAX_CHARS}
            />
            <span className={`absolute bottom-3 right-3 text-xs font-mono ${charsLeft < 20 ? 'text-destructive font-bold' : 'text-muted-foreground'}`}>
              {charsLeft}
            </span>
          </div>

          {/* Image Previews */}
          {previews.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {previews.map((src, idx) => (
                <div key={idx} className="relative group rounded-xl overflow-hidden aspect-square border border-border">
                  <img src={src} alt="Preview" className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                  <button 
                    type="button"
                    onClick={() => removeImage(idx)}
                    className="absolute top-2 right-2 bg-black/60 text-white p-1 rounded-full backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}

        </CardContent>
        <CardFooter className="flex justify-between border-t p-4 bg-muted/20">
          
          <div>
            <input 
              type="file" 
              accept="image/*" 
              multiple 
              className="hidden" 
              ref={fileInputRef}
              onChange={handleImageSelect}
            />
            <Button 
              type="button" 
              variant="outline" 
              className="text-primary hover:bg-primary/10 rounded-full"
              onClick={() => fileInputRef.current?.click()}
              disabled={isSubmitting || images.length >= 4}
            >
              <ImagePlus className="w-5 h-5 mr-2" />
              Adicionar Fotos
            </Button>
          </div>

          <Button 
            type="submit" 
            className="rounded-full px-6 font-semibold"
            disabled={isSubmitting || message.trim().length === 0}
          >
            {isSubmitting ? (
              <Loader2 className="w-5 h-5 animate-spin mr-2" />
            ) : (
              <Send className="w-5 h-5 mr-2" />
            )}
            {isSubmitting ? "Enviando..." : "Enviar Post"}
          </Button>

        </CardFooter>
      </form>
    </Card>
  )
}
