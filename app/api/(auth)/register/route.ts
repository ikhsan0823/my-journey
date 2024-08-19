import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";

import connect from "@/lib/db";
import User from "@/lib/models/user";
import Profile from "@/lib/models/profile";

export const POST = async (request: NextRequest) => {
    try {
        const { email, username, password } = await request.json();

        await connect();

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return NextResponse.json({ message: "User already exists" }, { status: 400 });
        }

        const newUser = new User({
            email,
            username,
            password: await bcrypt.hash(password, 10),
        });
        await newUser.save();

        if (newUser) {
            const newProfile = new Profile({
                userId: newUser._id,
                username: newUser.username,
            });
            await newProfile.save();
        }

        return NextResponse.json({ message: "User created successfully" }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ message: "Something went wrong" }, { status: 500 });
    }
}