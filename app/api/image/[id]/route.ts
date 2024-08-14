import { NextRequest, NextResponse } from "next/server";
import connect from "@/lib/db";
import { v2 as cloudinary } from "cloudinary";
import Image from "@/lib/models/image";
import getUserData from "@/lib/getUserData";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const DELETE = async (request: NextRequest, { params }: { params: { id: string } }) => {
    await connect();
    const userId = await getUserData(request);
    if (!userId) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    try {
        const { id } = params;
        const public_id = `my journey/${id}`;

        const cloudinaryResult = await cloudinary.uploader.destroy(public_id);
        if (cloudinaryResult.result !== "ok") {
            return NextResponse.json({ message: cloudinaryResult.result }, { status: 500 });
        }

        const deletedImage = await Image.findOneAndDelete({ userId: userId, publicId: id });
        if (!deletedImage) {
            return NextResponse.json({ message: "Image not found" }, { status: 404 });
        }

        return NextResponse.json({ message: "Image deleted successfully" }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: "Something went wrong", error }, { status: 500 });
    }
}
