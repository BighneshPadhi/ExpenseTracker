import React, { useState, useMemo } from 'react';
import { useTransactions } from '../context/TransactionContext';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export const CalendarPage: React.FC = () => {
  const { transactions } = useTransactions();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState<number | null>(null);

  const monthTransactions = useMemo(() => {
    const month = currentDate.getMonth();
    const year = currentDate.getFullYear();

    return transactions.reduce(
      (acc, transaction) => {
        const transDate = new Date(transaction.date);
        if (transDate.getMonth() === month && transDate.getFullYear() === year) {
          const day = transDate.getDate();
          if (!acc[day]) acc[day] = [];
          acc[day].push(transaction);
        }
        return acc;
      },
      {} as Record<number, typeof transactions>
    );
  }, [transactions, currentDate]);

  const daysInMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0
  ).getDate();

  const firstDayOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1
  ).getDay();

  const previousMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1)
    );
  };

  const nextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1)
    );
  };

  const monthName = currentDate.toLocaleString('default', {
    month: 'long',
    year: 'numeric',
  });

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const getDayTotal = (day: number, type: 'income' | 'expense') => {
    const dayTxns = monthTransactions[day] || [];
    return dayTxns
      .filter((t) => t.type === type)
      .reduce((sum, t) => sum + parseFloat(t.amount.toString()), 0);
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white mb-2">Calendar View</h1>
        <p className="text-gray-400">See all your transactions by date</p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card rounded-2xl p-6"
      >
        {/* Month Navigation */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={previousMonth}
            className="p-2 hover:bg-secondary/30 rounded-lg transition-colors"
          >
            <ChevronLeft className="w-6 h-6 text-accent" />
          </button>

          <h2 className="text-3xl font-bold text-white text-center flex-1">
            {monthName}
          </h2>

          <button
            onClick={nextMonth}
            className="p-2 hover:bg-secondary/30 rounded-lg transition-colors"
          >
            <ChevronRight className="w-6 h-6 text-accent" />
          </button>
        </div>

        {/* Day Names */}
        <div className="grid grid-cols-7 gap-2 mb-2">
          {dayNames.map((day) => (
            <div
              key={day}
              className="text-center font-semibold text-gray-400 py-3"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Days */}
        <div className="grid grid-cols-7 gap-2">
          {/* Empty cells for days before month starts */}
          {Array.from({ length: firstDayOfMonth }).map((_, i) => (
            <div
              key={`empty-${i}`}
              className="aspect-square rounded-lg bg-primary-800/20"
            />
          ))}

          {/* Day cells */}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1;
            const dayTransactions = monthTransactions[day] || [];
            const income = getDayTotal(day, 'income');
            const expense = getDayTotal(day, 'expense');
            const hasTransactions = dayTransactions.length > 0;
            const isSelected = selectedDay === day;

            return (
              <motion.div
                key={day}
                whileHover={hasTransactions ? { scale: 1.05 } : {}}
                onClick={() => setSelectedDay(isSelected ? null : day)}
                className={`aspect-square rounded-lg p-2 flex flex-col items-center justify-center cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-gradient-to-br from-accent to-secondary border-2 border-accent ring-2 ring-accent/50'
                    : hasTransactions
                    ? 'bg-gradient-to-br from-secondary/40 to-accent/20 border-2 border-accent/50 hover:border-accent'
                    : 'bg-primary-800/20 border border-gray-700 hover:border-gray-600'
                }`}
                title={`${dayTransactions.length} transaction${dayTransactions.length !== 1 ? 's' : ''}`}
              >
                <div className="text-center w-full">
                  <div className="text-lg font-bold text-white">{day}</div>

                  {hasTransactions && (
                    <>
                      {income > 0 && (
                        <div className="text-xs text-green-400 font-semibold">
                          +{income.toFixed(0)}
                        </div>
                      )}
                      {expense > 0 && (
                        <div className="text-xs text-red-400 font-semibold">
                          -{expense.toFixed(0)}
                        </div>
                      )}
                      <div className="text-xs text-gray-400 mt-1">
                        {dayTransactions.length} txn
                      </div>
                    </>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Day Details Modal */}
      <div className="mt-12">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-white">
            {selectedDay
              ? `Transactions for ${new Date(
                  currentDate.getFullYear(),
                  currentDate.getMonth(),
                  selectedDay
                ).toLocaleDateString('default', {
                  weekday: 'long',
                  month: 'long',
                  day: 'numeric',
                })}`
              : 'Transactions by Date'}
          </h3>
          {selectedDay && (
            <button
              onClick={() => setSelectedDay(null)}
              className="px-4 py-2 bg-accent/20 border border-accent text-accent rounded-lg hover:bg-accent/30 transition-colors"
            >
              View All
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries(monthTransactions)
            .filter(([day]) => !selectedDay || parseInt(day) === selectedDay)
            .sort(([dayA], [dayB]) => parseInt(dayA) - parseInt(dayB))
            .map(([day, dayTxns]) => (
              <motion.div
                key={day}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card rounded-xl p-4"
              >
                <div className="border-b border-gray-700 pb-3 mb-3">
                  <h4 className="text-lg font-bold text-white">
                    {new Date(
                      currentDate.getFullYear(),
                      currentDate.getMonth(),
                      parseInt(day)
                    ).toLocaleDateString('default', {
                      weekday: 'short',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </h4>
                </div>

                <div className="space-y-2">
                  {dayTxns.map((txn) => (
                    <div
                      key={txn.id}
                      className="flex items-center justify-between text-sm"
                    >
                      <div className="flex-1">
                        <p className="text-gray-300 font-medium">{txn.title}</p>
                        <p className="text-xs text-gray-500">
                          {txn.category}
                        </p>
                      </div>
                      <p
                        className={`font-bold ${
                          txn.type === 'income'
                            ? 'text-green-400'
                            : 'text-red-400'
                        }`}
                      >
                        {txn.type === 'income' ? '+' : '-'}
                        {txn.amount}
                      </p>
                    </div>
                  ))}
                </div>

                {dayTxns.length > 0 && (
                  <div className="border-t border-gray-700 mt-3 pt-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Daily Total:</span>
                      <span
                        className={`font-bold ${
                          getDayTotal(parseInt(day), 'income') >
                          getDayTotal(parseInt(day), 'expense')
                            ? 'text-green-400'
                            : 'text-red-400'
                        }`}
                      >
                        {(
                          getDayTotal(parseInt(day), 'income') -
                          getDayTotal(parseInt(day), 'expense')
                        ).toFixed(2)}
                      </span>
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
        </div>

        {Object.entries(monthTransactions).filter(([day]) => !selectedDay || parseInt(day) === selectedDay).length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <p className="text-gray-400">
              {selectedDay
                ? `No transactions on this date`
                : 'No transactions this month'}
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
};
