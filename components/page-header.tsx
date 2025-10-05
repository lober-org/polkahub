import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

type PageHeaderProps = {
  title: string | ReactNode
  description?: string
  className?: string
  children?: ReactNode
}

export function PageHeader({ title, description, className, children }: PageHeaderProps) {
  return (
    <section
      className={cn(
        "border-b border-border/40 bg-gradient-to-br from-primary/5 via-transparent to-accent/5",
        className,
      )}
    >
      <div className="container py-16 sm:py-20 md:py-24">
        <div className="max-w-3xl px-4">
          {typeof title === "string" ? (
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-3 sm:mb-4">{title}</h1>
          ) : (
            title
          )}
          {description && <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">{description}</p>}
          {children}
        </div>
      </div>
    </section>
  )
}
