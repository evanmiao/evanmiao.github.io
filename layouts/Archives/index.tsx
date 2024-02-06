import { useMemo } from 'react';
import { usePageData } from 'rspress/runtime';
import styles from './index.module.scss';
import ArchivePostList from '@components/ArchivePostList';
import type { PostInfo } from '@models/default';

interface PostsPerYearList {
  year: string;
  posts: PostInfo[];
}

const ArchivesLayout = () => {
  const { page } = usePageData();
  const title = (page.frontmatter.title as string) || 'Archives';
  const posts = (page.posts as PostInfo[]) || [];

  const postsPerYearList = useMemo(() => {
    const result: PostsPerYearList[] = [];
    const postsGroupByYear = {};
    posts.forEach((post) => {
      const year = post.date.slice(0, 4);
      if (postsGroupByYear[year]) {
        postsGroupByYear[year].push(post);
      } else {
        postsGroupByYear[year] = [post];
        result.push({ year, posts: postsGroupByYear[year] });
      }
    });
    return result;
  }, [posts]);

  return (
    <div className={`${styles.archivesLayout} custom-layout overview-index`}>
      <h1 className="text-3xl leading-10 tracking-tight">{title}</h1>
      {postsPerYearList.map((year) => (
        <div key={year.year}>
          <h2>{year.year}</h2>
          <ArchivePostList posts={year.posts} />
        </div>
      ))}
    </div>
  );
};

export default ArchivesLayout;
