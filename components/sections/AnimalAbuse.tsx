"use client";

export default function AnimalAbuse() {
  return (
    <section id="animals" className="relative py-24 px-6 md:py-28 bg-neutral-900/60 backdrop-blur">
      {/* Soft background glow */}
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <div
          className="absolute left-1/4 top-10 h-64 w-64 rounded-full"
          style={{
            background:
              "radial-gradient(closest-side, rgba(244,114,182,0.25), rgba(244,114,182,0.08), transparent 70%)",
            filter: "blur(18px)",
          }}
          aria-hidden
        />
      </div>

      <div className="max-w-7xl mx-auto">
        <div className="mb-12 text-center md:text-left">
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight">
            <span className="bg-gradient-to-r from-pink-300 to-rose-300 bg-clip-text text-transparent">Protect Wildlife & Stop Abuse</span>
          </h2>
          <p className="mt-6 text-neutral-300 max-w-3xl">
            Report incidents of animal abuse, poaching, or illegal trade. Your report can help protect wildlife and support
            enforcement by the appropriate authorities.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-2xl border border-rose-700/40 bg-neutral-900/60 p-6 backdrop-blur-sm shadow-lg">
            <div className="flex items-start gap-3">
              <div className="text-2xl text-rose-300">🦉</div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Animal Abuse</h3>
                <p className="text-neutral-300 text-sm leading-relaxed">Physical harm, neglect, or cruelty towards domestic or wild animals.</p>
              </div>
            </div>
          </div>
          <div className="rounded-2xl border border-rose-700/40 bg-neutral-900/60 p-6 backdrop-blur-sm shadow-lg">
            <div className="flex items-start gap-3">
              <div className="text-2xl text-rose-300">🦏</div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Poaching</h3>
                <p className="text-neutral-300 text-sm leading-relaxed">Illegal hunting or capturing of protected species and trafficking.</p>
              </div>
            </div>
          </div>
          <div className="rounded-2xl border border-rose-700/40 bg-neutral-900/60 p-6 backdrop-blur-sm shadow-lg">
            <div className="flex items-start gap-3">
              <div className="text-2xl text-rose-300">📍</div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Geotag & Evidence</h3>
                <p className="text-neutral-300 text-sm leading-relaxed">Attach photos, audio notes, and optional location to help responders.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-wrap items-center gap-4">
          <a
            href="#report"
            className="px-6 py-3 rounded-lg bg-secondary text-secondary-foreground font-semibold hover:bg-secondary/90 transition-colors border border-secondary/30"
          >
            Report Now
          </a>
          <span className="text-sm text-neutral-400">Your report is forwarded securely to the configured authority webhook.</span>
        </div>
      </div>
    </section>
  );
}
