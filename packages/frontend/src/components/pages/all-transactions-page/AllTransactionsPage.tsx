import { Card, DatePicker, Flex, TableProps } from 'antd';
import React, { useContext, useEffect, useRef, useState } from 'react';
import TransactionsTable from '../../transactions-table/TransactionsTable';
import { CompactModeContext } from '../../../context/CompactModeContext';
import useTransactions from '../../../hooks/useTransactions';
import CategoryFilter from '../../common/CategoryFilter';
import TablePagination from '../../common/TablePagination';
import { useSearchParams } from 'react-router';
import { SortInfo } from '../add-transaction-page/AddTransactionPage';
import { Transaction } from '../../../types/types';
import { parseSortParams, serializeSortParams } from '../../../utils/urlUtils';

function AllTransactionsPage() {
  const { isCompact } = useContext(CompactModeContext);
  const [searchParams, setSearchParams] = useSearchParams();
  const hasSetInitialUrlRef = useRef(false);

  // Initialize state from URL or with defaults
  const initialPage = parseInt(searchParams.get('page') || '1', 10);
  const initialPageSize = parseInt(searchParams.get('pageSize') || '20', 10);
  const initialSortParam = searchParams.get('sort');
  const initialSortInfo = parseSortParams(initialSortParam);

  const [currentPage, setCurrentPage] = useState(initialPage);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [sortInfo, setSortInfo] = useState<SortInfo>(initialSortInfo);

  // Track if sortInfo was explicitly changed by the user
  const userChangedSortRef = useRef(false);

  const {
    transactions,
    isLoading,
    messageContextHolder,
    deleteTransaction,
    updateTransaction,
    refreshTransactions,
    totalConfirmedItems,
  } = useTransactions({
    isConfirmed: true,
    page: currentPage,
    pageSize,
    sortInfo,
  });

  const handlePaginationChange = (page: number, size: number) => {
    setCurrentPage(page);
    setPageSize(size);

    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set('page', String(page));
    newSearchParams.set('pageSize', String(size));

    setSearchParams(newSearchParams, { replace: true });
  };

  // Combined effect to handle all URL parameter synchronization
  useEffect(() => {
    // On initial mount, ensure all default parameters are set in the URL
    if (!hasSetInitialUrlRef.current) {
      const newSearchParams = new URLSearchParams(searchParams);

      // Always set page and pageSize
      newSearchParams.set('page', String(currentPage));
      newSearchParams.set('pageSize', String(pageSize));

      // Only set sort if there's an initial value
      const initialSortParam = serializeSortParams(initialSortInfo);
      if (initialSortParam) {
        newSearchParams.set('sort', initialSortParam);
      }

      setSearchParams(newSearchParams, { replace: true });
      hasSetInitialUrlRef.current = true;
      return; // Skip the rest of the effect on first mount
    }

    // For subsequent runs (after sort changes by user),
    // only update the sort parameter in the URL
    if (userChangedSortRef.current) {
      const currentSortParam = searchParams.get('sort');
      const newSortParam = serializeSortParams(sortInfo);

      if (newSortParam !== currentSortParam) {
        const newSearchParams = new URLSearchParams(searchParams);
        if (newSortParam) {
          newSearchParams.set('sort', newSortParam);
        } else {
          newSearchParams.delete('sort');
        }
        setSearchParams(newSearchParams, { replace: true });
      }

      // Reset the flag after handling the sort change
      userChangedSortRef.current = false;
    }
  }, [
    currentPage,
    pageSize,
    sortInfo,
    searchParams,
    setSearchParams,
    initialSortInfo,
  ]);

  const handleTableChange: TableProps<Transaction>['onChange'] = (
    _pagination,
    _filters,
    sorter,
    _extra
  ) => {
    console.log('Sorter ====> ', sorter);

    const sorters = Array.isArray(sorter) ? sorter : sorter ? [sorter] : [];
    const activeSorters = sorters
      .filter((s) => !!s.order)
      .map((s) => ({
        field: s.field as string,
        order: s.order || null,
      }));

    setSortInfo(activeSorters);
    console.log('activeSorters ====> ', activeSorters);
  };

  return (
    <>
      {messageContextHolder}
      <Card
        loading={isLoading}
        title={
          <Flex justify="space-between" align="center">
            <span
              style={{
                flex: 1,
              }}
            >
              All Transactions
            </span>
            <Flex gap="small" flex={1} justify="flex-end">
              <DatePicker.RangePicker variant="filled" size="small" />
              <CategoryFilter />
            </Flex>
          </Flex>
        }
        style={{
          flex: 1,
        }}
        styles={{
          body: {
            height: `calc(100vh - ${isCompact ? '178px' : '198px'})`,
            display: 'flex',
            flexDirection: 'column',
          },
        }}
        actions={[
          <TablePagination
            currentPage={currentPage}
            pageSize={pageSize}
            totalItems={totalConfirmedItems}
            onPaginationChange={handlePaginationChange}
          />,
        ]}
      >
        <TransactionsTable
          transactions={transactions}
          isConfirmedTransactions={true}
          deleteTransaction={deleteTransaction}
          refreshTransactions={refreshTransactions}
          updateTransaction={updateTransaction}
          onTableChange={handleTableChange}
          sortInfo={sortInfo}
        />
      </Card>
    </>
  );
}

export default AllTransactionsPage;
