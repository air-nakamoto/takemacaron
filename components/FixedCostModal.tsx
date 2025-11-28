
import React, { useState } from 'react';
import { FixedCost } from '../types';
import { X, Plus, Trash2, Edit2, Check, CreditCard, CalendarClock } from 'lucide-react';

interface FixedCostModalProps {
  fixedCosts: FixedCost[];
  onClose: () => void;
  onAdd: (cost: Omit<FixedCost, 'id'>) => void;
  onUpdate: (cost: FixedCost) => void;
  onDelete: (id: number) => void;
}

export const FixedCostModal: React.FC<FixedCostModalProps> = ({ fixedCosts, onClose, onAdd, onUpdate, onDelete }) => {
  const [view, setView] = useState<'list' | 'form'>('list');
  const [editingId, setEditingId] = useState<number | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [paymentDate, setPaymentDate] = useState('');
  const [memo, setMemo] = useState('');

  const totalFixed = fixedCosts.reduce((sum, item) => sum + item.amount, 0);

  const resetForm = () => {
    setTitle('');
    setAmount('');
    setPaymentDate('');
    setMemo('');
    setEditingId(null);
    setView('list');
  };

  const startEdit = (cost: FixedCost) => {
    setTitle(cost.title);
    setAmount(cost.amount.toString());
    setPaymentDate(cost.paymentDate);
    setMemo(cost.memo);
    setEditingId(cost.id);
    setView('form');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amountNum = parseInt(amount, 10);
    if (!title || !amountNum) return;

    const costData = {
      title,
      amount: amountNum,
      paymentDate,
      memo
    };

    if (editingId) {
      onUpdate({ ...costData, id: editingId });
    } else {
      onAdd(costData);
    }
    resetForm();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>

      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden max-h-[85vh] flex flex-col animate-[fadeIn_0.2s_ease-out]">
        {/* Header */}
        <div className="p-6 pb-4 border-b border-slate-100 flex justify-between items-center bg-white sticky top-0 z-10">
          <div className="flex items-center gap-2 text-slate-700">
            <div className="p-2 bg-blue-100 text-blue-500 rounded-full">
              <CreditCard size={20} />
            </div>
            <div>
              <h3 className="font-bold text-lg leading-tight">固定費の管理</h3>
              <p className="text-xs text-slate-400">合計: ¥{totalFixed.toLocaleString()}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 bg-slate-100 text-slate-500 rounded-full hover:bg-slate-200 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto bg-slate-50 p-4">

          {view === 'list' ? (
            <div className="space-y-3">
              <button
                onClick={() => setView('form')}
                className="w-full py-3 border-2 border-dashed border-blue-200 rounded-2xl text-blue-400 font-bold flex items-center justify-center gap-2 hover:bg-blue-50 transition-colors"
              >
                <Plus size={18} />
                固定費を追加する
              </button>

              {fixedCosts.length === 0 && (
                <div className="text-center py-8 text-slate-400 text-sm">
                  家賃、サブスク、保険料など<br />毎月決まった出費を登録しましょう
                </div>
              )}

              {fixedCosts.map(cost => (
                <div key={cost.id} className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex justify-between items-center group">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-slate-700">{cost.title}</span>
                      {cost.paymentDate && (
                        <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full flex items-center gap-1">
                          <CalendarClock size={10} />
                          {cost.paymentDate}
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-slate-400">{cost.memo}</div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className="font-bold text-slate-700">¥{cost.amount.toLocaleString()}</span>
                    <div className="flex gap-1 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          startEdit(cost);
                        }}
                        className="p-2.5 bg-blue-50 text-blue-400 rounded-lg hover:bg-blue-100"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onDelete(cost.id);
                        }}
                        className="p-2.5 bg-rose-50 text-rose-400 rounded-lg hover:bg-rose-100"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1 ml-1">タイトル</label>
                <input
                  type="text"
                  required
                  placeholder="家賃、電気代など"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-300 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1 ml-1">金額</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold">¥</span>
                  <input
                    type="number"
                    required
                    inputMode="numeric"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full pl-8 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-300 outline-none font-bold"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1 ml-1">引き落とし日など</label>
                  <input
                    type="text"
                    placeholder="27日"
                    value={paymentDate}
                    onChange={(e) => setPaymentDate(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-300 outline-none text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1 ml-1">メモ</label>
                  <input
                    type="text"
                    placeholder="詳細..."
                    value={memo}
                    onChange={(e) => setMemo(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-300 outline-none text-sm"
                  />
                </div>
              </div>
              <div className="flex gap-2 pt-2">
                <button type="submit" className="flex-1 bg-blue-400 hover:bg-blue-500 text-white font-bold py-2 rounded-xl flex items-center justify-center gap-1">
                  <Check size={16} /> 保存
                </button>
                <button type="button" onClick={resetForm} className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-500 font-bold py-2 rounded-xl flex items-center justify-center gap-1">
                  <X size={16} /> キャンセル
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
