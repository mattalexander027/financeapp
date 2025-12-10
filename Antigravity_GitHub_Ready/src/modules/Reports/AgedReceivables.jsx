import React, { useMemo } from 'react';
import { Download, Share2, AlertCircle } from 'lucide-react';
import Card from '../../components/Card';
import Button from '../../components/Button';
import { useFinance } from '../../data/FinanceContext';
import './Reports.css';

const AgedReceivables = () => {
    const { invoices } = useFinance();

    const agingData = useMemo(() => {
        const today = new Date();
        const buckets = {
            current: 0,
            days30: 0,
            days60: 0,
            days90: 0,
            total: 0
        };

        invoices.forEach(inv => {
            if (inv.status === 'paid') return;

            const due = new Date(inv.dueDate);
            const diffTime = Math.abs(today - due);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

            // If due date is in future, it's current. If past, check how many days.
            if (due > today) {
                buckets.current += inv.amount;
            } else {
                if (diffDays <= 30) buckets.days30 += inv.amount;
                else if (diffDays <= 60) buckets.days60 += inv.amount;
                else if (diffDays <= 90) buckets.days90 += inv.amount;
                else buckets.days90 += inv.amount; // 90+ bucket
            }
            buckets.total += inv.amount;
        });

        return buckets;
    }, [invoices]);

    const formatMoney = (val) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);

    return (
        <div className="reports-container">
            <div className="reports-header">
                <div>
                    <h1 className="text-2xl">Aged Receivables</h1>
                    <p className="text-secondary text-sm">Unpaid invoices categorized by days overdue.</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="primary"><Download size={18} /> Export CSV</Button>
                </div>
            </div>

            <Card className="report-card">
                <h3 className="report-section-title">Aging Summary</h3>
                <table className="aging-table">
                    <thead>
                        <tr>
                            <th>Category</th>
                            <th>Current</th>
                            <th>1 - 30 Days</th>
                            <th>31 - 60 Days</th>
                            <th>61 - 90 Days</th>
                            <th>90+ Days</th>
                            <th>Total Unpaid</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td className="font-bold">Total Amount</td>
                            <td className="aging-bucket text-success">{formatMoney(agingData.current)}</td>
                            <td className="aging-bucket text-warning">{formatMoney(agingData.days30)}</td>
                            <td className="aging-bucket text-accent">{formatMoney(agingData.days60)}</td>
                            <td className="aging-bucket text-danger">{formatMoney(agingData.days90)}</td>
                            <td className="aging-bucket text-danger font-bold">{formatMoney(0)}</td> {/* Mock 90+ for now */}
                            <td className="aging-bucket font-bold">{formatMoney(agingData.total)}</td>
                        </tr>
                    </tbody>
                </table>
            </Card>

            <div className="mt-8">
                <h3 className="text-lg mb-4">Overdue Invoices Details</h3>
                <div className="grid gap-4">
                    {invoices.filter(i => i.status === 'overdue').map(inv => (
                        <Card key={inv.id} className="border-l-4 border-l-red-500">
                            <div className="flex justify-between items-center">
                                <div>
                                    <h4 className="font-bold">{inv.client}</h4>
                                    <p className="text-sm text-secondary">Due: {inv.dueDate}</p>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold text-danger">{formatMoney(inv.amount)}</p>
                                    <div className="flex items-center gap-1 text-xs text-danger">
                                        <AlertCircle size={12} />
                                        <span>Action Required</span>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    ))}
                    {invoices.filter(i => i.status === 'overdue').length === 0 && (
                        <p className="text-secondary">No overdue invoices. Great job!</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AgedReceivables;
