# Architecture Documentation

## ディレクトリ構成 - Feature-Sliced Design

> 詳細な配置・命名ルールは `docs/DIRECTORY_STRUCTURE.md` を正とし、本ドキュメントはレイヤー構造と依存方向、データフローにフォーカスする。

本プロジェクトは **Feature-Sliced Design (FSD)** アーキテクチャを採用しています。
これは、機能単位でコードを分割し、明確な依存関係ルールを持つスケーラブルなアーキテクチャパターンです。

```
src/
├── config/                 # 環境設定
│   └── env.ts              # 型安全な環境変数
│
├── lib/                    # コアライブラリ
│   ├── supabase/           # Supabaseクライアント
│   │   ├── client.ts       # ブラウザ用クライアント
│   │   ├── server.ts       # サーバー用クライアント
│   │   └── middleware.ts   # 認証ミドルウェア
│   └── utils/              # ユーティリティ関数
│       ├── cn.ts           # classNames結合
│       ├── avatar.ts       # アバター生成
│       └── validation.ts   # バリデーション
│
├── shared/                 # 共有リソース
│   ├── constants/          # 定数定義
│   │   └── index.ts        # FLOORS, AVATAR_COLORS等
│   ├── types/              # 共通型定義
│   │   └── index.ts        # Resident, Room, ApiError等
│   ├── ui/                 # 汎用UIコンポーネント
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Modal.tsx
│   │   ├── Avatar.tsx
│   │   ├── Badge.tsx
│   │   ├── Spinner.tsx
│   │   ├── Skeleton.tsx
│   │   └── index.ts
│   ├── layouts/            # レイアウトコンポーネント
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   ├── PageContainer.tsx
│   │   └── index.ts
│   └── hooks/              # 共通Hooks（将来用）
│       └── index.ts
│
└── features/               # 機能モジュール
    ├── residents/          # 居住者管理機能
    │   ├── components/
    │   │   ├── ResidentCard.tsx
    │   │   ├── ResidentGrid.tsx
    │   │   └── ProfileForm.tsx
    │   ├── api.ts          # Supabase操作
    │   ├── hooks.ts        # useResidents, useCurrentResident
    │   ├── mocks.ts        # 開発用モックデータ
    │   ├── types.ts        # 機能固有の型
    │   └── index.ts        # Public API
    │
    ├── rooms/              # 部屋管理機能
    │   ├── components/
    │   │   └── FloorPlanModal.tsx
    │   ├── api.ts
    │   └── index.ts
    │
    └── auth/               # 認証機能
        ├── components/     # (将来の認証UI用)
        ├── api.ts          # 認証サービス
        ├── hooks.ts        # useAuth
        ├── types.ts        # 認証関連型
        └── index.ts
```

## レイヤー構造と依存関係ルール

