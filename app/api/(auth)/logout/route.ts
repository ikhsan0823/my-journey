import { NextResponse } from "next/server";

export function GET() {
    try {
        const response = NextResponse.json({ message: "Logout successful" }, { status: 200 });

        response.cookies.delete("authToken");

        return response;
    } catch (error) {
        return NextResponse.json({ message: "Logout failed" }, { status: 500 });
    }
}