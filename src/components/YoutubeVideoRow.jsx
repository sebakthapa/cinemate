
import styles from "./css/row.module.css"
import YouTube from "react-youtube"

const YoutubeVideoCard = ({ id, title, videos }) => {
    const opts = {
        width: "auto",
        height: 250,
        playerVars: {
            // origin:window.location.href
        }
    }


    return (
        <>
            <div className={styles.row}>
                <h2 className={styles.rowTitle}>{title}</h2>
                <div className={styles.container}>
                    {
                        videos?.length > 0 && videos?.map(({ title, key, id }, idx) => {
                            !key && "";
                            return (
                                <YouTube loading="eager" key={id} videoId={key} opts={opts} />
                            )
                        })
                    }
                </div>
            </div>
        </>
    )
}

export default YoutubeVideoCard
