// POST => CREATE NEW PROFILE for the user

import bcrypt from 'bcrypt';
import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/dbConnect';
import Profiles from '@/models/profile';

export const POST = async (request) => {
  try {
    const saltRounds = 10;

    const query = request.url.split('/');
    const uid = query[query.length - 1];

    const { name, isKid, avatar, hasPin, pin } = await request.json();
    let hashedPin;

    // validation part
    if (!name && !pin && hasPin) {
      return new NextResponse(
        JSON.stringify({ message: 'Check the box below or create PIN', fields: ['name', 'pin'] }),
        { status: 401 }
      );
    }

    if (!name) {
      return new NextResponse(JSON.stringify({ message: 'Name is required', fields: ['name'] }), {
        status: 401,
      });
    }
    if (!pin && hasPin) {
      return new NextResponse(
        JSON.stringify({ message: 'Click on no PIN below or enter PIN', fields: ['pin'] }),
        { status: 401 }
      );
    }

    // DB query
    await connectToDatabase();

    const allProfiles = await Profiles.find({ uid });
    if (allProfiles.length >= 3) {
      return new NextResponse(
        JSON.stringify({ message: 'Maximum profile limit reached', fields: ['name'] }),
        { status: 401 }
      );
    }
    const existingProfile = allProfiles.filter((profile) => profile.name === name);
    if (existingProfile.length > 0) {
      return new NextResponse(JSON.stringify({ message: 'Enter another name', fields: ['name'] }), {
        status: 401,
      });
    }

    // hashing pin
    if (pin) {
      const hash = await bcrypt.hash(pin, saltRounds);
      if (!hash) {
        return new NextResponse(
          JSON.stringify({
            message: 'Unable to proceed due to server error. Error in password storage',
            fields: ['password'],
          }),
          { status: 401 }
        );
      }
      hashedPin = hash;
    }

    const newProfile = new Profiles({ uid, name, isKid, avatar, hasPin, pin: hashedPin });
    // hashedPin && (newProfile.pin = hashedPin)
    const savedProfile = await newProfile.save();

    return new NextResponse(
      JSON.stringify({
        id: savedProfile._id,
        uid: savedProfile.uid,
        name: savedProfile.name,
        isKid: savedProfile.isKid,
        avatar: savedProfile.avatar,
        hasPin: savedProfile.hasPin,
      })
    );
  } catch (error) {
    console.log('Error Creating new profile', +error);
    // return new NextResponse(JSON.stringify({ error: "Error occured while creating new user", details: {...error} }))
  }
};

// GET => get all the profiles of the user

export const GET = async (request) => {
  try {
    const query = request.url.split('/');
    const uid = query[query.length - 1];

    // DB query
    await connectToDatabase();

    const fetchedProfiles = await Profiles.find({ uid });

    const profiles = fetchedProfiles.map(({ _doc: doc }) => {
      // eslint-disable-next-line no-unused-vars
      const { pin, ...data } = doc;

      return data;
    });

    return new NextResponse(JSON.stringify(profiles));
  } catch (error) {
    console.log('Error fetching profiles' + error);
  }
};
