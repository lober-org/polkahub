import { PageLayout } from "@/components/page-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Link from "next/link"
import { notFound } from "next/navigation"
import { mockProjects, mockTasks } from "@/lib/mock-data"

const ExternalLink = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
    />
  </svg>
)

const Github = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
  </svg>
)

const Globe = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
    />
  </svg>
)

export default async function ProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const project = mockProjects.find((p) => p.id === id)

  if (!project) {
    notFound()
  }

  const tasks = mockTasks.filter((t) => t.project_id === id)
  const openTasks = tasks.filter((t) => t.status === "open")
  const totalRewards = openTasks.reduce((sum, t) => sum + Number(t.reward_amount_dot), 0)

  return (
    <PageLayout>
      {/* Project Header */}
      <section className="border-b border-border/40 bg-gradient-to-br from-primary/5 via-transparent to-accent/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          <div className="flex flex-col md:flex-row items-start gap-6 px-4">
            {project.logo_url && (
              <Avatar className="h-16 w-16 md:h-20 md:w-20 border-2 border-primary/20">
                <AvatarImage src={project.logo_url || "/placeholder.svg"} alt={project.github_repo_name} />
                <AvatarFallback className="bg-primary/10 text-primary">{project.github_repo_name[0]}</AvatarFallback>
              </Avatar>
            )}
            <div className="flex-1">
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                {project.github_repo_name}
              </h1>
              <p className="text-muted-foreground mb-4">@{project.github_owner}</p>
              {project.description && (
                <p className="text-base md:text-lg mb-4 leading-relaxed">{project.description}</p>
              )}
              <div className="flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  className="border-primary/30 hover:bg-primary/10 hover:border-primary/50 bg-transparent"
                  asChild
                >
                  <a href={project.github_repo_url} target="_blank" rel="noopener noreferrer">
                    <Github className="mr-2 h-4 w-4" />
                    View on GitHub
                  </a>
                </Button>
                {project.website_url && (
                  <Button
                    variant="outline"
                    className="border-primary/30 hover:bg-primary/10 hover:border-primary/50 bg-transparent"
                    asChild
                  >
                    <a href={project.website_url} target="_blank" rel="noopener noreferrer">
                      <Globe className="mr-2 h-4 w-4" />
                      Website
                    </a>
                  </Button>
                )}
              </div>
            </div>
            <div className="text-left md:text-right w-full md:w-auto">
              <div className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                {openTasks.length}
              </div>
              <div className="text-sm text-muted-foreground">Open Tasks</div>
              <div className="text-2xl font-bold mt-2 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                {totalRewards.toFixed(2)} DOT
              </div>
              <div className="text-sm text-muted-foreground">Total Rewards</div>
            </div>
          </div>
        </div>
      </section>

      {/* Tasks Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8 px-4">
          <h2 className="text-2xl font-bold mb-2 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Available Tasks
          </h2>
          <p className="text-muted-foreground">Browse open tasks and start contributing</p>
        </div>

        {tasks.length === 0 ? (
          <div className="text-center py-12 px-4">
            <p className="text-muted-foreground">No tasks available yet.</p>
          </div>
        ) : (
          <div className="space-y-4 px-4">
            {tasks.map((task) => (
              <Card key={task.id} className="glass-card border-border/40 hover:border-primary/40 transition-all">
                <CardHeader>
                  <div className="flex flex-col md:flex-row items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <Badge
                          variant={
                            task.status === "open" ? "default" : task.status === "completed" ? "secondary" : "outline"
                          }
                          className="bg-primary/20 text-primary border-primary/30"
                        >
                          {task.status}
                        </Badge>
                        {task.difficulty && (
                          <Badge variant="outline" className="border-accent/30 text-accent">
                            {task.difficulty}
                          </Badge>
                        )}
                      </div>
                      <CardTitle className="text-lg md:text-xl">{task.title}</CardTitle>
                      {task.description && (
                        <CardDescription className="mt-2 line-clamp-2">{task.description}</CardDescription>
                      )}
                    </div>
                    <div className="text-left md:text-right w-full md:w-auto flex-shrink-0">
                      <div className="text-xl md:text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                        {Number(task.reward_amount_dot).toFixed(2)} DOT
                      </div>
                      <div className="text-xs text-muted-foreground">Reward</div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div className="flex gap-2 flex-wrap">
                      {task.tags?.map((tag: string) => (
                        <Badge key={tag} variant="secondary" className="bg-primary/10 text-primary">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex gap-2 w-full md:w-auto">
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-primary/30 hover:bg-primary/10 flex-1 md:flex-none bg-transparent"
                        asChild
                      >
                        <a href={task.github_issue_url} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="mr-2 h-3 w-3" />
                          View Issue
                        </a>
                      </Button>
                      <Button
                        size="sm"
                        className="bg-gradient-to-r from-primary to-accent hover:opacity-90 flex-1 md:flex-none"
                        asChild
                      >
                        <Link href={`/tasks/${task.id}`}>View Details</Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>
    </PageLayout>
  )
}
