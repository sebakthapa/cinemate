// POST => LOGIN user

import connectToDatabase from "@/lib/dbConnect";
import Users from "@/models/users";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt"

export const POST = async (request) => {
    try {

        const { email, password } = await request.json();

        // validation part 
        if (!email && !password ) {
            return new NextResponse(JSON.stringify({ message: "This field is required", fields: ["email", "password", "confirmPassword"] }), {status:401})
        }

        if (!email) {
            return new NextResponse(JSON.stringify({ message: "Email is required", fields: ["email"] }), {status:401})
        }
        if (!password) {
            return new NextResponse(JSON.stringify({ message: "Password is required", fields: ["password"] }), {status:401})
        }

        // DB query
        await connectToDatabase();
        const existingUser = await Users.findOne({ email });
        if (!existingUser) {
            return new NextResponse(JSON.stringify({ message: "Email is not registered.", fields: ["email"] }), {status:401})
        }
        const result = await bcrypt.compare(password, existingUser.password);// form pw, db pw


        if (!result) {
            console.log("incorrect Password")
            return new NextResponse(JSON.stringify({ message: "Password is incorrect.", fields: ["password"] }), {status:401})
        }

        console.log("exhisitng user", existingUser)
        const { password: userPw, ...dataToSend } = existingUser._doc;
        console.log(dataToSend)

        return NextResponse.json(dataToSend)

    } catch (error) {
        console.log("Error logging in a user",  error);
        // return new NextResponse(JSON.stringify({ error: "Error occured while creating new user", details: {...error} }))
    }




}