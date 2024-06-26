import Image from 'next/image';
import Link from 'next/link';
import styles from '@/components/css/movieCard.module.css';

const movieCard = ({ image, title, link }) => {
  return (
    <div className={styles.movieCard}>
      <Link href={link} title={title}>
        <div className={styles.image}>
          <Image src={image} height={240} width={180} alt={`${title} poster`} />
        </div>
      </Link>
    </div>
  );
};

export default movieCard;
