import React, { useState } from 'react';
import { Plus, Filter, FileText, CheckCircle, Clock, AlertCircle, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';
import Card from '../../components/Card';
import Button from '../../components/Button';
import { useFinance } from '../../data/FinanceContext';
import './Invoicing.css';

const StatusBadge = ({ status }) => {
    const styles = {
        paid: { color: 'text-success', icon: CheckCircle, bg: 'bg-success-subtle' },
        pending: { color: 'text-accent', icon: Clock, bg: 'bg-accent-subtle' },
        overdue: { color: 'text-danger', icon: AlertCircle, bg: 'bg-danger-subtle' },
        recurring: { color: 'text-primary', icon: RefreshCw, bg: 'bg-primary-subtle' },
    };
    const style = styles[status] || styles.pending;
    const Icon = style.icon;

    return (
        <div className={`status-badge ${status}`}>
            <Icon size={14} />
            <span>{status.charAt(0).toUpperCase() + status.slice(1)}</span>
        </div>
    );
};

const InvoiceList = () => {
    const { invoices } = useFinance();
    const [filter, setFilter] = useState('all');

    const filteredInvoices = filter === 'all'
        ? invoices
        : invoices.filter(inv => inv.status === filter);

    const formatMoney = (val) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);

    return (
        <div className="invoicing-container">
            <div className="invoicing-header">
                <div>
                    <h1 className="text-2xl">Invoices</h1>
                    <p className="text-secondary text-sm">Manage your client invoices and payments.</p>
                </div>
                <div className="flex gap-2">
                    <Link to="/invoicing/new">
                        <Button variant="primary"><Plus size={18} className="mr-2" /> New Invoice</Button>
                    </Link>
                </div>
            </div>

            <div className="invoice-filters my-4 flex gap-2">
                {['all', 'paid', 'pending', 'overdue'].map(f => (
                    <button
                        key={f}
                        className={`filter-tab ${filter === f ? 'active' : ''}`}
                        onClick={() => setFilter(f)}
                    >
                        {f.charAt(0).toUpperCase() + f.slice(1)}
                    </button>
                ))}
            </div>

            <Card className="invoice-list-card">
                <div className="table-responsive">
                    <table className="invoice-table">
                        <thead>
                            <tr>
                                <th>Invoice ID</th>
                                <th>Client</th>
                                <th>Date</th>
                                <th>Due Date</th>
                                <th>Amount</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredInvoices.map(inv => (
                                <tr key={inv.id}>
                                    <td className="font-mono text-sm text-secondary">#{inv.id.slice(0, 8)}</td>
                                    <td className="font-bold">{inv.client}</td>
                                    <td className="text-secondary">{inv.date}</td>
                                    <td className="text-secondary">{inv.dueDate}</td>
                                    <td className="font-bold">{formatMoney(inv.amount)}</td>
                                    <td><StatusBadge status={inv.status} /></td>
                                    <td>
                                        <div className="flex gap-2">
                                            <Button variant="ghost" size="sm">Edit</Button>
                                            <Link to={`/pay/${inv.id}`} target="_blank">
                                                <Button variant="ghost" size="sm" className="text-accent">Pay Link</Button>
                                            </Link>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {filteredInvoices.length === 0 && (
                                <tr>
                                    <td colSpan="7" className="text-center py-8 text-secondary">No invoices found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
};

export default InvoiceList;
