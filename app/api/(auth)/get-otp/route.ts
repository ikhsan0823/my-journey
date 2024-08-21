import { NextRequest, NextResponse } from "next/server";
import { sendMail } from "@/lib/sendMail";
import { generateOTP } from "@/lib/sendMail";
import User from "@/lib/models/user";
import connect from "@/lib/db";

export const POST = async (request: NextRequest) => {
    await connect();
    const { email } = await request.json();
    const otp = generateOTP();

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        const mailOptions = {
            from: process.env.MAIL_USER,
            to: email,
            subject: "Your My Journey Account OTP",
            text: `Your OTP is ${otp}. Please do not share it with anyone.`,
        };

        await sendMail(mailOptions);
        user.otp = otp;
        user.otpExpires = new Date(Date.now() + 10 * 60 * 1000);
        await user.save();

        return NextResponse.json({ message: "OTP sent successfully"}, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: "Failed to send OTP", error }, { status: 500 });
    }
}