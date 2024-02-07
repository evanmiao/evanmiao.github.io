import dayjs from 'dayjs';
import { Link } from 'rspress/theme';
import { normalizeHrefInRuntime, usePageData } from 'rspress/runtime';
import styles from './index.module.scss';
import type { BaseRuntimePageInfo } from '@rspress/shared';

interface PostInfo extends BaseRuntimePageInfo {
  date?: string;
  tags?: string[];
}

const PostInfo = () => {
  const { page } = usePageData();
  const postInfo = page as PostInfo;

  return (
    <div className={`${styles.postInfo}`}>
      <div className="leading-7 block text-sm font-semibold pl-3">文章信息</div>
      <div className={`${styles.info} ${styles.date}`}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="10"></circle>
          <polyline points="12 6 12 12 16 14"></polyline>
        </svg>
        <time pubdate="pubdate" itemProp="datePublished" dateTime={postInfo.date}>
          {dayjs(postInfo.date).format('dddd, MMMM D, YYYY')}
        </time>
      </div>
      <div className={`${styles.info} ${styles.tags}`}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path>
          <line x1="7" y1="7" x2="7" y2="7"></line>
        </svg>
        {postInfo.tags.map((tag) => (
          <Link key={tag} href={normalizeHrefInRuntime(`/tags/index.html?tag=${tag}/`)}>
            {tag}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default PostInfo;
