import { NextRequest, NextResponse } from "next/server";

import connect from "@/lib/db";
import Todo from "@/lib/models/todo";
import getUserData from "@/lib/getUserData";

export const POST = async (request: NextRequest) => {
    await connect();
    const userId = await getUserData(request);

    if (!userId) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    try {
        const todo = await request.json();
        const newTodo = new Todo({
            userId: userId,
            title: todo.title,
            time: todo.time,
            date: todo.date
        });
        await newTodo.save();

        const id = newTodo._id.toString();

        return NextResponse.json({ id, message: "Task created successfully" }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ message: "Something went wrong", error }, { status: 500 });
    }
}