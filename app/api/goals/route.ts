import { NextRequest, NextResponse } from "next/server";

import connect from "@/lib/db";
import Goal from "@/lib/models/goals";
import getUserData from "@/lib/getUserData";

export const GET = async ( request: NextRequest ) => {
    await connect();
    const userId = await getUserData(request);
    if (!userId) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    try {
        const goals = await Goal.find({ userId: userId });
        return NextResponse.json({ goals }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: "Something went wrong", error }, { status: 500 });
    }
}