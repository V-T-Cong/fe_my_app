import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

export async function handler(request: NextRequest) {
  const accessToken = request.cookies.get("accessToken")?.value;
  const pathname = request.nextUrl.pathname.replace("/api/proxy", "");
  const searchParams = request.nextUrl.searchParams.toString();
  const targetUrl = `${BACKEND_URL}${pathname}${searchParams ? `?${searchParams}` : ""}`;

  try {
    // Read body for non-GET requests
    let body: BodyInit | undefined = undefined;
    const contentType = request.headers.get("content-type") || "";
    const isMultipart = contentType.includes("multipart/form-data");

    if (request.method !== "GET" && request.method !== "HEAD") {
      if (isMultipart) {
        // For multipart/form-data, forward the raw body as-is
        body = await request.arrayBuffer();
      } else {
        const text = await request.text();
        body = text || undefined; // Don't send empty string as body
      }
    }

    // Build headers for the backend request
    const forwardHeaders: Record<string, string> = {};
    if (accessToken) {
      forwardHeaders["Authorization"] = `Bearer ${accessToken}`;
    }
    if (isMultipart) {
      // Forward the exact content-type with boundary for multipart
      forwardHeaders["Content-Type"] = contentType;
    } else if (body) {
      forwardHeaders["Content-Type"] = "application/json";
    }

    console.log(`[Proxy] ${request.method} ${targetUrl}`);
    console.log(`[Proxy] Has token: ${!!accessToken}`);
    console.log(`[Proxy] Token: ${accessToken?.substring(0, 30)}...`);
    console.log(`[Proxy] Forward headers:`, JSON.stringify(forwardHeaders));
    if (body && typeof body === "string") {
      console.log(`[Proxy] Body:`, body.substring(0, 300));
    }

    const backendResponse = await fetch(targetUrl, {
      method: request.method,
      headers: forwardHeaders,
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
          forwardHeaders["Authorization"] = `Bearer ${refreshData.accessToken}`;
          const retryResponse = await fetch(targetUrl, {
            method: request.method,
            headers: forwardHeaders,
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
    console.log(`[Proxy] Response status: ${backendResponse.status}`);
    console.log(`[Proxy] Response body: ${responseData.substring(0, 500)}`);
    if (!backendResponse.ok) {
      console.log(`[Proxy] Response headers:`, Object.fromEntries(backendResponse.headers.entries()));
    }
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
