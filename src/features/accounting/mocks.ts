import type { AccountingEntry, MonthlyStatement } from "./types";

const entries: AccountingEntry[] = [
  {
    id: "tx-2024-12-01",
    date: "2024-12-01",
    method: "paypay",
    type: "income",
    category: "会費",
    description: "12月分会費（PayPay集金）",
    amount: 3500,
  },
  {
    id: "tx-2024-12-02",
    date: "2024-12-02",
    method: "cash",
    type: "income",
    category: "会費",
    description: "12月分会費（現金）",
    amount: 3500,
  },
  {
    id: "tx-2024-12-05",
    date: "2024-12-05",
    method: "paypay",
    type: "expense",
    category: "備品",
    description: "キッチン消耗品まとめ買い",
    amount: 1800,
  },
  {
    id: "tx-2024-12-08",
    date: "2024-12-08",
    method: "cash",
    type: "expense",
    category: "イベント",
    description: "年末パーティー用ドリンク",
    amount: 2400,
  },
  {
    id: "tx-2024-11-01",
    date: "2024-11-01",
    method: "paypay",
    type: "income",
    category: "会費",
    description: "11月分会費（PayPay集金）",
    amount: 3200,
  },
  {
    id: "tx-2024-11-06",
    date: "2024-11-06",
    method: "cash",
    type: "expense",
    category: "備品",
    description: "洗剤・スポンジ補充",
    amount: 1200,
  },
  {
    id: "tx-2024-11-18",
    date: "2024-11-18",
    method: "paypay",
    type: "expense",
    category: "イベント",
    description: "ボードゲームナイト 軽食",
    amount: 1500,
  },
];

function groupByMonth(entries: AccountingEntry[]): MonthlyStatement[] {
  const map = new Map<string, AccountingEntry[]>();

  entries.forEach((entry) => {
    const month = entry.date.slice(0, 7); // yyyy-MM
    const group = map.get(month) ?? [];
    group.push(entry);
    map.set(month, group);
  });

  const statements: MonthlyStatement[] = [];

  map.forEach((list, month) => {
    const totalIncome = list
      .filter((e) => e.type === "income")
      .reduce((sum, e) => sum + e.amount, 0);
    const totalExpense = list
      .filter((e) => e.type === "expense")
      .reduce((sum, e) => sum + e.amount, 0);
    statements.push({
      month,
      entries: list.sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      ),
      totalIncome,
      totalExpense,
      balance: totalIncome - totalExpense,
    });
  });

  return statements.sort((a, b) => (a.month < b.month ? 1 : -1));
}

export const mockStatements = groupByMonth(entries);
