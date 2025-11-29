# Coding Guidelines

## 設計原則

本プロジェクトは **リーダブルコード** と **クリーンアーキテクチャ** の原則に基づいて開発します。

---

## 1. 命名規則

### 1.1 明確で説明的な名前

```typescript
// Bad - 意味不明な省略
const r = getR();
const usr = fetchUsr();
const handleClk = () => {};

// Good - 意図が明確
const resident = getResident();
const currentUser = fetchCurrentUser();
const handleCardClick = () => {};
```

### 1.2 ブール値は質問形式

```typescript
// Bad
const login = true;
const data = false;

// Good
const isLoggedIn = true;
const hasData = false;
const canEdit = true;
const shouldRefresh = false;
```

### 1.3 関数名は動詞から始める

```typescript
// Bad
const userData = () => {};
const validation = () => {};

// Good
const fetchUserData = () => {};
const validateInput = () => {};
const calculateTotal = () => {};
const formatDate = () => {};
```

### 1.4 定数はSCREAMING_SNAKE_CASE

```typescript
// Bad
const maxFileSize = 5 * 1024 * 1024;
const ApiEndpoint = "/api/residents";

// Good
const MAX_FILE_SIZE = 5 * 1024 * 1024;
const API_ENDPOINT = "/api/residents";
```

### 1.5 型・インターフェースはPascalCase

```typescript
// Bad
interface resident_data {}
type apiResponse = {};

// Good
interface ResidentData {}
type ApiResponse = {};
```

### 1.6 ファイル名の規則

| 種類 | 規則 | 例 |
|-----|------|-----|
| コンポーネント | PascalCase | `ResidentCard.tsx` |
| フック | camelCase | `useResidents.ts` または `hooks.ts` |
| ユーティリティ | camelCase | `validation.ts` |
| 定数 | camelCase | `constants.ts` |
| 型定義 | camelCase | `types.ts` |

---

## 2. 関数設計

### 2.1 単一責任の原則 (SRP)

1つの関数は1つのことだけを行う。

```typescript
// Bad - 複数の責任
function handleFormSubmit(data: FormData) {
  // バリデーション
  if (!data.email) throw new Error("Email required");
  if (!data.nickname) throw new Error("Nickname required");

  // API呼び出し
  const response = await fetch("/api/residents", {
    method: "POST",
    body: JSON.stringify(data),
  });

  // 結果処理
  if (response.ok) {
    router.push("/");
    toast.success("Saved!");
  }
}

// Good - 責任を分離
function validateFormData(data: FormData): ValidationResult {
  const errors: string[] = [];
  if (!data.email) errors.push("Email required");
  if (!data.nickname) errors.push("Nickname required");
  return { isValid: errors.length === 0, errors };
}

async function saveResident(data: FormData): Promise<Resident> {
  const response = await fetch("/api/residents", {
    method: "POST",
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Failed to save");
  return response.json();
}

function handleSuccess() {
  router.push("/");
  toast.success("Saved!");
}

// 使用側で組み合わせる
async function handleFormSubmit(data: FormData) {
  const validation = validateFormData(data);
  if (!validation.isValid) {
    showErrors(validation.errors);
    return;
  }

  await saveResident(data);
  handleSuccess();
}
```

### 2.2 引数は3つ以下

```typescript
// Bad - 引数が多すぎる
function createResident(
  nickname: string,
  email: string,
  photoUrl: string,
  roomNumber: string,
  floor: string,
  moveInDate: Date
) {}

// Good - オブジェクトにまとめる
interface CreateResidentInput {
  nickname: string;
  email: string;
  photoUrl?: string;
  room: {
    number: string;
    floor: string;
  };
  moveInDate: Date;
}

function createResident(input: CreateResidentInput) {}
```

### 2.3 早期リターン (Guard Clauses)

```typescript
// Bad - ネストが深い
function processResident(resident: Resident | null) {
  if (resident) {
    if (resident.isActive) {
      if (resident.room) {
        return formatResidentInfo(resident);
      } else {
        return "No room assigned";
      }
    } else {
      return "Inactive resident";
    }
  } else {
    return "No resident";
  }
}

// Good - 早期リターン
function processResident(resident: Resident | null) {
  if (!resident) return "No resident";
  if (!resident.isActive) return "Inactive resident";
  if (!resident.room) return "No room assigned";

  return formatResidentInfo(resident);
}
```

