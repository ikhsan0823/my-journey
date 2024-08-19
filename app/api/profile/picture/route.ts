import { NextRequest, NextResponse } from "next/server";
import connect from "@/lib/db";
import ProfilePicture from "@/lib/models/profilePicture";
import getUserData from "@/lib/getUserData";
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const POST = async (request: NextRequest) => {
    await connect();
    const userId = await getUserData(request);

    if (!userId) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    try {
        const { publicId, secureUrl } = await request.json();

        if (!publicId || !secureUrl) {
            return NextResponse.json({ message: "All fields are required" }, { status: 400 });
        }

        const existingProfilePicture = await ProfilePicture.findOne({ userId: userId });
        if (existingProfilePicture) {
            console.log('existingProfilePicture', existingProfilePicture.updatedAt);
            const threeDaysLater = new Date(existingProfilePicture.updatedAt.getTime() + 3 * 24 * 60 * 60 * 1000);
            console.log('threeDaysLater', threeDaysLater);
            if (existingProfilePicture.updatedAt < threeDaysLater) {
                return NextResponse.json({ message: "Profile picture was recently updated. Please wait for 3 days" }, { status: 409 });
            } else if (existingProfilePicture.updatedAt > threeDaysLater) {
                const public_id = `my journey/${existingProfilePicture.publicId}`;
                const cloudinaryDelete = await cloudinary.uploader.destroy(public_id);

                if (cloudinaryDelete.result === "ok") {
                    await ProfilePicture.findOneAndUpdate(
                        { userId: userId },
                        { publicId: publicId.toString(), secureUrl: secureUrl.toString() },
                        { new: true }
                    );

                    return NextResponse.json({ message: "Profile picture updated successfully" }, { status: 200 });
                } else {
                    return NextResponse.json({ message: "Failed to delete old profile picture" }, { status: 500 });
                }
            } 
        } else {
            const newProfilePicture = new ProfilePicture({
                userId: userId,
                publicId: publicId.toString(),
                secureUrl: secureUrl.toString(),
            });

            await newProfilePicture.save();

            return NextResponse.json({ message: "Profile picture created successfully" }, { status: 201 });
        }
    } catch (error) {
        return NextResponse.json({ message: "Something went wrong", error }, { status: 500 });
    }
};

export const GET = async (request: NextRequest) => {
    await connect();
    const userId = await getUserData(request);
    if (!userId) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    try {
        const profilePicture = await ProfilePicture.findOne({ userId: userId });
        if (!profilePicture) {
            const defaultProfilePicture = {
                secureUrl: "https://res.cloudinary.com/dd9a17lsm/image/upload/v1723906901/blank-profile-picture-973460-1-1-1080x1080_jzzvkn.webp",
                publicId: "blank-profile-picture-973460-1-1-1080x1080_jzzvkn",
            }
            return NextResponse.json({ profilePicture: defaultProfilePicture }, { status: 200 });
        }

        return NextResponse.json({ profilePicture }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: "Something went wrong", error }, { status: 500 });
    }
};
