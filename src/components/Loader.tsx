import React from 'react';
import { motion } from 'framer-motion';

export const Loader: React.FC = () => {
  return (
    <div className="flex items-center justify-center py-12">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full"
      />
    </div>
  );
};

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon = '📭',
  title,
  description,
  action,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center justify-center py-12 px-4"
    >
      <div className="text-6xl mb-4">{icon}</div>
      <h3 className="text-xl font-semibold text-light mb-2">{title}</h3>
      <p className="text-gray-400 text-center mb-6">{description}</p>
      {action && (
        <button
          onClick={action.onClick}
          className="btn-primary"
        >
          {action.label}
        </button>
      )}
    </motion.div>
  );
};

// Skeleton loader for cards
export const SkeletonCard: React.FC = () => {
  return (
    <div className="glass-card p-6 rounded-xl">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="h-4 bg-primary-700 bg-opacity-50 rounded w-24 mb-4" />
          <div className="h-8 bg-primary-700 bg-opacity-50 rounded w-32 mb-4" />
          <div className="h-3 bg-primary-700 bg-opacity-30 rounded w-20" />
        </div>
        <div className="w-14 h-14 bg-primary-700 bg-opacity-50 rounded-xl" />
      </div>
    </div>
  );
};
