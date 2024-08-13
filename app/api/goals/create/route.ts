import { NextRequest, NextResponse } from "next/server";
import connect from "@/lib/db";
import Goal from "@/lib/models/goals";
import getUserData from "@/lib/getUserData";

function generateRandomId() {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

export async function POST(request: NextRequest) {
    await connect();
    const userId = await getUserData(request);

    if (!userId) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const data = await request.json();

    const updatedSteps = data.steps.map((step: { step: string }) => ({
        id: generateRandomId(),
        step: step.step,
        completed: false
    }));

    const newGoal = new Goal({
        userId: userId,
        priority: data.priority,
        category: data.category,
        goals: data.goals,
        reason: data.reason,
        startTime: new Date(data.startTime),
        completionDate: new Date(data.completionDate),
        steps: updatedSteps
    });

    try {
        const goal = await newGoal.save();
        return NextResponse.json({ goal, message: "Goal created successfully" }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ message: "Something went wrong", error }, { status: 500 });
    }
}
