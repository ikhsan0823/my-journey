import { NextRequest, NextResponse } from "next/server";
import connect from "@/lib/db";
import Image from "@/lib/models/image";
import getUserData from "@/lib/getUserData";

export const POST = async (request: NextRequest) => {
    await connect();
    const userId = await getUserData(request);
    if (!userId) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { description, publicId, date, secureUrl } = await request.json();

    if (!description || !publicId || !date || !secureUrl) {
        return NextResponse.json({ message: "All fields are required" }, { status: 400 });
    }

    const newImage = new Image({
        userId: userId,
        description: description.toString(),
        date: new Date(date.toString()),
        publicId: publicId.toString(),
        secureUrl: secureUrl.toString(),
    });

    try {
        await newImage.save();
        return NextResponse.json({ message: "Image created successfully" }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ message: "Something went wrong", error }, { status: 500 });
    }
}
