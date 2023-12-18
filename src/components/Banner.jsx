import React from 'react';
import styles from "./css/banner.module.css";
import Image from 'next/image';

function Banner({ imageHeight }) {
    return (
        <div className={styles.banner}>
            <div className={styles.banner__image}  >
                <Image src="/loginBanner.jpg" alt="Netflix movies collection poster " height={1000} width={1000} />
            </div>
        </div>
    )
}

export default Banner
