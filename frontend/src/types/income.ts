export interface IncomeCreate {
  title: string;
  amount: number;
  income_date: string;
}

export interface IncomeUpdate {
  title?: string;
  amount?: number;
  income_date?: string;
}

export interface Income {
  id: number;
  title: string;
  amount: number;
  income_date: string;
  user_id: number;
}

export interface IncomeSummary {
  total_incomes: number;
  total_amount: number;
  average_income: number;
  highest_income: number;
  lowest_income: number;
}

export interface DashboardStats {
  month: number | null;
  year: number | null;
  total_income: number;
  total_expenses: number;
  balance: number;
  income_count: number;
  expense_count: number;
}
