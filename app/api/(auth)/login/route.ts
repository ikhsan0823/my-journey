import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { SignJWT } from "jose";

import connect from "@/lib/db";
import User from "@/lib/models/user";

const secret = process.env.JWT_SECRET;

export const POST = async (request: NextRequest) => {
    try {
        const { username, password } = await request.json();

        await connect();

        const user = await User.findOne({ username });
        if (!user) {
            return NextResponse.json({ message: "Username or password is incorrect" }, { status: 404 });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return NextResponse.json({ message: "Username or password is incorrect" }, { status: 404 });
        }

        const jwtSecret = new TextEncoder().encode(secret);
        const token = await new SignJWT({ userId: user._id }).setProtectedHeader({ alg: "HS256" }).setExpirationTime("24h").sign(jwtSecret);

        const response = NextResponse.json({ message: "Login successful" } , { status: 200 });

        response.cookies.set({
            name: "authToken",
            value: token,
            path: "/",
            httpOnly: true,
            maxAge: 3600 * 24,
            secure: false,
        })

        return response;
    } catch (error) {
        return NextResponse.json({ message: "Something went wrong" }, { status: 500 });
    }
}