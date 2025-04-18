import { useEffect } from 'react';
import { useState } from 'react';
import { Transaction } from '../types/types';
import { message } from 'antd';
import { axiosInstance } from '../utils/httpUtil';

const useTransactions = ({ isConfirmed }: { isConfirmed: boolean }) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [messageApi, messageContextHolder] = message.useMessage();
  const authToken = localStorage.getItem('authToken');

  const baseUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setIsLoading(true);
        const response = await axiosInstance.get(
          `/transactions?isConfirmed=${isConfirmed}`
        );
        setTransactions(response.data.data || []);
      } catch (error) {
        setTransactions([]);
        console.error(
          'useTranactions :: fetchTransactions() :: error => ',
          error
        );
        setErr('Failed to fetch transactions');
      } finally {
        setIsLoading(false);
      }
    };

    fetchTransactions();
  }, [baseUrl, isConfirmed, authToken]);

  useEffect(() => {
    if (err) {
      messageApi.error({
        content: err,
        onClose: () => {
          setErr(null);
        },
      });
    }
  }, [err, messageApi]);

  const refreshTransactions = async (isConfirmed: boolean) => {
    const response = await axiosInstance.get(
      `/transactions?isConfirmed=${isConfirmed}`
    );
    setTransactions(response.data.data || []);
  };

  const addTransaction = async (transaction: Omit<Transaction, 'id'>) => {
    await axiosInstance.post('/transactions', transaction);
  };

  const bulkAddTransactions = async (
    transactions: Omit<Transaction, 'id'>[]
  ) => {
    await axiosInstance.post('/transactions/bulk', { transactions });
  };

  const deleteTransaction = async (id: React.Key) => {
    await axiosInstance.delete(`/transactions/${id}`);
  };

  const updateTransaction = async (
    id: React.Key,
    updatedTransaction: Partial<Omit<Transaction, 'id'>>
  ) => {
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

    await axiosInstance.put(`/transactions/${id}`, transactionWithoutId);

    // Update local state
    setTransactions((prev) =>
      prev.map((transaction) =>
        transaction.id === id ? { ...fullUpdatedTransaction } : transaction
      )
    );
  };

  return {
    transactions,
    messageContextHolder,
    isLoading,
    refreshTransactions,
    addTransaction,
    bulkAddTransactions,
    deleteTransaction,
    updateTransaction,
  };
};

export default useTransactions;
