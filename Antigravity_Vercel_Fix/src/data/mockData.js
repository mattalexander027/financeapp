export const financialData = {
    summary: {
        revenueYTD: 1250000,
        netProfit: 320000,
        cashOnHand: 85000,
        expensesYTD: 930000,
    },
    monthlyData: [
        { month: 'Jan', revenue: 95000, expenses: 70000, profit: 25000, cashFlow: 12000 },
        { month: 'Feb', revenue: 105000, expenses: 72000, profit: 33000, cashFlow: 15000 },
        { month: 'Mar', revenue: 100000, expenses: 75000, profit: 25000, cashFlow: 8000 },
        { month: 'Apr', revenue: 120000, expenses: 80000, profit: 40000, cashFlow: 18000 },
        { month: 'May', revenue: 125000, expenses: 82000, profit: 43000, cashFlow: 20000 },
        { month: 'Jun', revenue: 140000, expenses: 90000, profit: 50000, cashFlow: 25000 },
        { month: 'Jul', revenue: 135000, expenses: 88000, profit: 47000, cashFlow: 22000 },
        { month: 'Aug', revenue: 150000, expenses: 95000, profit: 55000, cashFlow: 28000 },
        { month: 'Sep', revenue: 145000, expenses: 92000, profit: 53000, cashFlow: 26000 },
        { month: 'Oct', revenue: 160000, expenses: 98000, profit: 62000, cashFlow: 35000 },
        { month: 'Nov', revenue: 170000, expenses: 105000, profit: 65000, cashFlow: 30000 },
        { month: 'Dec', revenue: 180000, expenses: 110000, profit: 70000, cashFlow: 40000 },
    ],
    transactions: [
        { id: 1, date: '2025-12-09', description: 'Client Payment - Acme Corp', amount: 15000, type: 'income' },
        { id: 2, date: '2025-12-08', description: 'Office Rent', amount: -5000, type: 'expense' },
        { id: 3, date: '2025-12-08', description: 'Software Licenses', amount: -1200, type: 'expense' },
        { id: 4, date: '2025-12-07', description: 'Consulting Fees', amount: 8500, type: 'income' },
        { id: 5, date: '2025-12-06', description: 'Server Costs', amount: -450, type: 'expense' },
    ]
};

export const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(value);
};
