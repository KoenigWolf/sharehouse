# Components

## 設計原則
- **Atomic Design**: Atoms(Button/Input) → Molecules(ResidentCard) → Organisms(Header/Grid) → Pages
- **Presentational/Container分離**: UIはprops経由、ロジックはhooksに分離

## 主要コンポーネント

| Component | Path | 用途 |
|-----------|------|------|
| Button | `src/shared/ui/Button.tsx` | variant: primary/secondary/outline/ghost |
| Input | `src/shared/ui/Input.tsx` | label/error対応、アクセシビリティ対応 |
| Modal | `src/shared/ui/Modal.tsx` | ESC/背景クリック対応 |
| Header | `src/shared/layouts/Header.tsx` | ナビ、モバイルメニュー |
| ResidentCard | `src/features/residents/components/` | 居住者情報カード |
| ResidentGrid | `src/features/residents/components/` | フロアフィルタ・検索付きグリッド |
| ProfileForm | `src/features/residents/components/` | 写真・ニックネーム編集 |
| FloorPlanModal | `src/features/rooms/components/` | 部屋情報モーダル |

## 作成ガイドライン
1. Props Interfaceを先に定義
2. 必須propsとオプションprops(デフォルト値)を明確に
3. コールバックは `onXxx` 命名
4. スタイルは `cn()` でTailwind結合

詳細実装は各ファイルを参照。
