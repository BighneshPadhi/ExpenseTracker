import type { CategoryItem } from '../types';

export const EXPENSE_CATEGORIES: CategoryItem[] = [
  { name: 'Food', icon: '🍔', color: '#FF6B6B' },
  { name: 'Shopping', icon: '🛍️', color: '#FFD93D' },
  { name: 'Transport', icon: '🚗', color: '#6BCB77' },
  { name: 'Bills', icon: '📄', color: '#4D96FF' },
  { name: 'Entertainment', icon: '🎬', color: '#A78BFA' },
  { name: 'Health', icon: '🏥', color: '#EC4899' },
  { name: 'Education', icon: '📚', color: '#3B82F6' },
  { name: 'Travel', icon: '✈️', color: '#10B981' },
];

export const INCOME_CATEGORIES: CategoryItem[] = [
  { name: 'Salary', icon: '💼', color: '#34D399' },
  { name: 'Freelance', icon: '💻', color: '#F59E0B' },
  { name: 'Bonus', icon: '🎁', color: '#06B6D4' },
  { name: 'Investment', icon: '📈', color: '#8B5CF6' },
  { name: 'Other', icon: '💰', color: '#60A5FA' },
];

export const ALL_CATEGORIES = [...EXPENSE_CATEGORIES, ...INCOME_CATEGORIES];

export const getCategoryIcon = (categoryName: string): string => {
  const category = ALL_CATEGORIES.find((c) => c.name === categoryName);
  return category?.icon || '💰';
};

export const getCategoryColor = (categoryName: string): string => {
  const category = ALL_CATEGORIES.find((c) => c.name === categoryName);
  return category?.color || '#60A5FA';
};

export const getExpenseCategoriesList = (): string[] => {
  return EXPENSE_CATEGORIES.map((c) => c.name);
};

export const getIncomeCategoriesList = (): string[] => {
  return INCOME_CATEGORIES.map((c) => c.name);
};
