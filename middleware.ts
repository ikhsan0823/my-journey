import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const secret = new TextEncoder().encode(process.env.JWT_SECRET);

export default async function middleware(request: NextRequest) {
    const nextPath = request.nextUrl.pathname;
    const isPublicPath = nextPath === "/" || nextPath === "/register";
    const token = request.cookies.get("authToken")?.value;
    if (!token && !isPublicPath) {
        return NextResponse.redirect(new URL("/", request.url));
    } else if (token) {
        try {
            const { payload } = await jwtVerify(token, secret)
            const tokenExpiration = new Date(payload.exp! * 1000);

            if (tokenExpiration < new Date()) {
                return NextResponse.redirect(new URL("/", request.url));
            }

            if (isPublicPath) {
                return NextResponse.redirect(new URL("/home", request.url));
            }
        } catch (error) {
            return NextResponse.redirect(new URL("/", request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/", "/register", "/home", "/todo-list", "/monthly-plan", "/goals", "/sweet-memory", "/notes", "/profile", "/settings"],
}