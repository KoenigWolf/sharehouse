# AI Contribution Guidelines

このリポジトリでAIが回答・修正を行う際の共通ルール。必ず関連ガイドを参照し、手順を踏むこと。

## 参照優先度
- まず `docs/README.md` で対象トピックの正本を確認する。
1. `docs/SECURITY_GUIDELINES.md` — 認証/認可、シークレット、入力防御、データ保護。
2. `docs/ARCHITECTURE.md` — レイヤー構造（app/features/shared/lib/config）と依存方向。
3. `docs/DIRECTORY_STRUCTURE.md` — 配置ルールと命名、Barrel export方針。
4. `docs/CODING_GUIDELINES.md` — 設計・命名・ガード節・状態管理などの実装規約。
5. `docs/DESIGN_GUIDELINES.md` — UI/UXのグローバル基準（色、余白、タイポ、アクセシビリティ）。
6. `docs/DEVELOPER_PRODUCTIVITY.md` — 小さく早いループ、PR運用、テスト・自動化の方針。
7. `docs/COMPONENTS.md`, `docs/API.md` — コンポーネント仕様やAPI契約がある場合に参照。

## 作業手順
- 変更前に該当ガイドを必ず確認し、矛盾があればガイドを更新するか理由を明示する。
- セキュリティ関連（認証/権限/シークレット/バリデーション）は常に最優先で遵守する。
- ディレクトリ配置は`ARCHITECTURE`と`DIRECTORY_STRUCTURE`に従い、例外を作る場合はPRで理由・期限を記録する。
- UI変更は`DESIGN_GUIDELINES`の役割別パレット、余白、タイポ、アクセシビリティ、モーション方針を守る。
- コード変更は`CODING_GUIDELINES`のガード節・命名・状態管理・副作用分離に従う。
- 作業を小さく刻み、テスト/型/リンターを実行してから結果を報告する（`DEVELOPER_PRODUCTIVITY`）。

## 禁止事項
- ガイドを無視した独自判断の変更。
- Feature間の直接依存追加（ガイド違反）。共有が必要なら`shared`へ抽出。
- セキュリティ設定の緩和やシークレットの露出。

## 変更報告のチェックリスト
- 参照したガイドと遵守内容を報告したか？
- セキュリティ・依存方向・配置・UI/アクセシビリティ・コーディング規約を満たしているか？
- テスト/型/リンターを必要に応じて実行し、結果を共有したか？
