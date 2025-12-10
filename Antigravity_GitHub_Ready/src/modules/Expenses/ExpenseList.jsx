import React, { useState } from 'react';
import { Plus, Filter, Search, Tag, DollarSign, X, UploadCloud } from 'lucide-react';
import Card from '../../components/Card';
import Button from '../../components/Button';
import Input from '../../components/Input';
import { useFinance } from '../../data/FinanceContext';
import './Expenses.css';

const CategoryBadge = ({ category }) => {
    const colors = {
        'Office': 'text-info bg-info-subtle',
        'Software': 'text-accent bg-accent-subtle',
        'Rent': 'text-warning bg-warning-subtle',
        'Travel': 'text-success bg-success-subtle',
        'Marketing': 'text-danger bg-danger-subtle',
    };
    const colorClass = colors[category] || 'text-secondary bg-secondary-subtle';

    return (
        <span className={`category-badge ${colorClass}`}>
            <Tag size={12} />
            {category}
        </span>
    );
};

const ExpenseList = () => {
    const { expenses, addExpense } = useFinance();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    // New Expense State
    const [vendor, setVendor] = useState('');
    const [amount, setAmount] = useState('');
    const [category, setCategory] = useState('Office');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

    const filteredExpenses = expenses.filter(exp =>
        exp.vendor.toLowerCase().includes(searchTerm.toLowerCase()) ||
        exp.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleSave = () => {
        if (!vendor || !amount) return;

        addExpense({
            vendor,
            amount: parseFloat(amount),
            category,
            date,
            status: 'paid'
        });

        setIsModalOpen(false);
        // Reset form
        setVendor('');
        setAmount('');
        setCategory('Office');
    };

    const formatMoney = (val) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);

    return (
        <div className="expenses-container">
            <div className="expenses-header">
                <div>
                    <h1 className="text-2xl">Expenses</h1>
                    <p className="text-secondary text-sm">Track and categorize your business spending.</p>
                </div>
                <Button variant="primary" onClick={() => setIsModalOpen(true)}>
                    <Plus size={18} className="mr-2" /> Add Expense
                </Button>
            </div>

            <div className="expenses-controls my-4 flex justify-between gap-4">
                <div className="search-wrapper flex-1">
                    <Search size={18} className="search-icon" />
                    <input
                        type="text"
                        placeholder="Search expenses by vendor or category..."
                        className="search-input"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <Button variant="secondary"><Filter size={18} /> Filter</Button>
            </div>

            <div className="expenses-grid">
                {/* Categories Summary (Mock) */}
                {/* Could be dynamic later */}
            </div>

            <Card className="expenses-list-card">
                <table className="expenses-table">
                    <thead>
                        <tr>
                            <th>Vendor</th>
                            <th>Category</th>
                            <th>Date</th>
                            <th>Amount</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredExpenses.map(exp => (
                            <tr key={exp.id}>
                                <td className="font-bold">{exp.vendor}</td>
                                <td><CategoryBadge category={exp.category} /></td>
                                <td className="text-secondary">{exp.date}</td>
                                <td className="font-mono text-danger">-{formatMoney(exp.amount)}</td>
                                <td><span className="text-xs font-bold text-success uppercase tracking-wider">Paid</span></td>
                            </tr>
                        ))}
                        {filteredExpenses.length === 0 && (
                            <tr><td colSpan="5" className="text-center py-8 text-secondary">No expenses found.</td></tr>
                        )}
                    </tbody>
                </table>
            </Card>

            {/* Add Expense Modal */}
            {isModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h2 className="text-lg">Log New Expense</h2>
                            <button className="close-btn" onClick={() => setIsModalOpen(false)}><X size={20} /></button>
                        </div>
                        <div className="modal-body flex flex-col gap-4">
                            <Input label="Vendor" value={vendor} onChange={(e) => setVendor(e.target.value)} placeholder="e.g. Amazon" />
                            <div className="flex gap-4">
                                <div className="flex-1">
                                    <label className="input-label">Amount</label>
                                    <div className="input-wrapper">
                                        <DollarSign size={16} className="input-icon" />
                                        <input
                                            type="number"
                                            className="custom-input pl-8"
                                            value={amount}
                                            onChange={(e) => setAmount(e.target.value)}
                                        />
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <Input label="Date" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
                                </div>
                            </div>
                            <div>
                                <label className="input-label">Category</label>
                                <select
                                    className="custom-select"
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                >
                                    <option>Office</option>
                                    <option>Software</option>
                                    <option>Rent</option>
                                    <option>Marketing</option>
                                    <option>Travel</option>
                                    <option>Utilities</option>
                                </select>
                            </div>

                            {/* Receipt Vault */}
                            <div className="border-2 border-dashed border-subtle rounded-lg p-6 text-center cursor-pointer hover:border-accent transition-colors group">
                                <div className="flex flex-col items-center gap-2">
                                    <div className="p-3 bg-secondary-subtle rounded-full group-hover:bg-accent-subtle transition-colors">
                                        <UploadCloud size={24} className="text-secondary group-hover:text-accent" />
                                    </div>
                                    <p className="text-sm font-bold">Receipt Vault</p>
                                    <p className="text-xs text-secondary">Drag & Drop proof here</p>
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <Button variant="secondary" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                            <Button variant="primary" onClick={handleSave}>Save Expense</Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ExpenseList;
