import { Card, DatePicker, Flex } from 'antd';
import React, { useContext } from 'react';
import TransactionsTable from '../../transactions-table/TransactionsTable';
import { CompactModeContext } from '../../../context/CompactModeContext';
import useTransactions from '../../../hooks/useTransactions';
import CategoryFilter from '../../common/CategoryFilter';
import TablePagination from '../../common/TablePagination';

function AllTransactionsPage() {
  const { isCompact } = useContext(CompactModeContext);

  const {
    transactions,
    isLoading,
    messageContextHolder,
    deleteTransaction,
    updateTransaction,
    refreshTransactions,
  } = useTransactions({
    isConfirmed: true,
  });

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
        actions={[<TablePagination />]}
      >
        <TransactionsTable
          transactions={transactions}
          isConfirmedTransactions={true}
          deleteTransaction={deleteTransaction}
          refreshTransactions={refreshTransactions}
          updateTransaction={updateTransaction}
        />
      </Card>
    </>
  );
}

export default AllTransactionsPage;
