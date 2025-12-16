# API

## データモデル

| Model | 主要フィールド |
|-------|---------------|
| Resident | id, user_id, nickname, room_number, floor, photo_url |
| Room | id, room_number, floor, floor_plan_url |
| ResidentWithRoom | Resident + room?: Room |

## サービス関数

### Auth (`src/features/auth/api.ts`)
- `signInWithEmail(email, password)` - ログイン
- `signOut()` - ログアウト
- `getCurrentUser()` - 現在のユーザー取得

### Residents (`src/features/residents/api.ts`)
- `getResidents()` - 全居住者取得
- `getResidentByUserId(userId)` - ユーザーIDから居住者取得
- `updateResident(id, updates)` - 居住者更新
- `uploadPhoto(userId, file)` - 写真アップロード
- `subscribeToResidents(callback)` - リアルタイム購読

## Hooks

| Hook | Return |
|------|--------|
| `useAuth()` | user, loading, signIn, signOut |
| `useResidents()` | residents, loading, error, refetch |
| `useCurrentResident(userId)` | resident, loading, error |

## エラーコード

| Code | 意味 |
|------|------|
| PGRST116 | レコードなし |
| 23505 | 一意制約違反 |
| 42501 | RLS権限エラー |

## モックモード
`NEXT_PUBLIC_USE_MOCK_DATA=true` でSupabase無しで動作。
