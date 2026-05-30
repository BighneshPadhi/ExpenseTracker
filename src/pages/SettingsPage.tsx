import React, { useState } from 'react';
import { User as UserIcon, Moon, DollarSign, Bell } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTransactions } from '../context/TransactionContext';
import { MainLayout } from '../layouts/MainLayout';
import { Button, Input } from '../components';
import { motion } from 'framer-motion';

export const SettingsPage: React.FC = () => {
  const { user } = useAuth();
  const { currency, setCurrency } = useTransactions();
  const [darkMode, setDarkMode] = useState(true);
  const [notifications, setNotifications] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const handleSaveSettings = async () => {
    setIsSaving(true);
    // Simulate saving
    setTimeout(() => {
      setIsSaving(false);
    }, 1000);
  };

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
    <MainLayout title="Settings">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="max-w-2xl space-y-6"
      >
        {/* Profile Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-6 rounded-2xl"
        >
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-full bg-gradient-to-r from-accent to-light flex items-center justify-center">
              <UserIcon className="w-8 h-8 text-primary-900" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-light">{user?.name || 'User'}</h3>
              <p className="text-gray-400">{user?.email}</p>
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-primary-700 border-opacity-20">
            <Input
              label="Full Name"
              value={user?.name || ''}
              disabled
            />
            <Input
              label="Email Address"
              value={user?.email || ''}
              disabled
            />
            <div>
              <label className="block text-sm font-medium text-light mb-2">
                Member Since
              </label>
              <input
                type="text"
                value={new Date(user?.created_at || '').toLocaleDateString()}
                disabled
                className="glass-input opacity-50 cursor-not-allowed"
              />
            </div>
          </div>
        </motion.div>

        {/* Preferences Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-6 rounded-2xl"
        >
          <h3 className="text-lg font-semibold text-light mb-6">Preferences</h3>

          {/* Currency */}
          <div className="space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-primary-700 border-opacity-20">
              <div className="flex items-center gap-3">
                <DollarSign className="w-5 h-5 text-accent" />
                <div>
                  <p className="text-light font-medium">Currency</p>
                  <p className="text-gray-400 text-sm">Choose your preferred currency</p>
                </div>
              </div>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="glass-input w-32"
              >
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
                <option value="INR">INR (₹)</option>
                <option value="JPY">JPY (¥)</option>
              </select>
            </div>

            {/* Dark Mode */}
            <div className="flex items-center justify-between pb-4 border-b border-primary-700 border-opacity-20">
              <div className="flex items-center gap-3">
                <Moon className="w-5 h-5 text-accent" />
                <div>
                  <p className="text-light font-medium">Dark Mode</p>
                  <p className="text-gray-400 text-sm">Currently enabled (always active)</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={darkMode}
                  onChange={(e) => setDarkMode(e.target.checked)}
                  disabled
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-primary-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-accent rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-light after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent" />
              </label>
            </div>

            {/* Notifications */}
            <div className="flex items-center justify-between pb-4 border-b border-primary-700 border-opacity-20">
              <div className="flex items-center gap-3">
                <Bell className="w-5 h-5 text-accent" />
                <div>
                  <p className="text-light font-medium">Notifications</p>
                  <p className="text-gray-400 text-sm">Receive budget alerts and updates</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={notifications}
                  onChange={(e) => setNotifications(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-primary-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-accent rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-light after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent" />
              </label>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-primary-700 border-opacity-20">
            <Button
              variant="primary"
              onClick={handleSaveSettings}
              isLoading={isSaving}
            >
              Save Preferences
            </Button>
          </div>
        </motion.div>

        {/* About Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-6 rounded-2xl"
        >
          <h3 className="text-lg font-semibold text-light mb-4">About</h3>
          <div className="space-y-3 text-gray-400 text-sm">
            <p>
              <strong>ExpenseTracker</strong> is a modern personal finance application designed to help
              you track and manage your expenses with ease.
            </p>
            <p>
              <strong>Version:</strong> 1.0.0
            </p>
            <p>
              <strong>Built with:</strong> React, TypeScript, Tailwind CSS, and Supabase
            </p>
            <p>
              <strong>Privacy:</strong> Your financial data is securely stored and never shared with third
              parties.
            </p>
          </div>
        </motion.div>

        {/* Danger Zone */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-6 rounded-2xl border-red-500 border-opacity-30"
        >
          <h3 className="text-lg font-semibold text-red-400 mb-4">Danger Zone</h3>
          <p className="text-gray-400 text-sm mb-4">
            These actions are irreversible. Please proceed with caution.
          </p>
          <div className="flex gap-3">
            <Button
              variant="secondary"
              className="border border-red-500 border-opacity-30 text-red-400 hover:bg-red-900 hover:bg-opacity-20"
            >
              Delete All Data
            </Button>
            <Button
              variant="secondary"
              className="border border-red-500 border-opacity-30 text-red-400 hover:bg-red-900 hover:bg-opacity-20"
            >
              Delete Account
            </Button>
          </div>
        </motion.div>
      </motion.div>
    </MainLayout>
  );
};
