# Coding Guidelines

## 命名規則
- 変数/関数: 意図が明確な名前（`getResident`, `isLoggedIn`）
- ブール値: `is`, `has`, `can`, `should` で開始
- 関数: 動詞で開始（`fetch`, `validate`, `calculate`）
- 定数: `SCREAMING_SNAKE_CASE`
- 型/Interface: `PascalCase`
- ファイル: コンポーネントは`PascalCase.tsx`、その他は`camelCase.ts`

## 関数設計
- **単一責任**: 1関数1責務
- **引数3つ以下**: 多い場合はオブジェクトに
- **早期リターン**: ガード節でネスト回避
- **副作用分離**: 純粋関数と副作用を分ける
- **null合体演算子を避ける**: 必須パラメータはガード節で確定させる

## コンポーネント設計
- **分割基準**: 再利用性、100行超、責務の違い、テスタビリティ
- **Props**: プリミティブ羅列ではなくドメインオブジェクトを渡す
- **メモ化**: 計算コストが高い場合のみ

## 状態管理
- Server State: hooks (useResidents等)
- Global UI: Context/Zustand
- Local UI: useState
- Derived: useMemo

## エラー処理
- エラー種別でハンドリング分岐
- ユーザーフレンドリーなメッセージ

## コメント
- 「何を」ではなく「なぜ」を書く
- TODO/FIXMEは課題番号付きで

詳細と例は各ファイルの実装を参照。
