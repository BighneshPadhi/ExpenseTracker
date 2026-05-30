import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button, Input } from '../components';
import { motion } from 'framer-motion';

export const LoginPage: React.FC = () => {
  const { signIn, error: authError } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    try {
      setLoading(true);
      await signIn(email, password);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-900 via-primary-800 to-primary-900 flex items-center justify-center p-4">
      {/* Animated background elements */}
      <motion.div
        animate={{ y: [0, -20, 0] }}
        transition={{ duration: 4, repeat: Infinity }}
        className="absolute top-10 right-10 w-72 h-72 bg-accent opacity-10 rounded-full blur-3xl"
      />
      <motion.div
        animate={{ y: [0, 20, 0] }}
        transition={{ duration: 4, repeat: Infinity, delay: 1 }}
        className="absolute bottom-10 left-10 w-72 h-72 bg-secondary opacity-10 rounded-full blur-3xl"
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md glass-card p-8 rounded-2xl relative z-10"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gradient mb-2">ExpenseTracker</h1>
          <p className="text-gray-400">Manage your finances smartly</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {(error || authError) && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-red-900 bg-opacity-30 border border-red-500 border-opacity-50 p-4 rounded-lg text-red-400 text-sm"
            >
              {error || authError}
            </motion.div>
          )}

          <Input
            label="Email Address"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
          />

          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
          />

          <Button
            type="submit"
            variant="primary"
            size="lg"
            isLoading={loading}
            className="w-full"
          >
            Sign In
          </Button>
        </form>

        {/* Divider */}
        <div className="my-6 flex items-center gap-4">
          <div className="flex-1 h-px bg-primary-700 bg-opacity-50" />
          <span className="text-gray-400 text-sm">or</span>
          <div className="flex-1 h-px bg-primary-700 bg-opacity-50" />
        </div>

        {/* Social Login */}
        <Button
          type="button"
          variant="secondary"
          size="lg"
          className="w-full mb-4"
          disabled={loading}
        >
          🔗 Continue with Google
        </Button>

        {/* Footer */}
        <p className="text-center text-gray-400 text-sm">
          Don't have an account?{' '}
          <Link to="/signup" className="text-accent hover:text-light transition-colors font-semibold">
            Sign Up
          </Link>
        </p>

        <p className="text-center text-gray-500 text-xs mt-4">
          <Link to="#" className="hover:text-accent transition-colors">
            Forgot password?
          </Link>
        </p>
      </motion.div>
    </div>
  );
};
