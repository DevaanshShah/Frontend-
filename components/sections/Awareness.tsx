"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import Modal from "../shared/Modal";

type Card = {
  id: string;
  icon: string;
  title: string;
  brief: string;
  details: string;
  hue: "sky" | "emerald" | "rose" | "amber" | "indigo";
  imageUrl: string;
};

const glowByHue: Record<Card["hue"], string> = {
  sky: "from-sky-400/25 border-sky-700/40",
  emerald: "from-emerald-400/25 border-emerald-700/40",
  rose: "from-rose-400/25 border-rose-700/40",
  amber: "from-amber-400/25 border-amber-700/40",
  indigo: "from-indigo-400/25 border-indigo-700/40",
};

export default function Awareness() {
  const cards = useMemo<Card[]>(
    () => [
      {
        id: "wildfire",
        icon: "🔥",
        title: "Wildfires",
        brief:
          "Driven by heat, wind, and drought. Human negligence and lightning are common triggers.",
        details:
          "Wildfires spread rapidly in dry, windy conditions. Key triggers include unattended campfires, discarded cigarettes, power line sparks, and lightning. Create defensible space, follow burn bans, and report smoke immediately.",
        hue: "rose",
        imageUrl: "https://unsplash.com/photos/icrhAD-qidc/download?force=true&w=1200",
      },
      {
        id: "deforestation",
        icon: "🌲",
        title: "Deforestation",
        brief:
          "Caused by logging, agricultural expansion, and infrastructure growth.",
        details:
          "Deforestation accelerates climate change, disrupts rainfall patterns, and reduces biodiversity. Support sustainable forestry, monitor illegal logging, and report suspicious large-scale tree clearing.",
        hue: "emerald",
        imageUrl: "https://unsplash.com/photos/Xywi2MePlYQ/download?force=true&w=1200",
      },
      {
        id: "floods",
        icon: "🌊",
        title: "Floods",
        brief:
          "Heavy rainfall, river overflow, poor drainage, and rapid snowmelt trigger floods.",
        details:
          "Urban areas with poor drainage are vulnerable. Prepare evacuation routes, avoid driving through water, and follow official alerts. Restoring wetlands can reduce flood risk.",
        hue: "sky",
        imageUrl: "https://unsplash.com/photos/ibSl9KNn1lQ/download?force=true&w=1200",
      },
      {
        id: "heatwaves",
        icon: "🌡️",
        title: "Heatwaves",
        brief:
          "Prolonged high temperatures increase wildfire risk and health hazards.",
        details:
          "Stay hydrated, check on vulnerable people, and avoid strenuous outdoor activity. Heatwaves dry vegetation, compounding wildfire spread.",
        hue: "amber",
        imageUrl: "https://unsplash.com/photos/y-aKAdyxOS0/download?force=true&w=1200",
      },
      {
        id: "storms",
        icon: "⛈️",
        title: "Severe Storms",
        brief:
          "High winds and lightning can ignite fires and damage infrastructure.",
        details:
          "Secure loose objects, unplug sensitive electronics, and shelter away from windows. Lightning strikes can start wildfires—report ignition points promptly.",
        hue: "indigo",
        imageUrl: "https://unsplash.com/photos/MQ6KtSsfgIc/download?force=true&w=1200",
      },
    ],
    []
  );

  // Additional featured image strip below cards (horizontal slider)
  const featuredImages = useMemo(
    () => [
      "https://unsplash.com/photos/Xywi2MePlYQ/download?force=true&w=1400",
      "https://unsplash.com/photos/icrhAD-qidc/download?force=true&w=1400",
      "https://unsplash.com/photos/y-aKAdyxOS0/download?force=true&w=1400",
      "https://unsplash.com/photos/MQ6KtSsfgIc/download?force=true&w=1400",
      "https://unsplash.com/photos/ibSl9KNn1lQ/download?force=true&w=1400",
    ],
    []
  );

  const [openId, setOpenId] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [subView, setSubView] = useState<"reasons" | "human" | "actions" | "contacts">("reasons");

  return (
    <section id="awareness" className="relative py-24 px-6 md:py-28">
      {/* Accent background glow */}
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <div
          className="absolute right-16 top-12 h-64 w-64 rounded-full"
          style={{
            background:
              "radial-gradient(closest-side, rgba(99,102,241,0.25), rgba(99,102,241,0.08), transparent 70%)",
            filter: "blur(20px)",
          }}
          aria-hidden
        />
      </div>

      <div className="max-w-7xl mx-auto">
        <div className="mb-10 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight">
              <span className="bg-gradient-to-r from-indigo-300 to-sky-300 bg-clip-text text-transparent">Awareness & Prevention</span>
            </h2>
            <p className="mt-4 text-neutral-300 max-w-3xl">
              Learn what triggers wildfires and other natural calamities. Tap a card to see detailed guidance and safety tips.
            </p>
          </div>
          <a
            href="/awareness"
            className="hidden md:inline-flex px-4 py-2 rounded-lg bg-secondary text-secondary-foreground font-semibold border border-secondary/30 hover:bg-secondary/90"
          >
            Full Guide
          </a>
        </div>

        {/* Auto-scrolling carousel slider from provided Unsplash links */}
        <div className="mt-8 mb-10 md:mb-14 relative overflow-hidden pb-2">
          <motion.div
            className="flex gap-4 w-max"
            initial={{ x: 0 }}
            animate={{ x: ["0%", "-66.666%"] }}
            transition={{ duration: 15, repeat: Infinity, repeatType: "loop", repeatDelay: 0, ease: "linear" }}
            aria-hidden
          >
            {[...featuredImages, ...featuredImages, ...featuredImages].map((src, i) => (
              <div key={i} className="shrink-0 w-[78%] sm:w-[50%] md:w-[40%] lg:w-[30%] rounded-xl overflow-hidden border border-white/10 bg-black/20">
                <img src={src} alt="Awareness visual" className="w-full h-48 md:h-56 object-cover" />
              </div>
            ))}
          </motion.div>
        </div>

        {/* Slider: horizontally scrollable, snap mandatory */}
        <div className="relative mt-4 md:mt-6">
          <div className="flex gap-5 overflow-x-auto snap-x snap-mandatory pb-3 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {cards.map((c, i) => (
              <motion.div
                key={c.id}
                onMouseEnter={() => setSelectedId(c.id)}
                className={`group relative overflow-hidden snap-start shrink-0 w-[86%] sm:w-[58%] md:w-[42%] lg:w-[32%] text-left rounded-2xl border bg-neutral-900/60 backdrop-blur-sm p-6 shadow-lg transition-all duration-300 ${
                  glowByHue[c.hue].split(" ")[1]
                } ${selectedId === c.id ? "ring-2 ring-emerald-400 shadow-emerald-500/20 scale-[1.02]" : "hover:shadow-emerald-500/10"}`}
                style={{ boxShadow: "0 10px 40px -12px rgba(99,102,241,0.25)" }}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, margin: "-80px" }}
                transition={{ duration: 0.5, delay: i * 0.06 }}
              >
                {/* Background image (disabled for Wildfires card as requested) */}
                {!(c.id === "wildfire" || c.id === "deforestation" || c.id === "floods") ? (
                  <>
                    <img src={c.imageUrl} alt="" className="absolute inset-0 w-full h-full object-cover opacity-35 group-hover:opacity-45 transition-opacity duration-500" />
                    {/* Gradient overlay for readability */}
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent" />
                  </>
                ) : (
                  // Custom glowing backgrounds (no photos) for specified cards
                  <>
                    {c.id === "wildfire" && (
                      <>
                        <div className="absolute -top-6 -left-6 h-56 w-56 rounded-full" style={{
                          background: "radial-gradient(closest-side, rgba(244,63,94,0.45), rgba(244,63,94,0.12), transparent 70%)",
                          filter: "blur(20px)",
                        }} aria-hidden />
                        <div className="absolute -bottom-8 -right-8 h-48 w-48 rounded-full" style={{
                          background: "radial-gradient(closest-side, rgba(251,191,36,0.35), rgba(251,191,36,0.10), transparent 70%)",
                          filter: "blur(22px)",
                        }} aria-hidden />
                      </>
                    )}
                    {c.id === "deforestation" && (
                      <>
                        <div className="absolute -top-6 -left-6 h-56 w-56 rounded-full" style={{
                          background: "radial-gradient(closest-side, rgba(16,185,129,0.45), rgba(16,185,129,0.12), transparent 70%)",
                          filter: "blur(20px)",
                        }} aria-hidden />
                        <div className="absolute -bottom-8 -right-8 h-48 w-48 rounded-full" style={{
                          background: "radial-gradient(closest-side, rgba(34,197,94,0.35), rgba(34,197,94,0.10), transparent 70%)",
                          filter: "blur(22px)",
                        }} aria-hidden />
                      </>
                    )}
                    {c.id === "floods" && (
                      <>
                        <div className="absolute -top-6 -left-6 h-56 w-56 rounded-full" style={{
                          background: "radial-gradient(closest-side, rgba(59,130,246,0.45), rgba(59,130,246,0.12), transparent 70%)",
                          filter: "blur(20px)",
                        }} aria-hidden />
                        <div className="absolute -bottom-8 -right-8 h-48 w-48 rounded-full" style={{
                          background: "radial-gradient(closest-side, rgba(56,189,248,0.35), rgba(56,189,248,0.10), transparent 70%)",
                          filter: "blur(22px)",
                        }} aria-hidden />
                      </>
                    )}
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent" />
                  </>
                )}
                <div className="flex items-start gap-4">
                  <div className="text-3xl">
                    <span className="inline-block text-white/90">{c.icon}</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl md:text-2xl font-semibold text-foreground mb-2">{c.title}</h3>
                    <p className="text-sm md:text-base text-neutral-300">{c.brief}</p>
                  </div>
                </div>

                {/* Flow chips appear one-by-one on hover */}
                <div className="relative mt-6 flex flex-wrap gap-2">
                  {[
                    { id: "reasons", label: "Reasons" },
                    { id: "human", label: "Human" },
                    { id: "actions", label: "What you can do" },
                    { id: "contacts", label: "Emergency" },
                  ].map((chip, idx) => (
                    <button
                      key={chip.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedId(c.id);
                        setSubView(chip.id as any);
                        setOpenId(c.id);
                      }}
                      className="inline-flex items-center text-xs md:text-sm font-semibold rounded-full border border-white/20 bg-black/30 px-3 py-1 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all hover:bg-white/10"
                      style={{ transitionDelay: `${idx * 120}ms` }}
                    >
                      {chip.label}
                    </button>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Modals for details (clickable chips open this) */}
        {cards.map((c) => (
          <Modal
            key={c.id}
            open={openId === c.id}
            onClose={() => setOpenId(null)}
            title={`${c.title} — ${subView === "reasons" ? "Reasons" : subView === "human" ? "Human Factors" : subView === "actions" ? "What You Can Do" : "Emergency"}`}
          >
            <div className="relative min-h-[120px]">
              {subView === "reasons" && (
                <div className="animate-scale-in">
                  <p className="mb-3">{c.details}</p>
                  <ul className="list-disc pl-5 space-y-1 text-neutral-300">
                    <li>Environmental triggers like heat, wind, and drought.</li>
                    <li>Lightning and extreme weather events.</li>
                    <li>Landscape and fuel load (dry vegetation) conditions.</li>
                  </ul>
                </div>
              )}
              {subView === "human" && (
                <div className="animate-scale-in">
                  <ul className="list-disc pl-5 space-y-1 text-neutral-300">
                    <li>Negligence: unattended fires, cigarettes, power lines.</li>
                    <li>Land use: illegal logging, slash-and-burn, poor planning.</li>
                    <li>Preparedness gaps: lack of defensible space and education.</li>
                  </ul>
                </div>
              )}
              {subView === "actions" && (
                <div className="animate-scale-in">
                  <ul className="list-disc pl-5 space-y-1 text-neutral-300">
                    <li>Follow advisories, respect burn bans, and report smoke.</li>
                    <li>Prepare evacuation kits and clear defensible space.</li>
                    <li>Support restoration and sustainable land management.</li>
                  </ul>
                </div>
              )}
              {subView === "contacts" && (
                <div className="animate-scale-in grid sm:grid-cols-2 gap-3 text-sm">
                  <div className="rounded-lg border border-white/10 p-3 bg-black/20">
                    <div className="font-semibold">Wildfire Hotline</div>
                    <a className="text-sky-300 hover:underline" href="tel:112">Call 112 (International)</a>
                  </div>
                  <div className="rounded-lg border border-white/10 p-3 bg-black/20">
                    <div className="font-semibold">Disaster Mgmt</div>
                    <a className="text-emerald-300 hover:underline" href="tel:108">Call 108</a>
                  </div>
                </div>
              )}
            </div>
          </Modal>
        ))}
      </div>
    </section>
  );
}