```
┌─────────────────────────────────────────────────────────────────┐
│                         app/ (Pages)                            │
│                     Next.js App Router                          │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  page.tsx  │  layout.tsx  │  middleware.ts              │   │
│  └─────────────────────────────────────────────────────────┘   │
└────────────────────────────┬────────────────────────────────────┘
                             │ imports
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                      src/features/                              │
│                   Feature Modules                               │
│  ┌───────────────┐  ┌───────────────┐  ┌───────────────┐       │
│  │   residents   │  │     rooms     │  │     auth      │       │
│  │   ─────────   │  │   ─────────   │  │   ─────────   │       │
│  │  components   │  │  components   │  │  components   │       │
│  │  api.ts       │  │  api.ts       │  │  api.ts       │       │
│  │  hooks.ts     │  │  hooks.ts     │  │  hooks.ts     │       │
│  │  types.ts     │  │  types.ts     │  │  types.ts     │       │
│  └───────────────┘  └───────────────┘  └───────────────┘       │
└────────────────────────────┬────────────────────────────────────┘
                             │ imports
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                       src/shared/                               │
│                   Shared Resources                              │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐             │
│  │     ui/     │  │   layouts/  │  │   types/    │             │
│  │  Button     │  │  Header     │  │  Resident   │             │
│  │  Input      │  │  Footer     │  │  Room       │             │
│  │  Modal      │  │  Container  │  │  ApiError   │             │
│  └─────────────┘  └─────────────┘  └─────────────┘             │
│  ┌─────────────┐  ┌─────────────┐                              │
│  │ constants/  │  │   hooks/    │                              │
│  │  FLOORS     │  │  (future)   │                              │
│  │  COLORS     │  │             │                              │
│  └─────────────┘  └─────────────┘                              │
└────────────────────────────┬────────────────────────────────────┘
                             │ imports
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                         src/lib/                                │
│                    Core Libraries                               │
│  ┌─────────────────────────┐  ┌─────────────────────────┐      │
│  │       supabase/         │  │        utils/           │      │
│  │  client.ts              │  │  cn.ts                  │      │
│  │  server.ts              │  │  avatar.ts              │      │
│  │  middleware.ts          │  │  validation.ts          │      │
│  └─────────────────────────┘  └─────────────────────────┘      │
└────────────────────────────┬────────────────────────────────────┘
                             │ imports
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                       src/config/                               │
│                   Environment Config                            │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  env.ts - Type-safe environment variables               │   │
│  └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

### 依存関係ルール

| レイヤー | 参照可能 | 参照不可 |
|---------|---------|---------|
| `app/` | features, shared, lib, config | - |
| `features/` | shared, lib, config | app, 他のfeatures |
| `shared/` | lib, config | app, features |
| `lib/` | config | app, features, shared |
| `config/` | - | すべて |

**重要**: Feature間の直接参照は禁止。共有が必要な場合は `shared/` に移動する。

## Feature Module 構造

各featureモジュールは以下の構造を持ちます：

```
features/[feature-name]/
├── components/           # UIコンポーネント
│   ├── ComponentA.tsx
│   └── ComponentB.tsx
├── api.ts               # データ取得・更新ロジック
├── hooks.ts             # カスタムHooks
├── types.ts             # 機能固有の型定義
├── mocks.ts             # 開発用モックデータ（オプション）
└── index.ts             # Public API (barrel export)
```

### Barrel Export パターン

`index.ts`でPublic APIを明示的に定義：

```typescript
// src/features/residents/index.ts

// Components
export { ResidentCard } from "./components/ResidentCard";
export { ResidentGrid } from "./components/ResidentGrid";
export { ProfileForm } from "./components/ProfileForm";

// Hooks
export { useResidents, useCurrentResident } from "./hooks";

// Types
export type { UseResidentsReturn, UseCurrentResidentReturn } from "./types";

// API (必要な場合のみ)
export { getResidents, updateResident } from "./api";
```

**使用例**:
```typescript
// Good - barrel exportから
import { ResidentGrid, useResidents } from "@/src/features/residents";

// Bad - 内部パスを直接参照
import { ResidentGrid } from "@/src/features/residents/components/ResidentGrid";
```

## データフロー

### 読み取りフロー

```
┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐
│   Page   │───▶│   Hook   │───▶│   API    │───▶│ Supabase │
│ (app/)   │    │(features)│    │(features)│    │          │
└──────────┘    └──────────┘    └──────────┘    └──────────┘
     ▲               │
     │               │ state
     └───────────────┘
```

**実装例**:
```typescript
// app/page.tsx
const { residents, loading, error } = useResidents();

// src/features/residents/hooks.ts
export function useResidents() {
  const [residents, setResidents] = useState<Resident[]>([]);

  useEffect(() => {
    if (env.features.useMockData) {
      setResidents(mockResidents);
    } else {
      getResidents().then(setResidents);
    }
  }, []);

  return { residents, loading, error };
}

// src/features/residents/api.ts
export async function getResidents() {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("residents")
    .select("*, rooms(*)");
  return data;
}
```

### 書き込みフロー

```
┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐
│   Form   │───▶│ Validate │───▶│   API    │───▶│ Supabase │
│(features)│    │(lib/utils)│    │(features)│    │          │
└──────────┘    └──────────┘    └──────────┘    └──────────┘
                                      │
                                      ▼
                               ┌──────────┐
                               │ Revalidate│
                               │ or Refetch│
                               └──────────┘
```

## 環境設定

### 型安全な環境変数

```typescript
// src/config/env.ts
export const env = {
  supabase: {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL!,
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  },
  app: {
    name: "ShareHouse",
    url: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  },
  features: {
    useMockData: process.env.NEXT_PUBLIC_USE_MOCK_DATA === "true",
  },
  isDev: process.env.NODE_ENV === "development",
  isProd: process.env.NODE_ENV === "production",
} as const;
```

### モック/本番切り替え

```typescript
// features内での使用
import { env } from "@/src/config/env";

