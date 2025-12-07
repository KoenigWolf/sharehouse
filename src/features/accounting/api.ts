import { createClient } from "@/src/lib/supabase/client";
import type { AccountingEntry, MonthlyStatement, PaymentMethod, EntryType } from "./types";

interface AccountingEntryRow {
  id: string;
  date: string;
  method: PaymentMethod;
  type: EntryType;
  category: string;
  description: string;
  amount: number;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

function mapRowToEntry(row: AccountingEntryRow): AccountingEntry {
  return {
    id: row.id,
    date: row.date,
    method: row.method,
    type: row.type,
    category: row.category,
    description: row.description,
    amount: row.amount,
  };
}

function groupEntriesByMonth(entries: AccountingEntry[]): MonthlyStatement[] {
  const grouped = new Map<string, AccountingEntry[]>();

  for (const entry of entries) {
    const month = entry.date.slice(0, 7); // "YYYY-MM"
    if (!grouped.has(month)) {
      grouped.set(month, []);
    }
    grouped.get(month)!.push(entry);
  }

  const statements: MonthlyStatement[] = [];

  for (const [month, monthEntries] of grouped.entries()) {
    const totalIncome = monthEntries
      .filter((e) => e.type === "income")
      .reduce((sum, e) => sum + e.amount, 0);

    const totalExpense = monthEntries
      .filter((e) => e.type === "expense")
      .reduce((sum, e) => sum + e.amount, 0);

    statements.push({
      month,
      entries: monthEntries.sort((a, b) =>
        new Date(b.date).getTime() - new Date(a.date).getTime()
      ),
      totalIncome,
      totalExpense,
      balance: totalIncome - totalExpense,
    });
  }

  // Sort by month descending (newest first)
  return statements.sort((a, b) => b.month.localeCompare(a.month));
}

export async function fetchAccountingStatements(): Promise<MonthlyStatement[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("accounting_entries")
    .select("*")
    .order("date", { ascending: false });

  if (error) throw error;

  const entries = (data ?? []).map(mapRowToEntry);
  return groupEntriesByMonth(entries);
}

export async function createAccountingEntry(
  entry: Omit<AccountingEntry, "id">
): Promise<AccountingEntry> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data, error } = await supabase
    .from("accounting_entries")
    .insert({
      date: entry.date,
      method: entry.method,
      type: entry.type,
      category: entry.category,
      description: entry.description,
      amount: entry.amount,
      created_by: user?.id,
    })
    .select()
    .single();

  if (error) throw error;
  return mapRowToEntry(data);
}
