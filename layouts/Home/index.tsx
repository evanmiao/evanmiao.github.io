import { useMemo } from 'react';
import { usePageData, useSearchParams } from 'rspress/runtime';
import styles from './index.module.scss';
import HomePostList from '@components/HomePostList';
import Pagination from '@components/Pagination';
import type { PostInfo } from '@models/default';

const HomeLayout = () => {
  const { page } = usePageData();
  const posts = (page.posts || []) as PostInfo[];

  const [searchParams, setSearchParams] = useSearchParams();

  const pageSize = 10;
  const totalPage = Math.ceil(posts.length / pageSize);

  const currentPage = useMemo(() => {
    const page = Number(searchParams.get('page')) || 1;
    if (page < 1) {
      return 1;
    }
    if (page > totalPage) {
      return totalPage;
    }
    return page;
  }, [searchParams]);

  const currentPagePosts = useMemo(() => {
    return posts.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  }, [currentPage]);

  return (
    <div className={`${styles.homeLayout} custom-layout`}>
      <HomePostList posts={currentPagePosts} />
      <Pagination
        total={posts.length}
        pageSize={pageSize}
        current={currentPage}
        onChange={(current) => setSearchParams({ page: `${current}` })}
      />
    </div>
  );
};

export default HomeLayout;
