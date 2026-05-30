import React from 'react';
import { Plus } from 'lucide-react';
import { motion } from 'framer-motion';

interface FloatingActionButtonProps {
  onClick: () => void;
  icon?: React.ReactNode;
  label?: string;
}

export const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({
  onClick,
  icon = <Plus className="w-6 h-6" />,
  label = 'Add',
}) => {
  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className="fixed bottom-20 right-6 md:bottom-8 md:right-8 w-16 h-16 rounded-full bg-gradient-to-r from-accent to-light text-primary-900 shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center justify-center font-semibold gap-2 z-50"
      title={label}
    >
      {icon}
    </motion.button>
  );
};
