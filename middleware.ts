import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// This file runs on server startup in Next.js App Router
// Import and run startup check
if (typeof window === "undefined") {
  import("./lib/startup").then((module) => {
    module.testConnection();
  });
}

export function middleware(request: NextRequest) {
  return NextResponse.next();
}

export const config = {
  matcher: "/api/:path*",
};
