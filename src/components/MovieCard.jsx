import Link from 'next/link';
import styles from "@/components/css/movieCard.module.css"
import Image from 'next/image';

const movieCard = ({image, title, link}) => {
    return (
        <div className={styles.movieCard}>
            <Link href={link}>
                <div title={title} className={styles.image}>
                    <Image  src={image} height={240} width={180} alt={`${title} poster`} />
                </div>
            </Link>
        </div>
    )
}

export default movieCard
