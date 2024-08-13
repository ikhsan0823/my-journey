import { NextRequest, NextResponse } from "next/server";

import connect from "@/lib/db";
import Goal from "@/lib/models/goals";
import Plan from "@/lib/models/plan";
import Todo from "@/lib/models/todo";
import getUserData from "@/lib/getUserData";

export const GET = async (request: NextRequest) => {
    await connect();
    const userId = await getUserData(request);
    if (!userId) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    try {
        const totalTasks = await Todo.countDocuments({ userId: userId });
        const totalGoals = await Goal.countDocuments({ userId: userId });
        const totalPlans = await Plan.countDocuments({ userId: userId });

        const checkedTasks = await Todo.countDocuments({ userId: userId, checked: true });

        const totalCompletedGoals = await Goal.aggregate([
            { $match: { userId: userId } },
            {
                $project: {
                    _id: 1,
                    allStepsCompleted: {
                        $reduce: {
                            input: "$steps.completed",
                            initialValue: true,
                            in: { $and: ["$$value", "$$this"] }
                        }
                    }
                }
            },
            { $match: { allStepsCompleted: true } },
            { $count: "totalCompletedGoals" }
        ]);

        const totalComplete = totalCompletedGoals[0]?.totalCompletedGoals || 0;
        
        const checkedPlans = await Plan.countDocuments({ userId: userId, checked: true });

        const taskCompletedPercentage = totalTasks > 0 ? (checkedTasks / totalTasks) * 100 : 0;
        const goalCompletedPercentage = totalGoals > 0 ? (totalComplete / totalGoals) * 100 : 0;
        const planCompletedPercentage = totalPlans > 0 ? (checkedPlans / totalPlans) * 100 : 0;

        return NextResponse.json({
            taskCompletedPercentage,
            goalCompletedPercentage,
            planCompletedPercentage
        }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: "Something went wrong", error }, { status: 500 });
    }
}