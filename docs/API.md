# API Documentation

## 概要

このドキュメントでは、ShareHouseアプリケーションのAPI層について説明します。

## データモデル

### Resident（居住者）

```typescript
interface Resident {
  id: string;           // UUID (Supabase auto-generated)
  user_id: string;      // auth.users.idへの参照
  nickname: string;     // 表示名 (max 50 chars)
  room_number: string;  // 部屋番号 (例: "101", "203")
  floor: string;        // フロア (例: "1F", "2F")
  photo_url: string | null;  // 顔写真URL (Supabase Storage)
  created_at: string;   // ISO 8601 timestamp
  updated_at: string;   // ISO 8601 timestamp
}
```

### Room（部屋）

```typescript
interface Room {
  id: string;
  room_number: string;      // ユニーク
  floor: string;
  floor_plan_url: string | null;  // 間取り図URL
  created_at: string;
}
```

### ResidentWithRoom（結合型）

```typescript
interface ResidentWithRoom extends Resident {
  room?: Room;  // リレーション
}
```

---

## Authentication Service

**パス**: `src/api/authService.ts`

### signInWithEmail

メールアドレスとパスワードでログイン

```typescript
async function signInWithEmail(
  email: string,
  password: string
): Promise<AuthResponse>
```

**パラメータ**:
| 名前 | 型 | 説明 |
|------|-----|------|
| email | string | ユーザーのメールアドレス |
| password | string | パスワード |

**戻り値**:
```typescript
{
  user: User | null;
  session: Session | null;
}
```

**エラー**:
| コード | 説明 |
|--------|------|
| invalid_credentials | メールまたはパスワードが間違っている |
| email_not_confirmed | メール未確認 |

---

### signOut

現在のセッションを終了

```typescript
async function signOut(): Promise<void>
```

---

### getCurrentUser

現在ログイン中のユーザーを取得

```typescript
async function getCurrentUser(): Promise<User | null>
```

---

## Resident Service

**パス**: `src/api/residentService.ts`

### getResidents

全居住者を取得（部屋情報含む）

```typescript
async function getResidents(): Promise<ResidentWithRoom[]>
```

**戻り値**: 部屋番号でソートされた居住者配列

**SQLクエリ**:
```sql
SELECT *, room:rooms(*)
FROM residents
ORDER BY room_number ASC
```

---

### getResidentByUserId

ユーザーIDから居住者情報を取得

```typescript
async function getResidentByUserId(
  userId: string
): Promise<ResidentWithRoom | null>
```

**パラメータ**:
| 名前 | 型 | 説明 |
|------|-----|------|
| userId | string | Supabase Auth User ID |

**戻り値**: 居住者情報、存在しない場合は`null`

---

### updateResident

居住者情報を更新

```typescript
async function updateResident(
  residentId: string,
  updates: Partial<Pick<Resident, "nickname" | "photo_url">>
): Promise<Resident>
```

**パラメータ**:
| 名前 | 型 | 説明 |
|------|-----|------|
| residentId | string | 居住者ID |
| updates | object | 更新するフィールド |

**更新可能フィールド**:
- `nickname`: 表示名
- `photo_url`: 写真URL

**注意**: `updated_at`は自動更新

---

### uploadPhoto

顔写真をアップロード

```typescript
async function uploadPhoto(
  userId: string,
  file: File
): Promise<string>  // 公開URL
```

**パラメータ**:
| 名前 | 型 | 説明 |
|------|-----|------|
| userId | string | ユーザーID（ファイル名に使用） |
| file | File | 画像ファイル |

**ファイル名形式**: `photos/{userId}-{timestamp}.{ext}`

**制限**:
- 最大サイズ: 5MB
- 許可形式: image/jpeg, image/png, image/gif, image/webp

---

### deletePhoto

写真を削除

```typescript
async function deletePhoto(photoUrl: string): Promise<void>
```

---

### getRoom

部屋情報を取得

```typescript
async function getRoom(roomNumber: string): Promise<Room | null>
```

---

### subscribeToResidents

リアルタイム更新を購読

```typescript
function subscribeToResidents(
  callback: (residents: ResidentWithRoom[]) => void
): () => void  // unsubscribe関数
```

**使用例**:
```typescript
useEffect(() => {
  const unsubscribe = subscribeToResidents((updated) => {
    setResidents(updated);
  });

  return () => unsubscribe();
}, []);
```

---

## Custom Hooks

### useAuth

**パス**: `src/hooks/useAuth.ts`

```typescript
function useAuth(): {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  signIn: (email: string, password: string) => Promise<AuthResponse>;
  signOut: () => Promise<void>;
}
```

**使用例**:
```tsx
function Component() {
  const { user, loading, signIn, signOut } = useAuth();

  if (loading) return <Spinner />;
  if (!user) return <LoginForm onSubmit={signIn} />;

  return <Dashboard user={user} onLogout={signOut} />;
}
```

---

### useResidents

**パス**: `src/hooks/useResidents.ts`

```typescript
function useResidents(): {
  residents: ResidentWithRoom[];
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}
```

**機能**:
- 初回マウント時に自動フェッチ
- リアルタイム更新の購読
- エラーハンドリング

---

### useCurrentResident

```typescript
function useCurrentResident(
  userId: string | undefined
): {
  resident: ResidentWithRoom | null;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}
```

---

## Database Schema

### テーブル定義

```sql
-- 部屋テーブル
CREATE TABLE rooms (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  room_number VARCHAR(10) NOT NULL UNIQUE,
  floor VARCHAR(5) NOT NULL,
  floor_plan_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 居住者テーブル
CREATE TABLE residents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  nickname VARCHAR(50) NOT NULL,
  room_number VARCHAR(10) NOT NULL REFERENCES rooms(room_number),
  floor VARCHAR(5) NOT NULL,
  photo_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id),
  UNIQUE(room_number)
);
```

### Row Level Security

```sql
-- 認証ユーザーは全居住者を閲覧可能
CREATE POLICY "view_all" ON residents
  FOR SELECT TO authenticated
  USING (true);

-- 自分のプロフィールのみ編集可能
CREATE POLICY "update_own" ON residents
  FOR UPDATE TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
```

---

## エラーハンドリング

### 共通エラー形式

```typescript
interface ApiError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}
```

### エラーコード一覧

| コード | HTTP Status | 説明 |
|--------|-------------|------|
| `PGRST116` | 406 | レコードが見つからない |
| `23505` | 409 | 一意制約違反 |
| `42501` | 403 | RLS違反（権限なし） |
| `NETWORK_ERROR` | - | 接続エラー |

### エラーハンドリングパターン

```typescript
try {
  const result = await apiCall();
  return result;
} catch (error) {
  if (error.code === 'PGRST116') {
    return null; // Not found
  }
  if (error.code === '42501') {
    throw new Error('Permission denied');
  }
  throw error; // Rethrow unknown errors
}
```

---

## モックモード

開発時はSupabase接続なしで動作可能。

**設定**: `src/hooks/useResidents.ts`
```typescript
const USE_MOCK_DATA = true; // trueでモックモード
```

**モックデータ**: `src/data/mockData.ts`
- 40名分のダミー居住者
- 日本人名のニックネーム
- 4フロア×10部屋構成
