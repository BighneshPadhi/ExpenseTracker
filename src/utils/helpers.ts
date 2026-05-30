export const formatCurrency = (amount: number, currency: string = 'USD'): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(amount);
};

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

export const formatMonth = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
  });
};

export const getMonthYear = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
  });
};

export const calculateTotalByType = (
  transactions: any[],
  type: 'income' | 'expense'
): number => {
  return transactions
    .filter((t) => t.type === type)
    .reduce((sum, t) => sum + (t.amount || 0), 0);
};

export const calculateCategoryTotal = (
  transactions: any[],
  category: string
): number => {
  return transactions
    .filter((t) => t.category === category)
    .reduce((sum, t) => sum + (t.amount || 0), 0);
};

export const groupTransactionsByMonth = (transactions: any[]): Record<string, any[]> => {
  return transactions.reduce((acc, transaction) => {
    const month = formatMonth(transaction.date);
    if (!acc[month]) {
      acc[month] = [];
    }
    acc[month].push(transaction);
    return acc;
  }, {});
};

export const getLatestTransactions = (transactions: any[], limit: number = 5): any[] => {
  return transactions
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, limit);
};

export const searchTransactions = (
  transactions: any[],
  searchTerm: string
): any[] => {
  if (!searchTerm.trim()) return transactions;
  
  const term = searchTerm.toLowerCase();
  return transactions.filter(
    (t) =>
      t.title.toLowerCase().includes(term) ||
      t.category.toLowerCase().includes(term) ||
      (t.notes && t.notes.toLowerCase().includes(term))
  );
};

export const filterByCategory = (
  transactions: any[],
  category: string
): any[] => {
  if (!category) return transactions;
  return transactions.filter((t) => t.category === category);
};

export const filterByDateRange = (
  transactions: any[],
  startDate: string,
  endDate: string
): any[] => {
  const start = new Date(startDate).getTime();
  const end = new Date(endDate).getTime();
  
  return transactions.filter((t) => {
    const transactionDate = new Date(t.date).getTime();
    return transactionDate >= start && transactionDate <= end;
  });
};

export const filterByType = (
  transactions: any[],
  type: 'income' | 'expense' | ''
): any[] => {
  if (!type) return transactions;
  return transactions.filter((t) => t.type === type);
};

export const calculatePercentage = (value: number, total: number): number => {
  if (total === 0) return 0;
  return Math.round((value / total) * 100);
};

export const generateColorForCategory = (category: string): string => {
  const colors: Record<string, string> = {
    'Food': '#FF6B6B',
    'Shopping': '#FFD93D',
    'Transport': '#6BCB77',
    'Bills': '#4D96FF',
    'Entertainment': '#A78BFA',
    'Salary': '#34D399',
    'Freelance': '#F59E0B',
    'Health': '#EC4899',
    'Education': '#3B82F6',
    'Travel': '#10B981',
  };
  return colors[category] || '#60A5FA';
};
