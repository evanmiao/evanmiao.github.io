import { useSearchParams } from 'rspress/runtime';
import styles from './index.module.scss';
import type { PostTag } from '@models/default';

const TagList = ({ tags = [] as PostTag[] }) => {
  const [_, setSearchParams] = useSearchParams();

  const onTagClick = (tag: string) => {
    setSearchParams({ tag });
  };

  return (
    <div className={styles.tagList}>
      {tags.map((tag) => (
        <a key={tag.name} className={styles.tag} onClick={() => onTagClick(tag.name)}>
          {`${tag.name} (${tag.count})`}
        </a>
      ))}
    </div>
  );
};

export default TagList;
