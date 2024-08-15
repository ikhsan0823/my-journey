import { NextRequest, NextResponse } from "next/server";
import connect from "@/lib/db";
import Note from "@/lib/models/note";
import getUserData from "@/lib/getUserData";

export const GET = async (request: NextRequest) => {
    await connect();
    const userId = await getUserData(request);

    if (!userId) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    try {
        const notes = await Note.find({ userId: userId });
        return NextResponse.json({ notes }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: "Something went wrong", error }, { status: 500 });
    }
}