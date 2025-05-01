import { Pagination, PaginationProps } from 'antd';
import { Flex } from 'antd';

interface TablePaginationProps {
  currentPage: number;
  pageSize: number;
  totalItems: number;
  onPaginationChange: (page: number, pageSize: number) => void;
}

function TablePagination({
  currentPage,
  pageSize,
  totalItems,
  onPaginationChange,
}: TablePaginationProps) {
  const handlePaginationChange: PaginationProps['onChange'] = (page, size) => {
    onPaginationChange(page, size);
  };

  return (
    <Flex justify="flex-end">
      <Pagination
        current={currentPage}
        pageSize={pageSize}
        total={totalItems}
        size="small"
        onChange={handlePaginationChange}
        showSizeChanger
        showTotal={(total, range) =>
          `${range[0]}-${range[1]} of ${total} items`
        }
        style={{
          paddingRight: 24,
        }}
        pageSizeOptions={[5, 10, 20, 50, 100]}
        defaultPageSize={10}
      />
    </Flex>
  );
}

export default TablePagination;
