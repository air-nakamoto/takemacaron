
import React, { useState } from 'react';
import { EXPENSE_CATEGORIES } from '../types';
import { PlusCircle, Calendar, Tag, FileText, JapaneseYen, X, Check } from 'lucide-react';

interface ExpenseFormProps {
  onAddExpense: (date: string, category: string, amount: number, memo: string) => void;
  onCancel?: () => void; // Optional: purely for the mobile modal view
}

export const ExpenseForm: React.FC<ExpenseFormProps> = ({ onAddExpense, onCancel }) => {
  const today = new Date().toISOString().split('T')[0];
  const [date, setDate] = useState(today);
  const [category, setCategory] = useState(EXPENSE_CATEGORIES[0]);
  const [amount, setAmount] = useState('');
  const [memo, setMemo] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amountNum = parseInt(amount, 10);
    if (!amountNum || amountNum <= 0) return;

    onAddExpense(date, category, amountNum, memo);
    
    // Reset fields (keep date and category as they might add multiple similar items)
    setAmount('');
    setMemo('');
    
    // Close modal if needed
    if (onCancel) onCancel();
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-4 shadow-lg border border-slate-100 h-auto relative">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold text-slate-700 flex items-center">
            <span className="bg-rose-100 text-rose-500 p-2 rounded-full mr-2">
                <PlusCircle size={20} />
            </span>
            支出を記録
        </h3>
        
        <div className="flex items-center gap-2">
            {/* Header Add Button (Mobile Only) - Allows quick submit without scrolling */}
            <button
                type="submit"
                className="md:hidden bg-rose-400 text-white text-xs font-bold px-3 py-2 rounded-full shadow-sm active:scale-95 transition-transform flex items-center gap-1"
            >
                <Check size={14} />
                <span>追加</span>
            </button>

            {onCancel && (
                <button 
                    type="button"
                    onClick={onCancel}
                    className="p-2 bg-slate-100 text-slate-500 rounded-full hover:bg-slate-200 transition-colors"
                >
                    <X size={20} />
                </button>
            )}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-3">
        
        {/* Date Input */}
        <div className="lg:col-span-3">
            <label className="block text-xs font-bold text-slate-400 mb-1 ml-1">日付</label>
            <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Calendar size={16} />
                </div>
                <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full pl-10 pr-2 py-2.5 bg-slate-50 border border-slate-200 text-slate-700 rounded-xl focus:ring-2 focus:ring-rose-300 focus:border-rose-300 outline-none transition-all font-medium text-sm"
                />
            </div>
        </div>

        {/* Category Input */}
        <div className="lg:col-span-3">
             <label className="block text-xs font-bold text-slate-400 mb-1 ml-1">カテゴリ</label>
             <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Tag size={16} />
                </div>
                <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full pl-10 pr-8 py-2.5 bg-slate-50 border border-slate-200 text-slate-700 rounded-xl focus:ring-2 focus:ring-rose-300 focus:border-rose-300 outline-none appearance-none transition-all font-medium cursor-pointer text-sm"
                >
                    {EXPENSE_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                        {cat}
                    </option>
                    ))}
                </select>
            </div>
        </div>

        {/* Amount Input */}
        <div className="lg:col-span-3">
            <label className="block text-xs font-bold text-slate-400 mb-1 ml-1">金額</label>
            <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <JapaneseYen size={16} />
                </div>
                <input
                    type="number"
                    inputMode="numeric" 
                    required
                    min="1"
                    placeholder="0"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 text-slate-700 rounded-xl focus:ring-2 focus:ring-rose-300 focus:border-rose-300 outline-none transition-all font-bold text-lg placeholder-slate-300"
                />
            </div>
        </div>

        {/* Memo Input & Submit */}
        <div className="lg:col-span-3 flex flex-col md:flex-row gap-2 items-end">
            <div className="w-full relative">
                 <label className="block text-xs font-bold text-slate-400 mb-1 ml-1">メモ</label>
                 <div className="absolute inset-y-0 left-0 pl-3 pt-8 flex items-start pointer-events-none text-slate-400">
                     <FileText size={16} />
                 </div>
                <input
                    type="text"
                    placeholder="用途など"
                    value={memo}
                    onChange={(e) => setMemo(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 text-slate-700 rounded-xl focus:ring-2 focus:ring-rose-300 focus:border-rose-300 outline-none transition-all text-sm"
                />
            </div>
            
            {/* Desktop/Bottom Submit Button */}
            <button
                type="submit"
                className="w-full md:w-auto h-[46px] bg-rose-400 hover:bg-rose-500 text-white font-bold py-2 px-6 rounded-xl shadow-md hover:shadow-lg transform active:scale-95 transition-all flex items-center justify-center whitespace-nowrap hidden md:flex"
            >
                追加
            </button>
            {/* Mobile Bottom Button (Also available if user scrolls down) */}
             <button
                type="submit"
                className="w-full h-[46px] bg-rose-400 hover:bg-rose-500 text-white font-bold py-2 px-6 rounded-xl shadow-md transform active:scale-95 transition-all flex items-center justify-center whitespace-nowrap md:hidden mt-2"
            >
                追加
            </button>
        </div>

      </div>
    </form>
  );
};
