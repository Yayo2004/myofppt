import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  try {
    const docRes = await fetch(`${API_BASE}/documents/${id}`, { cache: "no-store" });
    if (!docRes.ok) return new NextResponse("Vignette introuvable", { status: 404 });

    const doc = await docRes.json();
    if (!doc?.thumbnailUrl) return new NextResponse("Vignette introuvable", { status: 404 });

    const imgRes = await fetch(doc.thumbnailUrl, { cache: "no-store" });
    if (!imgRes.ok) return new NextResponse("Vignette introuvable", { status: 404 });

    const body = await imgRes.arrayBuffer();
    const contentType = imgRes.headers.get("content-type") || "image/png";

    return new NextResponse(body, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Content-Length": String(body.byteLength),
        "Cache-Control": "public, max-age=86400",
      },
    });
  } catch {
    return new NextResponse("Erreur interne", { status: 500 });
  }
}
