"use client"

import { useState, useEffect } from "react"
import { Card } from "./ui/card"
import { Avatar } from "./ui/avatar"

const QuoteIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z" />
    <path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z" />
  </svg>
)

const testimonials = [
  {
    id: 1,
    name: "Alex Chen",
    role: "Full-Stack Developer",
    avatar: "/developer-avatar.png",
    content:
      "PolkaHub made it incredibly easy to find meaningful projects in the Polkadot ecosystem. I've earned over 500 DOT while contributing to projects I'm passionate about.",
  },
  {
    id: 2,
    name: "Sarah Martinez",
    role: "Blockchain Engineer",
    avatar: "/female-developer-avatar.png",
    content:
      "The transparent escrow system gives me confidence that I'll be paid for my work. It's refreshing to see a platform that truly values developers.",
  },
  {
    id: 3,
    name: "James Wilson",
    role: "Open Source Contributor",
    avatar: "/male-developer-avatar.png",
    content:
      "I've connected with amazing projects and teams through PolkaHub. The quality of tasks and the community support are outstanding.",
  },
]

export function TestimonialsCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="relative max-w-4xl mx-auto">
      <div className="overflow-hidden">
        <div
          className="flex transition-transform duration-700 ease-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className="w-full flex-shrink-0 px-4">
              <Card className="modern-card p-8 md:p-12 text-center">
                <QuoteIcon className="h-12 w-12 text-primary/40 mx-auto mb-6" />
                <p className="text-lg md:text-xl text-foreground/90 leading-relaxed mb-8 italic">
                  "{testimonial.content}"
                </p>
                <div className="flex items-center justify-center gap-4">
                  <Avatar className="h-14 w-14">
                    <img
                      src={testimonial.avatar || "/placeholder.svg"}
                      alt={testimonial.name}
                      className="object-cover"
                    />
                  </Avatar>
                  <div className="text-left">
                    <div className="font-semibold text-lg">{testimonial.name}</div>
                    <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                  </div>
                </div>
              </Card>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-center gap-2 mt-6">
        {testimonials.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`h-2 rounded-full transition-all ${
              index === currentIndex ? "w-8 bg-primary" : "w-2 bg-muted-foreground/30"
            }`}
            aria-label={`Go to testimonial ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}
