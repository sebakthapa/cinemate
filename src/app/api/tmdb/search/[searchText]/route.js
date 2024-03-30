import { NextResponse } from 'next/server';
import axios from 'axios';

export const GET = async (req) => {
  try {
    const searchText = req.url.split('/').at(-1).split('?')[0];
    const searchParams = new URL(req.url).searchParams;
    const includeAdult = searchParams.get('includeAdult') || true;
    const page = searchParams.get('page') || 1;

    if (!searchText) {
      return NextResponse.json([], { status: 400 });
    }

    const res = await axios.get(
      `https://api.themoviedb.org/3/search/multi?query=${searchText}&include_adult=${includeAdult}&page=${page}&api_key=${process.env.TMDB_API_KEY}`,
      {
        headers: {
          accept: 'application/json',
          Authorization: `Bearer ${process.env.TMDB_API_KEY}`,
        },
      }
    );

    console.log(res.data);
    const filteredData = res?.data?.results?.filter(({ media_type: mediaType }) => mediaType !== 'person');
    const finalData = {
      results: filteredData,
      total_pages: res?.data?.total_pages,
      total_results: filteredData.length,
      page: res?.data?.page,
    };

    return NextResponse.json(finalData);
  } catch (error) {
    console.log('Error while searching', error);
  }
};
