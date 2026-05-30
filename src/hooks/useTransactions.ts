import { useState, useCallback } from 'react';
import type { Transaction } from '../types';

export const useTransactionFilters = (transactions: Transaction[]) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState<'income' | 'expense' | ''>('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  const filtered = useCallback(() => {
    let result = [...transactions];

    // Search filter
    if (searchTerm) {
      result = result.filter(
        (t) =>
          t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (t.notes && t.notes.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Category filter
    if (categoryFilter) {
      result = result.filter((t) => t.category === categoryFilter);
    }

    // Type filter
    if (typeFilter) {
      result = result.filter((t) => t.type === typeFilter);
    }

    // Date range filter
    if (dateFrom) {
      result = result.filter((t) => new Date(t.date) >= new Date(dateFrom));
    }
    if (dateTo) {
      result = result.filter((t) => new Date(t.date) <= new Date(dateTo));
    }

    return result;
  }, [transactions, searchTerm, categoryFilter, typeFilter, dateFrom, dateTo]);

  return {
    searchTerm,
    setSearchTerm,
    categoryFilter,
    setCategoryFilter,
    typeFilter,
    setTypeFilter,
    dateFrom,
    setDateFrom,
    dateTo,
    setDateTo,
    filteredTransactions: filtered(),
  };
};

export const useTransactionForm = (
  onSubmit?: (data: Omit<Transaction, 'id' | 'created_at' | 'user_id'>) => Promise<void>
) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = useCallback(
    async (data: Omit<Transaction, 'id' | 'created_at' | 'user_id'>) => {
      try {
        setIsLoading(true);
        setError(null);
        if (onSubmit) {
          await onSubmit(data);
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    },
    [onSubmit]
  );

  return { handleSubmit, isLoading, error };
};
