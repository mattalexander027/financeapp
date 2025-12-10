import React, { useState } from 'react';
import { Target, Edit2 } from 'lucide-react';
import Card from './Card';
import Button from './Button';
import { useFinance } from '../data/FinanceContext';

const ProgressBar = ({ label, current, target, colorClass }) => {
    const percent = Math.min((current / target) * 100, 100);
    const format = (val) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val);

    return (
        <div className="mb-6 last:mb-0">
            <div className="flex justify-between items-end mb-2">
                <span className="font-bold text-sm">{label}</span>
                <span className="text-xs text-secondary">
                    <span className="text-primary font-bold">{format(current)}</span> / {format(target)}
                </span>
            </div>
            <div className="h-3 bg-secondary-subtle rounded-full overflow-hidden">
                <div
                    className={`h-full rounded-full transition-all duration-1000 ${colorClass}`}
                    style={{ width: `${percent}%` }}
                ></div>
            </div>
            <div className="text-right mt-1">
                <span className="text-xs text-secondary font-mono">{percent.toFixed(1)}%</span>
            </div>
        </div>
    );
};

const GoalsWidget = () => {
    const { summary, goals, updateGoals } = useFinance();
    const [isEditing, setIsEditing] = useState(false);
    const [editValues, setEditValues] = useState(goals || { revenue: 100000, profit: 50000 });

    const handleSave = () => {
        updateGoals(editValues);
        setIsEditing(false);
    };

    return (
        <Card className="h-full">
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-2">
                    <Target className="text-success" size={20} />
                    <h3 className="text-lg font-bold">Monthly Goals</h3>
                </div>
                <Button variant="ghost" size="sm" onClick={() => isEditing ? handleSave() : setIsEditing(true)}>
                    {isEditing ? 'Save' : <Edit2 size={16} />}
                </Button>
            </div>

            {isEditing ? (
                <div className="flex flex-col gap-4">
                    <div>
                        <label className="text-xs font-bold text-secondary uppercase mb-1 block">Revenue Target</label>
                        <input
                            type="number"
                            className="bg-bg-secondary w-full p-2 rounded border border-subtle text-primary"
                            value={editValues.revenue}
                            onChange={(e) => setEditValues({ ...editValues, revenue: Number(e.target.value) })}
                        />
                    </div>
                    <div>
                        <label className="text-xs font-bold text-secondary uppercase mb-1 block">Profit Target</label>
                        <input
                            type="number"
                            className="bg-bg-secondary w-full p-2 rounded border border-subtle text-primary"
                            value={editValues.profit}
                            onChange={(e) => setEditValues({ ...editValues, profit: Number(e.target.value) })}
                        />
                    </div>
                </div>
            ) : (
                <div>
                    <ProgressBar
                        label="Revenue Goal"
                        current={summary.revenueYTD}
                        target={goals?.revenue || 100000}
                        colorClass="bg-accent"
                    />
                    <ProgressBar
                        label="Profit Goal"
                        current={summary.netProfit}
                        target={goals?.profit || 50000}
                        colorClass="bg-success"
                    />
                </div>
            )}
        </Card>
    );
};

export default GoalsWidget;
