import { NextRequest, NextResponse } from "next/server";

import connect from "@/lib/db";
import Todo from "@/lib/models/todo";
import getUserData from "@/lib/getUserData";

export const PATCH = async (request: NextRequest, {params}: {params: { id: string }}) => {
    await connect();
    const userId = await getUserData(request);

    if (!userId) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    try {
        const { id } = params;
        const { checked } = await request.json();
        const updatedTask = await Todo.findOneAndUpdate({ _id: id, userId: userId }, { checked }, { new: true });
        if (!updatedTask) {
            return NextResponse.json({ message: "Task not found" }, { status: 404 });
        }
        return NextResponse.json({ message: "Task updated successfully" }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: "Something went wrong", error }, { status: 500 });
    }
}

export const DELETE = async (request: NextRequest, {params}: {params: { id: string }}) => {
    await connect();
    const userId = await getUserData(request);

    if (!userId) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    try {
        const { id } = params;
        const deletedTask = await Todo.findOneAndDelete({ _id: id, userId: userId });
        if (!deletedTask) {
            return NextResponse.json({ message: "Task not found" }, { status: 404 });
        }
        return NextResponse.json({ message: "Task deleted successfully" }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: "Something went wrong", error }, { status: 500 });
    }
}