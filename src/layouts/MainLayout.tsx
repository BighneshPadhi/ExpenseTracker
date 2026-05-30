import React from 'react';
import { Sidebar } from '../components/Sidebar';

interface MainLayoutProps {
  children: React.ReactNode;
  title?: string;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children, title }) => {
  return (
    <div className="flex h-screen bg-primary-900 overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-auto w-full md:w-0">
        {title && (
          <div className="pt-20 md:pt-6 px-6 mb-6">
            <h1 className="text-3xl font-bold text-gradient">{title}</h1>
          </div>
        )}
        <div className="flex-1 px-6 md:px-8 pb-20 md:pb-8 pt-6 md:pt-0">
          {children}
        </div>
      </div>
    </div>
  );
};
