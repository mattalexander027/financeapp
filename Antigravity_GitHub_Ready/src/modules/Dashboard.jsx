import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ArrowUpRight, ArrowDownRight, DollarSign, Wallet, CreditCard, TrendingUp } from 'lucide-react';
import Card from '../components/Card';
import InsightsWidget from '../components/InsightsWidget';
import GoalsWidget from '../components/GoalsWidget';
import { useFinance } from '../data/FinanceContext';
import './Dashboard.css';

const StatCard = ({ title, value, icon: Icon, trend, trendValue, colorClass }) => {
    // Check if value is a number before formatting, otherwise render as is
    const formattedValue = typeof value === 'number'
        ? new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(value)
        : value;

    return (
        <Card className="stat-card">
            <div className="flex justify-between items-start mb-2">
                <div className={`icon-wrapper ${colorClass}`}>
                    <Icon size={24} />
                </div>
                {trend && (
                    <div className={`trend-badge ${trend === 'up' ? 'trend-up' : trend === 'down' ? 'trend-down' : 'bg-primary-subtle text-primary'}`}>
                        {trend === 'up' ? <ArrowUpRight size={16} /> : trend === 'down' ? <ArrowDownRight size={16} /> : null}
                        <span>{trendValue}</span>
                    </div>
                )}
            </div>
            <h3 className="stat-title">{title}</h3>
            <p className="stat-value">{formattedValue}</p>
        </Card>
    );
};

const Dashboard = () => {
    // Use Context hook
    const { summary, monthlyData, invoices } = useFinance();

    // Helper for formatting in chart tooltip and list
    const formatVal = (val) => new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(val);

    // Create transactions from recent invoices for demo
    const transactions = invoices.slice(0, 5).map(inv => ({
        id: inv.id,
        description: inv.client,
        amount: inv.amount,
        date: inv.date,
        type: 'income'
    }));

    return (
        <div className="dashboard-container">
            <div className="dashboard-header mb-4">
                <h1 className="text-2xl">Financial Overview</h1>
                <p className="text-secondary text-sm">Welcome back, here's what's happening with your finances today.</p>
            </div>

            {/* Summary Stats */}
            <div className="stats-grid">
                <StatCard
                    title="Total Revenue YTD"
                    value={summary.revenueYTD}
                    icon={DollarSign}
                    trend="up"
                    trendValue="12.5%"
                    colorClass="icon-accent"
                />
                <StatCard
                    title="Net Profit"
                    value={summary.netProfit}
                    icon={TrendingUp}
                    trend="up"
                    trendValue="8.2%"
                    colorClass="icon-success"
                />
                <StatCard
                    title="Cash on Hand"
                    value={summary.cashOnHand}
                    icon={Wallet}
                    trend="down"
                    trendValue="2.1%"
                    colorClass="icon-gold"
                />
                <StatCard
                    title="Expenses YTD"
                    value={summary.expensesYTD}
                    icon={CreditCard}
                    trend="up"
                    trendValue="4.3%"
                    colorClass="icon-danger"
                />
            </div>

            {/* Intelligence Widgets */}
            <h3 className="text-lg font-bold mt-8 mb-4">Business Intelligence</h3>
            <div className="stats-grid mb-8">
                <StatCard
                    title="Tax Vault (Est.)"
                    value={summary.netProfit * 0.25}
                    icon={DollarSign}
                    trend="info"
                    trendValue="25%"
                    colorClass="icon-primary"
                />
                <StatCard
                    title="Runway"
                    value="6.4 Months"
                    icon={TrendingUp}
                    trend="up"
                    trendValue="Safe"
                    colorClass="icon-accent"
                />
                <StatCard
                    title="Open Invoices"
                    value={3}
                    icon={CreditCard}
                    trend="down"
                    trendValue="Action Needed"
                    colorClass="icon-warning"
                />
            </div>



            {/* Phase 6: Intelligence & Goals */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                <InsightsWidget />
                <GoalsWidget />
            </div>

            {/* Main Chart Section */}
            <div className="charts-section mt-4">
                <Card className="chart-card">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg">Revenue vs Expenses</h2>
                    </div>
                    <div className="chart-wrapper">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={monthlyData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#38bdf8" stopOpacity={0} />
                                    </linearGradient>
                                    <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#f87171" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#f87171" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <XAxis dataKey="month" stroke="#94a3b8" tick={{ fontSize: 12 }} />
                                <YAxis stroke="#94a3b8" tick={{ fontSize: 12 }} tickFormatter={(val) => `$${val / 1000}k`} />
                                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc' }}
                                    formatter={(value) => formatVal(value)}
                                />
                                <Area type="monotone" dataKey="revenue" stroke="#38bdf8" fillOpacity={1} fill="url(#colorRevenue)" />
                                <Area type="monotone" dataKey="expenses" stroke="#f87171" fillOpacity={1} fill="url(#colorExpenses)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                {/* Recent Transactions */}
                <Card className="transactions-card">
                    <h2 className="text-lg mb-4">Recent Transactions</h2>
                    <div className="transactions-list">
                        {transactions.map(tx => (
                            <div key={tx.id} className="transaction-item">
                                <div className="flex flex-col">
                                    <span className="tx-desc">{tx.description}</span>
                                    <span className="tx-date text-secondary text-sm">{tx.date}</span>
                                </div>
                                <span className={`tx-amount ${tx.amount > 0 ? 'text-success' : 'text-danger'}`}>
                                    {tx.amount > 0 ? '+' : ''}{formatVal(tx.amount)}
                                </span>
                            </div>
                        ))}
                    </div>
                </Card>
            </div>
        </div >
    );
};

export default Dashboard;
