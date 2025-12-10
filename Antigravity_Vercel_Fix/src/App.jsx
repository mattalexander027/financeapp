import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import Layout from './components/Layout';
import AnimatedRoutes from './components/AnimatedRoutes';
import { FinanceProvider } from './data/FinanceContext';

function App() {
  return (
    <Router>
      <FinanceProvider>
        <Layout>
          <AnimatedRoutes />
        </Layout>
      </FinanceProvider>
    </Router>
  );
}

export default App;
