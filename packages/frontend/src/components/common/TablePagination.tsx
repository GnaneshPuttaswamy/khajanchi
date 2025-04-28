import { Pagination } from 'antd';
import { Flex } from 'antd';
import React, { useState } from 'react';

function TablePagination() {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(20);

  return (
    <Flex justify="flex-end">
      <Pagination
        current={currentPage}
        pageSize={pageSize}
        size="small"
        onChange={(page, size) => {
          setCurrentPage(page);
          setPageSize(size || 20);
        }}
        showSizeChanger
        showTotal={(total) => `Total ${total} items`}
        style={{
          paddingRight: 24,
        }}
      />
    </Flex>
  );
}

export default TablePagination;
