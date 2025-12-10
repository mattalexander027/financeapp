import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, FileText, CreditCard, Landmark, LayoutDashboard, Receipt, TrendingUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const CommandPalette = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [query, setQuery] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'k' && (e.ctrlKey || e.metaKey)) {
                e.preventDefault();
                setIsOpen(prev => !prev);
            }
            if (e.key === 'Escape') {
                setIsOpen(false);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    const actions = [
        { label: 'Go to Dashboard', icon: LayoutDashboard, path: '/' },
        { label: 'Go to Banking', icon: Landmark, path: '/banking' },
        { label: 'New Invoice', icon: FileText, path: '/invoicing/new' },
        { label: 'View Invoices', icon: FileText, path: '/invoicing' },
        { label: 'Add Expense', icon: CreditCard, path: '/expenses' }, // Simplification: route to list
        { label: 'View Expenses', icon: CreditCard, path: '/expenses' },
        { label: 'Profit & Loss', icon: Receipt, path: '/profit-loss' },
        { label: 'Cash Flow', icon: TrendingUp, path: '/cash-flow' },
        { label: 'Balance Sheet', icon: FileText, path: '/reports/balance-sheet' },
    ];

    const filteredActions = actions.filter(action =>
        action.label.toLowerCase().includes(query.toLowerCase())
    );

    const handleSelect = (path) => {
        navigate(path);
        setIsOpen(false);
        setQuery('');
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-[20vh] bg-black/50 backdrop-blur-sm" onClick={() => setIsOpen(false)}>
            <div
                className="w-full max-w-lg bg-card border border-subtle rounded-xl shadow-2xl overflow-hidden glass-panel"
                onClick={e => e.stopPropagation()}
            >
                <div className="flex items-center px-4 py-3 border-b border-subtle">
                    <Search className="text-secondary w-5 h-5 mr-3" />
                    <input
                        className="flex-1 bg-transparent border-none outline-none text-lg text-primary placeholder-secondary"
                        placeholder="Type to search..."
                        autoFocus
                        value={query}
                        onChange={e => setQuery(e.target.value)}
                    />
                    <kbd className="hidden sm:inline-block px-2 py-1 text-xs font-semibold text-secondary bg-secondary/10 border border-subtle rounded">ESC</kbd>
                </div>

                <div className="max-h-[300px] overflow-y-auto p-2">
                    {filteredActions.length > 0 ? (
                        filteredActions.map((action, index) => (
                            <button
                                key={index}
                                onClick={() => handleSelect(action.path)}
                                className="w-full flex items-center px-4 py-3 text-left rounded-lg hover:bg-accent/10 hover:text-accent transition-colors group"
                            >
                                <action.icon className="w-5 h-5 mr-3 text-secondary group-hover:text-accent" />
                                <span className="flex-1 font-medium">{action.label}</span>
                            </button>
                        ))
                    ) : (
                        <div className="px-4 py-8 text-center text-secondary">
                            No results found.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CommandPalette;
