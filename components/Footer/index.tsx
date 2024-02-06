import styles from './index.module.scss';

const Footer = () => {
  const year = new Date().getFullYear();
  return (
    <footer className={`${styles.footer}`}>
      <div className={`${styles.copyright}`}>
        <div className={`${styles.copyrightItem}`}>
          Powered by{' '}
          <a href="https://rspress.dev/" target="_blank" rel="noopener noreferrer">
            Rspress
          </a>
        </div>
        <div className={`${styles.copyrightItem}`}>
          Copyright © 2019-{year} Evan Miao. All Rights Reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
