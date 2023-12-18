import styles from "./css/card.module.css"
import Image from 'next/image';

function Card({ image, title, subtitle }) {
    return (
        <div className={styles.card}>
            <div className={styles.card__image}>
                <Image src={image} height="500" width="700" alt="Banner image for this card" />
            </div>
            <div className={styles.card__content}>
                <h2 className={styles.card__title}>
                    {title}
                </h2>
                <h6 className={styles.card__subtitle}>
                    {subtitle}
                </h6>
            </div>

        </div>
    )
}

export default Card
