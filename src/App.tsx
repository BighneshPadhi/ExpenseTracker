import React from 'react';
import { BrowserRouter as Router, useRoutes } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { TransactionProvider } from './context/TransactionContext';
import { routes } from './routes';

const AppRoutes: React.FC = () => {
  return useRoutes(routes);
};

function App() {
  return (
    <AuthProvider>
      <TransactionProvider>
        <Router>
          <AppRoutes />
        </Router>
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: '#243642',
              color: '#E2F1E7',
              border: '1px solid #387478',
            },
          }}
        />
      </TransactionProvider>
    </AuthProvider>
  );
}

export default App;
