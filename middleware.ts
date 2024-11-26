import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const requuestHeaders = new Headers(request.headers);
  const origin = requuestHeaders.get("origin") ?? "";

  const response = NextResponse.next({
    request: {
      headers: requuestHeaders,
    },
  });

  const allowedOrigins = [
    "http://localhost:3000",
    "https://pulse.freecorps.xyz",
  ];

  if (allowedOrigins.includes(origin)) {
    response.headers.set("Access-Control-Allow-Origin", origin);
  }

  response.headers.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  response.headers.set("Access-Control-Allow-Headers", "*");

  return response;
}
