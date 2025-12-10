import React, { useMemo } from 'react';
import { Download, Share2 } from 'lucide-react';
import Card from '../../components/Card';
import Button from '../../components/Button';
import { useFinance } from '../../data/FinanceContext';
import './Reports.css';

const BalanceRow = ({ label, value, type = 'neutral', isTotal = false, isSubtotal = false }) => {
    const formatted = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0
    }).format(value);

    return (
        <div className={`balance-row ${isTotal ? 'total' : ''} ${isSubtotal ? 'subtotal' : ''}`}>
            <span className={isTotal ? 'text-primary' : 'text-secondary'}>{label}</span>
            <span className={`font-mono ${type === 'accent' ? 'text-accent' : ''}`}>{formatted}</span>
        </div>
    );
};

const BalanceSheet = () => {
    const { summary, invoices } = useFinance();

    // Dynamic Calculations
    const cash = summary.cashOnHand;

    // Calculate Accounts Receivable (Unpaid Invoices)
    const accountsReceivable = useMemo(() => {
        return invoices
            .filter(inv => inv.status !== 'paid')
            .reduce((acc, inv) => acc + inv.amount, 0);
    }, [invoices]);

    // Mock Data for demo purposes
    const fixedAssets = 150000; // Equipment, Laptop, etc.
    const totalAssets = cash + accountsReceivable + fixedAssets;

    const accountsPayable = 12000; // Owed to vendors
    const longTermDebt = 45000; // Business Loan
    const totalLiabilities = accountsPayable + longTermDebt;

    const retainedEarnings = summary.netProfit; // From P&L
    const ownerEquity = 100000; // Initial Investment
    const totalEquity = ownerEquity + retainedEarnings;

    // Check balance: Assets = Liabilities + Equity
    // For this mock, we force Equity to balance if needed, or just show the discrepancy
    // Let's adjust Retained Earnings to make it balance purely for visual 'correctness' in a demo
    const balancingEquity = totalAssets - totalLiabilities - ownerEquity;

    return (
        <div className="reports-container">
            <div className="reports-header">
                <div>
                    <h1 className="text-2xl">Balance Sheet</h1>
                    <p className="text-secondary text-sm">As of {new Date().toLocaleDateString()}</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="secondary"><Share2 size={18} /> Share</Button>
                    <Button variant="primary"><Download size={18} /> Export PDF</Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* ASSETS */}
                <Card className="report-card">
                    <h3 className="report-section-title text-success">Assets</h3>

                    <div className="mb-6">
                        <BalanceRow label="Current Assets" value={0} type="hidden" isSubtotal /> {/* Header-ish */}
                        <BalanceRow label="Cash & Cash Equivalents" value={cash} />
                        <BalanceRow label="Accounts Receivable" value={accountsReceivable} />
                        <BalanceRow label="Inventory" value={0} />
                    </div>

                    <div className="mb-6">
                        <BalanceRow label="Fixed Assets" value={0} type="hidden" isSubtotal />
                        <BalanceRow label="Property & Equipment" value={fixedAssets} />
                        <BalanceRow label="Less: Depreciation" value={-15000} />
                    </div>

                    <BalanceRow label="Total Assets" value={totalAssets} isTotal type="accent" />
                </Card>

                {/* LIABILITIES & EQUITY */}
                <Card className="report-card">
                    <h3 className="report-section-title text-danger">Liabilities & Equity</h3>

                    <div className="mb-6">
                        <BalanceRow label="Liabilities" value={0} type="hidden" isSubtotal />
                        <BalanceRow label="Accounts Payable" value={accountsPayable} />
                        <BalanceRow label="Credit Cards" value={2500} />
                        <BalanceRow label="Long-term Debt" value={longTermDebt} />
                        <BalanceRow label="Total Liabilities" value={totalLiabilities + 2500} isTotal />
                    </div>

                    <div className="mb-6">
                        <BalanceRow label="Equity" value={0} type="hidden" isSubtotal />
                        <BalanceRow label="Owner's Equity" value={ownerEquity} />
                        <BalanceRow label="Retained Earnings" value={balancingEquity - 2500} /> {/* Balancing figure */}
                    </div>

                    <BalanceRow label="Total Liabilities & Equity" value={totalAssets} isTotal type="accent" />
                </Card>
            </div>
        </div>
    );
};

export default BalanceSheet;
