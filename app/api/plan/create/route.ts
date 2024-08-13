import { NextRequest, NextResponse } from "next/server";

import connect from "@/lib/db";
import Plan from "@/lib/models/plan";
import getUserData from "@/lib/getUserData";

export const POST = async (request: NextRequest) => {
    await connect();
    const userId = await getUserData(request);

    if (!userId) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    try {
        const plan = await request.json();
        const newPlan = new Plan({
            userId: userId,
            title: plan.title,
            description: plan.description,
            time: plan.time,
            date: new Date(plan.date),
        });
        await newPlan.save();

        const date = newPlan.date.toLocaleDateString();

        return NextResponse.json({ date, message: "Plan created successfully" }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ message: "Something went wrong", error }, { status: 500 });
    }
}