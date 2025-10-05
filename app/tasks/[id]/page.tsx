import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Link from "next/link"
import { notFound } from "next/navigation"
import { mockTasks, mockProjects } from "@/lib/mock-data"

const Github = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
  </svg>
)

const Lock = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
    />
  </svg>
)

const Calendar = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
    />
  </svg>
)

export default async function TaskDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const task = mockTasks.find((t) => t.id === id)

  if (!task) {
    notFound()
  }

  const project = mockProjects.find((p) => p.id === task.project_id)

  if (!project) {
    notFound()
  }

  return (
    <div className="flex min-h-screen flex-col relative">
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-black" />
        <div className="absolute inset-0">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-[#EC4899]/20"
              style={{
                width: Math.random() * 4 + 1 + "px",
                height: Math.random() * 4 + 1 + "px",
                left: Math.random() * 100 + "%",
                top: Math.random() * 100 + "%",
                animation: `float ${Math.random() * 10 + 10}s linear infinite`,
                animationDelay: Math.random() * 5 + "s",
              }}
            />
          ))}
        </div>
      </div>

      <SiteHeader />
      <main className="flex-1">
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          <div className="mb-8 animate-fade-in-up">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
              <Link href="/tasks" className="hover:text-[#EC4899] transition-colors">
                Tasks
              </Link>
              <span>/</span>
              <span className="text-foreground">{task.title}</span>
            </div>
          </div>

          <div className="grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-8">
              <div className="animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
                <Card className="glass-card border-border/40 hover:border-[#EC4899]/30 transition-all duration-500 group">
                  <CardHeader className="space-y-4">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge
                        variant={
                          task.status === "open" ? "default" : task.status === "completed" ? "secondary" : "outline"
                        }
                        className="bg-[#EC4899]/10 text-[#EC4899] border-[#EC4899]/30 text-sm px-3 py-1"
                      >
                        {task.status}
                      </Badge>
                      {task.difficulty && (
                        <Badge variant="outline" className="border-border/60 text-muted-foreground text-sm px-3 py-1">
                          {task.difficulty}
                        </Badge>
                      )}
                    </div>
                    <CardTitle className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground leading-tight">
                      {task.title}
                    </CardTitle>
                    <CardDescription className="text-base text-muted-foreground">
                      <Link
                        href={`/projects/${project.id}`}
                        className="hover:text-[#EC4899] transition-colors inline-flex items-center gap-2 font-medium"
                      >
                        <Github className="h-4 w-4" />
                        {project.github_repo_name}
                      </Link>
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {task.description && (
                      <div className="space-y-3">
                        <h3 className="text-xl font-semibold text-foreground">Description</h3>
                        <p className="text-muted-foreground leading-relaxed text-base whitespace-pre-wrap">
                          {task.description}
                        </p>
                      </div>
                    )}

                    {task.tags && task.tags.length > 0 && (
                      <div className="space-y-3">
                        <h3 className="text-xl font-semibold text-foreground">Tags</h3>
                        <div className="flex gap-2 flex-wrap">
                          {task.tags.map((tag: string) => (
                            <Badge
                              key={tag}
                              variant="secondary"
                              className="bg-muted/50 text-muted-foreground border border-border/40 hover:border-[#EC4899]/30 hover:bg-[#EC4899]/5 transition-all duration-300 text-sm px-3 py-1"
                            >
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="flex flex-col sm:flex-row gap-3 pt-6">
                      <Button
                        className="bg-gradient-to-r from-[#EC4899] to-pink-600 hover:from-[#EC4899]/90 hover:to-pink-600/90 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-[#EC4899]/25 text-base py-6"
                        asChild
                      >
                        <a href={task.github_issue_url} target="_blank" rel="noopener noreferrer">
                          <Github className="mr-2 h-5 w-5" />
                          View GitHub Issue
                        </a>
                      </Button>
                      <Button
                        variant="outline"
                        className="border-border/60 hover:bg-[#EC4899]/10 hover:border-[#EC4899]/40 hover:text-[#EC4899] bg-transparent transition-all duration-300 hover:scale-105 text-base py-6"
                        asChild
                      >
                        <Link href="/auth/login">Start Contributing</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            <div className="space-y-6">
              <div className="animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
                <Card className="glass-card border-border/40 hover:border-[#EC4899]/30 transition-all duration-500 relative overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#EC4899]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <CardHeader>
                    <CardTitle className="text-lg text-foreground">Reward</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-[#EC4899] to-pink-600 bg-clip-text text-transparent leading-tight">
                      {Number(task.reward_amount_dot).toFixed(2)} DOT
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Lock className="h-4 w-4" />
                      <span>Locked in escrow</span>
                    </div>
                    <Badge
                      variant="outline"
                      className="border-[#EC4899]/30 text-[#EC4899] bg-[#EC4899]/10 text-sm px-3 py-1"
                    >
                      funded
                    </Badge>
                  </CardContent>
                </Card>
              </div>

              <div className="animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
                <Card className="glass-card border-border/40 hover:border-[#EC4899]/30 transition-all duration-500 group">
                  <CardHeader>
                    <CardTitle className="text-lg text-foreground">Project</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-3">
                      {project.logo_url && (
                        <Avatar className="border-2 border-border/40 h-12 w-12 group-hover:border-[#EC4899]/30 transition-colors duration-300">
                          <AvatarImage src={project.logo_url || "/placeholder.svg"} />
                          <AvatarFallback className="bg-muted text-muted-foreground text-lg">
                            {project.github_repo_name[0]}
                          </AvatarFallback>
                        </Avatar>
                      )}
                      <div>
                        <p className="font-semibold text-foreground text-base">{project.github_repo_name}</p>
                        <p className="text-sm text-muted-foreground">@{project.github_owner}</p>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      className="w-full border-border/60 hover:bg-[#EC4899]/10 hover:border-[#EC4899]/40 hover:text-[#EC4899] bg-transparent transition-all duration-300 hover:scale-105"
                      asChild
                    >
                      <Link href={`/projects/${project.id}`}>View All Tasks</Link>
                    </Button>
                  </CardContent>
                </Card>
              </div>

              <div className="animate-fade-in-up" style={{ animationDelay: "0.4s" }}>
                <Card className="glass-card border-border/40 hover:border-[#EC4899]/30 transition-all duration-500">
                  <CardHeader>
                    <CardTitle className="text-lg text-foreground">Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4 text-sm">
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/20 hover:bg-muted/30 transition-colors duration-300">
                      <Calendar className="h-5 w-5 text-[#EC4899]" />
                      <div className="flex flex-col">
                        <span className="text-xs text-muted-foreground">Created</span>
                        <span className="text-foreground font-medium">
                          {new Date(task.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/20 hover:bg-muted/30 transition-colors duration-300">
                      <Github className="h-5 w-5 text-[#EC4899]" />
                      <div className="flex flex-col">
                        <span className="text-xs text-muted-foreground">Issue Number</span>
                        <span className="text-foreground font-medium">#{task.github_issue_number}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}
