# CLAUDE.md - AI Development Guide

このファイルはClaude Code、GitHub Copilot、Cursor、その他のAIアシスタントがこのプロジェクトを理解し、効果的に開発支援するためのガイドです。

## プロジェクト概要

**ShareHouse Resident Information System**
- 40名規模のシェアハウス向け居住者情報共有Webアプリケーション
- 居住者の顔写真、ニックネーム、部屋番号、フロア情報を管理
- セキュアな認証と高速なパフォーマンスを重視

## 技術スタック

| カテゴリ | 技術 | バージョン |
|---------|------|-----------|
| Framework | Next.js (App Router) | 16.x |
| Language | TypeScript | 5.x |
| UI | React | 19.x |
| Styling | Tailwind CSS | 4.x |
| Backend/Auth | Supabase | Latest |
| Database | PostgreSQL (via Supabase) | - |
| Storage | Supabase Storage | - |

---

## ディレクトリ構造 (Feature-Sliced Design)

```
sharehouse/
├── app/                          # Next.js App Router (Pages)
│   ├── layout.tsx               # ルートレイアウト
│   ├── page.tsx                 # ホームページ（居住者一覧）
│   ├── globals.css              # グローバルスタイル
│   ├── login/page.tsx           # ログインページ
│   └── profile/edit/page.tsx    # プロフィール編集ページ
│
├── src/
│   ├── config/                  # 🔧 アプリケーション設定
│   │   ├── env.ts              # 環境変数（型安全）
│   │   └── index.ts
│   │
│   ├── lib/                     # 📚 コアライブラリ
│   │   ├── supabase/           # Supabaseクライアント
│   │   │   ├── client.ts       # ブラウザ用
│   │   │   ├── server.ts       # サーバー用
│   │   │   ├── middleware.ts   # 認証ミドルウェア
│   │   │   └── index.ts
│   │   │
│   │   └── utils/              # ユーティリティ関数
│   │       ├── cn.ts           # クラス名ユーティリティ
│   │       ├── avatar.ts       # アバター色・イニシャル
│   │       ├── validation.ts   # 入力バリデーション
│   │       └── index.ts
│   │
│   ├── shared/                  # 🧩 共有リソース
│   │   ├── constants/          # アプリケーション定数
│   │   │   └── index.ts        # FLOORS, AVATAR_COLORS等
│   │   │
│   │   ├── types/              # 共有型定義
│   │   │   └── index.ts        # Resident, Room, ApiError等
│   │   │
│   │   ├── ui/                 # 再利用可能UIコンポーネント
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Modal.tsx
│   │   │   ├── Avatar.tsx
│   │   │   ├── Badge.tsx
│   │   │   ├── Spinner.tsx
│   │   │   ├── Skeleton.tsx
│   │   │   └── index.ts
│   │   │
│   │   └── layouts/            # レイアウトコンポーネント
│   │       ├── Header.tsx
│   │       ├── Footer.tsx
│   │       ├── PageContainer.tsx
│   │       └── index.ts
│   │
│   └── features/               # 🎯 機能モジュール
│       ├── residents/          # 居住者機能
│       │   ├── components/
│       │   │   ├── ResidentCard.tsx
│       │   │   ├── ResidentGrid.tsx
│       │   │   ├── ProfileForm.tsx
│       │   │   └── index.ts
│       │   ├── api.ts          # Supabase操作
│       │   ├── hooks.ts        # useResidents, useCurrentResident
│       │   ├── mocks.ts        # 開発用モックデータ
│       │   ├── types.ts        # 機能固有の型
│       │   └── index.ts        # パブリックAPI
│       │
│       ├── rooms/              # 部屋機能
│       │   ├── components/
│       │   │   ├── FloorPlanModal.tsx
│       │   │   └── index.ts
│       │   ├── api.ts
│       │   ├── types.ts
│       │   └── index.ts
│       │
│       └── auth/               # 認証機能
│           ├── api.ts
│           ├── hooks.ts        # useAuth
│           ├── types.ts
│           └── index.ts
│
├── docs/                        # 📖 ドキュメント
│   ├── ARCHITECTURE.md
│   ├── COMPONENTS.md
│   └── API.md
│
├── supabase/                    # 🗄️ データベース
│   ├── schema.sql
│   └── storage-policies.sql
│
├── CLAUDE.md                    # このファイル
├── CONTRIBUTING.md              # 貢献ガイド
└── middleware.ts                # Next.jsミドルウェア
```

---

## インポート規約

```typescript
// ✅ 正しいインポート
import { Button, Input, Modal } from "@/src/shared/ui";
import { PageContainer, Header } from "@/src/shared/layouts";
import { ResidentGrid, useResidents } from "@/src/features/residents";
import { FloorPlanModal } from "@/src/features/rooms";
import { useAuth } from "@/src/features/auth";
import { cn, getAvatarColor } from "@/src/lib/utils";
import { env } from "@/src/config";
import { FLOORS, AVATAR_COLORS } from "@/src/shared/constants";
import type { Resident, ResidentWithRoom } from "@/src/shared/types";

// ❌ 避けるべきインポート
import { Button } from "../../../shared/ui/Button";  // @/エイリアスを使用
import type { Resident } from "@/src/features/residents/types";  // sharedからインポート
```

---

## 機能モジュール構造

各機能は以下の構造に従います：

