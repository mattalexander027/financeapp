import React, { useState } from 'react';
import { Plus, Search, Mail, Phone, Building } from 'lucide-react';
import Card from '../../components/Card';
import Button from '../../components/Button';
import Input from '../../components/Input';
import { useFinance } from '../../data/FinanceContext';
import './Expenses.css';

const VendorList = () => {
    const { vendors, addVendor } = useFinance();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    // New Vendor State
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [category, setCategory] = useState('');

    const filteredVendors = vendors.filter(v =>
        v.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        v.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleSave = () => {
        if (!name) return;

        addVendor({
            name,
            email,
            phone,
            category
        });

        setIsModalOpen(false);
        // Reset form
        setName('');
        setEmail('');
        setPhone('');
        setCategory('');
    };

    return (
        <div className="expenses-container">
            <div className="expenses-header">
                <div>
                    <h1 className="text-2xl">Vendors</h1>
                    <p className="text-secondary text-sm">Manage your suppliers and service providers.</p>
                </div>
                <Button variant="primary" onClick={() => setIsModalOpen(true)}>
                    <Plus size={18} className="mr-2" /> Add Vendor
                </Button>
            </div>

            <div className="expenses-controls my-4">
                <div className="search-wrapper">
                    <Search size={18} className="search-icon" />
                    <input
                        type="text"
                        placeholder="Search vendors..."
                        className="search-input"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="vendor-grid">
                {filteredVendors.map(vendor => (
                    <Card key={vendor.id} className="vendor-card">
                        <div className="flex justify-between items-start mb-2">
                            <div className="vendor-icon">
                                <Building size={24} />
                            </div>
                            <span className="text-xs font-bold bg-secondary-subtle px-2 py-1 rounded-full text-secondary">
                                {vendor.category || 'General'}
                            </span>
                        </div>
                        <h3 className="text-lg font-bold mb-2">{vendor.name}</h3>
                        <div className="vendor-details flex flex-col gap-1 text-sm text-secondary">
                            {vendor.email && (
                                <div className="flex items-center gap-2">
                                    <Mail size={14} /> <span>{vendor.email}</span>
                                </div>
                            )}
                            {vendor.phone && (
                                <div className="flex items-center gap-2">
                                    <Phone size={14} /> <span>{vendor.phone}</span>
                                </div>
                            )}
                        </div>
                        <div className="mt-4 pt-4 border-t border-subtle">
                            <Button variant="ghost" size="sm" className="w-full">View History</Button>
                        </div>
                    </Card>
                ))}
            </div>

            {/* Add Vendor Modal */}
            {isModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h2 className="text-lg">Add New Vendor</h2>
                            <button className="close-btn" onClick={() => setIsModalOpen(false)}>×</button>
                        </div>
                        <div className="modal-body flex flex-col gap-4">
                            <Input label="Company Name" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Acme Supplies" />
                            <Input label="Category" value={category} onChange={(e) => setCategory(e.target.value)} placeholder="e.g. Office Supplies" />
                            <div className="flex gap-4">
                                <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                                <Input label="Phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} />
                            </div>
                        </div>
                        <div className="modal-footer">
                            <Button variant="secondary" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                            <Button variant="primary" onClick={handleSave}>Save Vendor</Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default VendorList;
