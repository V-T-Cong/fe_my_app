import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

export async function POST(request: NextRequest) {
  try {
    const refreshToken = request.cookies.get("refreshToken")?.value;

    if (refreshToken) {
      // Notify backend about logout
      await fetch(`${BACKEND_URL}/api/auth/logout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken }),
      }).catch(() => {
        // Ignore backend logout errors — still clear cookies
      });
    }

    // Clear both cookies
    const response = NextResponse.json({ message: "Logged out" });
    response.cookies.delete("accessToken");
    response.cookies.delete("refreshToken");

    return response;
  } catch {
    // Even on error, clear the cookies
    const response = NextResponse.json({ message: "Logged out" });
    response.cookies.delete("accessToken");
    response.cookies.delete("refreshToken");
    return response;
  }
}
