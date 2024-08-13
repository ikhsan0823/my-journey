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

    const formData = await request.formData();
    const description = formData.get("description");
    const file = formData.get("file");
    const date = formData.get("date");

    if (!description || !file || !date) {
        return NextResponse.json({ message: "All fields are required" }, { status: 400 });
    }

    if (!(file instanceof File)) {
        return NextResponse.json({ message: "Invalid file upload" }, { status: 400 });
    }

    const fileBuffer = await file.arrayBuffer();
    const base64Image = Buffer.from(fileBuffer).toString("base64");

    const newImage = new Image({
        userId: userId,
        description: description.toString(),
        date: new Date(date.toString()),
        file: base64Image,
        fileType: file.type,
    });

    try {
        await newImage.save();
        return NextResponse.json({ message: "Image created successfully" }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ message: "Something went wrong", error }, { status: 500 });
    }
}
