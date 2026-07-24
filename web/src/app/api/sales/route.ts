import { NextRequest, NextResponse } from "next/server";

const apiBase = (
  process.env.API_URL?.trim() ||
  process.env.NEXT_PUBLIC_API_URL?.trim() ||
  "http://localhost:5000/api"
).replace(/\/+$/, "");

export async function POST(request: NextRequest) {
  try {
    const response = await fetch(`${apiBase}/sales`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(await request.json()),
      cache: "no-store",
    });
    const body = await response.json();

    return NextResponse.json(body, {
      status: response.status,
      headers: { "Cache-Control": "no-store" },
    });
  } catch {
    return NextResponse.json(
      { message: "Unable to create sale right now." },
      { status: 502 },
    );
  }
}
