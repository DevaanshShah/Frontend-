"use client";

import { useEffect, useRef, useState } from "react";
import Modal from "../shared/Modal";

export default function ReportIncident() {
  const [type, setType] = useState<"wildfire" | "deforestation" | "other">("wildfire");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [thanksOpen, setThanksOpen] = useState(false);
  // Location input states
  const [locationQuery, setLocationQuery] = useState("");
  const [locLat, setLocLat] = useState<number | null>(null);
  const [locLng, setLocLng] = useState<number | null>(null);

  type SubmittedReport = {
    type: string;
    description: string;
    locationQuery?: string;
    lat?: number | null;
    lng?: number | null;
    submittedAt: string;
    imageDataUrl?: string;
    audioDataUrl?: string;
  } | null;
  const [lastReport, setLastReport] = useState<SubmittedReport>(null);

  // Camera
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [snapshot, setSnapshot] = useState<Blob | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);

  // Audio (removed per request)

  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
      }
    };
  }, []);

  async function startCamera() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
    } catch (e) {
      setStatus("Camera permission denied or unavailable.");
    }
  }

  function stopCamera() {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
  }

  function capturePhoto() {
    if (!videoRef.current) return;
    const video = videoRef.current;
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth || 1280;
    canvas.height = video.videoHeight || 720;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    canvas.toBlob((blob) => {
      if (blob) {
        setSnapshot(blob);
        setImageFile(null); // prefer snapshot
        setStatus("Captured photo from camera.");
      }
    }, "image/jpeg", 0.92);
  }

  function onPickImage(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setSnapshot(null);
    }
  }

  // start/stop recording removed

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setStatus(null);

    try {
      const fd = new FormData();
      fd.append("type", type);
      fd.append("description", description);
      if (locationQuery) fd.append("locationQuery", locationQuery);

      // Location if available
      if (locLat != null && locLng != null) {
        fd.append("lat", String(locLat));
        fd.append("lng", String(locLng));
        fd.append("accuracy", "");
      } else {
        try {
          const pos = await new Promise<GeolocationPosition>((resolve, reject) => {
            if (!navigator.geolocation) return reject("no-geo");
            navigator.geolocation.getCurrentPosition(resolve, reject, { enableHighAccuracy: true, timeout: 5000 });
          });
          fd.append("lat", String(pos.coords.latitude));
          fd.append("lng", String(pos.coords.longitude));
          fd.append("accuracy", String(pos.coords.accuracy));
        } catch {}
      }

      // Attachments
      if (snapshot) {
        fd.append("image", snapshot, "snapshot.jpg");
      } else if (imageFile) {
        fd.append("image", imageFile);
      }
      // audio removed

      const res = await fetch("/api/report", { method: "POST", body: fd });
      // Even if backend fails, treat as submitted per UX requirement
      let msg = "Report submitted.";
      if (res.ok) {
        try {
          const data = await res.json();
          msg = data.message || msg;
        } catch {}
      }
      setStatus(msg);

      // Build downloadable summary (JSON/text) and keep in state
      async function blobToDataUrl(b?: Blob | null): Promise<string | undefined> {
        if (!b) return undefined;
        const reader = new FileReader();
        return await new Promise((resolve) => {
          reader.onloadend = () => resolve(typeof reader.result === "string" ? reader.result : undefined);
          reader.readAsDataURL(b);
        });
      }
      const imageDataUrl = await blobToDataUrl(snapshot || imageFile || null);
      const audioDataUrl = undefined;
      setLastReport({
        type,
        description,
        locationQuery: locationQuery || undefined,
        lat: locLat,
        lng: locLng,
        submittedAt: new Date().toISOString(),
        imageDataUrl,
        audioDataUrl,
      });

      setThanksOpen(true);
      setDescription("");
      setSnapshot(null);
      setImageFile(null);
      // audio removed
    } catch (err: any) {
      // Suppress error and still show thank-you per request
      setStatus("Report submitted.");
      setThanksOpen(true);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section id="report" className="relative py-24 px-6 md:py-28">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h2 className="text-4xl md:text-5xl font-extrabold mb-3">Report an Incident</h2>
          <p className="text-neutral-300 max-w-2xl">Help authorities by reporting suspected deforestation or wildfires. You can attach a photo (camera or file) and add details. Location is attached if permitted.</p>
        </div>

        <form onSubmit={onSubmit} className="grid gap-6 md:grid-cols-2">
          <div className="space-y-4">
            <label className="block">
              <span className="text-sm text-neutral-300">Incident Type</span>
              <select value={type} onChange={(e) => setType(e.target.value as any)} className="mt-1 w-full bg-neutral-900/60 border border-white/10 rounded-lg px-3 py-2">
                <option value="wildfire">Wildfire</option>
                <option value="deforestation">Deforestation</option>
                <option value="other">Other</option>
              </select>
            </label>

            <label className="block">
              <span className="text-sm text-neutral-300">Description</span>
              <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={6} placeholder="Describe what you observed (time, place, severity, landmarks)..." className="mt-1 w-full bg-neutral-900/60 border border-white/10 rounded-lg px-3 py-2" />
            </label>

            {/* Location Input */}
            <div className="rounded-xl border border-white/10 bg-neutral-900/60 p-4">
              <p className="font-semibold mb-2">Location</p>
              <div className="grid gap-2">
                <label className="block">
                  <span className="text-sm text-neutral-300">Address or place (optional)</span>
                  <input
                    type="text"
                    value={locationQuery}
                    onChange={(e) => setLocationQuery(e.target.value)}
                    placeholder="e.g., Central Park, NYC or 1600 Amphitheatre Pkwy"
                    className="mt-1 w-full bg-neutral-900/60 border border-white/10 rounded-lg px-3 py-2"
                  />
                </label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    className="px-3 py-1 rounded-md border border-white/10 hover:bg-white/5"
                    onClick={async () => {
                      try {
                        const pos = await new Promise<GeolocationPosition>((resolve, reject) => {
                          if (!navigator.geolocation) return reject("no-geo");
                          navigator.geolocation.getCurrentPosition(resolve, reject, { enableHighAccuracy: true, timeout: 5000 });
                        });
                        setLocLat(pos.coords.latitude);
                        setLocLng(pos.coords.longitude);
                        setStatus("Using your current location for the report.");
                      } catch {
                        setStatus("Unable to retrieve your location.");
                      }
                    }}
                  >
                    Use current location
                  </button>
                  <button
                    type="button"
                    className="px-3 py-1 rounded-md border border-white/10 hover:bg-white/5"
                    onClick={() => {
                      setLocLat(null);
                      setLocLng(null);
                    }}
                  >
                    Clear
                  </button>
                </div>
              </div>
              {/* Map Preview */}
              {(locLat != null && locLng != null) || locationQuery ? (
                <div className="mt-3 rounded-lg overflow-hidden border border-white/10">
                  {locLat != null && locLng != null ? (
                    <iframe
                      title="Location preview"
                      className="w-full h-56"
                      src={`https://www.openstreetmap.org/export/embed.html?bbox=${(locLng-0.01).toFixed(6)}%2C${(locLat-0.01).toFixed(6)}%2C${(locLng+0.01).toFixed(6)}%2C${(locLat+0.01).toFixed(6)}&layer=mapnik&marker=${locLat.toFixed(6)}%2C${locLng.toFixed(6)}`}
                      referrerPolicy="no-referrer-when-downgrade"
                      loading="lazy"
                    />
                  ) : (
                    <iframe
                      title="Location preview"
                      className="w-full h-56"
                      src={`https://www.google.com/maps?q=${encodeURIComponent(locationQuery)}&output=embed`}
                      referrerPolicy="no-referrer-when-downgrade"
                      loading="lazy"
                    />
                  )}
                </div>
              ) : null}
            </div>

            <div className="flex items-center gap-3 text-xs text-neutral-400">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-400" />
              Data is transmitted securely to the configured authority webhook.
            </div>
          </div>

          <div className="space-y-4">
            <div className="rounded-xl border border-white/10 bg-neutral-900/60 p-4">
              <div className="flex items-center justify-between mb-3">
                <p className="font-semibold">Camera</p>
                <div className="flex gap-2">
                  <button type="button" onClick={startCamera} className="px-3 py-1 rounded-md border border-white/10 hover:bg-white/5">Start</button>
                  <button type="button" onClick={capturePhoto} className="px-3 py-1 rounded-md border border-white/10 hover:bg-white/5">Capture</button>
                  <button type="button" onClick={stopCamera} className="px-3 py-1 rounded-md border border-white/10 hover:bg-white/5">Stop</button>
                </div>
              </div>
              <video ref={videoRef} className="w-full rounded-lg bg-black/40 aspect-video" playsInline muted />
              {snapshot && (
                <p className="mt-2 text-xs text-emerald-300">Snapshot attached.</p>
              )}
            </div>

            <div className="rounded-xl border border-white/10 bg-neutral-900/60 p-4">
              <p className="font-semibold mb-2">Upload Image</p>
              <input type="file" accept="image/*" onChange={onPickImage} />
              {imageFile && (
                <p className="mt-2 text-xs text-emerald-300">Selected: {imageFile.name}</p>
              )}
            </div>

            <div className="flex items-center justify-end gap-3">
              <button disabled={submitting} className="px-4 py-2 rounded-lg bg-secondary text-secondary-foreground font-semibold border border-secondary/30 hover:bg-secondary/90 disabled:opacity-60">
                {submitting ? "Submitting..." : "Submit Report"}
              </button>
            </div>

            {status && <div className="text-sm text-neutral-300">{status}</div>}
          </div>
        </form>
      </div>

      {/* Thank you popup */}
      <Modal open={thanksOpen} onClose={() => setThanksOpen(false)} title="Report submitted">
        <p className="mb-2">Thank you for submitting your report. Your input helps authorities respond faster and protect our planet.</p>
        <div className="mt-3 flex flex-wrap items-center gap-3">
          <button
            className="px-3 py-2 rounded-md border border-white/10 hover:bg-white/5 text-sm"
            onClick={() => {
              if (!lastReport) return;
              const blob = new Blob([JSON.stringify(lastReport, null, 2)], { type: "application/json" });
              const url = URL.createObjectURL(blob);
              const a = document.createElement("a");
              a.href = url;
              a.download = `terratack_report_${Date.now()}.json`;
              a.click();
              URL.revokeObjectURL(url);
            }}
          >
            Download JSON
          </button>
          <button
            className="px-3 py-2 rounded-md border border-white/10 hover:bg-white/5 text-sm"
            onClick={() => {
              if (!lastReport) return;
              const lines = [
                `Type: ${lastReport.type}`,
                `Description: ${lastReport.description}`,
                lastReport.locationQuery ? `Location (query): ${lastReport.locationQuery}` : undefined,
                lastReport.lat != null && lastReport.lng != null ? `Coordinates: ${lastReport.lat}, ${lastReport.lng}` : undefined,
                `Submitted At: ${lastReport.submittedAt}`,
                lastReport.imageDataUrl ? `Image: [embedded base64]` : undefined,
                lastReport.audioDataUrl ? `Audio: [embedded base64]` : undefined,
              ].filter(Boolean) as string[];
              const blob = new Blob([lines.join("\n")], { type: "text/plain" });
              const url = URL.createObjectURL(blob);
              const a = document.createElement("a");
              a.href = url;
              a.download = `terratack_report_${Date.now()}.txt`;
              a.click();
              URL.revokeObjectURL(url);
            }}
          >
            Download Text
          </button>
          <button
            className="px-3 py-2 rounded-md border border-white/10 hover:bg-white/5 text-sm"
            onClick={async () => {
              if (!lastReport) return;
              try {
                // Use CDN runtime loader (defined earlier) to avoid bundler import
                // @ts-ignore
                if (!(window as any).jspdf?.jsPDF) {
                  const s = document.createElement("script");
                  s.src = "https://cdn.jsdelivr.net/npm/jspdf@2.5.1/dist/jspdf.umd.min.js";
                  await new Promise<void>((resolve, reject) => {
                    s.onload = () => resolve();
                    s.onerror = () => reject();
                    document.head.appendChild(s);
                  });
                }
                // @ts-ignore
                const jsPDFCtor = (window as any).jspdf?.jsPDF;
                if (!jsPDFCtor) throw new Error("jsPDF unavailable");
                const doc = new jsPDFCtor({ unit: "pt", format: "a4" });
                let y = 40;
                doc.setFontSize(14);
                doc.text("TerraTrack — Incident Report", 40, y);
                y += 24;
                doc.setFontSize(11);
                const lines: string[] = [];
                lines.push(`Type: ${lastReport.type}`);
                lines.push(`Submitted: ${new Date(lastReport.submittedAt).toLocaleString()}`);
                if (lastReport.locationQuery) lines.push(`Location (query): ${lastReport.locationQuery}`);
                if (lastReport.lat != null && lastReport.lng != null) lines.push(`Coordinates: ${lastReport.lat}, ${lastReport.lng}`);
                lines.push("");
                lines.push("Description:");
                lines.push(lastReport.description || "(none)");
                // @ts-ignore splitTextToSize may not be typed on UMD
                const wrapped = (doc as any).splitTextToSize ? (doc as any).splitTextToSize(lines.join("\n"), 515) : lines.join("\n");
                doc.text(wrapped as any, 40, y);
                y += (Array.isArray(wrapped) ? wrapped.length : String(wrapped).split("\n").length) * 14 + 16;
                // Omit images from PDF as requested
                if (y > 760) doc.addPage();
                doc.setFontSize(9);
                doc.text("Note: Audio cannot be embedded here. Please keep the downloaded JSON/Text for audio reference.", 40, Math.min(y, 780));
                doc.save(`terratack_report_${Date.now()}.pdf`);
              } catch (e) {
                // Fallback: print-friendly window
                const win = window.open("", "_blank");
                if (!win) return;
                win.document.write(`<!doctype html><title>Report</title><body style='font-family:system-ui,sans-serif;padding:24px;color:#111;background:#fff'>
                  <h2>TerraTrack — Incident Report</h2>
                  <pre style='white-space:pre-wrap'>Type: ${lastReport?.type}\nSubmitted: ${new Date(lastReport!.submittedAt).toLocaleString()}\n${lastReport?.locationQuery ? `Location (query): ${lastReport.locationQuery}\n` : ""}${lastReport?.lat != null && lastReport?.lng != null ? `Coordinates: ${lastReport.lat}, ${lastReport.lng}\n` : ""}\nDescription:\n${lastReport?.description || "(none)"}</pre>
                  <p style='margin-top:12px;font-size:12px;color:#555'>Note: Images are intentionally omitted from the printable report. Use the JSON/Text download for full details. Audio cannot be embedded; use JSON/Text for audio references.</p>
                </body>`);
                win.document.close();
                win.focus();
                win.print();
              }
            }}
          >
            Download PDF
          </button>
        </div>
        <p className="mt-3 text-neutral-400 text-sm">You may close this window.</p>
      </Modal>
    </section>
  );
}
