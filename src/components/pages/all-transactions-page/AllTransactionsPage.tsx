import { Card, message, Space } from 'antd';
import React, { useContext, useEffect, useState } from 'react';
import { Transaction } from '../../../types/types';
import axios from 'axios';
import TransactionsTable from '../../transactions-table/TransactionsTable';
import { CompactModeContext } from '../../../context/CompactModeContext';

function AllTransactionsPage({ isMobile }: { isMobile: boolean }) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isFetchingTransactions, setIsFetchingTransactions] = useState(false);
  const [fetchingTransactionsError, setFetchingTransactionsError] = useState<string | null>(null);
  const [messageApi, messageContextHolder] = message.useMessage();
  const { isCompact } = useContext(CompactModeContext);

  const baseUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setIsFetchingTransactions(true);
        const response = await axios.get(`${baseUrl}/transactions?isConfirmed=true`);
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
    const response = await axios.get(`${baseUrl}/transactions?isConfirmed=true`);
    setTransactions(response.data.data || []);
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
      <Card
        loading={isFetchingTransactions}
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
          updateTransaction={updateTransaction}
        />
      </Card>
    </>
  );
}

export default AllTransactionsPage;
