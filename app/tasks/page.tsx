import { PageLayout } from "@/components/page-layout"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { mockTasks } from "@/lib/mock-data"

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

export default async function TasksPage() {
  const tasks = mockTasks

  return (
    <PageLayout>
      <div className="relative py-20 sm:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight">
              Available{" "}
              <span className="bg-gradient-to-r from-[#EC4899] to-pink-600 bg-clip-text text-transparent">Tasks</span>
            </h1>
            <p className="text-xl sm:text-2xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
              Find tasks that match your skills and start earning DOT rewards
            </p>
          </div>
        </div>
      </div>

      <section className="py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {!tasks || tasks.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-muted-foreground text-lg">No open tasks available. Check back soon!</p>
            </div>
          ) : (
            <div className="space-y-6 max-w-6xl mx-auto">
              {tasks.map((task: any, index: number) => (
                <div
                  key={task.id}
                  className="group glass-card border-white/5 hover:border-[#EC4899]/40 transition-all duration-300 rounded-2xl overflow-hidden animate-fade-in-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="p-6 sm:p-8">
                    <div className="flex flex-col lg:flex-row items-start justify-between gap-6">
                      {/* Left content */}
                      <div className="flex-1 space-y-4">
                        <div className="flex flex-wrap items-center gap-3">
                          <Link
                            href={`/projects/${task.project_id}`}
                            className="text-sm font-medium text-muted-foreground hover:text-[#EC4899] transition-colors"
                          >
                            {task.projects?.github_repo_name}
                          </Link>
                          {task.difficulty && (
                            <Badge variant="outline" className="text-xs border-border text-muted-foreground">
                              {task.difficulty}
                            </Badge>
                          )}
                        </div>

                        <h3 className="text-2xl sm:text-3xl font-bold group-hover:text-[#EC4899] transition-colors">
                          {task.title}
                        </h3>

                        {task.description && (
                          <p className="text-muted-foreground leading-relaxed line-clamp-2">{task.description}</p>
                        )}

                        {/* Tags */}
                        <div className="flex gap-2 flex-wrap pt-2">
                          {task.tags?.map((tag: string) => (
                            <Badge
                              key={tag}
                              variant="secondary"
                              className="text-xs bg-muted hover:bg-muted/80 border-border transition-colors"
                            >
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {/* Right content - Reward */}
                      <div className="flex flex-col items-start lg:items-end gap-4 lg:text-right">
                        <div className="space-y-1">
                          <div className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-[#EC4899] to-pink-600 bg-clip-text text-transparent">
                            {Number(task.reward_amount_dot).toFixed(2)}
                          </div>
                          <div className="text-sm text-muted-foreground font-medium">DOT Reward</div>
                        </div>

                        {/* Action buttons */}
                        <div className="flex gap-3 w-full lg:w-auto">
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1 lg:flex-none bg-transparent border-border hover:border-[#EC4899]/40 hover:bg-[#EC4899]/10"
                            asChild
                          >
                            <a href={task.github_issue_url} target="_blank" rel="noopener noreferrer">
                              <ExternalLinkIcon className="mr-2 h-4 w-4" />
                              View Issue
                            </a>
                          </Button>
                          <Button
                            size="sm"
                            className="flex-1 lg:flex-none bg-gradient-to-r from-[#EC4899] to-pink-600 hover:opacity-90 transition-opacity"
                            asChild
                          >
                            <Link href={`/tasks/${task.id}`}>View Details</Link>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </PageLayout>
  )
}
