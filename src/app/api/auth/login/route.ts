import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

// Cookie options for HttpOnly tokens
const ACCESS_TOKEN_COOKIE = {
  name: "accessToken",
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
  maxAge: 60 * 60, // 1 hour
};

const REFRESH_TOKEN_COOKIE = {
  name: "refreshToken",
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
  maxAge: 60 * 60 * 24 * 7, // 7 days
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Forward login request to the backend
    const backendResponse = await fetch(`${BACKEND_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!backendResponse.ok) {
      const errorText = await backendResponse.text();
      return NextResponse.json(
        { error: errorText || "Login failed" },
        { status: backendResponse.status }
      );
    }

    const data = await backendResponse.json();

    // Set tokens as HttpOnly cookies
    const response = NextResponse.json({
      email: data.email,
      type: data.type,
    });

    response.cookies.set(ACCESS_TOKEN_COOKIE.name, data.accessToken, {
      httpOnly: ACCESS_TOKEN_COOKIE.httpOnly,
      secure: ACCESS_TOKEN_COOKIE.secure,
      sameSite: ACCESS_TOKEN_COOKIE.sameSite,
      path: ACCESS_TOKEN_COOKIE.path,
      maxAge: ACCESS_TOKEN_COOKIE.maxAge,
    });

    response.cookies.set(REFRESH_TOKEN_COOKIE.name, data.refreshToken, {
      httpOnly: REFRESH_TOKEN_COOKIE.httpOnly,
      secure: REFRESH_TOKEN_COOKIE.secure,
      sameSite: REFRESH_TOKEN_COOKIE.sameSite,
      path: REFRESH_TOKEN_COOKIE.path,
      maxAge: REFRESH_TOKEN_COOKIE.maxAge,
    });

    return response;
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
