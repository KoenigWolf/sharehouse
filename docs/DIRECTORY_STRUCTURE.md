# Directory Structure Guidelines (Global Standard)

長期運用を見据えたディレクトリ設計のベストプラクティス。新規機能やリファクタ時は本ガイドを基準に構成を決め、例外は理由を残して限定的に扱う。

## コア原則
- ドメイン優先: 技術軸（UI/API/Hook）ではなく「機能（Feature）」でまとめる。
- 境界の安定性: 変更の少ない層（config/lib/shared）を下に、変更が多い層（features/app）を上に置き、下層は上層を参照しない。
- 依存の明示: Barrel exportで公開APIを限定し、内部パスへの直接参照を避ける。
- 局所性: ある振る舞いに関するコード（UI/ロジック/型/テスト/モック）はできるだけ同じディレクトリ配下に集約する。
- 可搬性: Featureフォルダは単独で移動・再利用できることを目指し、外部依存はshared/lib/configに集約する。

## 推奨トップレベル
```
app/                 # Next.jsエントリポイント（ルーティング/レイアウトのみ）
public/              # 静的アセット
docs/                # ドキュメント（このファイル含む）
scripts/             # ツール・メンテ用スクリプト
src/
  config/            # 環境設定・定数（低頻度変更）
  lib/               # フレームワークに依存しないコアライブラリ
  shared/            # 複数Featureで共有するUI/レイアウト/型/定数/フック
  features/          # ドメイン機能ごとのモジュール（変更頻度高）
  ...
```

## レイヤールール（依存方向は下へ単方向）
- 依存の考え方とデータフローの詳細図は `docs/ARCHITECTURE.md` を参照し、本ドキュメントでは配置/命名/昇格基準を正とする。
- `app/` → features/shared/lib/config のみ可。app直下にビジネスロジックを置かない。
- `features/` → shared/lib/config は可。別featureへの直接参照は禁止（共有が必要ならsharedへ抽出）。
- `shared/` → lib/config は可。app/features 参照は禁止。
- `lib/` → config のみ可。UI・ドメイン依存を避ける。
- `config/` は最下層でどこも参照しない。

## Featureモジュールの構成
```
features/<feature>/
  components/      # UI（ドメイン固有）
  api.ts           # データアクセス・サービス呼び出し
  hooks.ts         # ビジネスロジックを隠蔽するhooks
  types.ts         # ドメイン固有の型
  mocks.ts         # 開発・テスト用データ（任意）
  index.ts         # Barrel export（公開APIを限定）
  __tests__/       # ユニット/コンポーネントテスト（任意で co-locate）
```
- コンポーネント・型・ロジックを同居させ、外部からは `features/<feature>` だけをインポート。
- 共有が疑わしいUIや型は安易にsharedへ上げず、利用箇所が2箇所以上かつドメイン非依存になったタイミングで昇格。

## shared の使い方
- `shared/ui`: Headless/汎用コンポーネントのみ。ドメイン文言やロジックは含めない。
- `shared/layouts`: ページ横断のレイアウト/ナビゲーション。
- `shared/constants` / `shared/types`: 複数featureで共有する非ドメイン特化の値・型。
- `shared/hooks`: フレームワーク寄りだがドメイン非依存のロジック。
- shared配下は「どのfeatureにも依存しない」ことを維持する。

## lib / config
- `config`: 環境変数、フラグ、ビルド時設定のみ。ランタイムロジックは置かない。
- `lib`: フレームワーク非依存の純粋ロジック（バリデーション、フォーマッタ、クライアント生成）。UI・ドメイン文脈は持たせない。

## 命名・配置の基準
- ディレクトリ名は複数形（residents, rooms）。ファイルは責務を表す（`ResidentGrid.tsx`, `useResidents.ts`）。
- index.ts のBarrelは「公開するもののみ」輸出し、内部実装への深いパス import を避ける。
- テスト/モック/ストーリーブックは可能な限り同じ階層に配置し、機能と一緒に移動できるようにする。
- アセット（画像・icons）は `public/` か `src/shared/ui/assets` に集約し、feature固有のものは feature配下に置く。

## 判断のチェックリスト
- この変更はどのドメイン（feature）に属するか？ → その配下に置けるか確認。
- 2箇所以上で使う予定か？ → はいなら shared への昇格を検討、いいえなら feature内に留める。
- 依存方向は単方向か？ → 上位層から下位層へのみかを確認。
- 公開APIは狭く保てているか？ → Barrel exportで必要最小限に。
- 移動可能性は保たれているか？ → フォルダごと切り出しても動く構成かを意識。

## 変更・例外の扱い
- 例外的配置をする場合は、チケットやPRで理由・範囲・見直し期限を明記する。
- 大きな構造変更は docs/ARCHITECTURE.md とこのガイドを更新し、チームに周知する。
