import { NextRequest, NextResponse } from "next/server";

import connect from "@/lib/db";
import Plan from "@/lib/models/plan";
import getUserData from "@/lib/getUserData";

export const PATCH = async (request: NextRequest, { params }: { params: { id: string } }) => {
    await connect();
    const userId = await getUserData(request);

    if (!userId) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    try {
        const { id } = params;
        await Plan.updateOne({ _id: id, userId: userId }, { checked: true }, { new: true });
        const date = await Plan.findOne({ _id: id, userId: userId }).then((plan) => plan?.date.toLocaleDateString());
        return NextResponse.json({ date, message: "Plan completed" }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: "Something went wrong", error }, { status: 500 });
    }
}

export const DELETE = async (request: NextRequest, { params }: { params: { id: string } }) => {
    await connect();
    const userId = await getUserData(request);

    if (!userId) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    try {
        const { id } = params;
        const deletedPlan = await Plan.findOneAndDelete({ _id: id, userId: userId });
        if (!deletedPlan) {
            return NextResponse.json({ message: "Plan not found" }, { status: 404 });
        }
        const date = deletedPlan.date.toLocaleDateString();
        return NextResponse.json({ date, message: "Plan deleted successfully" }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: "Something went wrong", error }, { status: 500 });
    }
}