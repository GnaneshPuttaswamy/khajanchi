import { useEffect, useState } from 'react';
import { Transaction } from '../types/types';
import axios from 'axios';

interface UseTransactionsProps {
  isConfirmed: boolean;
}

const useTransactions = ({ isConfirmed }: UseTransactionsProps) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const baseUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${baseUrl}/transactions?isConfirmed=true`);
        setTransactions(response.data.data || []);
      } catch (error) {
        setTransactions([]);
        console.error('error ========> ', error);
        setError('Failed to fetch transactions');
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [isConfirmed, baseUrl]);

  const refreshTransactions = async () => {
    const response = await axios.get(`${baseUrl}/transactions?isConfirmed=true`);
    setTransactions(response.data.data || []);
  };

  const addTransaction = async (transaction: Omit<Transaction, 'id'>) => {
    try {
      await axios.post(`${baseUrl}/transactions`, transaction);
      await refreshTransactions();
    } catch (err) {
      console.error('Failed to add transaction:', err);
      setError('Failed to add transaction');
    }
  };

  const deleteTransaction = async (id: React.Key) => {
    try {
      await axios.delete(`${baseUrl}/transactions/${id}`);
      await refreshTransactions();
    } catch (err) {
      console.error('Failed to delete transaction:', err);
      setError('Failed to delete transaction');
    }
  };

  const updateTransaction = async (id: React.Key, updatedTransaction: Partial<Omit<Transaction, 'id'>>) => {
    try {
      await axios.put(`${baseUrl}/transactions/${id}`, updatedTransaction);
      await refreshTransactions();
    } catch (err) {
      console.error('Failed to update transaction:', err);
      setError('Failed to update transaction');
    }
  };

  return {
    transactions,
    loading,
    error,
    addTransaction,
    deleteTransaction,
    updateTransaction,
    refresh: refreshTransactions,
  };
};

export default useTransactions;
