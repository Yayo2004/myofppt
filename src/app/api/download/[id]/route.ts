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
    if (!docRes.ok) return new NextResponse("Document introuvable", { status: 404 });

    const doc = await docRes.json();
    if (!doc?.storageUrl) return new NextResponse("Document introuvable", { status: 404 });

    const fileRes = await fetch(doc.storageUrl, { cache: "no-store" });
    if (!fileRes.ok) return new NextResponse("Document introuvable", { status: 404 });

    const body = await fileRes.arrayBuffer();
    const contentType = fileRes.headers.get("content-type") || "application/octet-stream";

    return new NextResponse(body, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Content-Length": String(body.byteLength),
        "Content-Disposition": `inline; filename="${(doc.fileName ?? "file").replace(/"/g, "")}"`,
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch {
    return new NextResponse("Erreur interne", { status: 500 });
  }
}
