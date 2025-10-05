import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const GithubIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
  </svg>
)

const ExternalLinkIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
    <polyline points="15 3 21 3 21 9" />
    <line x1="10" y1="14" x2="21" y2="3" />
  </svg>
)

type ProjectCardProps = {
  project: {
    id: string
    github_repo_name: string
    github_owner: string
    github_repo_url: string
    website_url?: string
    description?: string
    tasks?: Array<{ status: string; reward_amount_dot: string | number }>
  }
  variant?: "compact" | "detailed"
  className?: string
}

export function ProjectCard({ project, variant = "compact", className }: ProjectCardProps) {
  const openTasks = project.tasks?.filter((t) => t.status === "open") || []
  const totalRewards = openTasks.reduce((sum, t) => sum + Number(t.reward_amount_dot), 0) || 0

  if (variant === "compact") {
    return (
      <Link
        href={`/projects/${project.id}`}
        className={cn(
          "group glass-card rounded-2xl p-6 sm:p-8 transition-all duration-300 hover:border-[#EC4899]/40 hover:shadow-lg hover:shadow-[#EC4899]/10 border-white/5",
          className,
        )}
      >
        <div className="flex items-start gap-6">
          <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-[#EC4899]/20 to-pink-600/20 flex-shrink-0 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
            <GithubIcon className="h-8 w-8 text-[#EC4899]" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <h3 className="font-bold text-2xl group-hover:text-[#EC4899] transition-colors mb-2">
                  {project.github_repo_name}
                </h3>
                <p className="text-sm text-gray-400">@{project.github_owner}</p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <Badge variant="secondary" className="font-mono bg-[#EC4899]/10 text-[#EC4899] border-[#EC4899]/20">
                  {openTasks.length} tasks
                </Badge>
                <Badge variant="outline" className="font-mono border-pink-600/30 text-pink-400">
                  {totalRewards.toFixed(0)} DOT
                </Badge>
              </div>
            </div>
            {project.description && <p className="text-gray-400 line-clamp-2 leading-relaxed">{project.description}</p>}
          </div>
        </div>
      </Link>
    )
  }

  return (
    <div
      className={cn(
        "glass-card rounded-2xl p-6 sm:p-8 transition-all duration-300 hover:border-[#EC4899]/40 hover:shadow-lg hover:shadow-[#EC4899]/10 border-white/5 group",
        className,
      )}
    >
      <div className="flex flex-col sm:flex-row items-start gap-6">
        <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-[#EC4899]/20 to-pink-600/20 flex-shrink-0 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
          <GithubIcon className="h-10 w-10 text-[#EC4899]" />
        </div>
        <div className="flex-1 min-w-0 w-full space-y-4">
          <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
            <div className="w-full sm:w-auto">
              <h3 className="font-bold text-2xl sm:text-3xl mb-2 group-hover:text-[#EC4899] transition-colors">
                {project.github_repo_name}
              </h3>
              <p className="text-sm text-gray-400">@{project.github_owner}</p>
            </div>
            <div className="flex items-center gap-3 flex-shrink-0">
              <Button
                variant="ghost"
                size="icon"
                className="hover:text-[#EC4899] hover:bg-[#EC4899]/10 h-10 w-10 transition-colors"
                asChild
              >
                <a href={project.github_repo_url} target="_blank" rel="noopener noreferrer">
                  <GithubIcon className="h-5 w-5" />
                </a>
              </Button>
              {project.website_url && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="hover:text-[#EC4899] hover:bg-[#EC4899]/10 h-10 w-10 transition-colors"
                  asChild
                >
                  <a href={project.website_url} target="_blank" rel="noopener noreferrer">
                    <ExternalLinkIcon className="h-5 w-5" />
                  </a>
                </Button>
              )}
            </div>
          </div>
          {project.description && <p className="text-gray-400 line-clamp-2 leading-relaxed">{project.description}</p>}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-2">
            <div className="flex gap-3 flex-wrap">
              <Badge
                variant="secondary"
                className="font-mono text-sm bg-[#EC4899]/10 text-[#EC4899] border-[#EC4899]/20"
              >
                {openTasks.length} open tasks
              </Badge>
              <Badge variant="outline" className="font-mono text-sm border-pink-600/30 text-pink-400">
                {totalRewards.toFixed(0)} DOT
              </Badge>
            </div>
            <Button
              className="bg-gradient-to-r from-[#EC4899] to-pink-600 hover:opacity-90 transition-opacity w-full sm:w-auto"
              size="sm"
              asChild
            >
              <Link href={`/projects/${project.id}`}>View Tasks</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
