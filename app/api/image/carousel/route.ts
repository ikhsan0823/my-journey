import { NextRequest, NextResponse } from "next/server";
import connect from "@/lib/db";
import Image from "@/lib/models/image";
import getUserData from "@/lib/getUserData";

export const GET = async (request: NextRequest) => {
    await connect();
    const userId = await getUserData(request);
    if (!userId) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    try {

        const images = await Image.find({ userId: userId }).sort({ createdAt: -1 }).limit(5);
        
        if (!images) {
            return NextResponse.json({ message: "Images not found" }, { status: 404 });
        }

        return NextResponse.json({ images }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: "Something went wrong", error }, { status: 500 });
    }
}