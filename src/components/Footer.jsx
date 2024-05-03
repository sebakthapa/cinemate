import React from 'react';
import { FaLinkedin, FaTwitterSquare } from 'react-icons/fa';
import { AiFillGithub } from 'react-icons/ai';
import styles from './css/footer.module.css';
import { websiteName } from '@/lib';

function Footer() {
  return (
    <div className={styles.footer}>
      <div className={styles.footer__left}>
        <a target='_blank' href='https://twitter.com/Sebakthapa'>
          <FaTwitterSquare />
        </a>
        <a
          target='_blank'
          href='https://www.linkedin.com/in/sebak-thapa-a2b863201/'
        >
          <FaLinkedin />
        </a>
      </div>
      <div className={styles.footer__center}>
        © {websiteName} Inc. All rights reserved.
        <br /> Sebak Thapa
      </div>

      <div className={styles.footer__right}>
        <a target='_blank' href='https://github.com/sebakthapa'>
          <AiFillGithub />
        </a>
      </div>
    </div>
  );
}

export default Footer;
