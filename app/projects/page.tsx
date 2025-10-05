import { PageLayout } from "@/components/page-layout"
import { ProjectCard } from "@/components/project-card"
import { mockProjects } from "@/lib/mock-data"

export default async function ProjectsPage() {
  const projects = mockProjects

  return (
    <PageLayout>
      <div className="relative py-20 sm:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight">
              Discover{" "}
              <span className="bg-gradient-to-r from-[#EC4899] to-pink-600 bg-clip-text text-transparent">
                Projects
              </span>
            </h1>
            <p className="text-xl sm:text-2xl text-gray-400 leading-relaxed max-w-2xl mx-auto">
              Browse Polkadot open-source projects looking for contributors. Find tasks that match your skills and start
              earning DOT.
            </p>
          </div>
        </div>
      </div>

      <section className="py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {!projects || projects.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-400 text-lg">No projects found. Check back soon!</p>
            </div>
          ) : (
            <div className="space-y-6 max-w-6xl mx-auto">
              {projects.map((project, index) => (
                <div key={project.id} className="animate-fade-in-up" style={{ animationDelay: `${index * 100}ms` }}>
                  <ProjectCard project={project} variant="detailed" />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </PageLayout>
  )
}
