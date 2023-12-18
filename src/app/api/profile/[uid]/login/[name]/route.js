// POST => login PROFILE for the user

import connectToDatabase from "@/lib/dbConnect";
import Profiles from "@/models/profile";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt"


export const POST = async (request) => {
    try {
        const query = request.url.split("/");
        const name = query[query.length - 1];

        const { pin, uid } = await request.json();

        // validation part 


        if (!pin) {
            return new NextResponse(JSON.stringify({ message: "Pin is required", fields: ["pin"] }), { status: 401 })
        }


        // DB query
        await connectToDatabase();

        const profile = await Profiles.findOne({ uid, name });

        if (profile == null) {
            return new NextResponse(JSON.stringify({ message: "No profile with that name", fields: ["name"] }), { status: 401 })
        }

        const result = await bcrypt.compare(pin, profile.pin);



        if (!result) {
            return new NextResponse(JSON.stringify({ message: "Incorrect PIN", fields: ["pin"] }), { status: 401 })
        }




        return new NextResponse(JSON.stringify({ id: profile._id, uid: profile.uid, name: profile.name, isKid: profile.isKid, avatarName: profile.avatarName, hasPin: profile.hasPin }))

    } catch (error) {
        console.log("Error Creating new profile", + error);
        // return new NextResponse(JSON.stringify({ error: "Error occured while creating new user", details: {...error} }))
    }




}