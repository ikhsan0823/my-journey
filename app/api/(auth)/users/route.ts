import { NextResponse, NextRequest } from "next/server";

import connect from "@/lib/db";
import User from "@/lib/models/user";
import getUserData from "@/lib/getUserData";

export const GET = async (request: NextRequest) => {
    await connect();
    const userId = await getUserData(request);

    if (!userId) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    try {
        const user = await User.findById(userId);
        return NextResponse.json({ user, message: "User fetched successfully" }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: "Something went wrong" }, { status: 500 });
    }
}