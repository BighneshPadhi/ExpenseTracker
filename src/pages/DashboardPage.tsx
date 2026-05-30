import React from 'react';
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  PiggyBank,
  ArrowRight,
} from 'lucide-react';
import { useTransactions } from '../context/TransactionContext';
import { useAuth } from '../context/AuthContext';
import { MainLayout } from '../layouts/MainLayout';
import {
  DashboardCard,
  TransactionCard,
  Loader,
  EmptyState,
} from '../components';
import {
  calculateTotalByType,
  formatCurrency,
  getLatestTransactions,
} from '../utils/helpers';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const chartColors = ['#FF6B6B', '#FFD93D', '#6BCB77', '#4D96FF', '#A78BFA', '#34D399', '#F59E0B', '#EC4899'];

export const DashboardPage: React.FC = () => {
  const { transactions, loading, currency } = useTransactions();
  const { user } = useAuth();

  const totalIncome = calculateTotalByType(transactions, 'income');
  const totalExpense = calculateTotalByType(transactions, 'expense');
  const balance = totalIncome - totalExpense;
  const recentTransactions = getLatestTransactions(transactions, 5);

  // Prepare category data for pie chart
  const categoryData = React.useMemo(() => {
    const expensesByCategory: Record<string, number> = {};
    
    transactions
      .filter((t) => t.type === 'expense')
      .forEach((t) => {
        expensesByCategory[t.category] = (expensesByCategory[t.category] || 0) + t.amount;
      });

    return Object.entries(expensesByCategory).map(([category, amount]) => ({
      name: category,
      value: amount,
    }));
  }, [transactions]);

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
    <MainLayout title="Dashboard">
      {loading ? (
        <Loader />
      ) : (
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="space-y-8"
        >
          {/* Welcome Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-8 rounded-2xl bg-gradient-to-r from-accent/20 to-light/20"
          >
            <h2 className="text-2xl font-bold text-light mb-2">
              Welcome back, {user?.name || 'User'}! 👋
            </h2>
            <p className="text-gray-400">
              Here's your financial overview for this month
            </p>
          </motion.div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <DashboardCard
              title="Total Balance"
              value={formatCurrency(balance, currency)}
              icon={DollarSign}
              color={balance >= 0 ? 'green' : 'blue'}
              trend={{ direction: 'up', percentage: 12 }}
            />
            <DashboardCard
              title="Total Income"
              value={formatCurrency(totalIncome, currency)}
              icon={TrendingUp}
              color="green"
              trend={{ direction: 'up', percentage: 8 }}
            />
            <DashboardCard
              title="Total Expense"
              value={formatCurrency(totalExpense, currency)}
              icon={TrendingDown}
              color="blue"
              trend={{ direction: 'down', percentage: 5 }}
            />
            <DashboardCard
              title="Savings"
              value={formatCurrency(Math.max(0, balance * 0.3), currency)}
              icon={PiggyBank}
              color="purple"
              trend={{ direction: 'up', percentage: 15 }}
            />
          </div>

          {/* Charts and Transactions */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Expense Categories Pie Chart */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="lg:col-span-1 glass-card p-6 rounded-2xl"
            >
              <h3 className="text-xl font-bold text-light mb-6">Expense Categories</h3>
              {categoryData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={(_entry) => `${_entry.name}: ${(_entry.value / totalExpense * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {categoryData.map((_entry, index) => (
                        <Cell key={`cell-${index}`} fill={chartColors[index % chartColors.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => formatCurrency(value as number, currency)} />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-64 flex items-center justify-center text-gray-400">
                  No expense data yet
                </div>
              )}
            </motion.div>

            {/* Recent Transactions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="lg:col-span-2"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-light">Recent Transactions</h3>
                <Link
                  to="/transactions"
                  className="text-accent hover:text-light flex items-center gap-1 transition-colors"
                >
                  View All <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              {recentTransactions.length > 0 ? (
                <div className="space-y-3">
                  {recentTransactions.map((transaction) => (
                    <TransactionCard
                      key={transaction.id}
                      transaction={transaction}
                      showActions={false}
                    />
                  ))}
                </div>
              ) : (
                <EmptyState
                  icon="💸"
                  title="No transactions yet"
                  description="Start tracking your expenses to see them here"
                  action={{
                    label: 'Add Transaction',
                    onClick: () => {}, // Will be handled by FAB on transactions page
                  }}
                />
              )}
            </motion.div>
          </div>

          {/* Quick Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-6 rounded-2xl"
          >
            <h3 className="text-xl font-bold text-light mb-6">Monthly Summary</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 bg-primary-700 bg-opacity-50 rounded-lg">
                <p className="text-gray-400 text-sm">Average Daily Expense</p>
                <p className="text-xl font-bold text-accent mt-2">
                  {formatCurrency(totalExpense / 30, currency)}
                </p>
              </div>
              <div className="p-4 bg-primary-700 bg-opacity-50 rounded-lg">
                <p className="text-gray-400 text-sm">Highest Expense</p>
                <p className="text-xl font-bold text-light mt-2">
                  {formatCurrency(
                    Math.max(...transactions.filter((t) => t.type === 'expense').map((t) => t.amount), 0),
                    currency
                  )}
                </p>
              </div>
              <div className="p-4 bg-primary-700 bg-opacity-50 rounded-lg">
                <p className="text-gray-400 text-sm">Transactions</p>
                <p className="text-xl font-bold text-light mt-2">{transactions.length}</p>
              </div>
              <div className="p-4 bg-primary-700 bg-opacity-50 rounded-lg">
                <p className="text-gray-400 text-sm">Savings Rate</p>
                <p className="text-xl font-bold text-green-400 mt-2">
                  {totalIncome > 0 ? ((balance / totalIncome) * 100).toFixed(1) : 0}%
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </MainLayout>
  );
};
