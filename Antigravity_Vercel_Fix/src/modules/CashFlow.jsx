import React from 'react';
import { ComposedChart, Line, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, TrendingDown, DollarSign } from 'lucide-react';
import Card from '../components/Card';
import { useFinance } from '../data/FinanceContext';
import './CashFlow.css';

const CashFlowRow = ({ label, value, type = 'neutral' }) => {
    const formattedValue = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(value);

    return (
        <div className="cf-row">
            <span className="cf-label">{label}</span>
            <span className={`cf-value text-${type}`}>{formattedValue}</span>
        </div>
    );
};

const CashFlow = () => {
    const { monthlyData, summary } = useFinance();
    const { cashOnHand, revenueYTD, expensesYTD } = summary;

    // Helper
    const formatVal = (val) => new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(val);

    // Mock Simulations for Cash Flow Categories
    const operatingCashFlow = revenueYTD - expensesYTD + 50000; // Add back non-cash items
    const investingCashFlow = -120000; // CapEx
    const financingCashFlow = 45000; // Loan/Investment
    const netCashFlow = operatingCashFlow + investingCashFlow + financingCashFlow;
    const beginningCash = cashOnHand - netCashFlow;

    return (
        <div className="cf-container">
            <div className="cf-header mb-4">
                <h1 className="text-2xl">Cash Flow Statement</h1>
                <p className="text-secondary text-sm">Analysis of cash inflows and outflows.</p>
            </div>

            <div className="cf-grid">
                <div className="cf-main">
                    {/* Summary Cards */}
                    <div className="cf-summary-cards flex gap-4 mb-6">
                        <Card className="flex-1">
                            <span className="text-sm text-secondary">Beginning Cash</span>
                            <p className="text-xl font-bold mt-2">{formatVal(beginningCash)}</p>
                        </Card>
                        <Card className="flex-1">
                            <span className="text-sm text-secondary">Net Change</span>
                            <p className={`text-xl font-bold mt-2 ${netCashFlow >= 0 ? 'text-success' : 'text-danger'}`}>
                                {netCashFlow >= 0 ? '+' : ''}{formatVal(netCashFlow)}
                            </p>
                        </Card>
                        <Card className="flex-1">
                            <span className="text-sm text-secondary">Ending Cash</span>
                            <p className="text-xl font-bold mt-2 text-primary">{formatVal(cashOnHand)}</p>
                        </Card>
                    </div>

                    <Card className="cf-statement-card">
                        <h2 className="text-lg mb-4 text-primary">Cash Flow Details</h2>

                        <div className="cf-section">
                            <div className="cf-section-header text-success">
                                <TrendingUp size={18} />
                                <h3>Operating Activities</h3>
                            </div>
                            <CashFlowRow label="Net Income" value={summary.netProfit} />
                            <CashFlowRow label="Depreciation & Amortization" value={15000} />
                            <CashFlowRow label="Changes in Working Capital" value={-5000} />
                            <div className="cf-divider"></div>
                            <CashFlowRow label="Net Cash from Operating" value={operatingCashFlow} type="success" />
                        </div>

                        <div className="cf-section">
                            <div className="cf-section-header text-danger">
                                <TrendingDown size={18} />
                                <h3>Investing Activities</h3>
                            </div>
                            <CashFlowRow label="Capital Expenditures (CapEx)" value={-80000} />
                            <CashFlowRow label="Purchase of Equipment" value={-40000} />
                            <div className="cf-divider"></div>
                            <CashFlowRow label="Net Cash from Investing" value={investingCashFlow} type="danger" />
                        </div>

                        <div className="cf-section">
                            <div className="cf-section-header text-accent">
                                <DollarSign size={18} />
                                <h3>Financing Activities</h3>
                            </div>
                            <CashFlowRow label="Proceeds from Loans" value={60000} />
                            <CashFlowRow label="Repayment of Debt" value={-15000} />
                            <div className="cf-divider"></div>
                            <CashFlowRow label="Net Cash from Financing" value={financingCashFlow} type="accent" />
                        </div>
                    </Card>
                </div>

                <div className="cf-sidebar">
                    <Card className="cf-chart-card">
                        <h2 className="text-lg mb-4">Cash Flow Trends</h2>
                        <div className="cf-chart-wrapper">
                            <ResponsiveContainer width="100%" height="100%">
                                <ComposedChart data={monthlyData}>
                                    <XAxis dataKey="month" stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} />
                                    <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} tickFormatter={(val) => `${val / 1000}k`} />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc' }}
                                        formatter={(value) => formatVal(value)}
                                    />
                                    <Bar dataKey="cashFlow" name="Net Cash Flow" fill="#38bdf8" radius={[4, 4, 0, 0]} barSize={20} />
                                    <Line type="monotone" dataKey="revenue" name="Revenue" stroke="#4ade80" dot={false} strokeWidth={2} />
                                </ComposedChart>
                            </ResponsiveContainer>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default CashFlow;
