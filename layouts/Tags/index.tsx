import { useMemo } from 'react';
import { usePageData, useSearchParams } from 'rspress/runtime';
import styles from './index.module.scss';
import TagList from '@components/TagList';
import ArchivePostList from '@components/ArchivePostList';
import type { PostTag } from '@models/default';

const TagsLayout = () => {
  const { page } = usePageData();
  const title = (page.frontmatter.title as string) || 'Tags';
  const tags = (page.tags || []) as PostTag[];

  const [searchParams] = useSearchParams();

  const { name, posts } = useMemo(() => {
    const params = searchParams.get('tag');
    if (params) {
      const tagInfo = tags.find((tag) => tag.name === params);
      if (tagInfo) {
        return tagInfo;
      }
    }
    return { name: '', posts: [] };
  }, [searchParams.get('tag'), tags]);

  return (
    <div className={`${styles.tagsLayout} custom-layout overview-index`}>
      <h1 className="text-3xl leading-10 tracking-tight">{title}</h1>
      {name && <h2 className={styles.title}>{name}</h2>}
      {posts.length > 0 && <ArchivePostList posts={posts} />}
      <h2>All tags</h2>
      <TagList tags={tags} />
    </div>
  );
};

export default TagsLayout;