### 2.4 副作用の分離

```typescript
// Bad - 計算と副作用が混在
function calculateAndSaveTotal(items: Item[]) {
  const total = items.reduce((sum, item) => sum + item.price, 0);
  localStorage.setItem("total", String(total)); // 副作用
  sendAnalytics("total_calculated", total);     // 副作用
  return total;
}

// Good - 純粋関数と副作用を分離
// 純粋関数（計算のみ）
function calculateTotal(items: Item[]): number {
  return items.reduce((sum, item) => sum + item.price, 0);
}

// 副作用を含む関数（明示的に分離）
function saveAndTrackTotal(items: Item[]) {
  const total = calculateTotal(items);
  localStorage.setItem("total", String(total));
  sendAnalytics("total_calculated", total);
  return total;
}
```

### 2.5 null合体演算子を避けてガード節で前提を確定させる

- 必須パラメータ・設定・依存は「欠如＝エラー」とみなし、`??` で隠さず早期return/throwで明示する。
- 欠如時に「安全側の処理」に切り替える場合も if/return で分岐を露出させ、意図を読めるようにする。
- 軽微な表示調整など、欠如を許容する箇所のみ `??` を許容する。

```typescript
// Bad - 欠如をデフォルトで塗りつぶしてしまい前提が曖昧
const host = config.host ?? "localhost";
const limit = input.limit ?? 20;

// Good - 必須前提をガードで確定させる
if (!config?.host) {
  throw new Error("API契約: host is required in config");
}
const host = config.host;

// Good - 欠如時は安全側に寄せて早期return
if (!input || typeof input.limit !== "number" || input.limit <= 0) {
  return [];
}
const limit = input.limit;

function handle(user?: User) {
  if (!user) return { status: 400, message: "user required" };
  if (!user.id) return { status: 400, message: "user.id required" };
  return ok(user.id);
}
```

---

## 3. コンポーネント設計

### 3.1 Presentational / Container パターン

```
┌─────────────────────────────────────────────────────────────┐
│                    Container Component                       │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  - データ取得 (hooks)                                  │  │
│  │  - 状態管理                                           │  │
│  │  - ビジネスロジック                                    │  │
│  └───────────────────────────────────────────────────────┘  │
│                           │                                  │
│                           │ props                            │
│                           ▼                                  │
│  ┌───────────────────────────────────────────────────────┐  │
│  │              Presentational Component                  │  │
│  │  - UI描画のみ                                         │  │
│  │  - props経由でデータ受け取り                           │  │
│  │  - 状態を持たない（または最小限のUI状態のみ）           │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

```typescript
// Presentational Component - UIのみ
interface ResidentCardProps {
  resident: Resident;
  onEdit: () => void;
  onRoomClick: (roomNumber: string) => void;
}

function ResidentCard({ resident, onEdit, onRoomClick }: ResidentCardProps) {
  return (
    <div className="card">
      <Avatar src={resident.photoUrl} name={resident.nickname} />
      <h3>{resident.nickname}</h3>
      <button onClick={() => onRoomClick(resident.room.number)}>
        {resident.room.number}
      </button>
      <button onClick={onEdit}>Edit</button>
    </div>
  );
}

// Container Component - ロジック担当
function ResidentCardContainer({ residentId }: { residentId: string }) {
  const { resident, loading } = useResident(residentId);
  const router = useRouter();
  const [, setSelectedRoom] = useAtom(selectedRoomAtom);

  const handleEdit = () => router.push(`/residents/${residentId}/edit`);
  const handleRoomClick = (roomNumber: string) => setSelectedRoom(roomNumber);

  if (loading) return <Skeleton />;
  if (!resident) return null;

  return (
    <ResidentCard
      resident={resident}
      onEdit={handleEdit}
      onRoomClick={handleRoomClick}
    />
  );
}
```

### 3.2 コンポーネントの分割基準

以下の場合はコンポーネントを分割する：

1. **再利用性**: 2箇所以上で使用される
2. **複雑性**: 100行を超える
3. **責務の違い**: 異なる関心事を扱う
4. **テスタビリティ**: 個別にテストしたい

```typescript
// Bad - 1つのコンポーネントに詰め込みすぎ
function ResidentPage() {
  // 200行以上のコード...
  return (
    <div>
      <header>...</header>
      <nav>...</nav>
      <main>
        <div className="filters">...</div>
        <div className="grid">
          {residents.map(r => (
            <div className="card">
              {/* カードの詳細なUI */}
            </div>
          ))}
        </div>
      </main>
      <footer>...</footer>
    </div>
  );
}

