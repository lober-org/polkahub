"use client"

import { useState, useEffect } from "react"
import { ProjectCard } from "./project-card"
import { Button } from "./ui/button"

const ChevronLeftIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="15 18 9 12 15 6" />
  </svg>
)

const ChevronRightIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="9 18 15 12 9 6" />
  </svg>
)

type Project = {
  id: string
  github_repo_name: string
  github_owner: string
  github_repo_url: string
  website_url?: string
  description?: string
  tasks?: Array<{ status: string; reward_amount_dot: string | number }>
  name?: string
}

export function ProjectsCarousel({ projects }: { projects: Project[] }) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [itemsPerView, setItemsPerView] = useState(3)
  const [isPaused, setIsPaused] = useState(false)

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setItemsPerView(1)
      } else if (window.innerWidth < 1024) {
        setItemsPerView(2)
      } else {
        setItemsPerView(3)
      }
    }

    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  useEffect(() => {
    if (isPaused || projects.length <= itemsPerView) return

    const interval = setInterval(() => {
      setCurrentIndex((prev) => {
        const maxIndex = Math.max(0, projects.length - itemsPerView)
        return prev >= maxIndex ? 0 : prev + 1
      })
    }, 4000) // Increased from 3000ms to 4000ms for better viewing time

    return () => clearInterval(interval)
  }, [isPaused, projects.length, itemsPerView])

  const maxIndex = Math.max(0, projects.length - itemsPerView)

  const next = () => {
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1))
  }

  const prev = () => {
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1))
  }

  return (
    <div className="relative px-2" onMouseEnter={() => setIsPaused(true)} onMouseLeave={() => setIsPaused(false)}>
      <div className="overflow-hidden">
        <div
          className="flex transition-transform duration-700 ease-in-out gap-8"
          style={{ transform: `translateX(-${currentIndex * (100 / itemsPerView)}%)` }}
        >
          {projects.map((project) => (
            <div
              key={project.id}
              className="flex-shrink-0"
              style={{ width: `calc(${100 / itemsPerView}% - ${((itemsPerView - 1) * 32) / itemsPerView}px)` }}
            >
              <ProjectCard project={project} variant="compact" />
            </div>
          ))}
        </div>
      </div>

      {maxIndex > 0 && (
        <div className="flex justify-center gap-3 mt-8">
          <Button
            variant="outline"
            size="icon"
            onClick={prev}
            className="rounded-full border-primary/30 hover:bg-primary/10 bg-transparent transition-all duration-300 hover:scale-110"
          >
            <ChevronLeftIcon className="h-5 w-5" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={next}
            className="rounded-full border-primary/30 hover:bg-primary/10 bg-transparent transition-all duration-300 hover:scale-110"
          >
            <ChevronRightIcon className="h-5 w-5" />
          </Button>
        </div>
      )}
    </div>
  )
}
