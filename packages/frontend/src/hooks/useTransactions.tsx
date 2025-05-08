import { useEffect } from 'react';
import { useState } from 'react';
import { Transaction } from '../types/types';
import { message } from 'antd';
import { axiosInstance } from '../utils/httpUtil';
import { SortInfo } from '../components/pages/add-transaction-page/AddTransactionPage';

interface UseTransactionsOptions {
  isConfirmed: boolean;
  page?: number;
  pageSize?: number;
  sortInfo: SortInfo;
  startDate: string | null;
  endDate: string | null;
  selectedCategories: string[];
}

interface UseTransactionsResult {
  transactions: Transaction[];
  messageContextHolder: React.ReactElement;
  isLoading: boolean;
  totalUnconfirmedItems: number;
  totalConfirmedItems: number;
  refreshTransactions: (isConfirmed: boolean) => Promise<void>;
  addTransaction: any;
  bulkAddTransactions: any;
  deleteTransaction: any;
  updateTransaction: any;
}

const useTransactions = ({
  isConfirmed,
  page = 1,
  pageSize = 10,
  sortInfo,
  startDate,
  endDate,
  selectedCategories,
}: UseTransactionsOptions): UseTransactionsResult => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [totalUnconfirmedItems, setTotalUnconfirmedItems] = useState(0);
  const [totalConfirmedItems, setTotalConfirmedItems] = useState(0);
  const [err, setErr] = useState<string | null>(null);
  const [messageApi, messageContextHolder] = message.useMessage();
  const authToken = localStorage.getItem('authToken'); // TODO: To remove

  const baseUrl = import.meta.env.VITE_API_URL; // TODO

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setIsLoading(true);

        const params = new URLSearchParams();

        params.append('isConfirmed', String(isConfirmed));
        params.append('pageNumber', String(page));
        params.append('pageSize', String(pageSize));

        // Appending sorting parameters
        sortInfo.forEach((sorter) => {
          if (sorter.field && sorter.order) {
            params.append('sortBy', sorter.field);
            params.append(
              'sortOrder',
              sorter.order === 'ascend' ? 'ASC' : 'DESC'
            );
          }
        });

        if (startDate && endDate) {
          params.append('startDate', startDate);
          params.append('endDate', endDate);
        }

        selectedCategories.forEach((category) => {
          params.append('categories', category);
        });

        const apiUrl = `/transactions?${params.toString()}`;
        const response = await axiosInstance.get(apiUrl);

        const responseData = response.data?.data;
        setTransactions(responseData?.rows || []);

        if (isConfirmed) {
          setTotalConfirmedItems(responseData?.count || 0);
        } else {
          setTotalUnconfirmedItems(responseData?.count || 0);
        }
      } catch (error) {
        setTransactions([]);
        setTotalConfirmedItems(0);
        setTotalUnconfirmedItems(0);

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
  }, [
    baseUrl,
    isConfirmed,
    authToken,
    page,
    pageSize,
    sortInfo,
    startDate,
    endDate,
    selectedCategories,
  ]);

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

  const refreshTransactions = async (refreshIsConfirmed: boolean) => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      params.append('isConfirmed', String(refreshIsConfirmed));
      params.append('pageNumber', String(page));
      params.append('pageSize', String(pageSize));

      sortInfo.forEach((sorter) => {
        if (sorter.field && sorter.order) {
          params.append('sortBy', sorter.field);
          const apiSortOrder = sorter.order === 'ascend' ? 'ASC' : 'DESC';
          params.append('sortOrder', apiSortOrder);
        }
      });

      const response = await axiosInstance.get(
        `/transactions?${params.toString()}`
      );

      const responseData = response.data?.data;
      setTransactions(responseData?.rows || []);

      if (refreshIsConfirmed) {
        setTotalConfirmedItems(responseData?.count || 0);
      } else {
        setTotalUnconfirmedItems(responseData?.count || 0);
      }
    } catch (error) {
      console.error(
        'useTransactions :: refreshTransactions() :: error => ',
        error
      );
      setErr('Failed to refresh transactions');
    } finally {
      setIsLoading(false);
    }
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
    totalUnconfirmedItems,
    totalConfirmedItems,
    refreshTransactions,
    addTransaction,
    bulkAddTransactions,
    deleteTransaction,
    updateTransaction,
  };
};

export default useTransactions;
