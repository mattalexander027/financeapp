import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Trash2, Save, ArrowLeft } from 'lucide-react';
import Card from '../../components/Card';
import Button from '../../components/Button';
import Input from '../../components/Input';
import { useFinance } from '../../data/FinanceContext';
import './Invoicing.css';

const InvoiceEditor = () => {
    const navigate = useNavigate();
    const { addInvoice } = useFinance();

    const [client, setClient] = useState('');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [dueDate, setDueDate] = useState('');
    const [items, setItems] = useState([{ id: 1, description: '', quantity: 1, price: 0 }]);

    const addItem = () => {
        setItems([...items, { id: Date.now(), description: '', quantity: 1, price: 0 }]);
    };

    const removeItem = (id) => {
        setItems(items.filter(item => item.id !== id));
    };

    const updateItem = (id, field, value) => {
        setItems(items.map(item =>
            item.id === id ? { ...item, [field]: value } : item
        ));
    };

    const calculateTotal = () => {
        return items.reduce((acc, item) => acc + (item.quantity * item.price), 0);
    };

    const handleSave = () => {
        if (!client || !date) return;

        const total = calculateTotal();
        const invoice = {
            client,
            date,
            dueDate,
            amount: total,
            items
        };

        addInvoice(invoice);
        navigate('/invoicing');
    };

    return (
        <div className="invoicing-container">
            <div className="invoicing-header">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" onClick={() => navigate('/invoicing')}><ArrowLeft size={18} /></Button>
                    <h1 className="text-2xl">New Invoice</h1>
                </div>
                <Button variant="primary" onClick={handleSave}><Save size={18} className="mr-2" /> Save Invoice</Button>
            </div>

            <div className="invoice-editor-grid">
                <Card className="invoice-meta-card">
                    <h2 className="text-lg mb-4">Invoice Details</h2>
                    <div className="flex flex-col gap-4">
                        <Input
                            label="Client Name"
                            placeholder="e.g. Acme Corp"
                            value={client}
                            onChange={(e) => setClient(e.target.value)}
                        />
                        <div className="flex gap-4">
                            <Input
                                label="Invoice Date"
                                type="date"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                            />
                            <Input
                                label="Due Date"
                                type="date"
                                value={dueDate}
                                onChange={(e) => setDueDate(e.target.value)}
                            />
                        </div>

                        {/* Recurring Toggle */}
                        <div className="flex items-center gap-4 pt-2 border-t border-subtle mt-2">
                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    id="recurring"
                                    className="w-4 h-4 mr-2 accent-accent"
                                />
                                <label htmlFor="recurring" className="text-sm font-semibold text-secondary">Recurring Invoice?</label>
                            </div>
                            <select className="bg-transparent border border-subtle rounded p-2 text-sm text-primary outline-none focus:border-accent">
                                <option>Monthly</option>
                                <option>Weekly</option>
                                <option>Quarterly</option>
                                <option>Annually</option>
                            </select>
                        </div>
                    </div>
                </Card>

                <Card className="invoice-items-card">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg">Line Items</h2>
                        <Button variant="secondary" size="sm" onClick={addItem}><Plus size={16} /> Add Item</Button>
                    </div>

                    <div className="invoice-items-list">
                        {items.map((item, index) => (
                            <div key={item.id} className="invoice-item-row">
                                <div className="item-desc">
                                    <Input
                                        placeholder="Description"
                                        value={item.description}
                                        onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                                    />
                                </div>
                                <div className="item-qty">
                                    <Input
                                        type="number"
                                        placeholder="Qty"
                                        value={item.quantity}
                                        onChange={(e) => updateItem(item.id, 'quantity', Number(e.target.value))}
                                    />
                                </div>
                                <div className="item-price">
                                    <Input
                                        type="number"
                                        placeholder="Price"
                                        value={item.price}
                                        onChange={(e) => updateItem(item.id, 'price', Number(e.target.value))}
                                    />
                                </div>
                                <div className="item-total">
                                    ${(item.quantity * item.price).toFixed(2)}
                                </div>
                                <Button variant="ghost" className="text-danger" onClick={() => removeItem(item.id)}>
                                    <Trash2 size={16} />
                                </Button>
                            </div>
                        ))}
                    </div>

                    <div className="invoice-total">
                        <span>Total Amount:</span>
                        <span className="text-2xl font-bold text-accent">
                            {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(calculateTotal())}
                        </span>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default InvoiceEditor;
