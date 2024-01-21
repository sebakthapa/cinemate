// POST => SIGNUP

import connectToDatabase from "@/lib/dbConnect";
import Users from "@/models/users";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt"

export const POST = async (request) => {
    try {
        const saltRounds = 10;
        const myPlaintextPassword = 's0/\/\P4$$w0rD';
        const someOtherPlaintextPassword = 'not_bacon';

        const { email, password, confirmPassword } = await request.json();
        let hashedPassword;

        // validation part 
        if (!email && !password && !confirmPassword) {
            return new NextResponse(JSON.stringify({ message: "This field is required", fields: ["email", "password", "confirmPassword"] }), { status: 401 })
        }

        if (!email) {
            return new NextResponse(JSON.stringify({ message: "Email is required", fields: ["email"] }), { status: 401 })
        }
        if (!password) {
            return new NextResponse(JSON.stringify({ message: "Password is required", fields: ["password"] }), { status: 401 })
        }
        if (!confirmPassword) {
            return new NextResponse(JSON.stringify({ message: "Password Confirmation is required", fields: ["confirmPassword"] }), { status: 401 })
        }

        if (confirmPassword != password) {
            return new NextResponse(JSON.stringify({ message: "Confirm password did't match  required", fields: ["confirmPassword"] }), { status: 401 })
        }


        const hash = await bcrypt.hash(password, saltRounds)
            if (!hash) {
                return new NextResponse(JSON.stringify({ message: "Unable to proceed due to server error. Error in password storage", fields: ["password"] }), { status: 401 })
            }
            hashedPassword = hash;

         // DB query
         await connectToDatabase();

         const existingUser = await Users.findOne({ email });
         if (existingUser) {
             return new NextResponse(JSON.stringify({ message: "Email is already registered", fields: ["email"] }), { status: 401 })
         }
         const displayName = email.split("@")[0];
         const newUser = new Users({ email, password:hashedPassword, displayName });
        const savedUser = await newUser.save();
        
        const { password:userPw, ...filteredData } = savedUser._doc;

         return new NextResponse(JSON.stringify(filteredData))



    } catch (error) {
        console.log("Error Creating new user", + error);
        // return new NextResponse(JSON.stringify({ error: "Error occured while creating new user", details: {...error} }))
    }




}