```
features/[feature-name]/
├── components/          # この機能専用のUIコンポーネント
│   ├── Component1.tsx
│   ├── Component2.tsx
│   └── index.ts        # バレルエクスポート
├── api.ts              # API/データアクセス関数
├── hooks.ts            # カスタムReact Hooks
├── mocks.ts            # モックデータ（オプション）
├── types.ts            # 機能固有の型
└── index.ts            # パブリックAPI（他機能がインポートできるもの）
```

**パブリックAPI (`index.ts`) パターン：**
```typescript
// 他機能が必要とするものだけをエクスポート
export { ComponentA, ComponentB } from "./components";
export { useFeatureHook } from "./hooks";
export type { FeatureProps } from "./types";

// 内部実装はプライベートに保つ
// 必要な場合を除きapi.tsを直接エクスポートしない
```

---

## コンポーネントパターン

### 共有UIコンポーネント
```typescript
// src/shared/ui/Button.tsx
"use client";

import { cn } from "@/src/lib/utils";
import type { ButtonVariant, ButtonSize } from "@/src/shared/types";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(baseStyles, variantStyles[variant], className)}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";
```

### 機能コンポーネント
```typescript
// src/features/residents/components/ResidentCard.tsx
"use client";

import { cn } from "@/src/lib/utils";
import { Badge } from "@/src/shared/ui";
import type { ResidentCardProps } from "../types";

export function ResidentCard({ resident, onRoomClick }: ResidentCardProps) {
  return (
    <div className={cn("card-styles")}>
      <Badge>{resident.floor}</Badge>
      <h3>{resident.nickname}</h3>
    </div>
  );
}
```

---

## 状態管理

### カスタムHooksパターン
```typescript
// 機能Hook
export function useResidents(): UseResidentsReturn {
  const [residents, setResidents] = useState<ResidentWithRoom[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchResidents = useCallback(async () => {
    // 実装
  }, []);

  useEffect(() => {
    fetchResidents();
  }, [fetchResidents]);

  return { residents, loading, error, refetch: fetchResidents };
}
```

### モックデータモード
```typescript
// 環境変数で制御
import { env } from "@/src/config";

if (env.features.useMockData) {
  // モックデータを使用
} else {
  // 実APIを使用
}
```

---

## スタイリングガイドライン

### Tailwind規約
```tsx
// 1. レスポンシブ: モバイルファースト
className="text-sm sm:text-base lg:text-lg"

// 2. 状態は末尾に
className="bg-white hover:bg-gray-100 active:bg-gray-200"

// 3. ダークモードはライトの後に
className="bg-white dark:bg-slate-800 text-black dark:text-white"

// 4. 動的クラスにはcn()ユーティリティを使用
className={cn(
  "base-styles",
  isActive && "active-styles",
  className
)}
```

### デザイントークン
```typescript
// ハードコーディングの代わりに定数を使用
import { AVATAR_COLORS, ANIMATION_DURATION } from "@/src/shared/constants";
```

---

## コマンド

```bash
# 開発
npm run dev

# ビルド
npm run build

# リント
npm run lint

# 型チェック
npx tsc --noEmit
```

---

## 主要ファイル

| ファイル | 目的 |
|---------|------|
| `src/config/env.ts` | 環境設定 |
| `src/shared/types/index.ts` | ドメインモデル |
| `src/shared/constants/index.ts` | アプリケーション定数 |
| `src/features/residents/hooks.ts` | データフェッチロジック |
| `src/features/residents/mocks.ts` | モックデータ |
| `src/shared/layouts/PageContainer.tsx` | ページラッパー |

---

## AI開発時の注意点

1. **バレルエクスポートからインポート** - 常に`index.ts`ファイルからインポート
2. **機能の分離** - 機能は他機能の内部からインポートしない
3. **共有型** - ドメイン型は`src/shared/types`に配置
4. **モックモード** - Supabaseなしの開発には`NEXT_PUBLIC_USE_MOCK_DATA=true`を設定
5. **コンポーネント構造** - 既存パターンに従う（Types, Styles, Component, Sub-components）

---

## コメント規約（リーダブルコード）

**原則: コードで表現できることはコードで表現する。コメントは最小限に。**

### 書いてはいけないコメント
```typescript
// ❌ 避けるべきコメント

// コンポーネント
function MyComponent() {}

// ============================================
// Icons
// ============================================

// サブコンポーネント
function SubComponent() {}

// スタイル
const styles = {};

// 型定義
interface Props {}

// フック
function useMyHook() {}
```

### 書いてよいコメント
```typescript
// ✅ 許容されるコメント

// TODO: 認証機能実装後に削除
// FIXME: iOS Safariでスクロールが効かない問題
// 黄金比: 1:1.618 (φ) - 視覚的調和のため
// Safari対策: -webkit-overflow-scrolling が必要
```

### ルール
1. **セクション区切りコメントは不要** - ファイル分割や関数名で表現
2. **「何をしているか」のコメントは不要** - コード自体が説明
3. **「なぜそうしているか」のコメントは有用** - 意図や背景の説明
4. **TODO/FIXMEは許容** - 技術的負債の明示
5. **JSDoc**は公開APIのみ - 内部実装には不要

---

## トラブルシューティング

### ハイドレーションエラー
ブラウザ拡張機能（パスワードマネージャー等）が原因の場合あり。
`suppressHydrationWarning`を該当要素に追加で対処。

### Supabase接続エラー
`.env.local`の設定を確認：
```
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbG...
NEXT_PUBLIC_USE_MOCK_DATA=false
```

### ビルドエラー
```bash
# キャッシュクリア
rm -rf .next
npm run build
```

---

## 参考リンク

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
