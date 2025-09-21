"use client";

import { Canvas } from "@react-three/fiber";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import Earth from "../components/3d/Earth";
import Starfield from "../components/3d/Starfield";
import Hero from "../components/sections/Hero";
import LiveDetection from "../components/sections/LiveDetection";
import ReportIncident from "../components/sections/ReportIncident";

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
  const earthXLiveNum = useTransform(liveProgress, [0, 1], [50, 70]);
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

  return (
    <div ref={containerRef} className="relative">
      {/* Fixed animated Globe */}
      <motion.div
        className="fixed top-1/2 z-30 pointer-events-none -translate-y-1/2"
        style={{ left: earthX, x: earthXOffset, y: earthY, scale: earthScale, originX: "50%", originY: "50%", width: globeSize, height: globeSize }}
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

        {/* Protecting Our Home Section */}
        <section id="protect" className="relative py-24 px-6 md:py-28 bg-neutral-900/60 backdrop-blur">
          {/* Soft background glow */}
          <div className="absolute inset-0 -z-10 pointer-events-none">
            <div
              className="absolute left-1/2 top-0 h-72 w-72 -translate-x-1/2 rounded-full"
              style={{
                background:
                  "radial-gradient(closest-side, rgba(16,185,129,0.35), rgba(16,185,129,0.08), transparent 70%)",
                filter: "blur(18px)",
              }}
              aria-hidden
            />
          </div>

          <div className="max-w-7xl mx-auto">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight">
                <span className="bg-gradient-to-r from-teal-300 to-emerald-400 bg-clip-text text-transparent">Protecting Our Home</span>
              </h2>
              <p className="mt-6 text-lg text-neutral-300 leading-relaxed">
                As we explore and understand our planet, it becomes vital to preserve Earth's delicate systems for
                future generations. Together we can restore ecosystems and build resilient communities.
              </p>
            </div>

            {/* Feature cards */}
            <div className="mt-12 grid gap-6 md:grid-cols-3">
              <div className="rounded-2xl border border-emerald-700/40 bg-neutral-900/60 p-6 backdrop-blur-sm shadow-lg">
                <div className="flex items-start gap-3">
                  <div className="text-2xl text-emerald-400">🌿</div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Conservation Efforts</h3>
                    <p className="text-neutral-300 text-sm leading-relaxed">Protect biodiversity, reduce pollution, and scale renewable adoption.</p>
                  </div>
                </div>
              </div>
              <div className="rounded-2xl border border-emerald-700/40 bg-neutral-900/60 p-6 backdrop-blur-sm shadow-lg">
                <div className="flex items-start gap-3">
                  <div className="text-2xl text-emerald-400">📈</div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Data-Driven Policy</h3>
                    <p className="text-neutral-300 text-sm leading-relaxed">Transform live insights into actionable policies and rapid response.</p>
                  </div>
                </div>
              </div>
              <div className="rounded-2xl border border-emerald-700/40 bg-neutral-900/60 p-6 backdrop-blur-sm shadow-lg">
                <div className="flex items-start gap-3">
                  <div className="text-2xl text-emerald-400">👨‍👩‍👧‍👦</div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Future Generations</h3>
                    <p className="text-neutral-300 text-sm leading-relaxed">Educate, innovate, and collaborate to ensure a habitable planet.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* CTA */}
            <div className="mt-12 flex justify-center">
              <a
                href="#live"
                className="px-8 py-4 rounded-lg bg-secondary text-secondary-foreground font-semibold hover:bg-secondary/90 transition-colors border border-secondary/30"
              >
                Explore Live Monitoring
              </a>
            </div>
          </div>
        </section>

        {/* Report Incident Section */}
        <ReportIncident />
      </div>
    </div>
  );
}

