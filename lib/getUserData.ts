import { NextRequest } from "next/server";
import { jwtVerify } from "jose";

type JWTPayload = {
    userId?: string
}

async function getUserData(request: NextRequest) {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const token = request.cookies.get("authToken")?.value;
    if (!token) {
        return undefined;
    }

    try {
        const { payload } = await jwtVerify(token, secret) as { payload: JWTPayload };
        return payload.userId;
    } catch (error) {
        console.log("Error getting user data:", error);
        return undefined;
    }
}

export default getUserData;