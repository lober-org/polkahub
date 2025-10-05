"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { PageLayout } from "@/components/page-layout"
import { ProjectsCarousel } from "@/components/projects-carousel"
import { TestimonialsCarousel } from "@/components/testimonials-carousel"
import { WaitlistModal } from "@/components/waitlist-modal"
import { useScrollReveal } from "@/hooks/use-scroll-reveal"
import { mockProjects, mockTasks } from "@/lib/mock-data"

const ArrowRight = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
  </svg>
)

const Code2 = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
  </svg>
)

const Shield = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
    />
  </svg>
)

const Coins = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
)

export default function HomePage() {
  const [waitlistOpen, setWaitlistOpen] = useState(false)

  const heroRef = useScrollReveal<HTMLDivElement>()
  const howItWorksRef = useScrollReveal<HTMLDivElement>()
  const projectsRef = useScrollReveal<HTMLDivElement>()
  const testimonialsRef = useScrollReveal<HTMLDivElement>()
  const ctaRef = useScrollReveal<HTMLDivElement>()

  const projectCount = mockProjects.length
  const taskCount = mockTasks.filter((t) => t.status === "open").length
  const totalDOT = mockTasks
    .filter((t) => t.status === "open")
    .reduce((sum, task) => sum + Number(task.reward_amount_dot), 0)

  const stats = [
    {
      value: `${Math.floor(totalDOT)}+`,
      label: "DOT available in rewards",
      company: "Polkadot",
    },
    {
      value: `${projectCount}`,
      label: "Active projects",
      company: "Acala",
    },
    {
      value: `${taskCount}`,
      label: "Open tasks",
      company: "Moonbeam",
    },
    {
      value: "98%",
      label: "Payout success rate",
      company: "Astar",
    },
  ]

  return (
    <PageLayout>
      <section className="relative min-h-screen flex items-center pt-16">
        <div className="container mx-auto px-6">
          <div
            ref={heroRef.ref}
            className={`max-w-5xl mx-auto text-center space-y-8 ${
              heroRef.isVisible ? "animate-fade-in-up" : "opacity-0"
            }`}
          >
            <h1 className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-bold tracking-tighter leading-[1.1] text-balance">
              The Polkadot Platform for Developers
            </h1>

            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Connect with top Polkadot projects, solve real issues, and{" "}
              <span className="text-[#EC4899]">earn DOT</span> through transparent on-chain escrow.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Button
                size="lg"
                onClick={() => setWaitlistOpen(true)}
                className="bg-[#EC4899] hover:bg-[#EC4899]/90 h-12 px-8 text-base"
              >
                Join Waitlist
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button size="lg" variant="outline" className="h-12 px-8 text-base bg-transparent" asChild>
                <Link href="/projects">View Projects</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-border/40">
        <div className="container mx-auto py-16 px-6">
          <p className="text-center text-sm text-muted-foreground mb-12 uppercase tracking-wider">
            Trusted by developers contributing to
          </p>
          <div className="flex flex-wrap justify-center items-center gap-12 md:gap-16">
            {mockProjects.slice(0, 6).map((project, i) => (
              <div
                key={project.id}
                className={`text-muted-foreground/60 hover:text-foreground transition-colors text-lg font-medium opacity-0 animate-fade-in`}
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                {project.name}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section ref={howItWorksRef.ref} className="container mx-auto py-32 px-6">
        <div className={`text-center mb-20 space-y-4 ${howItWorksRef.isVisible ? "animate-fade-in-up" : "opacity-0"}`}>
          <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight">How It Works</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">Three simple steps to start earning DOT</p>
        </div>

        <div className="grid md:grid-cols-3 gap-12 max-w-6xl mx-auto">
          {[
            {
              icon: Code2,
              title: "Pick a Task",
              description: "Browse GitHub issues from top Polkadot projects with clear DOT rewards",
              delay: "0.2s",
            },
            {
              icon: Shield,
              title: "Submit Your PR",
              description: "Work on the issue and submit a pull request. Rewards held in secure escrow",
              delay: "0.4s",
            },
            {
              icon: Coins,
              title: "Get Paid",
              description: "When your PR is merged, rewards are automatically released to your wallet",
              delay: "0.6s",
            },
          ].map((step, i) => (
            <div
              key={i}
              className={`space-y-6 ${howItWorksRef.isVisible ? "opacity-0 animate-fade-in-up" : "opacity-0"}`}
              style={{ animationDelay: howItWorksRef.isVisible ? step.delay : "0s" }}
            >
              <div className="h-12 w-12 rounded-lg bg-[#EC4899] flex items-center justify-center">
                <step.icon className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold">{step.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{step.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section ref={projectsRef.ref} className="border-t border-border/40 bg-muted/5">
        <div className="container mx-auto py-32 px-6">
          <div className={`text-center mb-16 space-y-4 ${projectsRef.isVisible ? "animate-fade-in-up" : "opacity-0"}`}>
            <h2 className="text-5xl md:text-6xl font-bold tracking-tight">Featured Projects</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Join developers building the future of Web3
            </p>
          </div>

          <div
            className={`max-w-6xl mx-auto ${
              projectsRef.isVisible ? "animate-fade-in animation-delay-300" : "opacity-0"
            }`}
          >
            <ProjectsCarousel projects={mockProjects.slice(0, 6)} />
          </div>

          <div
            className={`text-center mt-12 ${
              projectsRef.isVisible ? "animate-fade-in animation-delay-500" : "opacity-0"
            }`}
          >
            <Button variant="outline" size="lg" asChild>
              <Link href="/projects">
                View All Projects
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <section ref={testimonialsRef.ref} className="border-t border-border/40">
        <div className="container mx-auto py-32 px-6">
          <div
            className={`text-center mb-16 space-y-4 ${testimonialsRef.isVisible ? "animate-fade-in-up" : "opacity-0"}`}
          >
            <h2 className="text-5xl md:text-6xl font-bold tracking-tight">Loved by Developers</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">See what our community has to say</p>
          </div>

          <div className={`${testimonialsRef.isVisible ? "animate-fade-in animation-delay-300" : "opacity-0"}`}>
            <TestimonialsCarousel />
          </div>
        </div>
      </section>

      <section ref={ctaRef.ref} className="border-t border-border/40">
        <div className="container mx-auto py-32 md:py-40 px-6">
          <div
            className={`max-w-4xl mx-auto text-center space-y-8 ${
              ctaRef.isVisible ? "animate-fade-in-up" : "opacity-0"
            }`}
          >
            <h2 className="text-6xl sm:text-7xl md:text-8xl font-bold tracking-tighter leading-[1.1]">
              Ready to Start Building?
            </h2>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
              Join the community of developers building the future of Web3 on Polkadot
            </p>

            <div className="pt-4">
              <Button
                size="lg"
                onClick={() => setWaitlistOpen(true)}
                className="bg-[#EC4899] hover:bg-[#EC4899]/90 h-12 px-8 text-base"
              >
                Join Waitlist
              </Button>
            </div>
          </div>
        </div>
      </section>

      <WaitlistModal open={waitlistOpen} onOpenChange={setWaitlistOpen} />
    </PageLayout>
  )
}
