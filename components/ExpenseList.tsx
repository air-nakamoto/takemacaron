
import React, { useState } from 'react';
import { Expense, EXPENSE_CATEGORIES } from '../types';
import { Coffee, ShoppingBag, Train, Users, Smile, HelpCircle, Trash2, Edit2, Check, X } from 'lucide-react';

interface ExpenseListProps {
  expenses: Expense[];
  onDeleteExpense: (id: number) => void;
  onUpdateExpense: (expense: Expense) => void;
}

const getCategoryIcon = (category: string) => {
  switch (category) {
    case '食費': return <Coffee size={18} className="text-amber-500" />;
    case '日用品': return <ShoppingBag size={18} className="text-blue-500" />;
    case '交通費': return <Train size={18} className="text-emerald-500" />;
    case '交際費': return <Users size={18} className="text-rose-500" />;
    case '趣味': return <Smile size={18} className="text-purple-500" />;
    default: return <HelpCircle size={18} className="text-slate-500" />;
  }
};

export const ExpenseList: React.FC<ExpenseListProps> = ({ expenses, onDeleteExpense, onUpdateExpense }) => {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<Expense | null>(null);

  const startEdit = (expense: Expense, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setEditingId(expense.id);
    setEditForm({ ...expense });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm(null);
  };

  const saveEdit = () => {
    if (editForm) {
      onUpdateExpense(editForm);
      setEditingId(null);
      setEditForm(null);
    }
  };

  const handleDelete = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    onDeleteExpense(id);
  };

  const updateFormValue = (key: keyof Expense, value: string | number) => {
    if (!editForm) return;
    setEditForm({ ...editForm, [key]: value });
  };

  if (expenses.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-3xl border border-dashed border-slate-300">
        <p className="text-slate-400 font-medium">まだ記録がありません 🍬</p>
      </div>
    );
  }

  // Sort by ID descending (newest first)
  const sortedExpenses = [...expenses].sort((a, b) => b.id - a.id);

  return (
    <div className="bg-white rounded-3xl shadow-lg border border-slate-100 overflow-hidden">
      <div className="bg-slate-50 px-6 py-4 border-b border-slate-100 flex justify-between items-center">
        <h3 className="font-bold text-slate-600">履歴</h3>
        <span className="text-xs font-bold text-slate-400 bg-white px-2 py-1 rounded-full border border-slate-200">Total items: {expenses.length}</span>
      </div>
      <div className="divide-y divide-slate-100 max-h-[500px] overflow-y-auto">
        {sortedExpenses.map((expense) => {
          // --- EDIT MODE ---
          if (editingId === expense.id && editForm) {
            return (
              <div key={expense.id} className="p-4 bg-rose-50 border-l-4 border-rose-300 animate-[fadeIn_0.2s]">
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <div>
                    <label className="text-xs font-bold text-slate-400 ml-1">日付</label>
                    <input
                      type="date"
                      value={editForm.date}
                      onChange={(e) => updateFormValue('date', e.target.value)}
                      className="w-full text-sm px-2 py-2 rounded-lg bg-white border border-rose-200 focus:outline-none focus:ring-1 focus:ring-rose-300"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-400 ml-1">カテゴリ</label>
                    <select
                      value={editForm.category}
                      onChange={(e) => updateFormValue('category', e.target.value)}
                      className="w-full text-sm px-2 py-2 rounded-lg bg-white border border-rose-200 focus:outline-none focus:ring-1 focus:ring-rose-300"
                    >
                      {EXPENSE_CATEGORIES.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                  <div>
                    <label className="text-xs font-bold text-slate-400 ml-1">金額</label>
                    <input
                      type="number"
                      inputMode="numeric"
                      value={editForm.amount}
                      onChange={(e) => updateFormValue('amount', parseInt(e.target.value) || 0)}
                      className="w-full font-bold text-lg px-2 py-2 rounded-lg bg-white border border-rose-200 text-slate-700 focus:outline-none focus:ring-1 focus:ring-rose-300"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-400 ml-1">メモ</label>
                    <input
                      type="text"
                      value={editForm.memo}
                      onChange={(e) => updateFormValue('memo', e.target.value)}
                      className="w-full text-sm px-2 py-2.5 rounded-lg bg-white border border-rose-200 focus:outline-none focus:ring-1 focus:ring-rose-300"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={saveEdit}
                    className="flex-1 bg-emerald-400 hover:bg-emerald-500 text-white text-xs font-bold py-2 rounded-lg flex items-center justify-center gap-1 shadow-sm transition-colors"
                  >
                    <Check size={14} /> 保存
                  </button>
                  <button
                    onClick={cancelEdit}
                    className="flex-1 bg-slate-200 hover:bg-slate-300 text-slate-500 text-xs font-bold py-2 rounded-lg flex items-center justify-center gap-1 transition-colors"
                  >
                    <X size={14} /> キャンセル
                  </button>
                </div>
              </div>
            );
          }

          // --- VIEW MODE ---
          return (
            <div key={expense.id} className="group p-4 hover:bg-rose-50 transition-colors flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-2xl bg-white border border-slate-100 shadow-sm flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                  {getCategoryIcon(expense.category)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-400">{expense.date}</span>
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-500">{expense.category}</span>
                  </div>
                  <div className="flex items-baseline mt-1">
                    <span className="font-medium text-slate-800">{expense.memo || 'No memo'}</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-end gap-1">
                <span className="text-lg font-bold text-slate-700">
                  -¥{expense.amount.toLocaleString()}
                </span>
                <div className="flex gap-1 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    type="button"
                    onClick={(e) => startEdit(expense, e)}
                    className="p-2.5 text-slate-300 hover:text-blue-500 hover:bg-blue-100 rounded-full transition-all"
                    title="編集"
                  >
                    <Edit2 size={18} />
                  </button>
                  <button
                    type="button"
                    onClick={(e) => handleDelete(expense.id, e)}
                    className="p-2.5 text-slate-300 hover:text-rose-500 hover:bg-rose-100 rounded-full transition-all"
                    title="削除"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <style>{`
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(-5px); }
            to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};
