import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import type { Transaction, Budget } from '../types';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthContext';

interface TransactionContextType {
  transactions: Transaction[];
  budgets: Budget[];
  loading: boolean;
  error: string | null;
  currency: string;
  setCurrency: (currency: string) => void;
  fetchTransactions: () => Promise<void>;
  fetchBudgets: () => Promise<void>;
  addTransaction: (transaction: Omit<Transaction, 'id' | 'created_at' | 'user_id'>) => Promise<void>;
  updateTransaction: (id: string, transaction: Partial<Transaction>) => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;
  addBudget: (budget: Omit<Budget, 'id' | 'created_at' | 'user_id'>) => Promise<void>;
  updateBudget: (id: string, budget: Partial<Budget>) => Promise<void>;
  deleteBudget: (id: string) => Promise<void>;
}

const TransactionContext = createContext<TransactionContextType | undefined>(undefined);

export const TransactionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { session } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currency, setCurrency] = useState<string>(() => {
    const saved = localStorage.getItem('app_currency');
    return saved || 'INR';
  });

  const handleSetCurrency = (newCurrency: string) => {
    setCurrency(newCurrency);
    localStorage.setItem('app_currency', newCurrency);
  };

  const fetchTransactions = useCallback(async () => {
    if (!session?.user.id) return;

    try {
      setLoading(true);
      
      // Create a timeout promise
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Fetch transactions timeout')), 5000)
      );
      
      const queryPromise = supabase
        .from('transactions')
        .select('*')
        .eq('user_id', session.user.id)
        .order('date', { ascending: false });

      const { data, error: fetchError } = await Promise.race([queryPromise, timeoutPromise]) as any;

      if (fetchError) throw fetchError;
      setTransactions(data || []);
      setError(null);
    } catch (err: any) {
      setError(err.message);
      console.error('Error fetching transactions:', err);
      setTransactions([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  }, [session?.user.id]);

  const fetchBudgets = useCallback(async () => {
    if (!session?.user.id) return;

    try {
      // Create a timeout promise
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Fetch budgets timeout')), 5000)
      );
      
      const queryPromise = supabase
        .from('budgets')
        .select('*')
        .eq('user_id', session.user.id);

      const { data, error: fetchError } = await Promise.race([queryPromise, timeoutPromise]) as any;

      if (fetchError) throw fetchError;
      setBudgets(data || []);
    } catch (err: any) {
      console.error('Error fetching budgets:', err);
      setBudgets([]); // Set empty array on error
    }
  }, [session?.user.id]);

  useEffect(() => {
    if (session?.user.id) {
      fetchTransactions();
      fetchBudgets();
    }
  }, [session?.user.id, fetchTransactions, fetchBudgets]);

  const ensureUserExists = async (userId: string, userEmail: string) => {
    try {
      // Call the Supabase function to create user if needed
      // This runs in the background with a 2 second timeout
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('User creation timeout')), 2000)
      );

      const rpcPromise = supabase.rpc('ensure_user_exists', {
        user_id: userId,
        user_email: userEmail,
        user_name: userEmail.split('@')[0],
      });

      await Promise.race([rpcPromise, timeoutPromise]);
    } catch (err) {
      // Silently log - this is non-critical
      console.warn('Non-critical: Could not ensure user exists', err);
      // Don't throw - let the transaction insert attempt
    }
  };

  const addTransaction = async (transaction: Omit<Transaction, 'id' | 'created_at' | 'user_id'>) => {
    if (!session?.user.id) {
      const errorMsg = 'No active session. Please log in.';
      setError(errorMsg);
      throw new Error(errorMsg);
    }

    try {
      // Fire off user ensure in background (don't wait)
      ensureUserExists(session.user.id, session.user.email || '').catch(() => {
        // Ignore errors
      });

      // Create a timeout promise
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Add transaction timeout - server not responding')), 5000)
      );

      const insertPromise = supabase
        .from('transactions')
        .insert({
          ...transaction,
          user_id: session.user.id,
        })
        .select();

      const { data, error: insertError } = await Promise.race([insertPromise, timeoutPromise]) as any;

      if (insertError) {
        const errorMsg = insertError.message || 'Failed to add transaction';
        console.error('Insert error:', insertError);
        
        // Check for foreign key constraint error
        if (insertError.message?.includes('foreign key')) {
          throw new Error('User profile not found. Trying to create it... Please try again.');
        }
        throw new Error(errorMsg);
      }
      
      if (data && data.length > 0) {
        setTransactions([data[0], ...transactions]);
        setError(null);
      }
    } catch (err: any) {
      const errorMsg = err.message || 'Failed to add transaction';
      setError(errorMsg);
      console.error('Error adding transaction:', err);
      throw err;
    }
  };

  const updateTransaction = async (id: string, transaction: Partial<Transaction>) => {
    try {
      const { error: updateError } = await supabase
        .from('transactions')
        .update(transaction)
        .eq('id', id);

      if (updateError) throw updateError;

      setTransactions(
        transactions.map((t) => (t.id === id ? { ...t, ...transaction } : t))
      );
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const deleteTransaction = async (id: string) => {
    try {
      const { error: deleteError } = await supabase
        .from('transactions')
        .delete()
        .eq('id', id);

      if (deleteError) throw deleteError;

      setTransactions(transactions.filter((t) => t.id !== id));
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const addBudget = async (budget: Omit<Budget, 'id' | 'created_at' | 'user_id'>) => {
    if (!session?.user.id) {
      const errorMsg = 'No active session. Please log in.';
      setError(errorMsg);
      throw new Error(errorMsg);
    }

    try {
      // Fire off user ensure in background (don't wait)
      ensureUserExists(session.user.id, session.user.email || '').catch(() => {
        // Ignore errors
      });

      // Create a timeout promise
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Add budget timeout - server not responding')), 5000)
      );

      const insertPromise = supabase
        .from('budgets')
        .insert({
          ...budget,
          user_id: session.user.id,
        })
        .select();

      const { data, error: insertError } = await Promise.race([insertPromise, timeoutPromise]) as any;

      if (insertError) {
        const errorMsg = insertError.message || 'Failed to add budget';
        console.error('Insert error:', insertError);
        
        // Check for foreign key constraint error
        if (insertError.message?.includes('foreign key')) {
          throw new Error('User profile not found. Trying to create it... Please try again.');
        }
        throw new Error(errorMsg);
      }
      
      if (data && data.length > 0) {
        setBudgets([...budgets, data[0]]);
        setError(null);
      }
    } catch (err: any) {
      const errorMsg = err.message || 'Failed to add budget';
      setError(errorMsg);
      console.error('Error adding budget:', err);
      throw err;
    }
  };

  const updateBudget = async (id: string, budget: Partial<Budget>) => {
    try {
      const { error: updateError } = await supabase
        .from('budgets')
        .update(budget)
        .eq('id', id);

      if (updateError) throw updateError;

      setBudgets(budgets.map((b) => (b.id === id ? { ...b, ...budget } : b)));
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const deleteBudget = async (id: string) => {
    try {
      const { error: deleteError } = await supabase
        .from('budgets')
        .delete()
        .eq('id', id);

      if (deleteError) throw deleteError;

      setBudgets(budgets.filter((b) => b.id !== id));
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  return (
    <TransactionContext.Provider
      value={{
        transactions,
        budgets,
        loading,
        error,
        currency,
        setCurrency: handleSetCurrency,
        fetchTransactions,
        fetchBudgets,
        addTransaction,
        updateTransaction,
        deleteTransaction,
        addBudget,
        updateBudget,
        deleteBudget,
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
};

export const useTransactions = () => {
  const context = useContext(TransactionContext);
  if (!context) {
    throw new Error('useTransactions must be used within TransactionProvider');
  }
  return context;
};
