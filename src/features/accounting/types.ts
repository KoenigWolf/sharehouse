export type PaymentMethod = "paypay" | "cash";
export type EntryType = "income" | "expense";

export interface AccountingEntry {
  id: string;
  date: string; // ISO date
  method: PaymentMethod;
  type: EntryType;
  category: string;
  description: string;
  amount: number; // positive number
}

export interface MonthlyStatement {
  month: string; // e.g. "2024-12"
  entries: AccountingEntry[];
  totalIncome: number;
  totalExpense: number;
  balance: number;
}

export interface UseAccountingReturn {
  statements: MonthlyStatement[];
  loading: boolean;
  error: Error | null;
}
