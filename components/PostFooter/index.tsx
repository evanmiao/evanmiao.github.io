import { useMemo } from 'react';
import Giscus from '@giscus/react';
import { useDark } from 'rspress/runtime';
import styles from './index.module.scss';

const PostFooter = () => {
  const isDark = useDark();
  const giscusTheme = useMemo(() => (isDark ? 'dark' : 'light'), [isDark]);

  return (
    <footer className={`${styles.postFooter}`}>
      <Giscus
        id="comments"
        repo="evanmiao/evanmiao.github.io"
        repoId="MDEwOlJlcG9zaXRvcnkxNTU0MzYzMjM="
        category="Announcements"
        categoryId="DIC_kwDOCUPFI84Cc96F"
        mapping="pathname"
        reactionsEnabled="1"
        emitMetadata="0"
        inputPosition="top"
        theme={giscusTheme}
        lang="zh-CN"
        loading="lazy"
      />
    </footer>
  );
};

export default PostFooter;
