import axios from 'axios';
import { NextResponse } from 'next/server';

export const POST = async (req) => {
  try {
    const { category, isKid } = await req.json();
    const res = await axios.get(
      `https://api.themoviedb.org/3/genre/${category}/list?language=en-US&include_adult=${!isKid}&api_key=${
        process.env.TMDB_API_KEY
      }`,
      {
        headers: {
          accept: 'application/json',
          Authorization: `Bearer ${process.env.TMDB_API_KEY}`,
        },
      }
    );

    return NextResponse.json(res.data.genres);
  } catch (error) {
    console.log(error);
    throw error;
  }
};
