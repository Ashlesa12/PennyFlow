export interface ExpenseCreate {
  title: string;
  amount: number;
  expense_date: string;
  category_id: number;
}

export interface ExpenseUpdate {
  title?: string;
  amount?: number;
  expense_date?: string;
  category_id?: number;
}

export interface Expense {
  id: number;
  title: string;
  amount: number;
  expense_date: string;
  user_id: number;
  category_id: number;
}

export interface ExpenseSummary {
  total_expenses: number;
  total_amount: number;
  average_expense: number;
  highest_expense: number;
  lowest_expense: number;
}

export interface CategorySummary {
  category: string;
  total: number;
}

export interface MonthlySummary {
  month: string;
  total: number;
}

export interface Category {
  id: number;
  name: string;
  icon: string;
}
