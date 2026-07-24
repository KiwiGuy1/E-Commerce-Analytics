import { NextResponse } from "next/server";

const apiBase = (
  process.env.API_URL?.trim() ||
  process.env.NEXT_PUBLIC_API_URL?.trim() ||
  "http://localhost:5000/api"
).replace(/\/+$/, "");

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const response = await fetch(`${apiBase}/analytics`, {
      headers: { Accept: "application/json" },
      cache: "no-store",
    });
    const body = await response.json();

    return NextResponse.json(body, {
      status: response.status,
      headers: { "Cache-Control": "no-store" },
    });
  } catch {
    return NextResponse.json(
      { message: "Unable to load analytics data right now." },
      { status: 502 },
    );
  }
}
