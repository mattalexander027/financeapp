import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Dashboard from '../modules/Dashboard';
import ProfitLoss from '../modules/ProfitLoss';
import CashFlow from '../modules/CashFlow';
import InvoiceList from '../modules/Invoicing/InvoiceList';
import InvoiceEditor from '../modules/Invoicing/InvoiceEditor';
import ClientInvoice from '../modules/Invoicing/ClientInvoice';
import AccountList from '../modules/Banking/AccountList';
import AccountDetail from '../modules/Banking/AccountDetail';
import ExpenseList from '../modules/Expenses/ExpenseList';
import VendorList from '../modules/Expenses/VendorList';
import ReportsHub from '../modules/Reports/ReportsHub';
import BalanceSheet from '../modules/Reports/BalanceSheet';
import AgedReceivables from '../modules/Reports/AgedReceivables';
import PageTransition from './PageTransition';

const AnimatedRoutes = () => {
    const location = useLocation();

    return (
        <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
                <Route path="/" element={<PageTransition><Dashboard /></PageTransition>} />
                <Route path="/banking" element={<PageTransition><AccountList /></PageTransition>} />
                <Route path="/banking/:id" element={<PageTransition><AccountDetail /></PageTransition>} />
                <Route path="/invoicing" element={<PageTransition><InvoiceList /></PageTransition>} />
                <Route path="/invoicing/new" element={<PageTransition><InvoiceEditor /></PageTransition>} />
                <Route path="/pay/:id" element={<PageTransition><ClientInvoice /></PageTransition>} />
                <Route path="/expenses" element={<PageTransition><ExpenseList /></PageTransition>} />
                <Route path="/vendors" element={<PageTransition><VendorList /></PageTransition>} />
                <Route path="/reports" element={<PageTransition><ReportsHub /></PageTransition>} />
                <Route path="/reports/balance-sheet" element={<PageTransition><BalanceSheet /></PageTransition>} />
                <Route path="/reports/aged-receivables" element={<PageTransition><AgedReceivables /></PageTransition>} />
                <Route path="/profit-loss" element={<PageTransition><ProfitLoss /></PageTransition>} />
                <Route path="/cash-flow" element={<PageTransition><CashFlow /></PageTransition>} />
            </Routes>
        </AnimatePresence>
    );
};

export default AnimatedRoutes;
