import { useEffect } from 'react';
import { useState } from 'react';
import { Transaction } from '../types/types';
import axios from 'axios';
import { message } from 'antd';

const useTransactions = ({ isConfirmed }: { isConfirmed: boolean }) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [messageApi, messageContextHolder] = message.useMessage();

  const baseUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(
          `${baseUrl}/transactions?isConfirmed=${isConfirmed}`
        );
        setTransactions(response.data.data || []);
      } catch (error) {
        setTransactions([]);
        console.error('error ========> ', error);
        setErr('Failed to fetch transactions');
      } finally {
        setIsLoading(false);
      }
    };

    fetchTransactions();
  }, [baseUrl, isConfirmed]);

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

  const refreshTransactions = async () => {
    const response = await axios.get(
      `${baseUrl}/transactions?isConfirmed=false`
    );
    setTransactions(response.data.data || []);
  };

  const addTransaction = async (transaction: Omit<Transaction, 'id'>) => {
    await axios.post(`${baseUrl}/transactions`, transaction);
  };

  const deleteTransaction = async (id: React.Key) => {
    await axios.delete(`${baseUrl}/transactions/${id}`);
    await refreshTransactions();
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

    await axios.put(`${baseUrl}/transactions/${id}`, transactionWithoutId);

    // Update local state
    setTransactions((prev) =>
      prev.map((transaction) =>
        transaction.id === id ? { ...fullUpdatedTransaction } : transaction
      )
    );

    await refreshTransactions();
  };

  return {
    transactions,
    messageContextHolder,
    isLoading,
    refreshTransactions,
    addTransaction,
    deleteTransaction,
    updateTransaction,
  };
};

export default useTransactions;
