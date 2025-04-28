import AddExpenseForm from './AddExpenseForm';
import { Badge, Card, DatePicker, Flex, Pagination, Space } from 'antd';
import TransactionsTable from '../../transactions-table/TransactionsTable';
import useTransactions from '../../../hooks/useTransactions';
import { useContext } from 'react';
import { CompactModeContext } from '../../../context/CompactModeContext';
import CategoryFilter from '../../common/CategoryFilter';
import TablePagination from '../../common/TablePagination';

function AddTransactionPage() {
  const { isCompact } = useContext(CompactModeContext);
  const {
    transactions,
    isLoading,
    refreshTransactions,
    bulkAddTransactions,
    deleteTransaction,
    updateTransaction,
    messageContextHolder,
  } = useTransactions({ isConfirmed: false });

  return (
    <>
      {messageContextHolder}
      <AddExpenseForm
        bulkAddTransactions={bulkAddTransactions}
        refreshTransactions={refreshTransactions}
      />
      <Card
        loading={isLoading}
        title={
          <Flex justify="space-between" align="center">
            <Flex flex={1} align="center" gap="small">
              <span>Verify Transactions</span>
              <Badge color="red" count={transactions.length} />
            </Flex>
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
            height: `calc(100vh - ${isCompact ? '420px' : '520px'})`,
            display: 'flex',
            flexDirection: 'column',
          },
        }}
        actions={[<TablePagination />]}
      >
        <TransactionsTable
          transactions={transactions}
          isConfirmedTransactions={false}
          deleteTransaction={deleteTransaction}
          updateTransaction={updateTransaction}
          refreshTransactions={refreshTransactions}
        />
      </Card>
    </>
  );
}

export default AddTransactionPage;
