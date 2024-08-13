import { NextRequest, NextResponse } from "next/server";

import connect from "@/lib/db";
import Goal from "@/lib/models/goals";
import getUserData from "@/lib/getUserData";

export const PATCH = async (request: NextRequest, { params }: { params: { id: string } }) => {
    await connect();
    const userId = await getUserData(request);
    if (!userId) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    try {
        const { id } = params;
        const { completed } = await request.json();
        
        const goal = await Goal.findOneAndUpdate(
            { userId: userId, "steps.id": id },
            { $set: { "steps.$.completed": completed } },
            { new: true }
        );
        
        if (!goal) {
            return NextResponse.json({ message: "Goal not found" }, { status: 404 });
        }
        
        return NextResponse.json({ message: "Step updated successfully", goal }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: "Something went wrong", error }, { status: 500 });
    }
};


export const DELETE = async (request: NextRequest, { params }: { params: { id: string } }) => {
    await connect();
    const userId = await getUserData(request);
    if (!userId) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    try {
        const { id } = params;
        const deletedGoal = await Goal.findOneAndDelete({ _id: id, userId: userId });
        if (!deletedGoal) {
            return NextResponse.json({ message: "Goal not found" }, { status: 404 });
        }
        return NextResponse.json({ message: "Goal deleted successfully" }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: "Something went wrong", error }, { status: 500 });
    }
}