// Good - 適切に分割
function ResidentPage() {
  const { residents, loading } = useResidents();
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);

  return (
    <PageContainer>
      <PageHeader title="Residents" count={residents.length} />
      <ResidentGrid
        residents={residents}
        isLoading={loading}
        onRoomClick={setSelectedRoom}
      />
      <FloorPlanModal
        roomNumber={selectedRoom}
        onClose={() => setSelectedRoom(null)}
      />
    </PageContainer>
  );
}
```

### 3.3 Props設計

```typescript
// Bad - プリミティブ値の羅列
interface BadProps {
  residentName: string;
  residentPhoto: string;
  residentRoom: string;
  residentFloor: string;
  isEditable: boolean;
  onNameChange: (name: string) => void;
  onPhotoChange: (photo: string) => void;
}

// Good - ドメインオブジェクトを渡す
interface GoodProps {
  resident: Resident;
  isEditable: boolean;
  onUpdate: (updates: Partial<Resident>) => void;
}
```

---

## 4. 状態管理

### 4.1 状態の配置

```
┌─────────────────────────────────────────────────────────────┐
│                      State Location                          │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Server State (Supabase)                                    │
│  └─► React Query / SWR / Custom Hooks                       │
│      - residents, rooms, user data                          │
│      - キャッシュ、再検証、楽観的更新                          │
│                                                             │
│  Global UI State                                            │
│  └─► Context / Zustand / Jotai                              │
│      - theme, locale, selectedRoom                          │
│      - 複数コンポーネントで共有                               │
│                                                             │
│  Local UI State                                             │
│  └─► useState                                               │
│      - isOpen, inputValue, isHovered                        │
│      - 単一コンポーネント内で完結                             │
│                                                             │
│  Derived State                                              │
│  └─► useMemo / computed                                     │
│      - filteredResidents, sortedList                        │
│      - 他の状態から計算可能                                   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### 4.2 状態の最小化

```typescript
// Bad - 派生状態を別途管理
const [residents, setResidents] = useState<Resident[]>([]);
const [filteredResidents, setFilteredResidents] = useState<Resident[]>([]);
const [residentCount, setResidentCount] = useState(0);

useEffect(() => {
  setFilteredResidents(residents.filter(r => r.isActive));
  setResidentCount(residents.length);
}, [residents]);

// Good - 派生状態は計算で導出
const [residents, setResidents] = useState<Resident[]>([]);

const filteredResidents = useMemo(
  () => residents.filter(r => r.isActive),
  [residents]
);
const residentCount = residents.length;
```

### 4.3 状態更新のイミュータビリティ

```typescript
// Bad - 直接変更
const handleAddResident = (newResident: Resident) => {
  residents.push(newResident); // 元の配列を変更
  setResidents(residents);
};

// Good - 新しい配列を作成
const handleAddResident = (newResident: Resident) => {
  setResidents(prev => [...prev, newResident]);
};

// Good - オブジェクトの更新
const handleUpdateResident = (id: string, updates: Partial<Resident>) => {
  setResidents(prev =>
    prev.map(r => r.id === id ? { ...r, ...updates } : r)
  );
};
```

---

## 5. エラーハンドリング

### 5.1 エラー境界の配置

```
┌─────────────────────────────────────────────────────────────┐
│                    App Error Boundary                        │
│  └─► 最後の砦、クリティカルエラー                             │
│                                                             │
│  ┌───────────────────────────────────────────────────────┐  │
│  │               Page Error Boundary                      │  │
│  │  └─► ページ単位のエラー、リトライボタン表示              │  │
│  │                                                       │  │
│  │  ┌─────────────────────────────────────────────────┐  │  │
│  │  │          Component Error Boundary                │  │  │
│  │  │  └─► 特定機能のエラー、フォールバックUI          │  │  │
│  │  └─────────────────────────────────────────────────┘  │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

### 5.2 エラーの種類と対処

```typescript
// カスタムエラークラス
class ValidationError extends Error {
  constructor(
    message: string,
    public field: string
  ) {
    super(message);
    this.name = "ValidationError";
  }
}

class ApiError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public code?: string
  ) {
    super(message);
    this.name = "ApiError";
  }
}

