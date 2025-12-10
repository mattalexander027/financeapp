import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Download, Filter } from 'lucide-react';
import Card from '../components/Card';
import Button from '../components/Button';
import { useFinance } from '../data/FinanceContext';
import './ProfitLoss.css';

const PLEntry = ({ label, value, type = 'neutral', indent = false, bold = false }) => {
    const formattedValue = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(value);

    return (
        <div className={`pl-entry ${indent ? 'pl-indent' : ''} ${bold ? 'pl-bold' : ''}`}>
            <span className="pl-label">{label}</span>
            <span className={`pl-value text-${type}`}>{formattedValue}</span>
        </div>
    );
};

const ProfitLoss = () => {
    const { monthlyData, summary } = useFinance();

    // Helper
    const formatVal = (val) => new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(val);

    // Mock breakdown data derivation
    const revenue = summary.revenueYTD;
    const cogs = Math.round(revenue * 0.3);
    const grossProfit = revenue - cogs;
    const expenses = summary.expensesYTD;
    const opEx = summary.expensesYTD - cogs;
    const netProfit = summary.netProfit;

    return (
        <div className="pl-container">
            <div className="pl-header">
                <div>
                    <h1 className="text-2xl">Profit & Loss</h1>
                    <p className="text-secondary text-sm">Statement of financial performance Year-to-Date.</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="secondary" size="sm"><Filter size={16} /> Filter</Button>
                    <Button variant="primary" size="sm"><Download size={16} /> Export</Button>
                </div>
            </div>

            <div className="pl-content-grid">
                {/* P&L Statement Table */}
                <Card className="pl-table-card">
                    <h2 className="text-lg mb-4 text-primary border-b border-subtle pb-2">Statement Details</h2>

                    <div className="pl-section">
                        <h3 className="section-title text-secondary">Income</h3>
                        <PLEntry label="Total Revenue" value={revenue} bold />
                        <PLEntry label="Cost of Goods Sold (COGS)" value={-cogs} type="danger" indent />
                        <div className="pl-divider"></div>
                        <PLEntry label="Gross Profit" value={grossProfit} type="success" bold />
                    </div>

                    <div className="pl-section mt-4">
                        <h3 className="section-title text-secondary">Operating Expenses</h3>
                        <PLEntry label="Salaries & Wages" value={-Math.round(opEx * 0.5)} indent />
                        <PLEntry label="Marketing" value={-Math.round(opEx * 0.2)} indent />
                        <PLEntry label="Rent & Utilities" value={-Math.round(opEx * 0.15)} indent />
                        <PLEntry label="Software & IT" value={-Math.round(opEx * 0.1)} indent />
                        <PLEntry label="Travel & Meals" value={-Math.round(opEx * 0.05)} indent />
                        <div className="pl-divider"></div>
                        <PLEntry label="Total Operating Expenses" value={-opEx} type="danger" bold />
                    </div>

                    <div className="pl-total mt-6">
                        <PLEntry label="Net Profit" value={netProfit} type="accent" bold />
                    </div>
                </Card>

                {/* Charts & Analysis */}
                <div className="pl-analysis-col">
                    <Card className="pl-chart-card">
                        <h2 className="text-lg mb-4">Monthly Profitability</h2>
                        <div className="chart-wrapper-pl">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={monthlyData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.5} />
                                    <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                                    <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `${val / 1000}k`} />
                                    <Tooltip
                                        cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                                        contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc' }}
                                        formatter={(value) => formatVal(value)}
                                    />
                                    <Legend />
                                    <Bar dataKey="revenue" name="Revenue" fill="#38bdf8" radius={[4, 4, 0, 0]} />
                                    <Bar dataKey="profit" name="Net Profit" fill="#4ade80" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </Card>

                    <Card className="kpi-card mt-4">
                        <h2 className="text-lg mb-4">Key Ratios</h2>
                        <div className="kpi-grid">
                            <div className="kpi-item">
                                <span className="kpi-label">Gross Margin</span>
                                <span className="kpi-value text-accent">{revenue ? ((grossProfit / revenue) * 100).toFixed(1) : 0}%</span>
                            </div>
                            <div className="kpi-item">
                                <span className="kpi-label">Net Profit Margin</span>
                                <span className="kpi-value text-success">{revenue ? ((netProfit / revenue) * 100).toFixed(1) : 0}%</span>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default ProfitLoss;
