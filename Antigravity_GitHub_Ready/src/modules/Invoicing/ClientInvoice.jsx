import React from 'react';
import { useParams } from 'react-router-dom';
import { CheckCircle, Download, CreditCard } from 'lucide-react';
import Card from '../../components/Card';
import Button from '../../components/Button';
import { useFinance } from '../../data/FinanceContext';
import './Invoicing.css';

const ClientInvoice = () => {
    const { id } = useParams();
    const { invoices } = useFinance();

    // Find invoice or use mock if not found (for demo purposes if ID doesn't match)
    const invoice = invoices.find(i => i.id === id) || invoices[0];

    if (!invoice) return <div className="p-10 text-center">Invoice not found.</div>;

    const formatMoney = (val) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);

    return (
        <div className="min-h-screen bg-bg-secondary flex items-center justify-center p-4">
            <Card className="max-w-3xl w-full shadow-2xl border-t-8 border-t-accent">

                {/* Header */}
                <div className="flex justify-between items-start mb-10 border-b border-subtle pb-6">
                    <div>
                        <h1 className="text-3xl font-bold mb-2">INVOICE</h1>
                        <p className="text-secondary">#{invoice.id.slice(0, 8)}</p>
                    </div>
                    <div className="text-right">
                        <h2 className="text-xl font-bold">{invoice.client}</h2>
                        <p className="text-secondary text-sm">Issued: {invoice.date}</p>
                        <p className="text-secondary text-sm">Due: {invoice.dueDate}</p>
                    </div>
                </div>

                {/* Amount */}
                <div className="flex justify-between items-center bg-primary-subtle p-6 rounded-lg mb-8">
                    <div>
                        <p className="text-secondary text-sm uppercase font-bold tracking-wider">Amount Due</p>
                        <h2 className="text-4xl font-bold text-primary mt-1">{formatMoney(invoice.amount)}</h2>
                    </div>
                    <div className="bg-success-subtle text-success px-4 py-2 rounded-full font-bold flex items-center">
                        <CheckCircle size={18} className="mr-2" /> Ready to Pay
                    </div>
                </div>

                {/* Line Items (Mocked if not present in data model yet for list view) */}
                <div className="mb-8">
                    <h3 className="text-lg font-bold mb-4">Description</h3>
                    <div className="border border-subtle rounded-lg overflow-hidden">
                        <table className="w-full text-left">
                            <thead className="bg-secondary-subtle">
                                <tr>
                                    <th className="p-4 text-sm font-semibold text-secondary">Service</th>
                                    <th className="p-4 text-sm font-semibold text-secondary text-right">Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td className="p-4 border-b border-subtle">Professional Services (Detailed)</td>
                                    <td className="p-4 border-b border-subtle text-right">{formatMoney(invoice.amount)}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex justify-between items-center pt-6 border-t border-subtle">
                    <Button variant="ghost" className="text-secondary">
                        <Download size={18} className="mr-2" /> Download PDF
                    </Button>
                    <Button variant="primary" size="lg" className="bg-gradient-to-r from-accent to-purple-500 hover:opacity-90 border-none">
                        <CreditCard size={18} className="mr-2" /> Pay Now
                    </Button>
                </div>

            </Card>
        </div>
    );
};

export default ClientInvoice;
