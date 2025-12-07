# Supabase移行プラン

## 概要

現在モックデータを使用している5つの機能をSupabaseデータベースに移行する。

## 現状分析

| 機能 | モックファイル | データ数 | Supabase対応 | 優先度 |
|------|---------------|---------|-------------|-------|
| Residents | `residents/mocks.ts` | ~40件 | ✅ 既存 | - |
| Events | `events/mocks.ts` | 5件 | ❌ 未実装 | 高 |
| Meetings | `meetings/mocks.ts` | 3件 | ❌ 未実装 | 高 |
| House Rules | `house-rules/mocks.ts` | 7件 | ❌ 未実装 | 中 |
| Accounting | `accounting/mocks.ts` | 7件 | ❌ 未実装 | 中 |

**注:** Residentsは既にSupabase対応済み（`env.features.useMockData`で切り替え可能）

---

## Phase 1: データベーススキーマ作成

### 1.1 Events テーブル

```sql
CREATE TABLE IF NOT EXISTS events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(200) NOT NULL,
  date DATE NOT NULL,
  location VARCHAR(200),
  description TEXT,
  cover_image_url TEXT,
  tags TEXT[], -- PostgreSQL配列
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view events"
  ON events FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage events"
  ON events FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM residents
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- Index
CREATE INDEX idx_events_date ON events(date DESC);
```

### 1.2 Meetings テーブル

```sql
CREATE TABLE IF NOT EXISTS meeting_notes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  date DATE NOT NULL,
  title VARCHAR(200) NOT NULL,
  summary TEXT,
  decisions TEXT[], -- 決定事項の配列
  action_items TEXT[], -- アクションアイテムの配列
  attendees TEXT[], -- 参加者名の配列
  content TEXT, -- 詳細内容（Markdown）
  doc_url TEXT, -- 原本リンク
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS
ALTER TABLE meeting_notes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view meeting notes"
  ON meeting_notes FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage meeting notes"
  ON meeting_notes FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM residents
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- Index
CREATE INDEX idx_meeting_notes_date ON meeting_notes(date DESC);
```

### 1.3 House Rules テーブル

```sql
CREATE TYPE house_rule_category AS ENUM ('living', 'cleaning', 'noise', 'safety', 'other');

CREATE TABLE IF NOT EXISTS house_rules (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(200) NOT NULL,
  description TEXT NOT NULL,
  category house_rule_category NOT NULL DEFAULT 'other',
  details TEXT, -- 詳細説明（Markdown）
  effective_from DATE,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS
ALTER TABLE house_rules ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view house rules"
  ON house_rules FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage house rules"
  ON house_rules FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM residents
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- Index
CREATE INDEX idx_house_rules_category ON house_rules(category);
CREATE INDEX idx_house_rules_sort ON house_rules(sort_order);
```

### 1.4 Accounting テーブル

```sql
CREATE TYPE payment_method AS ENUM ('paypay', 'cash', 'bank');
CREATE TYPE entry_type AS ENUM ('income', 'expense');

CREATE TABLE IF NOT EXISTS accounting_entries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  date DATE NOT NULL,
  method payment_method NOT NULL,
  type entry_type NOT NULL,
  category VARCHAR(50) NOT NULL,
  description TEXT NOT NULL,
  amount INT NOT NULL CHECK (amount > 0),
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS
ALTER TABLE accounting_entries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view accounting"
  ON accounting_entries FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Accounting admins can manage entries"
  ON accounting_entries FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM residents
      WHERE user_id = auth.uid() AND role IN ('admin', 'accounting_admin')
    )
  );

-- Indexes
CREATE INDEX idx_accounting_date ON accounting_entries(date DESC);
CREATE INDEX idx_accounting_type ON accounting_entries(type);
CREATE INDEX idx_accounting_month ON accounting_entries(DATE_TRUNC('month', date));
```

### 1.5 Residents テーブル拡張

既存のresidentsテーブルに不足しているカラムを追加:

```sql
-- 既存テーブルにカラム追加
ALTER TABLE residents
  ADD COLUMN IF NOT EXISTS full_name VARCHAR(100),
  ADD COLUMN IF NOT EXISTS bio TEXT,
  ADD COLUMN IF NOT EXISTS move_in_date DATE,
  ADD COLUMN IF NOT EXISTS move_out_date DATE,
  ADD COLUMN IF NOT EXISTS role VARCHAR(20) DEFAULT 'resident'
    CHECK (role IN ('resident', 'accounting_admin', 'admin'));

-- Roleのインデックス
CREATE INDEX IF NOT EXISTS idx_residents_role ON residents(role);
```

---

## Phase 2: API実装

### 2.1 ファイル構成

各featureに `api.ts` を追加/更新:

