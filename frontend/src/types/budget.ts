export interface Budget {
  id: number;
  month: string;
  amount: number;
}

export interface BudgetProgress extends Budget {
  spent: number;
  remaining: number;
  percentage: number;
}

export interface BudgetCreate {
  amount: number;
  month?: string;
}

export interface BudgetUpdate {
  amount: number;
}
