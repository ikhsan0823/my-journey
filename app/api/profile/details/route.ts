import { NextRequest, NextResponse } from "next/server";
import connect from "@/lib/db";
import Profile from "@/lib/models/profile";
import getUserData from "@/lib/getUserData";

export const GET = async (request: NextRequest) => {
    const userId = await getUserData(request)
    if (!userId) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    await connect()

    try {
        const profile = await Profile.findOne({ userId: userId })
        if (!profile) {
            return NextResponse.json({ message: "Profile not found" }, { status: 404 })
        }
        return NextResponse.json({ profile }, { status: 200 })
    } catch (error) {
        return NextResponse.json({ message: "Something went wrong", error }, { status: 500 })
    }
}