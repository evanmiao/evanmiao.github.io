import RcPagination from 'rc-pagination';
import styles from './index.module.scss';

interface PaginationProps {
  total: number;
  current: number;
  pageSize: number;
  onChange: (current: number) => void;
}

const Pagination = (props: PaginationProps) => {
  return (
    <RcPagination
      {...props}
      className={`${styles.pagination}`}
      prevIcon={<a>上一页</a>}
      nextIcon={<a>下一页</a>}
      jumpPrevIcon={<a>•••</a>}
      jumpNextIcon={<a>•••</a>}
    />
  );
};

export default Pagination;