export function useResidents() {
  useEffect(() => {
    if (env.features.useMockData) {
      // モックデータを使用
      setResidents(mockResidents);
    } else {
      // Supabaseから取得
      fetchFromSupabase();
    }
  }, []);
}
```

## Shared リソース

### UI コンポーネント

```typescript
// src/shared/ui/index.ts
export { Button, type ButtonProps } from "./Button";
export { Input, type InputProps } from "./Input";
export { Modal, type ModalProps } from "./Modal";
export { Avatar, type AvatarProps } from "./Avatar";
export { Badge, type BadgeProps } from "./Badge";
export { Spinner, type SpinnerProps } from "./Spinner";
export { Skeleton, type SkeletonProps } from "./Skeleton";
```

**設計原則**:
- Headless（ロジックなし）
- Props経由で完全にカスタマイズ可能
- アクセシビリティ対応
- ダークモード対応

### 定数

```typescript
// src/shared/constants/index.ts
export const FLOORS = ["1F", "2F", "3F", "4F"] as const;
export type Floor = (typeof FLOORS)[number];

export const AVATAR_COLORS = [
  "#6366f1", "#8b5cf6", "#ec4899", ...
] as const;

export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
export const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
```

### 共通型

```typescript
// src/shared/types/index.ts
export interface Resident {
  id: string;
  user_id: string;
  nickname: string;
  photo_url: string | null;
  move_in_date: string;
  room: Room | null;
}

export interface Room {
  id: string;
  room_number: string;
  floor: string;
}

export interface ApiError {
  message: string;
  code?: string;
  details?: unknown;
}
```

## 新機能追加ガイド

### 1. Feature作成

```bash
# 新しいfeatureディレクトリを作成
mkdir -p src/features/[new-feature]/components
touch src/features/[new-feature]/{api,hooks,types,index}.ts
```

### 2. 基本構造を実装

```typescript
// src/features/new-feature/types.ts
export interface NewFeatureItem {
  id: string;
  name: string;
}

export interface UseNewFeatureReturn {
  items: NewFeatureItem[];
  loading: boolean;
  error: Error | null;
}
```

```typescript
// src/features/new-feature/api.ts
import { createClient } from "@/src/lib/supabase/client";

export async function getItems(): Promise<NewFeatureItem[]> {
  const supabase = createClient();
  const { data, error } = await supabase.from("items").select("*");
  if (error) throw error;
  return data;
}
```

```typescript
// src/features/new-feature/hooks.ts
import { useState, useEffect } from "react";
import { getItems } from "./api";
import type { UseNewFeatureReturn } from "./types";

export function useNewFeature(): UseNewFeatureReturn {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getItems()
      .then(setItems)
      .catch(setError)
      .finally(() => setLoading(false));
  }, []);

  return { items, loading, error };
}
```

```typescript
// src/features/new-feature/index.ts
export { ItemCard } from "./components/ItemCard";
export { useNewFeature } from "./hooks";
export type { NewFeatureItem, UseNewFeatureReturn } from "./types";
```

### 3. Pageで使用

```typescript
// app/new-feature/page.tsx
import { useNewFeature, ItemCard } from "@/src/features/new-feature";

export default function NewFeaturePage() {
  const { items, loading } = useNewFeature();

  return (
    <div>
      {items.map(item => <ItemCard key={item.id} item={item} />)}
    </div>
  );
}
```

## セキュリティアーキテクチャ

### 認証フロー

```
┌──────────────────────────────────────────────────────────────┐
│                      Authentication Flow                      │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  1. User enters credentials                                  │
│          │                                                   │
│          ▼                                                   │
│  2. useAuth().signIn() called                                │
│          │                                                   │
│          ▼                                                   │
│  3. Supabase Auth validates                                  │
│          │                                                   │
│          ├──► Invalid → throw error → Show in UI             │
│          │                                                   │
│          ▼                                                   │
│  4. JWT token issued & stored in HTTP-only cookie            │
│          │                                                   │
│          ▼                                                   │
│  5. middleware.ts validates on each request                  │
│          │                                                   │
│          ├──► Invalid → Redirect to /login                   │
│          │                                                   │
│          ▼                                                   │
│  6. Access granted                                           │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

### Row Level Security (RLS)

