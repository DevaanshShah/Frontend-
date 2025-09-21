"use client";

import Awareness from "../../components/sections/Awareness";

export default function AwarenessPage() {
  return (
    <main className="relative">
      <Awareness />
      {/* Room for future long-form guides or FAQs */}
      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-6">
          <div className="rounded-2xl border border-white/10 bg-neutral-900/60 p-6">
            <h3 className="text-lg font-semibold mb-2">Preparation Checklist</h3>
            <ul className="list-disc pl-5 text-sm text-neutral-300 space-y-1">
              <li>Assemble a go-bag: water, first aid, flashlight, batteries, documents.</li>
              <li>Know your evacuation routes and an out-of-area contact person.</li>
              <li>Keep phones charged and enable emergency alerts.</li>
            </ul>
          </div>
          <div className="rounded-2xl border border-white/10 bg-neutral-900/60 p-6">
            <h3 className="text-lg font-semibold mb-2">Community Actions</h3>
            <ul className="list-disc pl-5 text-sm text-neutral-300 space-y-1">
              <li>Clear dry vegetation around homes and public spaces.</li>
              <li>Support reforestation and wetland restoration projects.</li>
              <li>Report damaged power lines or illegal burning.</li>
            </ul>
          </div>
        </div>
      </section>
    </main>
  );
}
