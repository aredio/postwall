import { BrowserRouter, Routes, Route } from "react-router-dom"
import { Toaster } from "@/components/ui/sonner"
import { Layout } from "@/components/layout/Layout"
import { HomePage } from "@/pages/HomePage"
import { PostPage } from "@/pages/PostPage"
import { BoardPage } from "@/pages/BoardPage"
import { LoginPage } from "@/pages/LoginPage"
import { AdminPage } from "@/pages/AdminPage"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/post" element={<PostPage />} />
          <Route path="/board" element={<BoardPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/admin" element={<AdminPage />} />
        </Route>
      </Routes>
      <Toaster position="top-center" richColors />
    </BrowserRouter>
  )
}

export default App
