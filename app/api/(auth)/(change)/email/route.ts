import { NextRequest, NextResponse } from "next/server";
import connect from "@/lib/db";
import User from "@/lib/models/user";

export const PATCH = async (request: NextRequest) => {
    await connect();
    const { otp, newEmail } = await request.json();
    try {
        const user = await User.findOne({ otp });
        if (!user) {
            return NextResponse.json({ message: "Invalid OTP" }, { status: 400 });
        }
        if (user.otpExpires < new Date()) {
            user.otp = null;
            user.otpExpires = null;
            await user.save();
            return NextResponse.json({ message: "OTP expired" }, { status: 400 });
        }
        user.email = newEmail;
        user.otp = null;
        user.otpExpires = null;
        await user.save();
        return NextResponse.json({ message: "Email changed successfully" }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: "Something went wrong" }, { status: 500 });
    }
}