import dayjs from 'dayjs';
import { Link } from 'rspress/theme';
import { normalizeHrefInRuntime } from 'rspress/runtime';
import styles from './index.module.scss';
import type { PostInfo } from '@models/default';

const ArchivePostList = ({ posts = [] as PostInfo[] }) => {
  return (
    <ul className={styles.postList}>
      {posts.map((post) => (
        <li key={post.route} className={`${styles.post}`}>
          <div className={styles.postDate}>{dayjs(post.date).format('YYYY-MM-DD')}</div>
          <Link href={normalizeHrefInRuntime(post.route)} className={`${styles.postLink}`}>
            {post.title}
          </Link>
        </li>
      ))}
    </ul>
  );
};

export default ArchivePostList;
