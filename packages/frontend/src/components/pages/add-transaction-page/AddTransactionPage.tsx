import AddExpenseForm from './AddExpenseForm';
import { Badge, Card, Space } from 'antd';
import TransactionsTable from '../../transactions-table/TransactionsTable';
import useTransactions from '../../../hooks/useTransactions';

function AddTransactionPage() {
  const {
    transactions,
    isLoading,
    refreshTransactions,
    addTransaction,
    deleteTransaction,
    updateTransaction,
    messageContextHolder,
  } = useTransactions({ isConfirmed: false });

  return (
    <>
      {messageContextHolder}
      <AddExpenseForm
        addTransaction={addTransaction}
        refreshTransactions={refreshTransactions}
      />
      <Card
        loading={isLoading}
        title={
          <Space>
            <span>Verify Transactions</span>
            <Badge color="red" count={transactions.length} />
          </Space>
        }
        style={{
          flex: 1,
        }}
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
