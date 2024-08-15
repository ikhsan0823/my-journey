import { NextRequest, NextResponse } from "next/server";
import connect from "@/lib/db";
import Note from "@/lib/models/note";
import getUserData from "@/lib/getUserData";

export const POST = async (request: NextRequest) => {
    await connect();
    const userId = await getUserData(request);

    if (!userId) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { title, content, category, date } = await request.json();

    const lowerCaseCategory = category.toLowerCase();

    const newNote = new Note({
        userId: userId,
        title: title,
        content: content,
        category: lowerCaseCategory,
        date: new Date(date)
    });

    try {
        await newNote.save();
        return NextResponse.json({ message: "Note created successfully" }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ message: "Something went wrong", error }, { status: 500 });
    }
}