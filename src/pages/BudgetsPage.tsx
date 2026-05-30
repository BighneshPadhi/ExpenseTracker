import React, { useState } from 'react';
import { useTransactions } from '../context/TransactionContext';
import { MainLayout } from '../layouts/MainLayout';
import {
  BudgetProgress,
  Button,
  Select,
  Input,
  Modal,
  Loader,
  EmptyState,
  FloatingActionButton,
} from '../components';
import type { Budget } from '../types';
import { getExpenseCategoriesList } from '../utils/categories';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';

export const BudgetsPage: React.FC = () => {
  const { budgets, transactions, loading, addBudget, deleteBudget } = useTransactions();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<
    Omit<Budget, 'id' | 'created_at' | 'user_id'>
  >({
    defaultValues: {
      category: '',
      limit_amount: 0,
    },
  });

  const handleOpenModal = () => {
    setIsModalOpen(true);
    reset();
    setSubmitError(null);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    reset();
    setSubmitError(null);
  };

  const onSubmit = async (data: Omit<Budget, 'id' | 'created_at' | 'user_id'>) => {
    try {
      setIsSubmitting(true);
      setSubmitError(null);
      await addBudget(data);
      handleCloseModal();
    } catch (err: any) {
      setSubmitError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this budget?')) {
      try {
        await deleteBudget(id);
      } catch (err: any) {
        setSubmitError(err.message);
      }
    }
  };

  // Get categories that don't already have budgets
  const availableCategories = getExpenseCategoriesList().filter(
    (cat) => !budgets.some((b) => b.category === cat)
  );

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
    <MainLayout title="Budgets">
      {loading ? (
        <Loader />
      ) : (
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="space-y-6"
        >
          {/* Budget Summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-6 rounded-2xl"
          >
            <h3 className="text-lg font-semibold text-light mb-4">Budget Overview</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 bg-primary-700 bg-opacity-50 rounded-lg">
                <p className="text-gray-400 text-sm">Active Budgets</p>
                <p className="text-2xl font-bold text-accent mt-2">{budgets.length}</p>
              </div>
              <div className="p-4 bg-primary-700 bg-opacity-50 rounded-lg">
                <p className="text-gray-400 text-sm">On Track</p>
                <p className="text-2xl font-bold text-green-400 mt-2">
                  {budgets.filter((b) => {
                    const spent = transactions
                      .filter((t) => t.type === 'expense' && t.category === b.category)
                      .reduce((sum, t) => sum + t.amount, 0);
                    return spent <= b.limit_amount;
                  }).length}
                </p>
              </div>
              <div className="p-4 bg-primary-700 bg-opacity-50 rounded-lg">
                <p className="text-gray-400 text-sm">Over Budget</p>
                <p className="text-2xl font-bold text-red-400 mt-2">
                  {budgets.filter((b) => {
                    const spent = transactions
                      .filter((t) => t.type === 'expense' && t.category === b.category)
                      .reduce((sum, t) => sum + t.amount, 0);
                    return spent > b.limit_amount;
                  }).length}
                </p>
              </div>
              <div className="p-4 bg-primary-700 bg-opacity-50 rounded-lg">
                <p className="text-gray-400 text-sm">Available Categories</p>
                <p className="text-2xl font-bold text-light mt-2">{availableCategories.length}</p>
              </div>
            </div>
          </motion.div>

          {/* Budgets List */}
          {budgets.length > 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-4"
            >
              {budgets.map((budget) => (
                <BudgetProgress
                  key={budget.id}
                  budget={budget}
                  transactions={transactions}
                  onDelete={handleDelete}
                />
              ))}
            </motion.div>
          ) : (
            <EmptyState
              icon="💰"
              title="No budgets yet"
              description="Create your first budget to track your spending"
              action={{
                label: 'Add Budget',
                onClick: handleOpenModal,
              }}
            />
          )}

          {/* Modal */}
          <Modal
            isOpen={isModalOpen}
            onClose={handleCloseModal}
            title="Create New Budget"
          >
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {submitError && (
                <div className="bg-red-900 bg-opacity-30 border border-red-500 border-opacity-50 p-4 rounded-lg text-red-400 text-sm">
                  {submitError}
                </div>
              )}

              <Select
                label="Category"
                options={availableCategories.map((c) => ({
                  value: c,
                  label: c,
                }))}
                {...register('category', { required: 'Category is required' })}
                error={errors.category?.message}
              />

              <Input
                label="Monthly Budget Limit"
                type="number"
                placeholder="0.00"
                step="0.01"
                min="0"
                {...register('limit_amount', { required: 'Budget limit is required' })}
                error={errors.limit_amount?.message}
              />

              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={handleCloseModal}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  isLoading={isSubmitting}
                >
                  Create Budget
                </Button>
              </div>
            </form>
          </Modal>

          {/* FAB */}
          {budgets.length < 8 && <FloatingActionButton onClick={handleOpenModal} />}
        </motion.div>
      )}
    </MainLayout>
  );
};
