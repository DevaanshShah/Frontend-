"use client"

import { motion } from "framer-motion";
import Link from "next/link";

export default function Hero() {
  const text = "TerraTrack";

  const container = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: 0.06,
        delayChildren: 0.2,
      },
    },
  };

  const letter = {
    hidden: { opacity: 0, y: 10, filter: "blur(4px)" },
    show: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: { type: "spring", stiffness: 300, damping: 20 }
    },
  };

  return (
    <section className="h-screen relative z-10 flex items-start justify-center px-6 md:px-8 pt-[75vh] md:pt-[70vh] pointer-events-none">
      <div className="max-w-7xl mx-auto w-full">
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-white text-center drop-shadow-[0_0_20px_rgba(255,255,255,0.35)]">
          <motion.span
            className="inline-block"
            variants={container}
            initial="hidden"
            animate="show"
            aria-label={text}
            role="heading"
          >
            {text.split("").map((ch, i) => (
              <motion.span key={i} className="inline-block" variants={letter}>
                {ch === " " ? "\u00A0" : ch}
              </motion.span>
            ))}
          </motion.span>
        </h1>

        {/* End-of-page CTA only (moved out of Hero) */}
      </div>
    </section>
  )
}
