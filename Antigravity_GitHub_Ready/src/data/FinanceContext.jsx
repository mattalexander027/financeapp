import React, { createContext, useContext, useState, useMemo, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { financialData as initialMockData } from './mockData';

const FinanceContext = createContext();

export const useFinance = () => useContext(FinanceContext);

export const FinanceProvider = ({ children }) => {
    // Helper to load from local storage or fallback to default
    const loadState = (key, fallback) => {
        const saved = localStorage.getItem(key);
        return saved ? JSON.parse(saved) : fallback;
    };

    const [invoices, setInvoices] = useState(() => loadState('invoices', []));
    const [expenses, setExpenses] = useState(() => loadState('expenses', []));
    const [vendors, setVendors] = useState(() => loadState('vendors', []));
    const [accounts, setAccounts] = useState(() => loadState('accounts', []));
    const [goals, setGoals] = useState(() => loadState('goals', { revenue: 150000, profit: 60000 }));

    // We'll keep the monthly data for charts, but ideally it should trigger updates from invoices/expenses
    const [monthlyData, setMonthlyData] = useState(initialMockData.monthlyData);

    // Persistence Effects
    useEffect(() => localStorage.setItem('invoices', JSON.stringify(invoices)), [invoices]);
    useEffect(() => localStorage.setItem('expenses', JSON.stringify(expenses)), [expenses]);
    useEffect(() => localStorage.setItem('vendors', JSON.stringify(vendors)), [vendors]);
    useEffect(() => localStorage.setItem('accounts', JSON.stringify(accounts)), [accounts]);
    useEffect(() => localStorage.setItem('goals', JSON.stringify(goals)), [goals]);

    // Update Goals function
    const updateGoals = (newGoals) => {
        setGoals(newGoals);
    };

    // Create some initial dummy transactions if empty AND no local storage was found (first run)
    useMemo(() => {
        if (invoices.length === 0 && !localStorage.getItem('invoices')) {
            setInvoices([
                { id: uuidv4(), client: 'Acme Corp', amount: 15000, date: '2025-12-01', status: 'paid', dueDate: '2025-12-15' },
                { id: uuidv4(), client: 'Globex Inc', amount: 8500, date: '2025-12-05', status: 'pending', dueDate: '2025-12-20' },
                { id: uuidv4(), client: 'Soylent Corp', amount: 12000, date: '2025-11-15', status: 'overdue', dueDate: '2025-11-30' },
            ]);
        }
        if (expenses.length === 0 && !localStorage.getItem('expenses')) {
            setExpenses([
                { id: uuidv4(), vendor: 'Office Supply Co', amount: 450, date: '2025-12-02', category: 'Office', status: 'paid' },
                { id: uuidv4(), vendor: 'AWS', amount: 1200, date: '2025-12-01', category: 'Software', status: 'paid' },
                { id: uuidv4(), vendor: 'Landlord Inc', amount: 5000, date: '2025-12-01', category: 'Rent', status: 'paid' },
            ]);
        }
        if (vendors.length === 0 && !localStorage.getItem('vendors')) {
            setVendors([
                { id: uuidv4(), name: 'Office Supply Co', email: 'sales@officesupply.com', phone: '555-0101', category: 'Supplies' },
                { id: uuidv4(), name: 'AWS', email: 'billing@aws.com', phone: '', category: 'Software' },
                { id: uuidv4(), name: 'Landlord Inc', email: 'rent@landlord.com', phone: '555-9999', category: 'Real Estate' },
            ]);
        }
        if (accounts.length === 0 && !localStorage.getItem('accounts')) {
            setAccounts([
                { id: uuidv4(), name: 'Chase Business Complete', institution: 'Chase', type: 'Checking', balance: 12500.00, lastUpdated: new Date().toISOString() },
                { id: uuidv4(), name: 'Amex Business Gold', institution: 'American Express', type: 'Credit Card', balance: -1250.00, lastUpdated: new Date().toISOString() },
            ]);
        }
    }, []);

    const addInvoice = (invoice) => {
        setInvoices(prev => [{ ...invoice, id: uuidv4(), status: 'pending' }, ...prev]);
        // Simplistic Logic: Update current month revenue in monthlyData (assuming current month is Dec)
        updateMonthlyData(invoice.amount, 0);
    };

    const addExpense = (expense) => {
        setExpenses(prev => [{ ...expense, id: uuidv4(), status: 'paid' }, ...prev]);
        // Simplistic Logic: Update current month expense
        updateMonthlyData(0, expense.amount);
    };

    const addVendor = (vendor) => {
        setVendors(prev => [{ ...vendor, id: uuidv4() }, ...prev]);
    };

    const addAccount = (account) => {
        setAccounts(prev => [{ ...account, id: uuidv4(), lastUpdated: new Date().toISOString() }, ...prev]);
    };

    // ... monthly data update ...

    const updateMonthlyData = (revenueAdd, expenseAdd) => {
        setMonthlyData(prev => {
            const newData = [...prev];
            const monthIndex = newData.findIndex(d => d.month === 'Dec'); // Hardcoded for demo
            if (monthIndex !== -1) {
                const item = { ...newData[monthIndex] };
                item.revenue += parseFloat(revenueAdd);
                item.expenses += parseFloat(expenseAdd);
                item.profit = item.revenue - item.expenses;
                item.cashFlow = item.profit; // Simplified
                newData[monthIndex] = item;
            }
            return newData;
        });
    };

    // Derived Summary
    const summary = useMemo(() => {
        const totalRevenue = monthlyData.reduce((acc, curr) => acc + curr.revenue, 0);
        const totalExpenses = monthlyData.reduce((acc, curr) => acc + curr.expenses, 0);
        const netProfit = totalRevenue - totalExpenses;

        // Dynamic Cash Calculation from Accounts (Checking/Savings)
        const cashAccounts = accounts.filter(a => a.type === 'Checking' || a.type === 'Savings');
        const totalCash = cashAccounts.reduce((acc, curr) => acc + curr.balance, 0);

        return {
            revenueYTD: totalRevenue,
            expensesYTD: totalExpenses,
            netProfit: netProfit,
            cashOnHand: totalCash > 0 ? totalCash : 85000 + (netProfit - 320000), // Fallback if no accounts or negative
        };
    }, [monthlyData, accounts]);

    const value = {
        invoices,
        expenses,
        vendors,
        accounts,
        monthlyData,
        summary,
        addInvoice,
        addExpense,
        addVendor,
        addAccount,
        goals,
        updateGoals
    };

    return (
        <FinanceContext.Provider value={value}>
            {children}
        </FinanceContext.Provider>
    );
};
