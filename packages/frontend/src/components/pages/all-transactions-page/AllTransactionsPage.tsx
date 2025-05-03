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
import { RangePickerProps } from 'antd/es/date-picker';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { axiosInstance } from '../../../utils/httpUtil';
dayjs.extend(utc);

function AllTransactionsPage() {
  const { isCompact } = useContext(CompactModeContext);
  const [searchParams, setSearchParams] = useSearchParams();
  const hasSetInitialUrlRef = useRef(false);

  // Initialize state from URL or with defaults
  const isConfirmed = true; // In AddTransactionPage, we only show only confirmed transactions, hence we set isConfirmed to true
  const initialPage = parseInt(searchParams.get('page') || '1', 10);
  const initialPageSize = parseInt(searchParams.get('pageSize') || '20', 10);
  const initialSortParam = searchParams.get('sort');
  const initialSortInfo = parseSortParams(initialSortParam);
  const initialStartDate = searchParams.get('startDate') || null;
  const initialEndDate = searchParams.get('endDate') || null;
  const initialCategories = searchParams.get('categories') || null;

  const [currentPage, setCurrentPage] = useState(initialPage);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [sortInfo, setSortInfo] = useState<SortInfo>(initialSortInfo);

  const [startDate, setStartDate] = useState<string | null>(initialStartDate);
  const [endDate, setEndDate] = useState<string | null>(initialEndDate);

  const [allUniqueCategories, setAllUniqueCategories] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    initialCategories ? initialCategories.split(',') : []
  );

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
    isConfirmed: isConfirmed,
    page: currentPage,
    pageSize,
    sortInfo,
    startDate,
    endDate,
    selectedCategories,
  });

  const handlePaginationChange = (page: number, size: number) => {
    setCurrentPage(page);
    setPageSize(size);

    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set('isConfirmed', 'true');
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
      newSearchParams.set('isConfirmed', 'true');
      newSearchParams.set('page', String(currentPage));
      newSearchParams.set('pageSize', String(pageSize));

      // Only set sort if there's an initial value
      const initialSortParam = serializeSortParams(initialSortInfo);
      if (initialSortParam) {
        newSearchParams.set('sort', initialSortParam);
      }

      // Add date range params if they exist
      if (startDate && endDate) {
        newSearchParams.set('startDate', startDate);
        newSearchParams.set('endDate', endDate);
      }

      if (initialCategories) {
        newSearchParams.set('categories', initialCategories);
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
    startDate,
    endDate,
    selectedCategories,
    initialCategories,
  ]);

  useEffect(() => {
    const fetchCategories = async () => {
      const response = await axiosInstance.get('/transactions/categories');
      setAllUniqueCategories(response?.data?.data?.categories || []);
    };

    fetchCategories();
  }, []);

  const handleTableChange: TableProps<Transaction>['onChange'] = (
    _pagination,
    _filters,
    sorter,
    _extra
  ) => {
    const sorters = Array.isArray(sorter) ? sorter : sorter ? [sorter] : [];
    const activeSorters = sorters
      .filter((s) => !!s.order)
      .map((s) => ({
        field: s.field as string,
        order: s.order || null,
      }));

    setSortInfo(activeSorters);
  };

  const handleDateChange: RangePickerProps['onChange'] = (dates) => {
    const newSearchParams = new URLSearchParams(searchParams);

    if (dates) {
      const newStartDate = dayjs(dates[0]).utc().format();
      const newEndDate = dayjs(dates[1]).utc().format();

      setStartDate(newStartDate);
      setEndDate(newEndDate);

      newSearchParams.set('startDate', newStartDate);
      newSearchParams.set('endDate', newEndDate);
    } else {
      setStartDate(null);
      setEndDate(null);

      newSearchParams.delete('startDate');
      newSearchParams.delete('endDate');
    }

    setSearchParams(newSearchParams, { replace: true });
  };

  const handleCategoryFilterChange = (selectedCategories: string[]) => {
    const newSearchParams = new URLSearchParams(searchParams);

    if (selectedCategories.length > 0) {
      newSearchParams.set('categories', selectedCategories.join(','));
    } else {
      newSearchParams.delete('categories');
    }

    setSelectedCategories(selectedCategories);
    setSearchParams(newSearchParams, { replace: true });
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
              <DatePicker.RangePicker
                value={
                  startDate && endDate
                    ? [dayjs(startDate), dayjs(endDate)]
                    : null
                }
                onChange={handleDateChange}
                variant="filled"
                size="small"
              />
              <CategoryFilter
                allUniqueCategories={allUniqueCategories}
                onCategoryFilterChange={handleCategoryFilterChange}
              />
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
