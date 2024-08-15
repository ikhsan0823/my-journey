import { NextRequest, NextResponse } from "next/server";
import connect from "@/lib/db";
import Note from "@/lib/models/note";
import getUserData from "@/lib/getUserData";

export const GET = async (request: NextRequest, { params }: { params: { category: string } }) => {
    const userId = await getUserData(request);
    if (!userId) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await connect();

    const { category } = params;
    try {
        const notes = await Note.find({ userId: userId, category: category });
        if (!notes) {
            return NextResponse.json({ message: "Notes not found" }, { status: 404 });
        }
        return NextResponse.json({ notes }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: "Something went wrong", error }, { status: 500 });
    }
}