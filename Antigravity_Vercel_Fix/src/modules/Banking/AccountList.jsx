import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Landmark, CreditCard, ArrowUpRight } from 'lucide-react';
import Card from '../../components/Card';
import Button from '../../components/Button';
import Input from '../../components/Input';
import { useFinance } from '../../data/FinanceContext';
import './Banking.css';

const AccountCard = ({ account }) => {
    const formatMoney = (val) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);
    const typeClass = account.type === 'Credit Card' ? 'type-Credit' : account.type;

    return (
        <Link to={`/banking/${account.id}`} className="block">
            <Card className={`account-card ${typeClass} h-full cursor-pointer`}>
                <div className="flex justify-between items-start">
                    <div className="flex gap-4">
                        <div className="institution-icon">
                            {account.type === 'Credit Card' ? <CreditCard size={24} /> : <Landmark size={24} />}
                        </div>
                        <div>
                            <h3 className="text-lg font-bold">{account.name}</h3>
                            <p className="text-sm text-secondary">{account.institution}</p>
                        </div>
                    </div>
                    <span className="text-xs font-bold bg-secondary-subtle px-2 py-1 rounded-full text-secondary uppercase">
                        {account.type}
                    </span>
                </div>

                <div className="account-balance text-primary">
                    {formatMoney(account.balance)}
                </div>

                <div className="account-meta">
                    <span>Updated: {new Date(account.lastUpdated).toLocaleDateString()}</span>
                    <span className="text-accent text-xs flex items-center">
                        View Ledger <ArrowUpRight size={12} className="ml-1" />
                    </span>
                </div>
            </Card>
        </Link>
    );
};

const AccountList = () => {
    const { accounts, addAccount } = useFinance();
    const [isModalOpen, setIsModalOpen] = useState(false);

    // New Account State
    const [institution, setInstitution] = useState('');
    const [name, setName] = useState('');
    const [type, setType] = useState('Checking');
    const [balance, setBalance] = useState('');

    const handleSave = () => {
        if (!name || !balance) return;

        addAccount({
            institution,
            name,
            type,
            balance: parseFloat(balance),
        });

        setIsModalOpen(false);
        // Reset
        setInstitution('');
        setName('');
        setType('Checking');
        setBalance('');
    };

    return (
        <div className="banking-container">
            <div className="banking-header">
                <div>
                    <h1 className="text-2xl">Banking & Accounts</h1>
                    <p className="text-secondary text-sm">Manage your connected bank accounts and credit cards.</p>
                </div>
                <Button variant="primary" onClick={() => setIsModalOpen(true)}>
                    <Plus size={18} className="mr-2" /> Add Account
                </Button>
            </div>

            <div className="accounts-grid">
                {accounts.map(acc => (
                    <AccountCard key={acc.id} account={acc} />
                ))}

                {/* Add New Placeholder Card */}
                <button
                    className="card border-dashed border-2 border-subtle bg-transparent flex flex-col items-center justify-center gap-4 min-h-[200px] hover:border-accent hover:text-accent transition-all cursor-pointer group"
                    onClick={() => setIsModalOpen(true)}
                >
                    <div className="w-12 h-12 rounded-full bg-secondary-subtle flex items-center justify-center group-hover:bg-accent-subtle transition-colors">
                        <Plus size={24} />
                    </div>
                    <span className="font-bold">Connect New Account</span>
                </button>
            </div>

            {/* Add Account Modal */}
            {isModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h2 className="text-lg">Connect Bank Account</h2>
                            <button className="close-btn" onClick={() => setIsModalOpen(false)}>×</button>
                        </div>
                        <div className="modal-body flex flex-col gap-4">
                            <Input label="Institution" value={institution} onChange={(e) => setInstitution(e.target.value)} placeholder="e.g. Chase, Wells Fargo" />
                            <Input label="Account Name" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Business Checking" />

                            <div>
                                <label className="input-label">Account Type</label>
                                <select
                                    className="custom-select"
                                    value={type}
                                    onChange={(e) => setType(e.target.value)}
                                >
                                    <option>Checking</option>
                                    <option>Savings</option>
                                    <option>Credit Card</option>
                                </select>
                            </div>

                            <div className="flex-1">
                                <label className="input-label">Current Balance</label>
                                <div className="input-wrapper">
                                    <span className="input-icon">$</span>
                                    <input
                                        type="number"
                                        className="custom-input pl-8"
                                        value={balance}
                                        onChange={(e) => setBalance(e.target.value)}
                                        placeholder="0.00"
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <Button variant="secondary" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                            <Button variant="primary" onClick={handleSave}>Connect</Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AccountList;
