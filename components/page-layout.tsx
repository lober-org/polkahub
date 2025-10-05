import type { ReactNode } from "react"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { ParticlesBackground } from "@/components/particles-background"

type PageLayoutProps = {
  children: ReactNode
  className?: string
}

export function PageLayout({ children, className }: PageLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col relative">
      <ParticlesBackground />
      <div className="gradient-overlay" />

      <div className="relative z-10">
        <SiteHeader />
        <main className={className || "flex-1"}>{children}</main>
        <SiteFooter />
      </div>
    </div>
  )
}