// エラーハンドリング
async function handleSubmit(data: FormData) {
  try {
    await saveResident(data);
    handleSuccess();
  } catch (error) {
    if (error instanceof ValidationError) {
      // フィールドエラーを表示
      setFieldError(error.field, error.message);
    } else if (error instanceof ApiError) {
      if (error.statusCode === 401) {
        // 認証エラー → ログインページへ
        router.push("/login");
      } else if (error.statusCode === 409) {
        // 競合エラー → 再読み込み提案
        showConflictDialog();
      } else {
        // その他のAPIエラー
        showErrorToast(error.message);
      }
    } else {
      // 予期しないエラー
      console.error("Unexpected error:", error);
      showErrorToast("An unexpected error occurred");
    }
  }
}
```

### 5.3 ユーザーフレンドリーなエラーメッセージ

```typescript
// Bad - 技術的なメッセージ
"SQLITE_CONSTRAINT: UNIQUE constraint failed"
"TypeError: Cannot read property 'id' of undefined"

// Good - ユーザーが理解できるメッセージ
"This email is already registered. Please use a different email."
"Failed to load resident data. Please try again."
```

---

## 6. コメントとドキュメント

### 6.1 コメントの原則

```typescript
// Bad - 何をしているかを説明（コードを見れば分かる）
// ループで配列を回す
for (const item of items) {
  // itemを処理する
  process(item);
}

// Good - なぜそうしているかを説明
// Supabaseの制限により一度に100件までしか取得できないため
// ページネーションで全件取得する
for await (const batch of fetchAllResidentsInBatches()) {
  results.push(...batch);
}

// Good - 非自明なビジネスロジックの説明
// 入居日から6ヶ月未満の居住者は「新入居者」バッジを表示
const isNewResident = differenceInMonths(new Date(), moveInDate) < 6;
```

### 6.2 JSDocの使用

```typescript
/**
 * 居住者情報を取得する
 *
 * @param id - 居住者ID
 * @returns 居住者情報。存在しない場合はnull
 * @throws {ApiError} API通信エラー時
 *
 * @example
 * const resident = await getResident("user-123");
 * if (resident) {
 *   console.log(resident.nickname);
 * }
 */
export async function getResident(id: string): Promise<Resident | null> {
  // ...
}
```

### 6.3 TODO/FIXMEの書き方

```typescript
// TODO(username): 機能追加の予定
// TODO: ページネーション実装（Issue #123）

// FIXME: 既知の問題
// FIXME: Safari でスクロール位置がリセットされる問題（Issue #456）

// HACK: 一時的な回避策
// HACK: SupabaseのRLSバグ回避のため、サーバーサイドで二重チェック
```

---

## 7. テスト設計

### 7.1 テストの種類と配置

```
src/features/residents/
├── __tests__/
│   ├── api.test.ts              # ユニットテスト
│   ├── hooks.test.ts            # Hooksテスト
│   └── components/
│       ├── ResidentCard.test.tsx  # コンポーネントテスト
│       └── ResidentCard.stories.tsx # Storybook
└── ...
```

### 7.2 テストの原則

```typescript
// Good - テスト名は振る舞いを説明
describe("useResidents", () => {
  it("should return empty array when no residents exist", () => {});
  it("should filter residents by floor when floor is specified", () => {});
  it("should show loading state while fetching", () => {});
  it("should handle API errors gracefully", () => {});
});

// Good - Arrange-Act-Assert パターン
it("should update resident nickname", async () => {
  // Arrange
  const resident = createMockResident({ nickname: "Old Name" });
  render(<ProfileForm resident={resident} onSuccess={jest.fn()} />);

  // Act
  await userEvent.clear(screen.getByLabelText("Nickname"));
  await userEvent.type(screen.getByLabelText("Nickname"), "New Name");
  await userEvent.click(screen.getByRole("button", { name: "Save" }));

  // Assert
  expect(mockUpdateResident).toHaveBeenCalledWith(
    expect.objectContaining({ nickname: "New Name" })
  );
});
```

### 7.3 モックの使用

```typescript
// Bad - 実装の詳細に依存
jest.mock("../api", () => ({
  __esModule: true,
  getResidents: jest.fn().mockResolvedValue([
    { id: "1", nickname: "Test" }
  ]),
}));

// Good - 抽象化されたモック
const mockResidentService = {
  getResidents: jest.fn(),
  updateResident: jest.fn(),
};

