import type React from "react"
import "./css/Layout.css"
interface LayoutProps {
  children: React.ReactNode
  title: string
  footer: string
}

export default function Layout({ children, title, footer }: LayoutProps) {
  return (
    <div className="app-container">
      <header className="header">
        <h1>{title}</h1>
      </header>

      {children}
      
      <footer className="footer">
        <p>{footer}</p>
      </footer>
    </div>
  )
}