```
src/features/
├── events/
│   ├── api.ts          # 新規作成
│   └── hooks.ts        # 更新
├── meetings/
│   ├── api.ts          # 新規作成
│   └── hooks.ts        # 更新
├── house-rules/
│   ├── api.ts          # 新規作成
│   └── hooks.ts        # 更新
├── accounting/
│   ├── api.ts          # 新規作成
│   └── hooks.ts        # 更新
└── residents/
    ├── api.ts          # 既存（確認・更新）
    └── hooks.ts        # 既存（確認）
```

### 2.2 API実装パターン

```typescript
// 例: src/features/events/api.ts
import { createClient } from "@/src/lib/supabase/client";

export async function fetchEvents() {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("events")
    .select("*")
    .order("date", { ascending: false });

  if (error) throw error;
  return data;
}

export async function fetchEvent(id: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("events")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw error;
  return data;
}
```

### 2.3 Hooks更新パターン

```typescript
// 例: src/features/events/hooks.ts
import { env } from "@/src/config";
import { fetchEvents, fetchEvent } from "./api";
import { events as mockEvents } from "./mocks";

export function useEvents() {
  const [data, setData] = useState<EventInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        if (env.features.useMockData) {
          setData(mockEvents);
        } else {
          const result = await fetchEvents();
          setData(result);
        }
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Failed to fetch"));
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  // ... upcoming/past filtering logic
  return { events: data, upcoming, past, thisMonth, loading, error };
}
```

---

## Phase 3: 初期データ投入

### 3.1 シードスクリプト作成

```
supabase/
├── schema.sql           # 既存 + 新テーブル
├── seed/
│   ├── events.sql       # イベント初期データ
│   ├── meetings.sql     # 議事録初期データ
│   ├── house-rules.sql  # ハウスルール初期データ
│   └── accounting.sql   # 会計初期データ
└── seed.sql             # 全シード実行
```

### 3.2 サンプルシードデータ

各mocksファイルのデータをSQLに変換:

```sql
-- events seed example
INSERT INTO events (title, date, location, description, tags) VALUES
  ('新年ウェルカムパーティー', '2025-01-12', '1F共有ラウンジ', '新しい年を...', ARRAY['交流', 'パーティー']),
  ('年末大掃除', '2024-12-23', '各フロア共用部', '年末恒例の...', ARRAY['清掃', '交流']);
```

---

## Phase 4: 移行実行手順

### Step 1: スキーマ適用
```bash
# Supabase SQLエディタで実行
# 1. schema.sql の新テーブル部分を実行
# 2. RLSポリシーを確認
```

### Step 2: 初期データ投入
```bash
# シードファイルを順番に実行
# 1. house-rules.sql (依存なし)
# 2. events.sql (依存なし)
# 3. meetings.sql (依存なし)
# 4. accounting.sql (依存なし)
```

### Step 3: API実装
```bash
# 各featureのapi.tsを作成
# 1. events/api.ts
# 2. meetings/api.ts
# 3. house-rules/api.ts
# 4. accounting/api.ts
```

### Step 4: Hooks更新
```bash
# 各featureのhooks.tsを更新
# env.features.useMockData チェックを追加
```

### Step 5: テスト
```bash
# .env.local で切り替えテスト
NEXT_PUBLIC_USE_MOCK_DATA=true  # モック
NEXT_PUBLIC_USE_MOCK_DATA=false # Supabase
```

### Step 6: モックファイル削除（任意）
```bash
# 完全移行後、不要になったモックを削除
# - src/features/*/mocks.ts
```

---

## 実装優先順位

1. **Events** - シンプルな構造、公開データ
2. **Meetings** - シンプルな構造、公開データ
3. **House Rules** - カテゴリENUM、公開データ
4. **Accounting** - 権限チェック必要、複雑な集計

---

## 注意事項

1. **RLS確認**: 各テーブルのRow Level Securityポリシーを本番前に確認
2. **バックアップ**: 移行前に既存データのバックアップを取得
3. **段階的移行**: 一度にすべて移行せず、機能ごとにテスト
4. **環境変数**: 開発/本番で`NEXT_PUBLIC_USE_MOCK_DATA`を適切に設定
5. **型定義**: 既存の`types.ts`をSupabase生成型と整合させる

---

## 見積もり作業量

| Phase | 作業内容 | 想定時間 |
|-------|---------|---------|
| Phase 1 | スキーマ作成・適用 | - |
| Phase 2 | API実装 (4機能) | - |
| Phase 3 | シードデータ作成 | - |
| Phase 4 | テスト・デバッグ | - |
| **合計** | | - |

---

## 次のアクション

1. [ ] Phase 1: スキーマSQL作成・レビュー
2. [ ] Phase 1: Supabaseでテーブル作成
3. [ ] Phase 2: events API実装
4. [ ] Phase 2: meetings API実装
5. [ ] Phase 2: house-rules API実装
6. [ ] Phase 2: accounting API実装
7. [ ] Phase 3: シードデータ投入
8. [ ] Phase 4: 統合テスト
9. [ ] Phase 4: 本番デプロイ
