import { NextRequest, NextResponse } from "next/server";
import connect from "@/lib/db";
import Todo from "@/lib/models/todo";
import Plan from "@/lib/models/plan";
import Goal from "@/lib/models/goals";
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
        const todos = await Todo.countDocuments({ userId: userId, checked: false, date: { $lt: today } });
        const plans = await Plan.countDocuments({ userId: userId, checked: false, date: { $lt: today } });
        const goals = await Goal.countDocuments({ 
            userId: userId, 
            completionDate: { $lt: today },
            steps: { $elemMatch: { completed: false } }
        });
        
        return NextResponse.json({ todos, plans, goals }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: "Something went wrong", error }, { status: 500 });
    }
}
