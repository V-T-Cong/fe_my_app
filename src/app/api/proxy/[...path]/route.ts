import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

export async function handler(request: NextRequest) {
  const accessToken = request.cookies.get("accessToken")?.value;
  const pathname = request.nextUrl.pathname.replace("/api/proxy", "");
  const searchParams = request.nextUrl.searchParams.toString();
  const targetUrl = `${BACKEND_URL}${pathname}${searchParams ? `?${searchParams}` : ""}`;

  // Build headers — forward content-type and add auth
  const headers: Record<string, string> = {
    "Content-Type": request.headers.get("content-type") || "application/json",
  };

  if (accessToken) {
    headers["Authorization"] = `Bearer ${accessToken}`;
  }

  try {
    // Read body for non-GET requests
    let body: string | null = null;
    if (request.method !== "GET" && request.method !== "HEAD") {
      body = await request.text();
    }

    const backendResponse = await fetch(targetUrl, {
      method: request.method,
      headers,
      body,
    });

    // If 401, try to refresh token
    if (backendResponse.status === 401) {
      const refreshToken = request.cookies.get("refreshToken")?.value;

      if (refreshToken) {
        const refreshResponse = await fetch(
          `${BACKEND_URL}/api/auth/refresh-token`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ refreshToken }),
          }
        );

        if (refreshResponse.ok) {
          const refreshData = await refreshResponse.json();

          // Retry original request with new token
          headers["Authorization"] = `Bearer ${refreshData.accessToken}`;
          const retryResponse = await fetch(targetUrl, {
            method: request.method,
            headers,
            body,
          });

          const retryData = await retryResponse.text();
          const response = new NextResponse(retryData, {
            status: retryResponse.status,
            headers: {
              "Content-Type":
                retryResponse.headers.get("content-type") ||
                "application/json",
            },
          });

          // Update cookies with new tokens
          response.cookies.set("accessToken", refreshData.accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
            maxAge: 60 * 60,
          });

          if (refreshData.refreshToken) {
            response.cookies.set("refreshToken", refreshData.refreshToken, {
              httpOnly: true,
              secure: process.env.NODE_ENV === "production",
              sameSite: "lax",
              path: "/",
              maxAge: 60 * 60 * 24 * 7,
            });
          }

          return response;
        }

        // Refresh failed — clear cookies and return 401
        const failResponse = NextResponse.json(
          { error: "Session expired" },
          { status: 401 }
        );
        failResponse.cookies.delete("accessToken");
        failResponse.cookies.delete("refreshToken");
        return failResponse;
      }
    }

    // Forward the backend response
    const responseData = await backendResponse.text();
    return new NextResponse(responseData, {
      status: backendResponse.status,
      headers: {
        "Content-Type":
          backendResponse.headers.get("content-type") || "application/json",
      },
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to reach backend" },
      { status: 502 }
    );
  }
}

export const GET = handler;
export const POST = handler;
export const PUT = handler;
export const DELETE = handler;
export const PATCH = handler;
