import { NextResponse, NextRequest } from "next/server";

// This function can be marked `async` if using `await` inside

const PUBLIC_ROUTES = [
  "/register",
  "/register/employee",
  "/register/company",
  "/login",
];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isPublicRoute = PUBLIC_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );

  const accessToken = request.cookies.get("access_token")?.value;

  if (isPublicRoute) {
    if (accessToken) {
      const registerUrl = new URL("/", request.url);
      return NextResponse.redirect(registerUrl);
    }
    return NextResponse.next();
  } else {
    if (!accessToken) {
      const registerUrl = new URL("/login", request.url);
      return NextResponse.redirect(registerUrl);
    }

    return NextResponse.next();
  }
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
