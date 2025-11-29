# Contributing Guide

## 開発環境セットアップ

### 必要条件

- Node.js 18.x 以上
- npm 9.x 以上
- Git

### 初期セットアップ

```bash
# リポジトリクローン
git clone <repository-url>
cd sharehouse

# 依存関係インストール
npm install

# 環境変数設定
cp .env.local.example .env.local
# .env.localを編集してSupabase認証情報を設定

# 開発サーバー起動
npm run dev
```

### モックモードでの開発

Supabase接続なしで開発する場合:

```typescript
// src/hooks/useResidents.ts
const USE_MOCK_DATA = true;
```

---

## Git ワークフロー

### ブランチ戦略

```
main          # 本番環境（保護ブランチ）
├── develop   # 開発統合ブランチ
├── feature/* # 機能開発
├── fix/*     # バグ修正
├── hotfix/*  # 緊急修正
└── docs/*    # ドキュメント
```

### ブランチ命名規則

```bash
feature/add-resident-search      # 機能追加
fix/photo-upload-error           # バグ修正
hotfix/auth-token-expiry         # 緊急修正
docs/update-api-documentation    # ドキュメント
refactor/extract-avatar-logic    # リファクタリング
```

### コミットメッセージ規約

[Conventional Commits](https://www.conventionalcommits.org/) に準拠:

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types:**
| Type | 説明 |
|------|------|
| `feat` | 新機能 |
| `fix` | バグ修正 |
| `docs` | ドキュメント |
| `style` | フォーマット（機能変更なし） |
| `refactor` | リファクタリング |
| `perf` | パフォーマンス改善 |
| `test` | テスト追加・修正 |
| `chore` | ビルド・補助ツール |

**例:**
```bash
feat(resident): add photo upload functionality

- Implement file upload to Supabase Storage
- Add image preview before upload
- Validate file size (max 5MB)

Closes #123
```

---

## コーディング規約

### TypeScript

```typescript
// Good: 明示的な型定義
interface ResidentCardProps {
  resident: ResidentWithRoom;
  onRoomClick?: (roomNumber: string) => void;
}

// Bad: anyの使用
function processData(data: any) { ... }

// Good: 適切な型ガード
function isResident(obj: unknown): obj is Resident {
  return typeof obj === 'object' && obj !== null && 'nickname' in obj;
}
```

### React コンポーネント

```typescript
// Good: 関数コンポーネント + Props Interface
interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary";
  isLoading?: boolean;
}

export function Button({
  variant = "primary",
  isLoading = false,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={getButtonStyles(variant)}
      disabled={isLoading}
      {...props}
    >
      {isLoading ? <Spinner /> : children}
    </button>
  );
}
```

### スタイリング（Tailwind CSS）

```tsx
// Good: レスポンシブは小さい順
<div className="text-sm sm:text-base lg:text-lg">

// Good: 状態変化は末尾
<button className="
  bg-indigo-600 text-white
  hover:bg-indigo-700
  active:bg-indigo-800
  disabled:opacity-50
">

// Bad: ハードコーディングされた値
<div style={{ marginTop: '16px' }}>
```

### ファイル命名規則

```
ComponentName.tsx     # PascalCase for components
useHookName.ts        # camelCase with 'use' prefix for hooks
serviceName.ts        # camelCase for services
CONSTANT_NAME         # UPPER_SNAKE_CASE for constants
```

---

## Pull Request ガイドライン

### PRの作成

1. **タイトル**: Conventional Commits形式
   ```
   feat(resident): add search functionality
   ```

2. **説明テンプレート**:
   ```markdown
   ## 概要
   [変更内容の簡潔な説明]

   ## 変更種別
   - [ ] 新機能
   - [ ] バグ修正
   - [ ] リファクタリング
   - [ ] ドキュメント
   - [ ] その他

   ## テスト
   - [ ] ユニットテスト追加/更新
   - [ ] 手動テスト実施

   ## スクリーンショット
   [UI変更がある場合]

   ## チェックリスト
   - [ ] コードがスタイルガイドに準拠している
   - [ ] セルフレビュー完了
   - [ ] ドキュメント更新（必要な場合）
   ```

### コードレビュー観点

| カテゴリ | チェック項目 |
|---------|------------|
| 機能 | 要件を満たしているか |
| 品質 | エラーハンドリングは適切か |
| セキュリティ | XSS/インジェクション対策 |
| パフォーマンス | 不要な再レンダリングはないか |
| 可読性 | コードは理解しやすいか |
| 一貫性 | 既存パターンに従っているか |

---

## テスト

### テスト構造

```
__tests__/
├── components/
│   ├── Button.test.tsx
│   └── ResidentCard.test.tsx
├── hooks/
│   └── useAuth.test.ts
└── utils/
    └── helpers.test.ts
```

### テスト実行

```bash
# 全テスト実行
npm test

# ウォッチモード
npm test -- --watch

# カバレッジ
npm test -- --coverage
```

### テスト記述ガイド

```typescript
describe('ResidentCard', () => {
  // Setup
  const mockResident: ResidentWithRoom = {
    id: '1',
    nickname: 'テスト太郎',
    room_number: '101',
    floor: '1F',
    // ...
  };

  it('should display resident nickname', () => {
    render(<ResidentCard resident={mockResident} />);
    expect(screen.getByText('テスト太郎')).toBeInTheDocument();
  });

  it('should call onRoomClick when room number is clicked', () => {
    const handleClick = jest.fn();
    render(<ResidentCard resident={mockResident} onRoomClick={handleClick} />);

    fireEvent.click(screen.getByText('101'));

    expect(handleClick).toHaveBeenCalledWith('101');
  });
});
```

---

## Issue 管理

### Issue テンプレート

**バグ報告:**
```markdown
## バグの説明
[何が起きたか]

## 再現手順
1. ...
2. ...

## 期待される動作
[本来どうなるべきか]

## 環境
- OS:
- ブラウザ:
- バージョン:

## スクリーンショット
[可能であれば]
```

**機能リクエスト:**
```markdown
## 概要
[何を実現したいか]

## 動機
[なぜこの機能が必要か]

## 提案する解決策
[どう実装するか]

## 代替案
[検討した他の方法]
```

### ラベル体系

| ラベル | 説明 |
|-------|------|
| `bug` | バグ |
| `enhancement` | 機能追加 |
| `documentation` | ドキュメント |
| `good first issue` | 初心者向け |
| `help wanted` | 協力募集 |
| `priority: high` | 優先度高 |
| `priority: low` | 優先度低 |

---

## セキュリティ

### 報告方法

セキュリティ脆弱性を発見した場合:

1. **公開Issueを作成しない**
2. メールで直接報告: [security@example.com]
3. 72時間以内に初期応答

### セキュリティチェックリスト

- [ ] ユーザー入力のサニタイズ
- [ ] 認証・認可の確認
- [ ] 機密情報のログ出力防止
- [ ] HTTPS強制
- [ ] CSPヘッダー設定

---

## リリースプロセス

### バージョニング

[Semantic Versioning](https://semver.org/) に準拠:

```
MAJOR.MINOR.PATCH

例: 1.2.3
- MAJOR: 互換性のない変更
- MINOR: 後方互換性のある機能追加
- PATCH: 後方互換性のあるバグ修正
```

### リリース手順

1. `develop` → `main` へのPR作成
2. CHANGELOG.md 更新
3. バージョンタグ付け
4. リリースノート作成

---

## パフォーマンスガイドライン

### 画像最適化

```tsx
// Good: Next.js Image component
import Image from 'next/image';

<Image
  src={photoUrl}
  alt={nickname}
  width={80}
  height={80}
  loading="lazy"
/>

// Bad: 通常のimgタグ
<img src={photoUrl} alt={nickname} />
```

### メモ化

```typescript
// 重い計算にuseMemo
const filteredResidents = useMemo(() => {
  return residents.filter(r => r.floor === selectedFloor);
}, [residents, selectedFloor]);

// コールバックにuseCallback
const handleClick = useCallback((id: string) => {
  onSelect(id);
}, [onSelect]);
```

### バンドルサイズ

```typescript
// Good: Dynamic import
const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <Skeleton />,
});

// Bad: 直接import
import HeavyComponent from './HeavyComponent';
```

---

## 連絡先

- **技術的な質問**: GitHub Discussions
- **バグ報告**: GitHub Issues
- **セキュリティ**: security@example.com

---

## ライセンス

このプロジェクトへの貢献は、プロジェクトのライセンスに従います。
