"use client";

import { Canvas } from "@react-three/fiber";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import Link from "next/link";
import Earth from "../components/3d/Earth";
import Starfield from "../components/3d/Starfield";
import Hero from "../components/sections/Hero";
import LiveDetection from "../components/sections/LiveDetection";
import Awareness from "../components/sections/Awareness";

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);
  const liveRef = useRef<HTMLDivElement>(null);
  const aboutRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });
  // Progress specifically while approaching the Live section
  const { scrollYProgress: liveProgress } = useScroll({
    target: liveRef,
    // Start animating closer to the section to keep hero stable
    offset: ["start 90%", "start 40%"],
  });
  // Progress as we approach the About section
  const { scrollYProgress: aboutProgress } = useScroll({
    target: aboutRef,
    offset: ["start 95%", "start 35%"],
  });

  // Large in Hero, then shift right + shrink as Live section approaches
  // First, move a bit to the right during Live section, then glide left for About
  // During Live Detection, drift the globe to the LEFT (smaller %) instead of right
  const earthXLiveNum = useTransform(liveProgress, [0, 1], [50, 12]);
  const earthXAboutNum = useTransform(aboutProgress, [0, 1], [70, 0]);
  const earthX = useTransform(
    [earthXLiveNum, earthXAboutNum, aboutProgress],
    (values) => {
      const [liveVal, aboutVal, a] = values as number[];
      const blended = (1 - a) * liveVal + a * aboutVal; // smooth blend between sections
      return `${blended}%`;
    }
  );
  // Also blend the transform offset from centered (-50%) to left-aligned (0%) during About
  const earthXOffset = useTransform(aboutProgress, [0, 1], ["-50%", "0%"]);
  // Keep scale subtle to avoid compounding with size
  const earthScale = useTransform(liveProgress, [0, 1], [1.0, 0.92]);
  // Nudge upward in hero so the full globe is visible, then center
  const earthY = useTransform(liveProgress, [0, 1], [-260, 0]);
  // Separate size states for hero vs live (slightly smaller in hero to avoid clipping)
  const globeSize = useTransform(liveProgress, [0, 1], ["68vmin", "56vmin"]);
  // Keep the globe visible through About; fade out as About begins
  const earthOpacity = useTransform(aboutProgress, [0, 1], [1, 0]);
  // Subtle clockwise rotation as we enter About to give a "facing down" feel
  const earthRotate = useTransform(aboutProgress, [0, 1], [0, 12]);

  return (
    <div ref={containerRef} className="relative">
      {/* Fixed animated Globe */}
      <motion.div
        className="fixed top-1/2 z-30 pointer-events-none -translate-y-1/2"
        style={{ left: earthX, x: earthXOffset, y: earthY, scale: earthScale, rotate: earthRotate, originX: "50%", originY: "50%", width: globeSize, height: globeSize, opacity: earthOpacity }}
      >
        <Canvas camera={{ position: [0, 0, 5.2], fov: 40 }} className="w-full h-full">
          <ambientLight intensity={0.5} />
          <directionalLight position={[10, 10, 5]} intensity={1} />
          <Earth />
          <Starfield />
          <pointLight position={[10, 10, 10]} intensity={0.35} />
        </Canvas>
      </motion.div>

      {/* Content Sections */}
      <div className="relative z-20">
        {/* Hero Section */}
        <Hero />

        {/* Live Detection Section (wrapped for scroll targeting) */}
        <div ref={liveRef}>
          <LiveDetection />
        </div>

        {/* About Our Planet Section */}
        <section id="about" ref={aboutRef} className="relative py-24 px-6 md:py-28 bg-neutral-900/60 backdrop-blur">
          {/* Accent background dots/glow */}
          <div className="absolute inset-0 -z-10 pointer-events-none">
            <div
              className="absolute right-10 top-10 h-56 w-56 rounded-full"
              style={{
                background:
                  "radial-gradient(closest-side, rgba(59,130,246,0.25), rgba(59,130,246,0.08), transparent 70%)",
                filter: "blur(18px)",
              }}
              aria-hidden
            />
          </div>

          <div className="max-w-7xl mx-auto">
            <div className="grid md:grid-cols-2 gap-10 items-center">
              {/* Heading and copy */}
              <div>
                <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight">
                  <span className="bg-gradient-to-r from-sky-300 to-emerald-300 bg-clip-text text-transparent">About Our Planet</span>
                </h2>
                <p className="mt-6 text-neutral-300 leading-relaxed">
                  A uniquely balanced world of oceans, continents, and atmosphere. Earth’s position in the habitable
                  zone enables stable climates, liquid water, and thriving biodiversity.
                </p>
                <div className="mt-8 flex flex-wrap gap-3">
                  <span className="px-3 py-1 rounded-full text-sm bg-sky-400/10 text-sky-300 border border-sky-400/30">Habitable Zone</span>
                  <span className="px-3 py-1 rounded-full text-sm bg-emerald-400/10 text-emerald-300 border border-emerald-400/30">Liquid Water</span>
                  <span className="px-3 py-1 rounded-full text-sm bg-indigo-400/10 text-indigo-300 border border-indigo-400/30">Protective Atmosphere</span>
                </div>
              </div>

              {/* Bulleted features */}
              <div className="grid gap-6">
                <div className="rounded-2xl border border-sky-700/40 bg-neutral-900/60 p-6 backdrop-blur-sm shadow-lg">
                  <div className="flex items-start gap-4">
                    <div className="text-2xl text-sky-300">🪐</div>
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Formation & Composition</h3>
                      <p className="text-neutral-300 text-sm leading-relaxed">Forged 4.54 billion years ago; iron core, silicate mantle, dynamic crust.</p>
                    </div>
                  </div>
                </div>
                <div className="rounded-2xl border border-emerald-700/40 bg-neutral-900/60 p-6 backdrop-blur-sm shadow-lg">
                  <div className="flex items-start gap-4">
                    <div className="text-2xl text-emerald-300">🌋</div>
                    <div>
                      <h3 className="text-lg font-semibold mb-2">A Dynamic Planet</h3>
                      <p className="text-neutral-300 text-sm leading-relaxed">Plate tectonics, volcanism, and erosion continuously reshape the surface.</p>
                    </div>
                  </div>
                </div>
                <div className="rounded-2xl border border-indigo-700/40 bg-neutral-900/60 p-6 backdrop-blur-sm shadow-lg">
                  <div className="flex items-start gap-4">
                    <div className="text-2xl text-indigo-300">🌧️</div>
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Climate & Oceans</h3>
                      <p className="text-neutral-300 text-sm leading-relaxed">Interacting ocean–atmosphere systems drive seasons, weather, and life.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section removed */}

        {/* Ocean and Climate Section removed */}

        {/* Life on Earth Section removed */}

        

        {/* Awareness Section */}
        <Awareness />

        {/* End-of-page Submit Report CTA */}
        <section className="relative py-16 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="w-full max-w-4xl mx-auto rounded-2xl border border-white/10 bg-black/30 backdrop-blur px-4 py-5 md:px-8 md:py-6 flex flex-col md:flex-row items-center gap-4">
              <p className="text-center md:text-left text-base md:text-lg text-neutral-100">
                <span className="font-semibold">See something wrong or cruelty?</span> Help us fight the enemies of nature.
              </p>
              <Link
                href="/report"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-secondary text-secondary-foreground font-semibold border border-secondary/30 hover:bg-secondary/90 transition-colors whitespace-nowrap"
              >
                Submit Report
              </Link>
            </div>
          </div>
        </section>

        {/* Report moved to its own page (see /report) */}
      </div>
    </div>
  );
}

