
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Budget, Expense, BudgetResult, FixedCost } from './types';
import { BudgetOverview } from './components/BudgetOverview';
import { ExpenseForm } from './components/ExpenseForm';
import { ExpenseList } from './components/ExpenseList';
import { ArchiveList } from './components/ArchiveList';
import { FixedCostModal } from './components/FixedCostModal';
import { BudgetSettingsModal } from './components/BudgetSettingsModal';
import { LoginButton } from './components/LoginButton';
import { Plus, History, Settings, CreditCard } from 'lucide-react';

function App() {
  // --- Helpers ---

  // Format date as YYYY-MM-DD using local time
  const toDateStr = (d: Date) => {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const getDefaultDates = () => {
    const today = new Date();
    const start = new Date(today.getFullYear(), today.getMonth(), 1); // 1st of this month
    const end = new Date(today.getFullYear(), today.getMonth() + 1, 0); // Last day of this month
    return { start: toDateStr(start), end: toDateStr(end) };
  };

  const getSampleArchives = (): BudgetResult[] => {
    const today = new Date();
    // 1 month ago
    const m1Start = new Date(today.getFullYear(), today.getMonth() - 1, 1);
    const m1End = new Date(today.getFullYear(), today.getMonth(), 0);
    // 2 months ago
    const m2Start = new Date(today.getFullYear(), today.getMonth() - 2, 1);
    const m2End = new Date(today.getFullYear(), today.getMonth() - 1, 0);

    return [
      {
        id: "sample-1",
        startDate: toDateStr(m1Start),
        endDate: toDateStr(m1End),
        totalBudget: 50000,
        spent: 42300,
        remaining: 7700
      },
      {
        id: "sample-2",
        startDate: toDateStr(m2Start),
        endDate: toDateStr(m2End),
        totalBudget: 50000,
        spent: 51200,
        remaining: -1200
      }
    ];
  };

  const defaultDates = getDefaultDates();

  // --- State Management ---

  // 1. Settings (Total Budget & Period)
  const [budgetSettings, setBudgetSettings] = useState<{ total: number, start: string, end: string }>(() => {
    const savedTotal = localStorage.getItem('takemacaron_total');
    const savedStart = localStorage.getItem('takemacaron_start');
    const savedEnd = localStorage.getItem('takemacaron_end');
    return {
      total: savedTotal ? parseInt(savedTotal, 10) : 200000, // Default higher since it includes fixed costs
      start: savedStart || defaultDates.start,
      end: savedEnd || defaultDates.end
    };
  });

  // 2. Expenses
  const [expenses, setExpenses] = useState<Expense[]>(() => {
    const saved = localStorage.getItem('takemacaron_expenses');
    return saved ? JSON.parse(saved) : [];
  });

  // 3. Fixed Costs
  const [fixedCosts, setFixedCosts] = useState<FixedCost[]>(() => {
    const saved = localStorage.getItem('takemacaron_fixed_costs');
    return saved ? JSON.parse(saved) : [];
  });

  // 4. Archives (Past Results)
  const [archives, setArchives] = useState<BudgetResult[]>(() => {
    const saved = localStorage.getItem('takemacaron_archives');
    return saved ? JSON.parse(saved) : getSampleArchives();
  });

  // UI State
  const [isMobileFormOpen, setIsMobileFormOpen] = useState(false);
  const [showArchives, setShowArchives] = useState(false);
  const [showFixedCosts, setShowFixedCosts] = useState(false);
  const [showBudgetSettings, setShowBudgetSettings] = useState(false);

  // --- Effects ---
  useEffect(() => {
    localStorage.setItem('takemacaron_total', budgetSettings.total.toString());
    localStorage.setItem('takemacaron_start', budgetSettings.start);
    localStorage.setItem('takemacaron_end', budgetSettings.end);
  }, [budgetSettings]);

  useEffect(() => {
    localStorage.setItem('takemacaron_expenses', JSON.stringify(expenses));
  }, [expenses]);

  useEffect(() => {
    localStorage.setItem('takemacaron_fixed_costs', JSON.stringify(fixedCosts));
  }, [fixedCosts]);

  useEffect(() => {
    localStorage.setItem('takemacaron_archives', JSON.stringify(archives));
  }, [archives]);

  // --- Automatic Archive Check ---
  // Use ref to track the last processed end date to prevent infinite loops
  const lastProcessedEndDate = useRef<string | null>(null);

  useEffect(() => {
    const todayStr = toDateStr(new Date());
    const currentEndDate = budgetSettings.end;

    // Only proceed if:
    // 1. Today is strictly AFTER the end date
    // 2. We haven't already processed this end date
    if (todayStr <= currentEndDate) return;
    if (lastProcessedEndDate.current === currentEndDate) return;

    // Mark this end date as processed BEFORE making any state changes
    lastProcessedEndDate.current = currentEndDate;

    // Working variables
    let tempStart = budgetSettings.start;
    let tempEnd = budgetSettings.end;
    let tempTotal = budgetSettings.total;
    // Note: We assume fixed costs are relatively constant, but ideally we snapshot them.
    // For this simple MVP, we just use the current total.

    let newArchives: BudgetResult[] = [];
    let loopCount = 0;
    const MAX_LOOPS = 12;

    // Loop until we catch up to today
    while (todayStr > tempEnd && loopCount < MAX_LOOPS) {
      const periodExpenses = expenses.filter(e => e.date >= tempStart && e.date <= tempEnd);
      const periodSpent = periodExpenses.reduce((sum, item) => sum + item.amount, 0);

      // Calculate effective remaining for that period
      // Logic: Total Budget - Fixed Costs (Current snapshot) - Variable Spent
      // In a real app, we might need history of fixed costs, but this is MVP.
      const currentFixedTotal = fixedCosts.reduce((sum, fc) => sum + fc.amount, 0);
      const effectiveRemaining = tempTotal - currentFixedTotal - periodSpent;

      newArchives.unshift({
        id: `auto-${Date.now()}-${loopCount}`,
        startDate: tempStart,
        endDate: tempEnd,
        totalBudget: tempTotal,
        spent: periodSpent + currentFixedTotal, // Record total spent including fixed
        remaining: effectiveRemaining
      });

      const nextStartObj = new Date(tempEnd);
      nextStartObj.setDate(nextStartObj.getDate() + 1);

      const nextEndObj = new Date(nextStartObj);
      nextEndObj.setMonth(nextEndObj.getMonth() + 1);
      nextEndObj.setDate(nextEndObj.getDate() - 1);

      tempStart = toDateStr(nextStartObj);
      tempEnd = toDateStr(nextEndObj);

      loopCount++;
    }

    if (newArchives.length > 0) {
      setArchives(prev => [...newArchives, ...prev]);
      setBudgetSettings(prev => ({
        ...prev,
        start: tempStart,
        end: tempEnd
      }));

      setTimeout(() => {
        alert(`📅 期間（${newArchives[0].endDate}まで）が終了していたため、\n${newArchives.length}件の記録を自動保存しました！`);
        setShowArchives(true);
      }, 500);
    }

  }, [budgetSettings.end, budgetSettings.start, budgetSettings.total, expenses, fixedCosts]);

  // --- Logic ---

  const currentPeriodExpenses = useMemo(() => {
    return expenses.filter(e => e.date >= budgetSettings.start && e.date <= budgetSettings.end);
  }, [expenses, budgetSettings.start, budgetSettings.end]);

  const spent = useMemo(() => {
    return currentPeriodExpenses.reduce((sum, item) => sum + item.amount, 0);
  }, [currentPeriodExpenses]);

  const fixedCostTotal = useMemo(() => {
    return fixedCosts.reduce((sum, item) => sum + item.amount, 0);
  }, [fixedCosts]);

  // Remaining = (Total Budget - Fixed Costs) - Variable Spent
  const remaining = (budgetSettings.total - fixedCostTotal) - spent;

  const budget: Budget = {
    total: budgetSettings.total,
    spent: spent,
    remaining: remaining,
    startDate: budgetSettings.start,
    endDate: budgetSettings.end
  };

  // --- Handlers ---

  const handleUpdateBudget = (newTotal: number, newStart: string, newEnd: string) => {
    setBudgetSettings({
      total: newTotal,
      start: newStart,
      end: newEnd
    });
  };

  const handleAddExpense = (date: string, category: string, amount: number, memo: string) => {
    const newExpense: Expense = {
      id: Date.now(),
      date,
      category,
      amount,
      memo
    };
    setExpenses(prev => [...prev, newExpense]);
    setIsMobileFormOpen(false);
  };

  const handleUpdateExpense = (updatedExpense: Expense) => {
    setExpenses(prev => prev.map(e => e.id === updatedExpense.id ? updatedExpense : e));
  };

  const handleDeleteExpense = (id: number) => {
    if (window.confirm("この記録を削除しますか？")) {
      setExpenses(prev => prev.filter(e => e.id !== id));
    }
  };

  // Fixed Cost Handlers
  const handleAddFixedCost = (cost: Omit<FixedCost, 'id'>) => {
    const newCost: FixedCost = {
      ...cost,
      id: Date.now()
    };
    setFixedCosts(prev => [...prev, newCost]);
  };

  const handleUpdateFixedCost = (cost: FixedCost) => {
    setFixedCosts(prev => prev.map(c => c.id === cost.id ? cost : c));
  };

  const handleDeleteFixedCost = (id: number) => {
    if (window.confirm("この固定費設定を削除しますか？")) {
      setFixedCosts(prev => prev.filter(c => c.id !== id));
    }
  };

  // Archive Handlers
  const handleDeleteArchive = (id: string) => {
    if (window.confirm("このアーカイブ記録を削除しますか？\n（復元できません）")) {
      setArchives(prev => prev.filter(a => a.id !== id));
    }
  };

  const handleUpdateArchive = (updatedRecord: BudgetResult) => {
    setArchives(prev => prev.map(a => a.id === updatedRecord.id ? updatedRecord : a));
  };

  // Import/Export Handlers
  const handleExport = () => {
    const exportData = {
      version: "1.0",
      exportDate: new Date().toISOString(),
      budgetSettings,
      expenses,
      fixedCosts,
      archives
    };

    const dataStr = JSON.stringify(exportData, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');

    const today = new Date();
    const dateStr = `${today.getFullYear()}${String(today.getMonth() + 1).padStart(2, '0')}${String(today.getDate()).padStart(2, '0')}`;
    link.download = `takemacaron_backup_${dateStr}.json`;
    link.href = url;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json';

    input.onchange = (e: Event) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const importData = JSON.parse(event.target?.result as string);

          // Validate structure
          if (!importData.budgetSettings ||
            !Array.isArray(importData.expenses) ||
            !Array.isArray(importData.fixedCosts) ||
            !Array.isArray(importData.archives)) {
            alert("無効なファイル形式です。正しいバックアップファイルを選択してください。");
            return;
          }

          // Additional validation for budgetSettings
          if (typeof importData.budgetSettings.total !== 'number' ||
            typeof importData.budgetSettings.start !== 'string' ||
            typeof importData.budgetSettings.end !== 'string') {
            alert("無効なファイル形式です。予算設定が正しくありません。");
            return;
          }

          // Update all state
          if (window.confirm("データをインポートすると、現在のデータが上書きされます。続行しますか？")) {
            setBudgetSettings(importData.budgetSettings);
            setExpenses(importData.expenses);
            setFixedCosts(importData.fixedCosts);
            setArchives(importData.archives);
            alert("✅ データのインポートが完了しました！");
          }
        } catch (error) {
          alert("❌ ファイルの読み込みに失敗しました。JSONファイルが正しいか確認してください。");
          console.error("Import error:", error);
        }
      };
      reader.readAsText(file);
    };

    input.click();
  };


  return (
    <div className="min-h-screen bg-[#fdf2f8] py-4 md:py-8 px-4 font-sans text-slate-800 pb-24 md:pb-8">
      <div className="max-w-3xl mx-auto">

        {/* Header */}
        <header className="mb-6 flex flex-col md:flex-row items-center justify-between gap-4 md:gap-0">
          <h1 className="text-3xl md:text-4xl font-black text-rose-400 tracking-tight flex items-center gap-2">
            <span>🍬</span>
            <span>タケマカロン</span>
          </h1>

          <div className="flex items-center gap-2">
            <LoginButton />
            <button
              onClick={() => setShowBudgetSettings(true)}
              className="p-3 bg-white text-slate-400 hover:text-rose-400 rounded-full shadow-sm border border-slate-100 transition-all"
              aria-label="予算設定"
            >
              <Settings size={20} />
            </button>
            <button
              onClick={() => setShowFixedCosts(true)}
              className="p-3 bg-white text-slate-400 hover:text-blue-400 rounded-full shadow-sm border border-slate-100 transition-all"
              aria-label="固定費"
            >
              <CreditCard size={20} />
            </button>
            <button
              onClick={() => setShowArchives(true)}
              className="p-3 bg-white text-slate-400 hover:text-rose-400 rounded-full shadow-sm border border-slate-100 transition-all"
              aria-label="過去の記録"
            >
              <History size={20} />
            </button>
          </div>
        </header>

        <p className="text-center md:text-left text-slate-400 font-medium text-sm mb-6 -mt-4 ml-2 hidden md:block">
          記録より「予算」を大切にする家計簿
        </p>

        <main>
          <BudgetOverview
            budget={budget}
            fixedCostTotal={fixedCostTotal}
          />

          {/* Modals */}
          {showBudgetSettings && (
            <BudgetSettingsModal
              currentTotal={budgetSettings.total}
              currentStart={budgetSettings.start}
              currentEnd={budgetSettings.end}
              onClose={() => setShowBudgetSettings(false)}
              onSave={handleUpdateBudget}
              onExport={handleExport}
              onImport={handleImport}
            />
          )}

          {showFixedCosts && (
            <FixedCostModal
              fixedCosts={fixedCosts}
              onClose={() => setShowFixedCosts(false)}
              onAdd={handleAddFixedCost}
              onUpdate={handleUpdateFixedCost}
              onDelete={handleDeleteFixedCost}
            />
          )}

          {showArchives && (
            <ArchiveList
              archives={archives}
              onClose={() => setShowArchives(false)}
              onDelete={handleDeleteArchive}
              onUpdate={handleUpdateArchive}
            />
          )}

          <div className="hidden md:block mb-6">
            <ExpenseForm onAddExpense={handleAddExpense} />
          </div>

          <div className="mb-2 px-2">
            <h3 className="font-bold text-slate-600 text-sm">
              今の期間の支出 ({budgetSettings.start} ~ {budgetSettings.end})
            </h3>
          </div>
          <ExpenseList
            expenses={currentPeriodExpenses}
            onDeleteExpense={handleDeleteExpense}
            onUpdateExpense={handleUpdateExpense}
          />
        </main>

        {/* Mobile FAB */}
        <button
          onClick={() => setIsMobileFormOpen(true)}
          className="md:hidden fixed bottom-6 right-6 w-16 h-16 bg-rose-400 text-white rounded-full shadow-xl flex items-center justify-center transform transition hover:scale-110 active:scale-95 z-40"
        >
          <Plus size={32} strokeWidth={3} />
        </button>

        {/* Mobile Input Modal */}
        {isMobileFormOpen && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 md:hidden">
            <div
              className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
              onClick={() => setIsMobileFormOpen(false)}
            ></div>
            <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl animate-[slideUp_0.3s_ease-out] max-h-[85vh] overflow-y-auto">
              <ExpenseForm
                onAddExpense={handleAddExpense}
                onCancel={() => setIsMobileFormOpen(false)}
              />
            </div>
          </div>
        )}

        <footer className="mt-12 text-center text-slate-400 text-xs">
          <p>© 2025 Takemacaron Project.</p>
        </footer>
      </div>

      <style>{`
        @keyframes slideUp {
            from { transform: translateY(100%); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
}

export default App;
