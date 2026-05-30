import React, { useState } from 'react';
import { useTransactions } from '../context/TransactionContext';
import { useTransactionFilters } from '../hooks/useTransactions';
import { MainLayout } from '../layouts/MainLayout';
import {
  TransactionCard,
  Button,
  Input,
  Select,
  Modal,
  Loader,
  EmptyState,
  FloatingActionButton,
} from '../components';
import type { Transaction } from '../types';
import { getExpenseCategoriesList, getIncomeCategoriesList } from '../utils/categories';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';

export const TransactionsPage: React.FC = () => {
  const {
    transactions,
    loading,
    addTransaction,
    updateTransaction,
    deleteTransaction,
  } = useTransactions();

  const {
    searchTerm,
    setSearchTerm,
    categoryFilter,
    setCategoryFilter,
    typeFilter,
    setTypeFilter,
    filteredTransactions,
  } = useTransactionFilters(transactions);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    watch,
  } = useForm<Omit<Transaction, 'id' | 'created_at' | 'user_id'>>({
    defaultValues: {
      title: '',
      amount: 0,
      category: '',
      type: 'expense',
      date: new Date().toISOString().split('T')[0],
      notes: '',
    },
  });

  const selectedType = watch('type');
  const categoryOptions =
    selectedType === 'income'
      ? getIncomeCategoriesList().map((c) => ({ value: c, label: c }))
      : getExpenseCategoriesList().map((c) => ({ value: c, label: c }));

  const handleOpenModal = (transaction?: Transaction) => {
    if (transaction) {
      setEditingTransaction(transaction);
      reset({
        ...transaction,
      });
    } else {
      setEditingTransaction(null);
      reset();
    }
    setIsModalOpen(true);
    setSubmitError(null);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingTransaction(null);
    reset();
    setSubmitError(null);
  };

  const onSubmit = async (data: Omit<Transaction, 'id' | 'created_at' | 'user_id'>) => {
    try {
      setIsSubmitting(true);
      setSubmitError(null);

      if (editingTransaction) {
        await updateTransaction(editingTransaction.id, data);
      } else {
        await addTransaction(data);
      }

      handleCloseModal();
    } catch (err: any) {
      setSubmitError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      try {
        await deleteTransaction(id);
      } catch (err: any) {
        setSubmitError(err.message);
      }
    }
  };

  return (
    <MainLayout title="Transactions">
      {loading ? (
        <Loader />
      ) : (
        <div className="space-y-6">
          {/* Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-6 rounded-2xl"
          >
            <h3 className="text-lg font-semibold text-light mb-4">Filter Transactions</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Input
                placeholder="Search transactions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                type="text"
              />
              <Select
                options={[
                  { value: '', label: 'All Types' },
                  { value: 'income', label: 'Income' },
                  { value: 'expense', label: 'Expense' },
                ]}
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value as 'income' | 'expense' | '')}
              />
              <Select
                options={[
                  { value: '', label: 'All Categories' },
                  ...getExpenseCategoriesList().map((c) => ({ value: c, label: c })),
                  ...getIncomeCategoriesList().map((c) => ({ value: c, label: c })),
                ]}
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
              />
              <Button
                variant="secondary"
                onClick={() => {
                  setSearchTerm('');
                  setCategoryFilter('');
                  setTypeFilter('');
                }}
              >
                Clear Filters
              </Button>
            </div>
          </motion.div>

          {/* Transactions List */}
          {filteredTransactions.length > 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-3"
            >
              {filteredTransactions.map((transaction) => (
                <TransactionCard
                  key={transaction.id}
                  transaction={transaction}
                  onEdit={handleOpenModal}
                  onDelete={handleDelete}
                />
              ))}
            </motion.div>
          ) : (
            <EmptyState
              icon="🔍"
              title="No transactions found"
              description="Adjust your filters or create a new transaction to get started"
            />
          )}

          {/* Modal */}
          <Modal
            isOpen={isModalOpen}
            onClose={handleCloseModal}
            title={editingTransaction ? 'Edit Transaction' : 'Add New Transaction'}
          >
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {submitError && (
                <div className="bg-red-900 bg-opacity-30 border border-red-500 border-opacity-50 p-4 rounded-lg text-red-400 text-sm">
                  {submitError}
                </div>
              )}

              <Input
                label="Title"
                placeholder="Transaction description"
                {...register('title', { required: 'Title is required' })}
                error={errors.title?.message}
              />

              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Amount"
                  type="number"
                  placeholder="0.00"
                  step="0.01"
                  {...register('amount', { required: 'Amount is required' })}
                  error={errors.amount?.message}
                />
                <Input
                  label="Date"
                  type="date"
                  {...register('date', { required: 'Date is required' })}
                  error={errors.date?.message}
                />
              </div>

              <Select
                label="Type"
                options={[
                  { value: 'expense', label: 'Expense' },
                  { value: 'income', label: 'Income' },
                ]}
                {...register('type', { required: 'Type is required' })}
                error={errors.type?.message}
              />

              <Select
                label="Category"
                options={categoryOptions}
                {...register('category', { required: 'Category is required' })}
                error={errors.category?.message}
              />

              <Input
                label="Notes"
                placeholder="Optional notes..."
                {...register('notes')}
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
                  {editingTransaction ? 'Update' : 'Add'} Transaction
                </Button>
              </div>
            </form>
          </Modal>

          {/* FAB */}
          <FloatingActionButton onClick={() => handleOpenModal()} />
        </div>
      )}
    </MainLayout>
  );
};
