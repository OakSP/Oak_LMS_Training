import { NextResponse, type NextRequest } from "next/server";

const PROTECTED = ["/dashboard", "/learn", "/quiz", "/settings"];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isProtected = PROTECTED.some((p) => pathname.startsWith(p));

  if (isProtected) {
    // NextAuth v5 session cookie names
    const token = request.cookies.get("authjs.session-token") ??
                  request.cookies.get("__Secure-authjs.session-token");
    if (!token) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
