import { NextRequest, NextResponse } from "next/server";
import connect from "@/lib/db";
import Plan from "@/lib/models/plan";
import getUserData from "@/lib/getUserData";

export const GET = async (request: NextRequest) => {
    await connect();
    const userId = await getUserData(request);

    if (!userId) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    try {
        const uniqueDates = await Plan.aggregate([
            { $match: { userId: userId } },
            { $group: { _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } }, title: { $first: "$title" }, count: { $sum: 1  } } }
        ]);

        // Mengembalikan response
        return NextResponse.json({ message: "Plans fetched successfully", uniqueDates }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: "Something went wrong", error }, { status: 500 });
    }
};
