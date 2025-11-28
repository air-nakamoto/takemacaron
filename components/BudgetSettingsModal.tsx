
import React, { useState, useEffect } from 'react';
import { Settings, X, Check } from 'lucide-react';

interface BudgetSettingsModalProps {
  currentTotal: number;
  currentStart: string;
  currentEnd: string;
  onClose: () => void;
  onSave: (total: number, start: string, end: string) => void;
  onExport: () => void;
  onImport: () => void;
}

export const BudgetSettingsModal: React.FC<BudgetSettingsModalProps> = ({ currentTotal, currentStart, currentEnd, onClose, onSave, onExport, onImport }) => {
  const [total, setTotal] = useState(currentTotal.toString());
  const [start, setStart] = useState(currentStart);
  const [end, setEnd] = useState(currentEnd);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseInt(total, 10);
    if (!isNaN(val) && val >= 0 && start && end) {
      if (start > end) {
        alert("開始日は終了日より前である必要があります");
        return;
      }
      onSave(val, start, end);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>

      <div className="relative w-full max-w-sm bg-white rounded-3xl shadow-2xl overflow-hidden animate-[fadeIn_0.2s_ease-out]">
        <div className="p-6 pb-4 border-b border-slate-100 flex justify-between items-center bg-white">
          <div className="flex items-center gap-2 text-slate-700">
            <Settings size={24} className="text-slate-400" />
            <h3 className="font-bold text-lg">予算の設定</h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 bg-slate-100 text-slate-500 rounded-full hover:bg-slate-200 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 bg-slate-50">
          <div>
            <label className="block text-xs font-bold text-slate-400 mb-1 ml-1">総予算 (月収など)</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold">¥</span>
              <input
                type="number"
                value={total}
                onChange={(e) => setTotal(e.target.value)}
                className="w-full pl-8 pr-3 py-3 rounded-xl border border-slate-200 font-bold text-lg text-slate-700 focus:ring-2 focus:ring-rose-300 outline-none"
                placeholder="例: 200000"
              />
            </div>
            <p className="text-[10px] text-slate-400 mt-1 ml-1">ここから固定費が自動で引かれます</p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-400 ml-1">開始日</label>
              <input type="date" value={start} onChange={(e) => setStart(e.target.value)} className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm font-medium focus:ring-2 focus:ring-rose-300 outline-none" />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-400 ml-1">終了日</label>
              <input type="date" value={end} onChange={(e) => setEnd(e.target.value)} className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm font-medium focus:ring-2 focus:ring-rose-300 outline-none" />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-rose-400 hover:bg-rose-500 text-white font-bold py-3 rounded-xl shadow-md mt-2 flex items-center justify-center gap-2"
          >
            <Check size={18} />
            設定を保存
          </button>

          {/* Data Management Section */}
          <div className="mt-6 pt-6 border-t border-slate-200">
            <h4 className="text-xs font-bold text-slate-400 mb-3 ml-1">データ管理</h4>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={onExport}
                className="bg-blue-50 hover:bg-blue-100 text-blue-500 font-bold py-2.5 rounded-xl flex items-center justify-center gap-2 transition-colors border border-blue-200"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
                エクスポート
              </button>
              <button
                type="button"
                onClick={onImport}
                className="bg-emerald-50 hover:bg-emerald-100 text-emerald-500 font-bold py-2.5 rounded-xl flex items-center justify-center gap-2 transition-colors border border-emerald-200"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="17 8 12 3 7 8" />
                  <line x1="12" y1="3" x2="12" y2="15" />
                </svg>
                インポート
              </button>
            </div>
            <p className="text-[10px] text-slate-400 mt-2 ml-1">
              JSONファイルでバックアップ・復元できます
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};
