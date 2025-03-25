import { Card, Space } from 'antd';
import React, { useContext } from 'react';
import TransactionsTable from '../../transactions-table/TransactionsTable';
import { CompactModeContext } from '../../../context/CompactModeContext';
import useTransactions from '../../../hooks/useTransactions';

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
          <Space>
            <span>All Transactions</span>
          </Space>
        }
        style={{
          flex: 1,
        }}
        styles={{
          body: {
            height: `calc(100vh - ${isCompact ? '130px' : '150px'})`,
            display: 'flex',
            flexDirection: 'column',
          },
        }}
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
