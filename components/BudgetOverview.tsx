
import React from 'react';
import { Budget } from '../types';
import { CalendarRange, AlertCircle } from 'lucide-react';
import { Mascot } from './Mascot';

interface BudgetOverviewProps {
  budget: Budget;
  fixedCostTotal: number;
}

export const BudgetOverview: React.FC<BudgetOverviewProps> = ({ budget, fixedCostTotal }) => {
  
  // Calculate effective budget (Variable Budget)
  // Budget.remaining in props is already (Total - Fixed - Spent)
  // We need to reconstruct the "Usable Variable Budget" to show percentage correctly.
  const variableBudget = budget.total - fixedCostTotal;
  
  // Percentage of the VARIABLE budget remaining
  const percentRemaining = variableBudget > 0 ? (budget.remaining / variableBudget) * 100 : 0;
  const isOverBudget = budget.remaining < 0;
  
  // Color logic
  let textColorClass = "text-emerald-500";
  if (isOverBudget) textColorClass = "text-slate-400"; 
  else if (percentRemaining <= 20) textColorClass = "text-rose-500";
  else if (percentRemaining <= 50) textColorClass = "text-amber-500";

  let barColorClass = "bg-emerald-400";
  if (percentRemaining <= 20) barColorClass = "bg-rose-400";
  else if (percentRemaining <= 50) barColorClass = "bg-amber-400";

  // Date formatting
  const formatDate = (d: string) => {
    const date = new Date(d);
    return `${date.getMonth() + 1}/${date.getDate()}`;
  };

  return (
    <div className="bg-white rounded-3xl p-6 shadow-xl mb-6 relative overflow-hidden border-b-4 border-slate-100">
      <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-rose-200 via-amber-200 to-emerald-200"></div>
      
      {/* Header: Title & Date Range */}
      <div className="flex justify-between items-start mb-2">
        <div>
           <h2 className="text-slate-400 text-sm font-bold tracking-wider uppercase">Remaining Budget</h2>
           <div className="flex items-center gap-2 mt-1">
             <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
               <CalendarRange size={12} />
               {formatDate(budget.startDate)} - {formatDate(budget.endDate)}
             </span>
           </div>
        </div>
        <Mascot remainingPercentage={percentRemaining} />
      </div>

      {/* Big Number Display */}
      <div className="text-center py-2 flex flex-col items-center justify-center">
        <div className={`text-6xl md:text-7xl font-black tracking-tighter transition-colors duration-500 ${textColorClass} flex items-center gap-2`}>
          <span>¥{budget.remaining.toLocaleString()}</span>
        </div>
        {isOverBudget && (
          <div className="mt-2 flex items-center gap-1 text-slate-400 font-bold bg-slate-100 px-3 py-1 rounded-full text-sm">
            <AlertCircle size={14} />
            <span>OVER (超過)</span>
          </div>
        )}
      </div>

      {/* Calculation Breakdown */}
      <div className="flex justify-center gap-1 md:gap-3 text-[10px] md:text-xs text-slate-400 font-bold mb-4 bg-slate-50 py-2 rounded-lg mx-auto max-w-xs md:max-w-md px-2">
        <div className="flex flex-col items-center">
            <span>総予算</span>
            <span className="text-slate-600">¥{budget.total.toLocaleString()}</span>
        </div>
        <div className="self-center">-</div>
        <div className="flex flex-col items-center">
            <span>固定費</span>
            <span className="text-blue-400">¥{fixedCostTotal.toLocaleString()}</span>
        </div>
        <div className="self-center">=</div>
        <div className="flex flex-col items-center">
            <span>やりくり予算</span>
            <span className="text-emerald-500">¥{variableBudget.toLocaleString()}</span>
        </div>
      </div>

      {/* Progress Bar (Battery Style) */}
      <div className="mt-4 flex flex-col gap-4 bg-slate-50 rounded-2xl p-4">
        <div className="w-full">
            <div className="flex justify-between text-xs text-slate-500 mb-1 font-medium">
                <span>残り: {Math.max(0, Math.floor(percentRemaining))}%</span>
                <span>使用済み: ¥{budget.spent.toLocaleString()}</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-4 overflow-hidden relative">
                <div className="absolute inset-0 opacity-10 bg-[linear-gradient(45deg,transparent_25%,#000_25%,#000_50%,transparent_50%,transparent_75%,#000_75%,#000_100%)] bg-[length:10px_10px]"></div>
                
                <div 
                    className={`h-4 rounded-full transition-all duration-1000 ease-out relative z-10 ${barColorClass}`}
                    style={{ width: `${Math.max(0, Math.min(percentRemaining, 100))}%` }}
                ></div>
            </div>
        </div>
      </div>
    </div>
  );
};
