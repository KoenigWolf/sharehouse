# Architecture

Feature-Sliced Design (FSD) アーキテクチャを採用。

## ディレクトリ構成

```
src/
├── config/          # 環境設定（env.ts）
├── lib/             # コアライブラリ（supabase/, utils/）
├── shared/          # 共有リソース（ui/, layouts/, types/, constants/）
└── features/        # 機能モジュール（residents/, rooms/, auth/）
```

## 依存関係ルール

| レイヤー | 参照可能 | 参照不可 |
|---------|---------|---------|
| app/ | features, shared, lib, config | - |
| features/ | shared, lib, config | app, 他のfeatures |
| shared/ | lib, config | app, features |
| lib/ | config | app, features, shared |
| config/ | - | すべて |

**重要**: Feature間の直接参照は禁止。共有が必要なら `shared/` へ移動。

## Feature Module構造

```
features/[name]/
├── components/   # UIコンポーネント
├── api.ts        # データ取得・更新
├── hooks.ts      # カスタムHooks
├── types.ts      # 型定義
├── mocks.ts      # モックデータ（オプション）
└── index.ts      # Public API (barrel export)
```

## データフロー

**読み取り**: Page → Hook → API → Supabase → State → UI
**書き込み**: Form → Validate → API → Supabase → Revalidate

## 認証

1. ユーザーがログイン
2. Supabase Authがトークン発行（HTTP-only cookie）
3. middleware.tsが各リクエストで検証
4. RLSがDB層でアクセス制御

詳細はCLAUDE.mdと各ファイルを参照。
