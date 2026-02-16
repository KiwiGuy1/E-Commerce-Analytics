import { NextResponse } from "next/server";
import type { User } from "@/types/analytics";

const backendApiBase = (
  process.env.BACKEND_API_URL?.trim() ||
  process.env.NEXT_PUBLIC_API_URL?.trim() ||
  "http://localhost:5000/api"
).replace(/\/+$/, "");

export async function GET() {
  try {
    const response = await fetch(`${backendApiBase}/users`, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
      cache: "no-store",
    });

    if (!response.ok) {
      return NextResponse.json(
        { message: "Unable to load users right now." },
        { status: response.status }
      );
    }

    const users = (await response.json()) as User[];
    return NextResponse.json(users, { status: 200 });
  } catch {
    return NextResponse.json(
      { message: "Unable to load users right now." },
      { status: 502 }
    );
  }
}
