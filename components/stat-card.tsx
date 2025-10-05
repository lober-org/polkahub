import { cn } from "@/lib/utils"

type StatCardProps = {
  value: string | number
  label: string
  className?: string
}

export function StatCard({ value, label, className }: StatCardProps) {
  return (
    <div className={cn("glass-card rounded-xl p-6 sm:p-8 text-center", className)}>
      <div className="text-4xl sm:text-5xl font-bold mb-2 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
        {value}
      </div>
      <div className="text-sm text-muted-foreground font-medium">{label}</div>
    </div>
  )
}
