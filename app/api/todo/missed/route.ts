import { NextRequest, NextResponse } from "next/server";

import connect from "@/lib/db";
import Todo from "@/lib/models/todo";
import getUserData from "@/lib/getUserData";

export const GET = async (request: NextRequest) => {
    await connect();
    const userId = await getUserData(request);

    if (!userId) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    try {
        await Todo.deleteMany({ userId: userId, checked: true, date: { $lt: today } });

        const missedTasks = await Todo.find({ userId: userId, checked: false, date: { $lt: today } });
        if (!missedTasks) {
            return NextResponse.json({ message: "Tasks not found" }, { status: 404 });
        }
        return NextResponse.json({ missedTasks, message: "Tasks fetched successfully" }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: "Something went wrong", error }, { status: 500 });
    }
}