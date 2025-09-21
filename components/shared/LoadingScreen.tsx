"use client"

import { useEffect, useState } from "react"

export function LoadingScreen() {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false)
    }, 2500)

    return () => clearTimeout(timer)
  }, [])

  if (!isVisible) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background">
      <div className="text-center animate-scale-in">
        <h1 className="text-6xl font-bold text-foreground mb-4 tracking-tight">TerraTrack</h1>
        <p className="text-xl text-muted opacity-80">Planetary Health Monitoring</p>
        <div className="mt-8 flex justify-center">
          <div className="w-2 h-2 bg-secondary rounded-full animate-pulse mr-2"></div>
          <div className="w-2 h-2 bg-accent rounded-full animate-pulse mr-2 animate-delay-200"></div>
          <div className="w-2 h-2 bg-secondary rounded-full animate-pulse animate-delay-400"></div>
        </div>
      </div>
    </div>
  )
}
