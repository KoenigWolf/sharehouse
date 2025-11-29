# Component Documentation

## コンポーネント設計原則

### Atomic Design アプローチ

```
Atoms (基本要素)
├── Button
├── Input
└── Modal

Molecules (組み合わせ)
├── ResidentCard
└── ProfileForm

Organisms (複合)
├── Header
├── RoomGrid
└── FloorPlanModal

Templates (レイアウト)
└── app/layout.tsx

Pages (完成形)
├── app/page.tsx
├── app/login/page.tsx
└── app/profile/edit/page.tsx
```

---

## Common Components

### Button

**パス**: `src/components/common/Button.tsx`

**Props**:
```typescript
interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
}
```

**使用例**:
```tsx
// Primary button
<Button onClick={handleSubmit}>Submit</Button>

// Loading state
<Button isLoading>Processing...</Button>

// Variants
<Button variant="outline" size="sm">Cancel</Button>
<Button variant="ghost">Learn more</Button>
```

**スタイルバリエーション**:
| Variant | 背景 | 文字色 | 用途 |
|---------|------|--------|------|
| primary | indigo-600 | white | 主要アクション |
| secondary | gray-600 | white | 補助アクション |
| outline | transparent | gray-700 | キャンセル等 |
| ghost | transparent | gray-700 | リンク的ボタン |

---

### Input

**パス**: `src/components/common/Input.tsx`

**Props**:
```typescript
interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}
```

**使用例**:
```tsx
// Basic
<Input
  id="email"
  type="email"
  label="Email"
  placeholder="your@email.com"
/>

// With error
<Input
  id="password"
  type="password"
  label="Password"
  error="Password is required"
/>
```

**アクセシビリティ**:
- `id`と`label`の自動紐付け
- エラー時の`aria-invalid`対応
- `suppressHydrationWarning`でハイドレーションエラー防止

---

### Modal

**パス**: `src/components/common/Modal.tsx`

**Props**:
```typescript
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
}
```

**使用例**:
```tsx
<Modal
  isOpen={showModal}
  onClose={() => setShowModal(false)}
  title="Confirm Action"
>
  <p>Are you sure?</p>
  <Button onClick={handleConfirm}>Confirm</Button>
</Modal>
```

**機能**:
- ESCキーでクローズ
- 背景クリックでクローズ
- `body`スクロールロック
- アニメーション付き

---

## Feature Components

### Header

**パス**: `src/components/Header.tsx`

**機能**:
- ロゴとナビゲーション
- スクロール時のガラスエフェクト
- モバイルハンバーガーメニュー
- レスポンシブ対応

**状態**:
```typescript
const [scrolled, setScrolled] = useState(false);
const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
```

**レスポンシブ動作**:
| 画面サイズ | 表示 |
|-----------|------|
| < 640px | ハンバーガーメニュー |
| ≥ 640px | インラインナビゲーション |

---

### ResidentCard

**パス**: `src/components/ResidentCard.tsx`

**Props**:
```typescript
interface ResidentCardProps {
  resident: ResidentWithRoom;
  onRoomClick?: (roomNumber: string) => void;
  index?: number; // アニメーション遅延用
}
```

**機能**:
- 居住者情報表示（写真、ニックネーム、部屋番号、フロア）
- 写真がない場合はイニシャルアバター
- 名前ベースでアバター色を決定（一貫性あり）
- 部屋番号クリックでモーダル表示
- ホバーアニメーション

**アバター色ロジック**:
```typescript
function getAvatarColor(name: string): string {
  const colors = [
    "from-violet-500 to-purple-500",
    "from-blue-500 to-cyan-500",
    // ...
  ];
  const index = name.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return colors[index % colors.length];
}
```

---

### RoomGrid

**パス**: `src/components/RoomGrid.tsx`

**Props**:
```typescript
interface RoomGridProps {
  residents: ResidentWithRoom[];
  onRoomClick?: (roomNumber: string) => void;
  isLoading?: boolean;
}
```

**機能**:
- フロア別フィルタリング（All, 1F, 2F, 3F, 4F）
- 名前・部屋番号検索
- レスポンシブグリッド
- スケルトンローディング

**状態**:
```typescript
const [selectedFloor, setSelectedFloor] = useState("All");
const [searchQuery, setSearchQuery] = useState("");
```

**グリッドレスポンシブ**:
```
Mobile:  2 columns (grid-cols-2)
sm:      3 columns
md:      4 columns
lg:      5 columns
xl:      6 columns
```

---

### ProfileForm

**パス**: `src/components/ProfileForm.tsx`

**Props**:
```typescript
interface ProfileFormProps {
  resident: ResidentWithRoom;
  onSuccess?: () => void;
}
```

**機能**:
- 写真アップロード（プレビュー付き）
- ニックネーム編集
- 部屋番号・フロア表示（読み取り専用）
- バリデーション（画像サイズ5MB制限）
- 成功/エラーフィードバック

**状態**:
```typescript
const [nickname, setNickname] = useState(resident.nickname);
const [photoPreview, setPhotoPreview] = useState<string | null>(null);
const [isLoading, setIsLoading] = useState(false);
const [error, setError] = useState<string | null>(null);
const [success, setSuccess] = useState(false);
```

---

### FloorPlanModal

**パス**: `src/components/FloorPlanModal.tsx`

**Props**:
```typescript
interface FloorPlanModalProps {
  roomNumber: string | null;
  onClose: () => void;
}
```

**機能**:
- 部屋情報の表示
- 間取り図の表示（未登録時はプレースホルダー）
- モバイル：ボトムシート形式
- デスクトップ：中央モーダル
- アニメーション付き表示/非表示

**アニメーション**:
```typescript
// Mobile: slide up from bottom
// Desktop: scale in
${isVisible
  ? "opacity-100 translate-y-0 sm:scale-100"
  : "opacity-0 translate-y-full sm:translate-y-0 sm:scale-95"
}
```

---

## コンポーネント作成ガイドライン

### 新規コンポーネント作成時

```typescript
// 1. Props Interface定義
interface NewComponentProps {
  // 必須props
  data: DataType;
  // オプションprops（デフォルト値付き）
  variant?: "default" | "compact";
  // コールバック
  onAction?: (id: string) => void;
}

// 2. ヘルパー関数（必要な場合）
function formatData(data: DataType): string {
  // ...
}

// 3. コンポーネント本体
export function NewComponent({
  data,
  variant = "default",
  onAction,
}: NewComponentProps) {
  // Hooks
  const [state, setState] = useState();

  // Handlers
  const handleClick = () => {
    onAction?.(data.id);
  };

  // Render
  return (
    <div className="...">
      {/* JSX */}
    </div>
  );
}
```

### スタイリング規約

```tsx
// 1. レスポンシブは小さい順に
className="text-sm sm:text-base lg:text-lg"

// 2. 状態変化は末尾に
className={`
  base-styles
  hover:hover-styles
  active:active-styles
  ${condition ? "conditional-styles" : ""}
`}

// 3. ダークモードは対応するライトモードの直後に
className="bg-white dark:bg-slate-800 text-black dark:text-white"
```

### パフォーマンス最適化

```typescript
// メモ化が必要な場合
const MemoizedComponent = React.memo(Component);

// 重い計算
const filteredData = useMemo(() => {
  return data.filter(item => item.active);
}, [data]);

// コールバックの安定化
const handleChange = useCallback((value: string) => {
  onChange(value);
}, [onChange]);
```
