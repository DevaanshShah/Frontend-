"use client"

import { useEffect, useRef, useState } from "react"
import { Card } from "./ui/card"

const features = [
  {
    title: "Deforestation Tracking",
    description:
      "Monitor forest loss and degradation patterns across the globe with high-resolution satellite imagery and machine learning algorithms.",
    icon: "🌲",
    color: "text-secondary",
  },
  {
    title: "Urban Sprawl Analysis",
    description:
      "Track urban expansion and development patterns to understand the impact on natural ecosystems and climate.",
    icon: "🏙️",
    color: "text-accent",
  },
  {
    title: "Wildfire Detection",
    description: "Real-time wildfire monitoring and risk assessment using thermal imaging and predictive modeling.",
    icon: "🔥",
    color: "text-orange-400",
  },
  {
    title: "Surface Water Changes",
    description:
      "Monitor water body changes, drought conditions, and flood patterns to assess water resource availability.",
    icon: "💧",
    color: "text-blue-400",
  },
]

export function InfoSection() {
  const [visibleCards, setVisibleCards] = useState<boolean[]>(new Array(features.length).fill(false))
  const cardRefs = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    const observers = cardRefs.current.map((ref, index) => {
      if (!ref) return null

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setVisibleCards((prev) => {
              const newVisible = [...prev]
              newVisible[index] = true
              return newVisible
            })
          }
        },
        { threshold: 0.2 },
      )

      observer.observe(ref)
      return observer
    })

    return () => {
      observers.forEach((observer) => observer?.disconnect())
    }
  }, [])

  return (
    <section className="py-24 px-6 bg-gradient-to-b from-background to-background/95">
      <div className="max-w-7xl mx-auto">
        {/* Mission Statement */}
        <div className="text-center mb-20">
          <h2 className="text-4xl lg:text-5xl font-bold text-foreground mb-6 text-balance">Our Mission</h2>
          <p className="text-xl text-muted max-w-3xl mx-auto text-pretty">
            To provide comprehensive, real-time monitoring of Earth's environmental health through advanced satellite
            technology and AI-powered analysis, empowering decision-makers with actionable insights for a sustainable
            future.
          </p>
        </div>

        {/* Features Grid */}
        <div className="mb-20">
          <h3 className="text-3xl font-bold text-foreground mb-12 text-center">Key Features</h3>
          <div className="grid md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <div
                key={feature.title}
                ref={(el) => { cardRefs.current[index] = el }}
                className={`transform transition-all duration-700 ${
                  visibleCards[index] ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                }`}
                style={{ transitionDelay: `${index * 150}ms`  }}
              >
                <Card className="p-8 bg-card/50 border-border/50 backdrop-blur-sm hover:bg-card/70 transition-all duration-300 h-full">
                  <div className="flex items-start gap-4">
                    <div className={`text-4xl ${feature.color} flex-shrink-0` }>{feature.icon}</div>
                    <div>
                      <h4 className="text-xl font-semibold text-foreground mb-3">{feature.title}</h4>
                      <p className="text-muted text-pretty">{feature.description}</p>
                    </div>
                  </div>
                </Card>
              </div>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <div className="bg-gradient-to-r from-secondary/10 to-accent/10 rounded-2xl p-12 border border-secondary/20">
            <h3 className="text-3xl font-bold text-foreground mb-4">Ready to Monitor Our Planet?</h3>
            <p className="text-lg text-muted mb-8 max-w-2xl mx-auto text-pretty">
              Join researchers, policymakers, and environmental organizations worldwide in tracking Earth's vital signs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="px-8 py-4 bg-secondary text-secondary-foreground rounded-lg font-semibold hover:bg-secondary/90 transition-colors">
                Get Started
              </button>
              <button className="px-8 py-4 bg-transparent border border-accent text-accent rounded-lg font-semibold hover:bg-accent hover:text-accent-foreground transition-colors">
                Learn More
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