```sql
-- 認証ユーザーのみ閲覧可能
CREATE POLICY "Authenticated users can view"
  ON residents FOR SELECT
  TO authenticated
  USING (true);

-- 自分のプロフィールのみ編集可能
CREATE POLICY "Users can update own profile"
  ON residents FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
```

## パフォーマンス最適化

### コンポーネント最適化

| 戦略 | 使用箇所 | 効果 |
|------|---------|------|
| `React.memo` | ResidentCard | 不要な再レンダリング防止 |
| `useMemo` | ResidentGrid (filter) | フィルター計算の最適化 |
| `useCallback` | Event handlers | 関数参照の安定化 |
| Dynamic Import | Heavy components | 初期ロード削減 |

### 画像最適化

```
Original Image (User Upload)
         │
         ▼
Supabase Storage (CDN-backed)
         │
         ▼
Next.js Image Component
         │
         ├──► Lazy Loading
         ├──► Responsive Sizes
         ├──► Format Optimization (WebP/AVIF)
         └──► Blur Placeholder
```

## テスト戦略

```
src/features/residents/
├── __tests__/
│   ├── api.test.ts         # API関数のユニットテスト
│   ├── hooks.test.ts       # Hooksのテスト
│   └── components/
│       └── ResidentCard.test.tsx
```

**テスト対象**:
- `api.ts` - Supabase操作のモック・検証
- `hooks.ts` - 状態管理ロジック
- `components/` - UIの振る舞い

## データベース変更ガイド

現在はSupabaseを使用していますが、別のDBに移行する場合の対応手順です。

### 変更が必要なファイル

| ファイル | 変更内容 |
|---------|---------|
| `src/lib/supabase/` | 新DBクライアントに置き換え（ディレクトリ名も変更） |
| `src/config/env.ts` | 新DB用の環境変数を追加 |
| `src/features/*/api.ts` | 各機能のデータアクセス層を新DBに対応 |
| `middleware.ts` | 認証ミドルウェアを新DBに対応 |
| `.env.local` | 新DB用の接続情報を設定 |

### 移行手順

#### 1. 新DBクライアントの作成

```
src/lib/[new-db]/
├── client.ts      # ブラウザ用クライアント
├── server.ts      # サーバー用クライアント
└── index.ts
```

#### 2. 環境変数の更新

`src/config/env.ts` を更新：

```typescript
export const env = {
  // 新DBの設定
  database: {
    url: maybeEnvVar("DATABASE_URL"),
    // 他の接続情報
  },
  features: {
    useMockData,
    databaseAvailable: !!databaseUrl,
  },
  // ...
} as const;
```

#### 3. 各機能のapi.tsを更新

```typescript
// src/features/residents/api.ts
import { db } from "@/src/lib/[new-db]";

export async function getResidents() {
  // 新DBのクエリに変更
  return await db.query("SELECT * FROM residents");
}
```

対象ファイル：
- `src/features/residents/api.ts`
- `src/features/rooms/api.ts`
- `src/features/auth/api.ts`

#### 4. 認証の移行

- `middleware.ts` を新DBの認証に対応
- `src/features/auth/` 配下を更新

#### 5. スキーマの移行

- `supabase/schema.sql` を参考に新DBでテーブル作成
- ストレージポリシーがある場合は新DBの機能で再現

### 設計上のポイント

```
┌─────────────────────────────────────────────────────────────────┐
│  UI Components  │  直接DBを参照しない                            │
├─────────────────────────────────────────────────────────────────┤
│  hooks.ts       │  api.tsをラップ、DB変更の影響を受けにくい        │
├─────────────────────────────────────────────────────────────────┤
│  api.ts         │  ★ DB変更時の主な修正箇所                       │
├─────────────────────────────────────────────────────────────────┤
│  Database       │  Supabase → 新DB                              │
└─────────────────────────────────────────────────────────────────┘
```

- **api.tsがデータアクセス層** - UIコンポーネントは直接DBを参照しない
- **hooksがapi.tsをラップ** - コンポーネントはhooksを通じてデータ取得
- **モックモードを維持** - DB移行中も `useMockData=true` で開発可能

---

## まとめ

Feature-Sliced Designにより以下のメリットを実現：

1. **明確な境界**: 各featureが独立し、責務が明確
2. **スケーラビリティ**: 新機能追加が容易
3. **保守性**: 変更の影響範囲が限定的
4. **テスタビリティ**: 各レイヤーを個別にテスト可能
5. **オンボーディング**: 新メンバーが構造を理解しやすい
