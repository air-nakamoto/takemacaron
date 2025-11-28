
export interface Budget {
  total: number;      // 月の総予算
  spent: number;      // 使った金額
  remaining: number;  // 残り予算
  startDate: string;  // 期間開始日
  endDate: string;    // 期間終了日
}

export interface Expense {
  id: number;
  date: string;
  category: string;
  amount: number;
  memo: string;
}

export interface FixedCost {
  id: number;
  title: string;
  amount: number;
  paymentDate: string; // e.g., "27日", "月末"
  memo: string;
}

export interface BudgetResult {
  id: string;
  startDate: string;
  endDate: string;
  totalBudget: number;
  spent: number;
  remaining: number;
}

export const EXPENSE_CATEGORIES = [
  "食費",
  "日用品",
  "交通費",
  "交際費",
  "趣味",
  "その他"
];
