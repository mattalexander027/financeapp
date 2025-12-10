import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, Clock, TrendingUp, PieChart } from 'lucide-react';
import Card from '../../components/Card';
import './Reports.css';

const ReportLink = ({ title, description, icon: Icon, to, color }) => (
    <Link to={to} className="block">
        <Card className="report-nav-card hover:bg-secondary-subtle transition-colors cursor-pointer h-full">
            <div className={`p-3 rounded-full w-fit mb-4 ${color}`}>
                <Icon size={24} />
            </div>
            <h3 className="text-lg font-bold mb-2">{title}</h3>
            <p className="text-secondary text-sm">{description}</p>
        </Card>
    </Link>
);

const ReportsHub = () => {
    return (
        <div className="reports-container">
            <div className="reports-header mb-6">
                <div>
                    <h1 className="text-2xl">Reports Hub</h1>
                    <p className="text-secondary text-sm">Deep dive into your financial health.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <ReportLink
                    title="Balance Sheet"
                    description="A snapshot of your company's assets, liabilities, and equity at a specific point in time."
                    icon={FileText}
                    to="/reports/balance-sheet"
                    color="bg-primary-subtle text-primary"
                />
                <ReportLink
                    title="Aged Receivables"
                    description="See who owes you money and how long it's been outstanding."
                    icon={Clock}
                    to="/reports/aged-receivables"
                    color="bg-warning-subtle text-warning"
                />
                <ReportLink
                    title="Profit & Loss"
                    description="Detailed breakdown of revenues, costs, and expenses over time."
                    icon={TrendingUp}
                    to="/profit-loss"
                    color="bg-success-subtle text-success"
                />
                <ReportLink
                    title="Cash Flow"
                    description="Track cash coming in and going out of your business."
                    icon={PieChart}
                    to="/cash-flow"
                    color="bg-accent-subtle text-accent"
                />
            </div>
        </div>
    );
};

export default ReportsHub;
