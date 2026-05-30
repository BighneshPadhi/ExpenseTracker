import React from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, TrendingDown } from 'lucide-react';
import type { Budget, Transaction } from '../types';
import { formatCurrency, calculateCategoryTotal } from '../utils/helpers';
import { getCategoryIcon, getCategoryColor } from '../utils/categories';
import { useTransactions } from '../context/TransactionContext';

interface BudgetProgressProps {
  budget: Budget;
  transactions: Transaction[];
  onDelete?: (id: string) => void;
}

export const BudgetProgress: React.FC<BudgetProgressProps> = ({
  budget,
  transactions,
  onDelete,
}) => {
  const { currency } = useTransactions();
  const spent = calculateCategoryTotal(
    transactions.filter((t) => t.type === 'expense'),
    budget.category
  );
  const remaining = budget.limit_amount - spent;
  const percentage = (spent / budget.limit_amount) * 100;
  const isExceeded = spent > budget.limit_amount;
  const icon = getCategoryIcon(budget.category);
  const categoryColor = getCategoryColor(budget.category);

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className={`glass-card p-6 rounded-xl ${
        isExceeded ? 'border-red-500 border-opacity-30' : ''
      }`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center text-lg"
            style={{ backgroundColor: `${categoryColor}20` }}
          >
            {icon}
          </div>
          <div>
            <h4 className="text-light font-semibold">{budget.category}</h4>
            <p className="text-gray-400 text-sm">Budget: {formatCurrency(budget.limit_amount, currency)}</p>
          </div>
        </div>
        {onDelete && (
          <button
            onClick={() => onDelete(budget.id)}
            className="text-gray-400 hover:text-red-400 transition-colors"
          >
            ✕
          </button>
        )}
      </div>

      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-400">Spent: {formatCurrency(spent, currency)}</span>
          <span className={`text-sm font-semibold ${isExceeded ? 'text-red-400' : 'text-green-400'}`}>
            {percentage.toFixed(0)}%
          </span>
        </div>
        <div className="w-full bg-primary-700 bg-opacity-50 rounded-full h-2">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(percentage, 100)}%` }}
            transition={{ duration: 0.6 }}
            className={`h-full rounded-full ${
              isExceeded
                ? 'bg-gradient-to-r from-red-500 to-orange-500'
                : percentage > 80
                ? 'bg-gradient-to-r from-yellow-500 to-orange-500'
                : 'bg-gradient-to-r from-accent to-light'
            }`}
          />
        </div>
      </div>

      {isExceeded ? (
        <div className="flex items-center gap-2 text-red-400 text-sm bg-red-900 bg-opacity-20 px-3 py-2 rounded-lg">
          <AlertCircle className="w-4 h-4" />
          <span>Budget exceeded by {formatCurrency(spent - budget.limit_amount, currency)}</span>
        </div>
      ) : (
        <div className="flex items-center gap-2 text-green-400 text-sm bg-green-900 bg-opacity-20 px-3 py-2 rounded-lg">
          <TrendingDown className="w-4 h-4" />
          <span>{formatCurrency(remaining, currency)} remaining</span>
        </div>
      )}
    </motion.div>
  );
};
