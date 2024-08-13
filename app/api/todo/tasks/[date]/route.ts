import { NextRequest, NextResponse } from "next/server";

import connect from "@/lib/db";
import Todo from "@/lib/models/todo";
import getUserData from "@/lib/getUserData";

export const GET = async (request: NextRequest, { params }: { params: { date: string } }) => {
    await connect();
    const userId = await getUserData(request);

    if (!userId) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { date } = params;
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(startOfDay);
    endOfDay.setHours(23, 59, 59, 999);

    try {
        const tasks = await Todo.find({ userId: userId, date: { $gte: startOfDay, $lte: endOfDay } });
        if (!tasks) {
            return NextResponse.json({ message: "Tasks not found" }, { status: 404 });
        }
        return NextResponse.json({ tasks, message: "Tasks fetched successfully" }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: "Something went wrong", error }, { status: 500 });
    }
}