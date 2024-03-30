import { NextResponse } from 'next/server';

export const POST = async (req) => {
  const { currentPage, isKid, fetchUrl } = await req.json();
  const res = await fetch(
    `${fetchUrl}&page=${currentPage}&include_adult=${!isKid}&api_key=${process.env.TMDB_API_KEY}`,
    {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${process.env.TMDB_API_KEY}`,
      },
    }
  );
  if (res.status === 200) {
    const lists = await res.json();

    return NextResponse.json(lists.results);
  } else {
    return NextResponse.json({ message: 'Unable to fetch data.' }, { status: res.status });
  }
};
