import { NextRequest, NextResponse } from "next/server";

import connect from "@/lib/db";
import Todo from "@/lib/models/todo";
import getUserData from "@/lib/getUserData";

export const PATCH = async (request: NextRequest, { params }: { params: { id: string } }) => {
    await connect();
    const userId = await getUserData(request);

    if (!userId) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const { id } = params;

    try {
        const updateTask = await Todo.findOneAndUpdate({ _id: id, userId: userId }, { date: today }, { new: true });

        if (!updateTask) {
            return NextResponse.json({ message: "Task not found" }, { status: 404 });
        }

        return NextResponse.json({ message: "Task updated successfully" }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: "Something went wrong", error }, { status: 500 });
    }
}