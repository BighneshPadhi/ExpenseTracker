export type TransactionType = 'income' | 'expense';

export interface Transaction {
  id: string;
  user_id: string;
  title: string;
  amount: number;
  category: string;
  type: TransactionType;
  notes?: string;
  date: string;
  created_at: string;
}

export interface Budget {
  id: string;
  user_id: string;
  category: string;
  limit_amount: number;
  created_at: string;
}

export interface User {
  id: string;
  email: string;
  name?: string;
  created_at: string;
}

export interface CategoryItem {
  name: string;
  icon: string;
  color: string;
}

export interface DashboardStats {
  totalBalance: number;
  totalIncome: number;
  totalExpense: number;
  savings: number;
}

export interface MonthlyData {
  month: string;
  income: number;
  expense: number;
}

export interface CategoryExpense {
  category: string;
  amount: number;
  percentage: number;
}
