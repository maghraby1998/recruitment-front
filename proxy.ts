import { NextResponse, NextRequest } from "next/server";

// This function can be marked `async` if using `await` inside

const PUBLIC_ROUTES = [
  "/register",
  "/register/employee",
  "/register/company",
  "/login",
];

const EMPLOYEE_ROUTES: string[] = [];
const COMPANY_ROUTES = ["/job-posts"];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isPublicRoute = PUBLIC_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );

  const authInfoCookie = request.cookies.get("auth_info")?.value;

  const authInfo = authInfoCookie ? JSON.parse(authInfoCookie) : null;

  const accessToken = authInfo?.accessToken;

  if (isPublicRoute) {
    if (accessToken) {
      const registerUrl = new URL("/", request.url);
      return NextResponse.redirect(registerUrl);
    }
    return NextResponse.next();
  } else {
    if (!accessToken) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    const userType = authInfo?.user_type;

    const isEmployeeRoute = EMPLOYEE_ROUTES.some((route) =>
      pathname.startsWith(route),
    );
    const isCompanyRoute = COMPANY_ROUTES.some((route) =>
      pathname.startsWith(route),
    );

    // Redirect employees away from company routes
    if (userType === "EMPLOYEE" && isCompanyRoute) {
      return NextResponse.redirect(new URL("/jobs", request.url));
    }

    // Redirect companies away from employee routes
    if (userType === "COMPANY" && isEmployeeRoute) {
      return NextResponse.redirect(new URL("/job-posts", request.url));
    }

    // Redirect from root to appropriate dashboard
    if (pathname === "/") {
      if (userType === "COMPANY") {
        return NextResponse.redirect(new URL("/jobs", request.url));
      } else {
        return NextResponse.redirect(new URL("/jobs", request.url));
      }
    }

    return NextResponse.next();
  }
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
