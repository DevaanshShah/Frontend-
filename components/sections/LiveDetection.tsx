"use client"

export default function LiveDetection() {
  const cards = [
    {
      icon: "🔥",
      title: "Wildfire Detection",
      desc:
        "Real-time hotspot detection and perimeter change analytics from thermal and optical satellite feeds.",
    },
    {
      icon: "📲",
      title: "Live SMS Alert",
      desc:
        "For any event in a user's area or when thresholds are crossed, authorities and users nearby are notified instantly via SMS.",
    },
    {
      icon: "🌲",
      title: "Deforestation Detection",
      desc:
        "Track forest canopy loss, illegal logging indicators, and vegetation stress with high-cadence monitoring.",
    },
    {
      icon: "📡",
      title: "Live Reporting",
      desc:
        "Stream status updates, alerts, and summaries to dashboards and webhooks for rapid response.",
    },
  ]

  return (
    <section className="py-24 px-6 md:px-8" id="live">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-extrabold mb-4">Live Detection Using AI</h2>
          <p className="text-lg md:text-xl text-muted max-w-3xl mx-auto">
            Cutting-edge artificial intelligence algorithms continuously monitor and analyze planetary health indicators.
          </p>
        </div>

        {/* Vertical stack of cards with a glowing sphere accent */}
        <div className="flex flex-col gap-8 max-w-3xl mx-auto">
          {cards.map((c, i) => (
            <div key={c.title} className="relative">
              {/* Glowing sphere accent */}
              <div
                className="pointer-events-none absolute -right-10 top-1/2 -translate-y-1/2 h-40 w-40 rounded-full"
                style={{
                  background:
                    "radial-gradient(closest-side, rgba(16,185,129,0.35), rgba(16,185,129,0.12), transparent 70%)",
                  filter: "blur(12px)",
                }}
                aria-hidden
              />

              <div
                className="relative rounded-2xl border border-emerald-700/40 bg-neutral-900/60 p-6 md:p-8 backdrop-blur-sm shadow-lg"
                style={{ boxShadow: "0 10px 40px -12px rgba(16,185,129,0.25)" }}
              >
                <div className="flex items-start gap-4">
                  <div className="text-2xl md:text-3xl text-emerald-400">{c.icon}</div>
                  <div className="flex-1">
                    <h3 className="text-xl md:text-2xl font-semibold text-foreground mb-2">{c.title}</h3>
                    <p className="text-sm md:text-base text-neutral-300 mb-3">{c.desc}</p>
                    {c.title === "Deforestation Detection" && (
                      <p className="text-xs md:text-sm text-emerald-300 mb-3 inline-flex items-center gap-2 bg-emerald-400/10 border border-emerald-500/30 px-3 py-1 rounded-full">
                        <span>👁️</span>
                        Actionable visual insights
                      </p>
                    )}
                    <span className="inline-flex items-center gap-2 text-emerald-300 text-xs md:text-sm font-semibold bg-emerald-400/10 border border-emerald-500/30 px-3 py-1 rounded-full">
                      <span className="inline-block w-2 h-2 bg-emerald-400 rounded-full"></span>
                      LIVE MONITORING ACTIVE
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

