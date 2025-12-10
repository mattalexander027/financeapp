import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Receipt, TrendingUp, Settings, FileText, CreditCard, Building, PieChart, Landmark } from 'lucide-react';
import './Sidebar.css';

const Sidebar = () => {
    const navItems = [
        { path: '/', label: 'Dashboard', icon: LayoutDashboard },
        { path: '/banking', label: 'Banking', icon: Landmark },
        { path: '/invoicing', label: 'Invoices', icon: FileText },
        { path: '/expenses', label: 'Expenses', icon: CreditCard },
        { path: '/vendors', label: 'Vendors', icon: Building },
        { path: '/reports', label: 'Reports', icon: PieChart },
        { path: '/profit-loss', label: 'Profit & Loss', icon: Receipt },
        { path: '/cash-flow', label: 'Cash Flow', icon: TrendingUp },
    ];

    return (
        <aside className="sidebar">
            <div className="sidebar-header">
                <div className="logo">
                    <span className="logo-icon">▲</span>
                    <span className="logo-text">Finance</span>
                </div>
            </div>

            <nav className="sidebar-nav">
                {navItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                    >
                        <item.icon size={20} />
                        <span>{item.label}</span>
                    </NavLink>
                ))}
            </nav>

            <div className="sidebar-footer">
                <a href="#" className="nav-item">
                    <Settings size={20} />
                    <span>Settings</span>
                </a>
            </div>
        </aside>
    );
};

export default Sidebar;
