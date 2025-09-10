import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const ALLOWED_ORIGINS = [
  "https://my-cash-omega.vercel.app",
  "http://localhost:3000",
];

export function middleware(req: NextRequest) {
  //   const origin = req.headers.get("origin") || "";
  //   if (!req.nextUrl.pathname.startsWith("/api")) {
  //     return NextResponse.next();
  //   }
  //   const allowedOrigin = ALLOWED_ORIGINS.includes(origin) ? origin : "";
  //   if (req.method === "OPTIONS") {
  //     const res = new NextResponse(null, { status: 204 });
  //     if (allowedOrigin) {
  //       res.headers.set("Access-Control-Allow-Origin", allowedOrigin);
  //     }
  //     res.headers.set(
  //       "Access-Control-Allow-Methods",
  //       "GET, POST, PUT, DELETE, OPTIONS"
  //     );
  //     res.headers.set(
  //       "Access-Control-Allow-Headers",
  //       "Content-Type, Authorization"
  //     );
  //     res.headers.set("Access-Control-Allow-Credentials", "true");
  //     return res;
  //   }
  //   const res = NextResponse.next();
  //   if (allowedOrigin) {
  //     res.headers.set("Access-Control-Allow-Origin", allowedOrigin);
  //   }
  //   res.headers.set(
  //     "Access-Control-Allow-Methods",
  //     "GET, POST, PUT, DELETE, OPTIONS"
  //   );
  //   res.headers.set(
  //     "Access-Control-Allow-Headers",
  //     "Content-Type, Authorization"
  //   );
  //   res.headers.set("Access-Control-Allow-Credentials", "true");
  //   return res;
}

export const config = {
  matcher: "/api/:path*",
};
