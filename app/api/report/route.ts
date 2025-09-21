import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs"; // ensure Node runtime for FormData processing

export async function POST(req: NextRequest) {
  try {
    const form = await req.formData();

    const type = String(form.get("type") || "");
    const description = String(form.get("description") || "");
    const lat = form.get("lat") ? Number(form.get("lat")) : undefined;
    const lng = form.get("lng") ? Number(form.get("lng")) : undefined;
    const accuracy = form.get("accuracy") ? Number(form.get("accuracy")) : undefined;

    const image = form.get("image");
    const audio = form.get("audio");

    if (!type || !description) {
      return NextResponse.json({ message: "Missing required fields." }, { status: 400 });
    }

    const payload: any = {
      type,
      description,
      location: lat != null && lng != null ? { lat, lng, accuracy } : undefined,
      submittedAt: new Date().toISOString(),
      userAgent: req.headers.get("user-agent"),
    };

    // Convert blobs to base64 for transport if forwarding
    async function blobToBase64(b: File | Blob | null): Promise<string | undefined> {
      if (!b) return undefined;
      const buf = Buffer.from(await b.arrayBuffer());
      return `data:${(b as File).type || "application/octet-stream"};base64,${buf.toString("base64")}`;
    }

    const imageDataUrl = await blobToBase64(image as any);
    const audioDataUrl = await blobToBase64(audio as any);
    if (imageDataUrl) payload.image = imageDataUrl;
    if (audioDataUrl) payload.audio = audioDataUrl;

    // Optional forwarding to authority webhook
    const webhook = process.env.REPORT_WEBHOOK_URL;
    if (webhook) {
      const res = await fetch(webhook, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const text = await res.text().catch(() => "");
        console.error("Webhook forward failed", res.status, text);
      }
    } else {
      // If no webhook, just log on server for now
      console.log("Report received (no webhook configured)", {
        ...payload,
        image: imageDataUrl ? "<image base64>" : undefined,
        audio: audioDataUrl ? "<audio base64>" : undefined,
      });
    }

    return NextResponse.json({ message: "Report submitted. Thank you for helping protect our planet." });
  } catch (err: any) {
    console.error("/api/report error", err);
    return NextResponse.json({ message: "Server error." }, { status: 500 });
  }
}
