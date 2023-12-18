import { fetchGenre, tmdbBaseUrl } from "@/lib/tmdb"
import Row from "./Row"

const TvMoviePage = async ({ type }) => {
    const genres = await fetchGenre(type);
    // console.log(genres)

    return (
        <div>
            {
                genres.length > 0 && genres.map(({ id, name }) => {
                    return (
                        <Row
                            mediaType={"type"}
                            key={id}
                            title={name}
                            fetchUrl={`${tmdbBaseUrl}/discover/${type}?with_genres=${id}&language=en-US&sort_by=popularity.desc`}
                        />
                    )
                })
            }

        </div>
    )


}

export default TvMoviePage
