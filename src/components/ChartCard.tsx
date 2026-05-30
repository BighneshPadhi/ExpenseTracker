import React from 'react';
import { motion } from 'framer-motion';

interface ChartCardProps {
  title: string;
  children: React.ReactNode;
  description?: string;
}

export const ChartCard: React.FC<ChartCardProps> = ({ title, children, description }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="glass-card p-6 rounded-2xl"
    >
      <div className="mb-6">
        <h3 className="text-xl font-bold text-light">{title}</h3>
        {description && (
          <p className="text-gray-400 text-sm mt-1">{description}</p>
        )}
      </div>
      <div className="w-full h-96 md:h-64 flex items-center justify-center">
        {children}
      </div>
    </motion.div>
  );
};
