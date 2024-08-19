import { NextRequest, NextResponse } from "next/server";
import connect from "@/lib/db";
import Profile from "@/lib/models/profile";
import getUserData from "@/lib/getUserData";

export const PATCH = async (request: NextRequest, { params }: { params: { id: string } }) => {

    const userId = await getUserData(request)
    if (!userId) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    await connect()

    try {
        const { id } = params
        const { name, username, birthDate, gender, phone } = await request.json()
        const profile = await Profile.findOneAndUpdate(
            { 
                _id: id,
                userId: userId 
            },
            {
                name,
                username,
                birthDate,
                gender,
                phone
            },
            { new: true }
        )

        if (!profile) {
            return NextResponse.json({ message: "Profile not found" }, { status: 404 })
        }

        return NextResponse.json({ message: "Profile updated successfully" }, { status: 200 })
    } catch (error) {
        return NextResponse.json({ message: "Something went wrong", error }, { status: 500 })
    }
}