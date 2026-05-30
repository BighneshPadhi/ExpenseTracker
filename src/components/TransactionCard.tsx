import React from 'react';
import { Trash2, Edit2 } from 'lucide-react';
import { motion } from 'framer-motion';
import type { Transaction } from '../types';
import { formatCurrency, formatDate } from '../utils/helpers';
import { getCategoryIcon, getCategoryColor } from '../utils/categories';
import { useTransactions } from '../context/TransactionContext';

interface TransactionCardProps {
  transaction: Transaction;
  onEdit?: (transaction: Transaction) => void;
  onDelete?: (id: string) => void;
  showActions?: boolean;
}

export const TransactionCard: React.FC<TransactionCardProps> = ({
  transaction,
  onEdit,
  onDelete,
  showActions = true,
}) => {
  const { currency } = useTransactions();
  const icon = getCategoryIcon(transaction.category);
  const categoryColor = getCategoryColor(transaction.category);

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="glass-card p-4 rounded-xl hover:shadow-lg hover:shadow-accent/10 transition-all duration-300 flex items-center gap-4 group"
    >
      <div
        className="w-12 h-12 rounded-lg flex items-center justify-center text-xl"
        style={{ backgroundColor: `${categoryColor}20` }}
      >
        {icon}
      </div>

      <div className="flex-1 min-w-0">
        <h4 className="text-light font-semibold group-hover:text-accent transition-colors">
          {transaction.title}
        </h4>
        <div className="flex items-center gap-3 text-sm text-gray-400 mt-1">
          <span>{transaction.category}</span>
          <span>•</span>
          <span>{formatDate(transaction.date)}</span>
        </div>
      </div>

      <div className="flex flex-col items-end gap-2">
        <span
          className={`font-bold text-lg ${
            transaction.type === 'income' ? 'text-green-400' : 'text-red-400'
          }`}
        >
          {transaction.type === 'income' ? '+' : '-'}
          {formatCurrency(transaction.amount, currency)}
        </span>
      </div>

      {showActions && (
        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          {onEdit && (
            <button
              onClick={() => onEdit(transaction)}
              className="p-2 hover:bg-primary-700 rounded-lg transition-colors"
              title="Edit transaction"
            >
              <Edit2 className="w-4 h-4 text-accent" />
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => onDelete(transaction.id)}
              className="p-2 hover:bg-red-900 hover:bg-opacity-30 rounded-lg transition-colors"
              title="Delete transaction"
            >
              <Trash2 className="w-4 h-4 text-red-400" />
            </button>
          )}
        </div>
      )}
    </motion.div>
  );
};
