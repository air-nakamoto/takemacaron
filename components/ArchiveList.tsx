
import React, { useState } from 'react';
import { BudgetResult } from '../types';
import { History, Award, AlertCircle, X, Trash2, Edit2, Check, ArrowRight } from 'lucide-react';

interface ArchiveListProps {
  archives: BudgetResult[];
  onClose: () => void;
  onDelete: (id: string) => void;
  onUpdate: (record: BudgetResult) => void;
}

export const ArchiveList: React.FC<ArchiveListProps> = ({ archives, onClose, onDelete, onUpdate }) => {
  // Editing State
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<BudgetResult | null>(null);

  // Sort by end date descending
  const sortedArchives = [...archives].sort((a, b) => new Date(b.endDate).getTime() - new Date(a.endDate).getTime());

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return `${d.getMonth() + 1}/${d.getDate()}`;
  };

  const startEdit = (record: BudgetResult, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setEditingId(record.id);
    setEditForm({ ...record });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm(null);
  };

  const saveEdit = () => {
    if (editForm) {
      // Recalculate remaining
      const newRemaining = editForm.totalBudget - editForm.spent;
      onUpdate({ ...editForm, remaining: newRemaining });
      setEditingId(null);
      setEditForm(null);
    }
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(id);
  };

  const updateFormValue = (key: keyof BudgetResult, value: string | number) => {
    if (!editForm) return;
    setEditForm({ ...editForm, [key]: value });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>
      
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden max-h-[85vh] flex flex-col animate-[fadeIn_0.2s_ease-out]">
        <div className="p-6 pb-4 border-b border-slate-100 flex justify-between items-center bg-white sticky top-0 z-10">
          <div className="flex items-center gap-2 text-slate-700">
            <History size={24} className="text-rose-400" />
            <h3 className="font-bold text-lg">過去の記録</h3>
          </div>
          <button 
            onClick={onClose}
            className="p-2 bg-slate-100 text-slate-500 rounded-full hover:bg-slate-200 transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="overflow-y-auto p-4 space-y-3 bg-slate-50 flex-1">
          {archives.length === 0 ? (
            <div className="text-center py-10 text-slate-400 font-medium">
              まだ記録がありません
            </div>
          ) : (
            sortedArchives.map((record) => {
              // --- EDIT MODE ---
              if (editingId === record.id && editForm) {
                return (
                  <div key={record.id} className="p-4 bg-white rounded-2xl shadow-md border-2 border-rose-100 space-y-3">
                    <div className="grid grid-cols-2 gap-2">
                        <div>
                            <label className="text-xs text-slate-400 font-bold ml-1">開始日</label>
                            <input 
                                type="date" 
                                value={editForm.startDate} 
                                onChange={(e) => updateFormValue('startDate', e.target.value)}
                                className="w-full text-xs px-2 py-2 rounded-lg bg-slate-50 border border-slate-200"
                            />
                        </div>
                        <div>
                            <label className="text-xs text-slate-400 font-bold ml-1">終了日</label>
                            <input 
                                type="date" 
                                value={editForm.endDate} 
                                onChange={(e) => updateFormValue('endDate', e.target.value)}
                                className="w-full text-xs px-2 py-2 rounded-lg bg-slate-50 border border-slate-200"
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                         <div>
                            <label className="text-xs text-slate-400 font-bold ml-1">予算</label>
                            <input 
                                type="number" 
                                value={editForm.totalBudget} 
                                onChange={(e) => updateFormValue('totalBudget', parseInt(e.target.value) || 0)}
                                className="w-full text-sm px-2 py-2 rounded-lg bg-slate-50 border border-slate-200 font-bold"
                            />
                        </div>
                         <div>
                            <label className="text-xs text-slate-400 font-bold ml-1">使った金額</label>
                            <input 
                                type="number" 
                                value={editForm.spent} 
                                onChange={(e) => updateFormValue('spent', parseInt(e.target.value) || 0)}
                                className="w-full text-sm px-2 py-2 rounded-lg bg-slate-50 border border-slate-200 font-bold text-rose-500"
                            />
                        </div>
                    </div>
                    <div className="flex gap-2 pt-2">
                        <button 
                            onClick={saveEdit}
                            className="flex-1 bg-emerald-400 text-white text-xs font-bold py-2 rounded-lg flex items-center justify-center gap-1 shadow-sm hover:bg-emerald-500"
                        >
                            <Check size={14} /> 保存
                        </button>
                        <button 
                            onClick={cancelEdit}
                            className="flex-1 bg-slate-100 text-slate-500 text-xs font-bold py-2 rounded-lg flex items-center justify-center gap-1 hover:bg-slate-200"
                        >
                            <X size={14} /> キャンセル
                        </button>
                    </div>
                  </div>
                );
              }

              // --- VIEW MODE ---
              const isSuccess = record.remaining >= 0;
              const colorClass = isSuccess ? 'text-emerald-500' : 'text-slate-500';
              
              return (
                <div key={record.id} className="group flex flex-col p-4 bg-white rounded-2xl shadow-sm border border-slate-100 transition-colors hover:border-rose-100">
                  <div className="flex justify-between items-start">
                      <div>
                        <div className="text-xs font-bold text-slate-400 mb-1 flex items-center gap-1">
                          <span>{formatDate(record.startDate)}</span>
                          <ArrowRight size={10} />
                          <span>{formatDate(record.endDate)}</span>
                        </div>
                        <div className="text-sm text-slate-600 font-medium">
                            予算: ¥{record.totalBudget.toLocaleString()}
                        </div>
                      </div>

                      <div className="text-right">
                        <div className={`font-black text-xl ${colorClass} flex items-center justify-end gap-1`}>
                            {isSuccess ? <Award size={18} /> : <AlertCircle size={18} />}
                            <span>{isSuccess ? '+' : ''}¥{record.remaining.toLocaleString()}</span>
                        </div>
                        <div className={`text-xs font-bold ${isSuccess ? 'text-emerald-400' : 'text-slate-400'}`}>
                            {isSuccess ? '達成！' : '-超過'}
                        </div>
                      </div>
                  </div>

                  {/* Actions (Edit/Delete) - visible on hover or always on mobile */}
                  <div className="flex justify-end gap-2 mt-3 pt-3 border-t border-slate-50">
                    <button 
                        onClick={(e) => startEdit(record, e)}
                        className="p-1.5 text-slate-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors flex items-center gap-1 text-xs font-bold"
                    >
                        <Edit2 size={14} /> 編集
                    </button>
                    <button 
                        onClick={(e) => handleDelete(record.id, e)}
                        className="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors flex items-center gap-1 text-xs font-bold"
                    >
                        <Trash2 size={14} /> 削除
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
      <style>{`
        @keyframes fadeIn {
            from { opacity: 0; transform: scale(0.95); }
            to { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
};
