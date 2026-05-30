import React, { useMemo } from 'react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { useTransactions } from '../context/TransactionContext';
import { MainLayout } from '../layouts/MainLayout';
import { ChartCard, Loader } from '../components';
import { formatCurrency, formatMonth } from '../utils/helpers';
import { motion } from 'framer-motion';

const chartColors = ['#FF6B6B', '#FFD93D', '#6BCB77', '#4D96FF', '#A78BFA'];

export const AnalyticsPage: React.FC = () => {
  const { transactions, loading, currency } = useTransactions();

  // Monthly data for bar and line charts
  const monthlyData = useMemo(() => {
    const data: Record<string, { month: string; income: number; expense: number }> = {};

    transactions.forEach((transaction) => {
      const month = formatMonth(transaction.date);
      if (!data[month]) {
        data[month] = { month, income: 0, expense: 0 };
      }
      if (transaction.type === 'income') {
        data[month].income += transaction.amount;
      } else {
        data[month].expense += transaction.amount;
      }
    });

    return Object.values(data).sort(
      (a, b) => new Date(a.month).getTime() - new Date(b.month).getTime()
    );
  }, [transactions]);

  // Category breakdown
  const categoryData = useMemo(() => {
    const data: Record<string, number> = {};

    transactions
      .filter((t) => t.type === 'expense')
      .forEach((transaction) => {
        data[transaction.category] = (data[transaction.category] || 0) + transaction.amount;
      });

    return Object.entries(data)
      .map(([category, amount]) => ({
        name: category,
        value: amount,
      }))
      .sort((a, b) => b.value - a.value);
  }, [transactions]);

  // Income vs Expense comparison
  const comparisonData = useMemo(() => {
    const data: Record<string, { month: string; income: number; expense: number }> = {};

    transactions.forEach((transaction) => {
      const month = new Date(transaction.date).toLocaleDateString('en-US', {
        month: 'short',
        year: '2-digit',
      });
      if (!data[month]) {
        data[month] = { month, income: 0, expense: 0 };
      }
      if (transaction.type === 'income') {
        data[month].income += transaction.amount;
      } else {
        data[month].expense += transaction.amount;
      }
    });

    return Object.values(data).slice(-12); // Last 12 months
  }, [transactions]);

  // Top categories
  const topCategories = useMemo(() => {
    return categoryData.slice(0, 5);
  }, [categoryData]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  return (
    <MainLayout title="Analytics">
      {loading ? (
        <Loader />
      ) : (
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="space-y-8"
        >
          {/* Monthly Overview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <ChartCard
              title="Monthly Income vs Expense"
              description="Track your income and expenses over time"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyData} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis dataKey="month" stroke="#999" />
                  <YAxis stroke="#999" />
                  <Tooltip
                    formatter={(value) => formatCurrency(value as number, currency)}
                    contentStyle={{
                      backgroundColor: '#1a2630',
                      border: '1px solid #387478',
                      borderRadius: '8px',
                    }}
                  />
                  <Legend />
                  <Bar dataKey="income" fill="#34D399" name="Income" radius={[8, 8, 0, 0]} />
                  <Bar dataKey="expense" fill="#FF6B6B" name="Expense" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Spending Trend */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <ChartCard
                title="Spending Trend"
                description="Your expense pattern over the last 12 months"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={comparisonData} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                    <XAxis dataKey="month" stroke="#999" />
                    <YAxis stroke="#999" />
                    <Tooltip
                      formatter={(value) => formatCurrency(value as number)}
                      contentStyle={{
                        backgroundColor: '#1a2630',
                        border: '1px solid #387478',
                        borderRadius: '8px',
                      }}
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="expense"
                      stroke="#FF6B6B"
                      strokeWidth={2}
                      dot={false}
                      name="Expense"
                    />
                    <Line
                      type="monotone"
                      dataKey="income"
                      stroke="#34D399"
                      strokeWidth={2}
                      dot={false}
                      name="Income"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </ChartCard>
            </motion.div>

            {/* Category Breakdown */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <ChartCard
                title="Top 5 Expense Categories"
                description="Where your money goes"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={topCategories}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={(entry) =>
                        `${entry.name}: ${((entry.value / categoryData.reduce((sum, c) => sum + c.value, 0)) * 100).toFixed(0)}%`
                      }
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {topCategories.map((_entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={chartColors[index % chartColors.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value) => formatCurrency(value as number, currency)}
                      contentStyle={{
                        backgroundColor: '#1a2630',
                        border: '1px solid #387478',
                        borderRadius: '8px',
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </ChartCard>
            </motion.div>
          </div>

          {/* Category List */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-6 rounded-2xl"
          >
            <h3 className="text-xl font-bold text-light mb-6">All Expense Categories</h3>
            <div className="space-y-3">
              {categoryData.map((category, index) => {
                const total = categoryData.reduce((sum, c) => sum + c.value, 0);
                const percentage = (category.value / total) * 100;

                return (
                  <div key={category.name} className="flex items-center gap-4">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: chartColors[index % chartColors.length] }} />
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-light font-medium">{category.name}</span>
                        <span className="text-gray-400 text-sm">{formatCurrency(category.value, currency)}</span>
                      </div>
                      <div className="w-full bg-primary-700 bg-opacity-50 rounded-full h-1">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${percentage}%` }}
                          transition={{ duration: 0.6 }}
                          className="h-full rounded-full"
                          style={{ backgroundColor: chartColors[index % chartColors.length] }}
                        />
                      </div>
                    </div>
                    <span className="text-gray-400 text-sm">{percentage.toFixed(1)}%</span>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </motion.div>
      )}
    </MainLayout>
  );
};
