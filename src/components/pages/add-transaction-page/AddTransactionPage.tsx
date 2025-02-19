import React, { useEffect, useState } from 'react';
import AddExpenseForm from './AddExpenseForm';
import { Badge, Card, message, Space } from 'antd';
import { Transaction } from '../../../types/types';
import axios from 'axios';
import TransactionsTable from '../../transactions-table/TransactionsTable';

function AddTransactionPage({ isMobile, isCompact }: { isMobile: boolean; isCompact: boolean }) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isFetchingTransactions, setIsFetchingTransactions] = useState(false);
  const [fetchingTransactionsError, setFetchingTransactionsError] = useState<string | null>(null);
  const [messageApi, messageContextHolder] = message.useMessage();

  const baseUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setIsFetchingTransactions(true);
        const response = await axios.get(`${baseUrl}/transactions?isConfirmed=false`);
        setTransactions(response.data.data || []);
      } catch (error) {
        setTransactions([]);
        console.error('error ========> ', error);
        setFetchingTransactionsError('Failed to fetch transactions');
      } finally {
        setIsFetchingTransactions(false);
      }
    };

    fetchTransactions();
  }, [baseUrl]);

  useEffect(() => {
    if (fetchingTransactionsError) {
      messageApi.error({
        content: fetchingTransactionsError,
        onClose: () => {
          setFetchingTransactionsError(null);
        },
      });
    }
  }, [fetchingTransactionsError, messageApi]);

  const refreshTransactions = async () => {
    const response = await axios.get(`${baseUrl}/transactions?isConfirmed=false`);
    setTransactions(response.data.data || []);
  };

  const addTransaction = async (transaction: Omit<Transaction, 'id'>) => {
    await axios.post(`${baseUrl}/transactions`, transaction);
    // await refreshTransactions();
  };

  const deleteTransaction = async (id: React.Key) => {
    await axios.delete(`${baseUrl}/transactions/${id}`);
    await refreshTransactions();
  };

  const updateTransaction = async (id: React.Key, updatedTransaction: Partial<Omit<Transaction, 'id'>>) => {
    // First get the current transaction
    const currentTransaction = transactions.find((t) => t.id === id);

    if (!currentTransaction) {
      throw new Error('Transaction not found');
    }

    // Merge current with updates
    const fullUpdatedTransaction = {
      ...currentTransaction,
      ...updatedTransaction,
    };

    // Remove id as it's part of the URL
    const { id: _, ...transactionWithoutId } = fullUpdatedTransaction;

    await axios.put(`${baseUrl}/transactions/${id}`, transactionWithoutId);

    // Update local state
    setTransactions((prev) =>
      prev.map((transaction) => (transaction.id === id ? { ...fullUpdatedTransaction } : transaction))
    );

    await refreshTransactions();
  };

  return (
    <>
      {messageContextHolder}
      <AddExpenseForm isMobile={isMobile} addTransaction={addTransaction} refreshTransactions={refreshTransactions} />
      <Card
        loading={isFetchingTransactions}
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
          isCompact={isCompact}
          deleteTransaction={deleteTransaction}
          updateTransaction={updateTransaction}
        />
      </Card>
    </>
  );
}

export default AddTransactionPage;
