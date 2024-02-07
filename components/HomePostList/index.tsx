import dayjs from 'dayjs';
import { Link } from 'rspress/theme';
import { normalizeHrefInRuntime } from 'rspress/runtime';
import styles from './index.module.scss';
import type { PostInfo } from '@models/default';

const HomePostList = ({ posts = [] as PostInfo[] }) => {
  return (
    <div className={`${styles.postList}`} itemScope itemType="http://schema.org/Blog">
      {posts.map((post) => (
        <article
          key={post.route}
          className={`${styles.post}`}
          itemProp="blogPost"
          itemScope
          itemType="https://schema.org/BlogPosting"
        >
          <meta itemProp="mainEntityOfPage" content={post.path} />
          <header className={`${styles.postTitle}`} itemProp="name headline">
            <Link href={normalizeHrefInRuntime(post.route)}>{post.title}</Link>
          </header>
          <p className={`${styles.postSummary}`} itemProp="description">
            {post.summary}
          </p>
          <footer>
            <div className={`${styles.postInfo}`}>
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
              <time pubdate="pubdate" itemProp="datePublished" dateTime={post.date}>
                {dayjs(post.date).format('dddd, MMMM D, YYYY')}
              </time>
            </div>
            {post.tags && (
              <div className={`${styles.postInfo}`} itemProp="keywords">
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
                {post.tags.map((tag) => (
                  <Link key={tag} href={normalizeHrefInRuntime(`/tags/index.html?tag=${tag}`)}>
                    {tag}
                  </Link>
                ))}
              </div>
            )}
          </footer>
        </article>
      ))}
    </div>
  );
};

export default HomePostList;
