import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Middleware runs in the Edge Runtime.
// Avoid Node.js-only modules here (e.g., mongoose/db connections).
// Server startup checks are handled via instrumentation.ts (Node.js runtime).

export function middleware(request: NextRequest) {
  return NextResponse.next();
}

export const config = {
  matcher: "/api/:path*",
};
