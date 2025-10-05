"use client"

import { useScrollReveal } from "@/hooks/use-scroll-reveal"

interface Stat {
  value: string
  label: string
  company?: string
}

interface PremiumStatsProps {
  stats: Stat[]
}

export function PremiumStats({ stats }: PremiumStatsProps) {
  const ref = useScrollReveal<HTMLDivElement>()

  return (
    <section ref={ref.ref} className="border-y border-border/40">
      <div className="container mx-auto py-24 md:py-32">
        <div
          className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-border/40 ${
            ref.isVisible ? "animate-fade-in" : "opacity-0"
          }`}
        >
          {stats.map((stat, i) => (
            <div
              key={i}
              className={`bg-background p-12 flex flex-col justify-between min-h-[280px] ${
                ref.isVisible ? "opacity-0 animate-fade-in-up" : "opacity-0"
              }`}
              style={{ animationDelay: ref.isVisible ? `${i * 0.1}s` : "0s" }}
            >
              <div className="space-y-4">
                <div className="text-5xl md:text-6xl font-bold tracking-tight">{stat.value}</div>
                <div className="text-sm text-muted-foreground leading-relaxed">{stat.label}</div>
              </div>
              {stat.company && (
                <div className="text-lg font-semibold text-muted-foreground/60 mt-8">{stat.company}</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
