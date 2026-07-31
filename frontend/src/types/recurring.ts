export type RecurringFrequency = "Daily" | "Weekly" | "Monthly" | "Yearly";

export interface RecurringExpense {
  id: number;
  title: string;
  amount: number;
  category_id: number;
  frequency: RecurringFrequency;
  start_date: string;
  next_due_date: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface RecurringCreate {
  title: string;
  amount: number;
  category_id: number;
  frequency: RecurringFrequency;
  start_date: string;
  next_due_date?: string;
}

export interface RecurringUpdate {
  title?: string;
  amount?: number;
  category_id?: number;
  frequency?: RecurringFrequency;
  start_date?: string;
  next_due_date?: string;
}
