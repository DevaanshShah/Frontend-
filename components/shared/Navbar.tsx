"use client";

import { useState } from "react";
import Link from "next/link";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  const links = [
    { href: "#live", label: "Live" },
    { href: "#about", label: "About" },
    { href: "#protect", label: "Protect" },
    { href: "/awareness", label: "Awareness" },
    { href: "#report", label: "Report" },
  ];

  return (
    <header className="fixed top-0 inset-x-0 z-50">
      <nav className="mx-auto max-w-7xl px-6 md:px-8 py-4">
        <div className="flex items-center justify-between rounded-xl border border-white/10 bg-black/30 backdrop-blur supports-[backdrop-filter]:bg-black/30 px-4 py-2">
          <Link href="/" className="text-white font-extrabold tracking-tight text-xl">
            TerraTrack
          </Link>

          <div className="hidden md:flex items-center gap-6">
            {links.map((l) => (
              <a key={l.href} href={l.href} className="text-white/80 hover:text-white transition-colors">
                {l.label}
              </a>
            ))}
            <a href="#live" className="px-3 py-1.5 rounded-lg bg-secondary text-secondary-foreground text-sm font-semibold border border-secondary/30 hover:bg-secondary/90 transition-colors">
              Explore
            </a>
          </div>

          <button
            className="md:hidden inline-flex items-center justify-center rounded-md p-2 text-white/80 hover:text-white"
            aria-label="Toggle menu"
            onClick={() => setOpen((v) => !v)}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4 6H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              <path d="M4 12H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              <path d="M4 18H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {open && (
          <div className="mt-2 md:hidden rounded-xl border border-white/10 bg-black/40 backdrop-blur px-4 py-3">
            <div className="flex flex-col gap-3">
              {links.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  className="text-white/90 hover:text-white transition-colors"
                  onClick={() => setOpen(false)}
                >
                  {l.label}
                </a>
              ))}
              <a
                href="#live"
                className="mt-2 inline-flex items-center justify-center px-3 py-2 rounded-lg bg-secondary text-secondary-foreground text-sm font-semibold border border-secondary/30 hover:bg-secondary/90 transition-colors"
                onClick={() => setOpen(false)}
              >
                Explore
              </a>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
