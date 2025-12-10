import React, { useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowUpRight, ArrowDownLeft, Search } from 'lucide-react';
import Card from '../../components/Card';
import Button from '../../components/Button';
import Input from '../../components/Input';
import { useFinance } from '../../data/FinanceContext';
import './Banking.css';

const TransactionRow = ({ date, desc, category, amount, type }) => {
    const isCredit = type === 'credit';
    const colorClass = isCredit ? 'text-success' : 'text-primary';
    const Sign = isCredit ? ArrowDownLeft : ArrowUpRight;

    return (
        <div className="flex justify-between items-center p-4 border-b border-subtle last:border-0 hover:bg-secondary-subtle transition-colors">
            <div className="flex items-center gap-4">
                <div className={`p-2 rounded-full ${isCredit ? 'bg-success-subtle text-success' : 'bg-primary-subtle text-primary'}`}>
                    <Sign size={16} />
                </div>
                <div>
                    <p className="font-bold">{desc}</p>
                    <p className="text-secondary text-xs">{date} • {category}</p>
                </div>
            </div>
            <span className={`font-mono font-bold ${colorClass}`}>
                {isCredit ? '+' : '-'}{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount)}
            </span>
        </div>
    );
};

const AccountDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { accounts, invoices, expenses } = useFinance();

    const account = accounts.find(a => a.id === id);

    // If no account found (e.g. reload or mockup), just fallback to first or null
    const safeAccount = account || accounts[0];

    // Derive Transactions
    // In a real app, these would be filtered by accountId. 
    // For this demo, we'll combine Invoices (Deposits) and Expenses (Withdrawals) to simulate activity.
    const transactions = useMemo(() => {
        const deposits = invoices
            .filter(i => i.status === 'paid')
            .map(i => ({
                id: i.id, date: i.date, desc: `Invoice #${i.id.slice(0, 4)} - ${i.client}`,
                category: 'Sales', amount: i.amount, type: 'credit'
            }));

        const withdrawals = expenses
            .filter(e => e.status === 'paid')
            .map(e => ({
                id: e.id, date: e.date, desc: e.vendor,
                category: e.category, amount: e.amount, type: 'debit'
            }));

        return [...deposits, ...withdrawals].sort((a, b) => new Date(b.date) - new Date(a.date));
    }, [invoices, expenses]);

    if (!safeAccount) return <div className="p-8">Account not found</div>;

    return (
        <div className="banking-container">
            <div className="mb-6">
                <Button variant="ghost" onClick={() => navigate('/banking')} className="mb-4 pl-0 hover:bg-transparent text-secondary hover:text-primary">
                    <ArrowLeft size={18} className="mr-2" /> Back to Accounts
                </Button>

                <div className="flex justify-between items-end">
                    <div>
                        <h1 className="text-3xl font-bold">{safeAccount.name}</h1>
                        <p className="text-secondary">{safeAccount.institution} • {safeAccount.type}</p>
                    </div>
                    <div className="text-right">
                        <p className="text-sm text-secondary uppercase font-bold tracking-wider">Current Balance</p>
                        <p className="text-4xl font-mono font-bold text-accent">
                            {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(safeAccount.balance)}
                        </p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-3 gap-6 mb-8">
                <Card className="glass-panel text-center py-6">
                    <span className="text-secondary text-sm">Income (MTD)</span>
                    <p className="text-2xl font-bold text-success mt-2">+$24,500.00</p>
                </Card>
                <Card className="glass-panel text-center py-6">
                    <span className="text-secondary text-sm">Spending (MTD)</span>
                    <p className="text-2xl font-bold text-primary mt-2">$8,250.00</p>
                </Card>
                <Card className="glass-panel text-center py-6">
                    <span className="text-secondary text-sm">Projected End Balance</span>
                    <p className="text-2xl font-bold text-secondary mt-2">
                        {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(safeAccount.balance + 16250)}
                    </p>
                </Card>
            </div>

            <Card className="glass-panel relative overflow-hidden">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold">Transaction History</h3>
                    <div className="w-64">
                        <Input placeholder="Search transactions..." icon={Search} />
                    </div>
                </div>

                <div className="flex flex-col">
                    {transactions.map(tx => (
                        <TransactionRow key={tx.id} {...tx} />
                    ))}
                    {transactions.length === 0 && (
                        <p className="text-center text-secondary py-8">No recent transactions found.</p>
                    )}
                </div>
            </Card>
        </div>
    );
};

export default AccountDetail;
