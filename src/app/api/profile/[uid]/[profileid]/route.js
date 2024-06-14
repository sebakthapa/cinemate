import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/dbConnect';
import Profiles from '@/models/profile';

export const DELETE = async (request) => {
  try {
    const query = request.url.split('/');
    const profileId = query[query.length - 1];
    const uid = query[query.length - 2];
    await connectToDatabase();

    await Profiles.findOneAndDelete({ uid, _id: profileId });

    return new NextResponse(JSON.stringify({ message: 'deletion success' }));
  } catch (error) {
    console.log('error while deleting profile');
  }
};