beforeEach(() => {
  mockResidentService.getResidents.mockResolvedValue(mockResidents);
});
```

---

## 8. パフォーマンス

### 8.1 メモ化の適切な使用

```typescript
// Bad - 不要なメモ化
const name = useMemo(() => resident.nickname, [resident.nickname]);

// Good - 計算コストが高い場合のみ
const sortedResidents = useMemo(
  () => residents
    .filter(r => r.isActive)
    .sort((a, b) => a.nickname.localeCompare(b.nickname)),
  [residents]
);

// Good - 参照の安定化が必要な場合
const handleClick = useCallback(
  (id: string) => {
    setSelectedId(id);
    onSelect?.(id);
  },
  [onSelect]
);
```

### 8.2 レンダリング最適化

```typescript
// Bad - 親の再レンダリングで子も再レンダリング
function ParentComponent() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <button onClick={() => setCount(c => c + 1)}>{count}</button>
      <ExpensiveChild /> {/* countが変わるたびに再レンダリング */}
    </div>
  );
}

// Good - React.memoで最適化
const ExpensiveChild = memo(function ExpensiveChild() {
  // 重い処理
  return <div>...</div>;
});

// Good - 子コンポーネントを分離
function ParentComponent() {
  return (
    <div>
      <Counter />
      <ExpensiveChild />
    </div>
  );
}

function Counter() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(c => c + 1)}>{count}</button>;
}
```

---

## 9. セキュリティ

### 9.1 入力のサニタイズ

```typescript
// Bad - ユーザー入力をそのまま使用
const html = `<div>${userInput}</div>`;

// Good - エスケープまたはサニタイズ
import DOMPurify from "dompurify";
const sanitized = DOMPurify.sanitize(userInput);

// Good - Reactの自動エスケープを活用
return <div>{userInput}</div>; // 自動的にエスケープされる
```

### 9.2 認証・認可チェック

```typescript
// Bad - クライアントのみでチェック
if (user.role === "admin") {
  await deleteResident(id);
}

// Good - サーバーサイドでも必ずチェック
// API側
export async function DELETE(req: Request) {
  const user = await getAuthenticatedUser(req);
  if (user.role !== "admin") {
    return new Response("Forbidden", { status: 403 });
  }
  // 削除処理
}
```

### 9.3 機密情報の取り扱い

```typescript
// Bad - 機密情報をログ出力
console.log("User data:", { email, password, token });

// Good - 機密情報をマスク
console.log("User login:", { email, password: "***", token: "***" });

// Bad - URLにトークンを含める
router.push(`/verify?token=${secretToken}`);

// Good - POSTで送信
await fetch("/api/verify", {
  method: "POST",
  body: JSON.stringify({ token: secretToken }),
});
```

---

## 10. チェックリスト

### コードレビュー時の確認項目

#### 命名
- [ ] 変数名・関数名は意図を明確に表している
- [ ] 省略形を避け、一貫した命名規則に従っている
- [ ] ブール値は `is`, `has`, `can`, `should` で始まる

#### 関数
- [ ] 1つの関数は1つの責務のみ
- [ ] 引数は3つ以下（または1つのオブジェクト）
- [ ] 早期リターンで深いネストを回避
- [ ] 副作用は明示的に分離

#### コンポーネント
- [ ] 適切な粒度で分割されている
- [ ] Propsはドメインオブジェクトを渡している
- [ ] 不要なメモ化を避けている

#### 状態管理
- [ ] 状態は適切なレベルで管理されている
- [ ] 派生状態は計算で導出している
- [ ] イミュータブルな更新を行っている

#### エラー処理
- [ ] 適切なエラーハンドリングが行われている
- [ ] ユーザーフレンドリーなエラーメッセージ
- [ ] エラー境界が適切に配置されている

#### セキュリティ
- [ ] ユーザー入力は検証・サニタイズされている
- [ ] 認証・認可はサーバーサイドでチェック
- [ ] 機密情報はログに出力していない

---

## 参考文献

- [リーダブルコード](https://www.oreilly.co.jp/books/9784873115658/)
- [Clean Code](https://www.oreilly.com/library/view/clean-code-a/9780136083238/)
- [Clean Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [React公式ドキュメント](https://react.dev/)
- [TypeScript公式ドキュメント](https://www.typescriptlang.org/docs/)
