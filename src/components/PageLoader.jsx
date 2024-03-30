import React from 'react';
import styles from './css/pageLoader.module.css';
import Spinner from './Spinner';

const PageLoader = () => {
  return (
    <div className={styles.loader}>
      <div className={styles.loaderContents}>
        <Spinner />
        <p className={styles.text}>CINEMATE</p>
      </div>
    </div>
  );
};

export default PageLoader;
