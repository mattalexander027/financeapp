import React, { useMemo } from 'react';
import { Lightbulb, TrendingUp, AlertTriangle, CheckCircle } from 'lucide-react';
import Card from './Card';
import { useFinance } from '../data/FinanceContext';

const InsightItem = ({ icon: Icon, title, message, type }) => {
    const colors = {
        success: 'bg-success-subtle text-success',
        warning: 'bg-warning-subtle text-warning',
        info: 'bg-accent-subtle text-accent',
        primary: 'bg-primary-subtle text-primary'
    };
    const colorClass = colors[type] || colors.primary;

    return (
        <div className="flex items-start gap-4 p-4 border-b border-subtle last:border-0 hover:bg-secondary-subtle transition-colors">
            <div className={`p-2 rounded-lg ${colorClass} shrink-0`}>
                <Icon size={20} />
            </div>
            <div>
                <h4 className="font-bold text-sm mb-1">{title}</h4>
                <p className="text-secondary text-sm leading-relaxed">{message}</p>
            </div>
        </div>
    );
};

const InsightsWidget = () => {
    const { summary, monthlyData, expenses } = useFinance();

    const insights = useMemo(() => {
        const list = [];
        const currentMonth = monthlyData[monthlyData.length - 1];
        const prevMonth = monthlyData[monthlyData.length - 2] || currentMonth;

        // Revenue Insight
        if (currentMonth.revenue > prevMonth.revenue) {
            const growth = ((currentMonth.revenue - prevMonth.revenue) / prevMonth.revenue * 100).toFixed(0);
            list.push({
                id: 1,
                icon: TrendingUp,
                title: 'Revenue Growth',
                message: `Great job! Revenue is up ${growth}% compared to last month. Keep pushing sales.`,
                type: 'success'
            });
        }

        // Expense Warning
        const rentExpense = expenses.find(e => e.category === 'Rent');
        if (rentExpense && rentExpense.amount > 4000) {
            list.push({
                id: 2,
                icon: AlertTriangle,
                title: 'High Fixed Costs',
                message: 'Your Rent expense is 15% of your total burn. Consider renegotiating your lease.',
                type: 'warning'
            });
        }

        // Tax Tip
        if (summary.netProfit > 10000) {
            list.push({
                id: 3,
                icon: Lightbulb,
                title: 'Tax Optimization',
                message: `You have set aside $${(summary.netProfit * 0.25).toFixed(0)} for taxes. Consider prepaying some annual software subscriptions to lower taxable income.`,
                type: 'info'
            });
        }

        // Runway
        if (summary.cashOnHand > 20000) {
            list.push({
                id: 4,
                icon: CheckCircle,
                title: 'Healthy Runway',
                message: 'You have over 6 months of cash runway. It might be a good time to invest in marketing.',
                type: 'success'
            });
        }

        return list;
    }, [summary, monthlyData, expenses]);

    return (
        <Card className="h-full">
            <div className="flex items-center gap-2 mb-4">
                <Lightbulb className="text-accent" size={20} />
                <h3 className="text-lg font-bold">AI CFO Insights</h3>
            </div>
            <div className="flex flex-col">
                {insights.slice(0, 3).map(insight => (
                    <InsightItem key={insight.id} {...insight} />
                ))}
            </div>
        </Card>
    );
};

export default InsightsWidget;
