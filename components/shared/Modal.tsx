"use client";

import { useEffect } from "react";

export default function Modal({ open, onClose, title, children }: { open: boolean; onClose: () => void; title?: string; children: React.ReactNode }) {
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    if (open) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-[71] w-full max-w-2xl mx-4 rounded-2xl border border-white/10 bg-neutral-950/90 p-6">
        {title && <h3 className="text-xl font-semibold mb-3">{title}</h3>}
        <div className="text-neutral-200 text-sm leading-relaxed">{children}</div>
        <div className="mt-6 flex justify-end">
          <button onClick={onClose} className="px-4 py-2 rounded-lg border border-white/15 hover:bg-white/5">Close</button>
        </div>
      </div>
    </div>
  );
}
