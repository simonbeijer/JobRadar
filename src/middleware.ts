import { NextRequest, NextResponse } from "next/server";
import { verifyAuth } from "./lib/auth";

export async function middleware(request: NextRequest) {
    const token = request.cookies.get("token")?.value;
    const { pathname } = request.nextUrl;

    console.log("Middleware running on:", pathname);

    if (pathname === "/") {
        return NextResponse.next();
    }

    if (pathname === "/login") {
        if (token) {
            try {
                await verifyAuth(token);
                return NextResponse.redirect(new URL("/dashboard", request.url));
            } catch (error) {
                console.log("Invalid token:", error instanceof Error ? error.message : 'Unknown error');
            }
        }
        return NextResponse.next();
    }

    if (!token) {
        return NextResponse.redirect(new URL("/login", request.url));
    }

    try {
        await verifyAuth(token);
        return NextResponse.next();
    } catch (error) {
        console.log("Invalid token:", error instanceof Error ? error.message : 'Unknown error');
        return NextResponse.redirect(new URL("/login", request.url));
    }
}

export const config = {
    matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
};
