import { Outlet } from "react-router-dom"
import { Header } from "./Header"

export function Layout() {
  return (
    <div className="relative flex min-h-screen flex-col bg-background font-sans antialiased">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  )
}
