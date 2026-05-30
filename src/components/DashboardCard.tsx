import React from 'react';
import type { LucideIcon } from 'lucide-react';
import { motion } from 'framer-motion';

interface DashboardCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  trend?: {
    direction: 'up' | 'down';
    percentage: number;
  };
  color?: string;
}

export const DashboardCard: React.FC<DashboardCardProps> = ({
  title,
  value,
  icon: Icon,
  trend,
  color = 'accent',
}) => {
  const colorMap = {
    accent: 'from-accent to-light',
    green: 'from-green-400 to-emerald-400',
    blue: 'from-blue-400 to-cyan-400',
    purple: 'from-purple-400 to-pink-400',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="glass-card p-6 rounded-2xl hover:shadow-lg hover:shadow-accent/20 transition-all duration-300 group"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-gray-400 text-sm mb-2">{title}</p>
          <h3 className="text-3xl font-bold text-light mb-4">{value}</h3>
          {trend && (
            <div className={`flex items-center gap-2 text-sm ${
              trend.direction === 'up' ? 'text-green-400' : 'text-red-400'
            }`}>
              <span>{trend.direction === 'up' ? '↑' : '↓'}</span>
              <span>{trend.percentage}% from last month</span>
            </div>
          )}
        </div>
        <div className={`bg-gradient-to-br ${colorMap[color as keyof typeof colorMap]} p-4 rounded-xl group-hover:scale-110 transition-transform duration-300`}>
          <Icon className="w-6 h-6 text-primary-900" />
        </div>
      </div>
    </motion.div>
  );
};
