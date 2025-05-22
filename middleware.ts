import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

import jwt from "jsonwebtoken";

const ADMIN_PROTECTED = /^\/admin(\/|$)/;
const ADMIN_LOGIN = "/admin/login";
const JWT_SECRET = process.env.ADMIN_JWT_SECRET || "changemejwt";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only protect /admin/*
  if (!ADMIN_PROTECTED.test(pathname)) {
    return NextResponse.next();
  }

  // Allow /admin/login always
  if (pathname === ADMIN_LOGIN) {
    return NextResponse.next();
  }

  // Check for admin_jwt cookie
  const jwtToken = request.cookies.get("admin_jwt")?.value;
  if (!jwtToken) {
    return NextResponse.redirect(new URL(ADMIN_LOGIN, request.url));
  }
  try {
    jwt.verify(jwtToken, JWT_SECRET);
    return NextResponse.next();
  } catch {
    return NextResponse.redirect(new URL(ADMIN_LOGIN, request.url));
  }
}


export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!_next/static|_next/image|favicon.ico|public/).*)",
  ],
}
