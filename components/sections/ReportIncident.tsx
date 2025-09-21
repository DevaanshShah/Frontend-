"use client";

import { useEffect, useRef, useState } from "react";

export default function ReportIncident() {
  const [type, setType] = useState<"wildfire" | "deforestation" | "other">("wildfire");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  // Camera
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [snapshot, setSnapshot] = useState<Blob | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);

  // Audio
  const [recording, setRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);

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

  async function startRecording() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
      const mr = new MediaRecorder(stream);
      mediaRecorderRef.current = mr;
      audioChunksRef.current = [];
      mr.ondataavailable = (ev) => {
        if (ev.data.size > 0) audioChunksRef.current.push(ev.data);
      };
      mr.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        setAudioBlob(blob);
        // stop tracks
        stream.getTracks().forEach((t) => t.stop());
      };
      mr.start();
      setRecording(true);
    } catch (e) {
      setStatus("Microphone permission denied or unavailable.");
    }
  }

  function stopRecording() {
    if (mediaRecorderRef.current && recording) {
      mediaRecorderRef.current.stop();
      setRecording(false);
    }
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setStatus(null);

    try {
      const fd = new FormData();
      fd.append("type", type);
      fd.append("description", description);

      // Location if available
      try {
        const pos = await new Promise<GeolocationPosition>((resolve, reject) => {
          if (!navigator.geolocation) return reject("no-geo");
          navigator.geolocation.getCurrentPosition(resolve, reject, { enableHighAccuracy: true, timeout: 5000 });
        });
        fd.append("lat", String(pos.coords.latitude));
        fd.append("lng", String(pos.coords.longitude));
        fd.append("accuracy", String(pos.coords.accuracy));
      } catch {}

      // Attachments
      if (snapshot) {
        fd.append("image", snapshot, "snapshot.jpg");
      } else if (imageFile) {
        fd.append("image", imageFile);
      }
      if (audioBlob) {
        fd.append("audio", audioBlob, "report.webm");
      }

      const res = await fetch("/api/report", { method: "POST", body: fd });
      if (!res.ok) throw new Error("Failed to submit");
      const data = await res.json();
      setStatus(data.message || "Report submitted successfully.");
      setDescription("");
      setSnapshot(null);
      setImageFile(null);
      setAudioBlob(null);
    } catch (err: any) {
      setStatus(err?.message || "Submission failed.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section id="report" className="relative py-24 px-6 md:py-28">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h2 className="text-4xl md:text-5xl font-extrabold mb-3">Report an Incident</h2>
          <p className="text-neutral-300 max-w-2xl">Help authorities by reporting suspected deforestation or wildfires. You can attach a photo (camera or file), record a brief audio note, and add details. Location is attached if permitted.</p>
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

            <div className="rounded-xl border border-white/10 bg-neutral-900/60 p-4">
              <div className="flex items-center justify-between">
                <p className="font-semibold">Audio Note</p>
                {!recording ? (
                  <button type="button" onClick={startRecording} className="px-3 py-1 rounded-md border border-white/10 hover:bg-white/5">
                    Start Recording
                  </button>
                ) : (
                  <button type="button" onClick={stopRecording} className="px-3 py-1 rounded-md border border-white/10 hover:bg-white/5">
                    Stop Recording
                  </button>
                )}
              </div>
              {audioBlob && <p className="mt-2 text-xs text-emerald-300">Audio recorded.</p>}
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
    </section>
  );
}
