import type { HouseRule } from "./types";

export const houseRules: HouseRule[] = [
  {
    id: "rule-01",
    title: "ゴミ出し",
    description: "分別厳守。前日23時以降の持ち込み禁止、回収日の朝8時までに所定の場所へ。",
    category: "living",
    details: "燃えるゴミ/プラ/瓶・缶・ペットは必ず分別。大型ゴミは事前申請。前日23時以降の持ち込みや場所外への放置は厳禁。",
  },
  {
    id: "rule-02",
    title: "共用部の清掃当番",
    description: "キッチン・リビングは週替わり当番制。担当表は玄関のホワイトボードを確認。",
    category: "cleaning",
    details: "当番は毎週月曜に更新。担当できない場合は代役を見つけて記入。範囲: カウンター/シンク拭き、ゴミ集約、床の簡易掃除。",
  },
  {
    id: "rule-03",
    title: "静音時間",
    description: "平日22時以降・休日23時以降は大音量・大人数の集まりを控える。",
    category: "noise",
    details: "ヘッドホン利用推奨。来客がいても静音時間を尊重し、指摘があれば即対応。ドア開閉も静かに。",
  },
  {
    id: "rule-04",
    title: "来客・宿泊",
    description: "宿泊や長時間利用は前日までにSlack共有。共用部占有は目安2時間まで。",
    category: "living",
    details: "日時・場所をSlackで共有し、宿泊は全員の同意を得る。ゲストのゴミ/片付けはホストが責任を持つ。",
  },
  {
    id: "rule-05",
    title: "共有Wi-Fi",
    description: "大容量ダウンロードは深夜帯。ルーター設定変更は管理人のみ。",
    category: "living",
    details: "速度低下時は再接続・周辺機器再起動を試す。設定変更やSSID追加は管理人へ相談。",
  },
  {
    id: "rule-06",
    title: "防災備蓄",
    description: "備蓄棚の食料・水は持ち出し不可。消費したら必ず連絡し補充。",
    category: "safety",
    details: "賞味期限は四半期ごとに確認。補充は会計担当に連絡し、購入後リストを更新すること。",
  },
  {
    id: "rule-07",
    title: "📅 THE WHITE ROOM カレンダーの追加ガイド",
    description: "THE WHITE ROOMの予定を自分のスマホやパソコンでいつでも確認できるようになります。一度追加すれば、カレンダーが自動で更新されるのでとても便利です。",
    category: "other",
    details: `## 🔰 はじめに確認してください

**Q. Googleカレンダーを使ったことはありますか？**

- **はい** → 「ステップ２」へ進んでください
- **いいえ・わからない** → 「ステップ１」から始めてください

---

## ステップ１：Googleカレンダーをインストールする（初めての方のみ）

**iPhoneの方**
1. App Storeを開く
2. 「Googleカレンダー」と検索
3. インストールして、Googleアカウントでログイン

**Androidの方**
1. 最初からインストールされている場合が多いです
2. なければGoogle Playストアで「Googleカレンダー」を検索してインストール

> 💡 Googleアカウント（Gmailアドレス）をお持ちでない方は、先にアカウントを作成してください。

---

## ステップ２：THE WHITE ROOMカレンダーを追加する

**① 下のリンクをタップ（またはクリック）**

👉 [THE WHITE ROOMカレンダーを開く](https://calendar.google.com/calendar/embed?src=83upqlen06th406lpatlcutha0%40group.calendar.google.com&ctz=Asia%2FTokyo)

**② 画面右下の「+ Google カレンダー」をタップ**

**③ 自分のGoogleアカウントを選んで追加**

これで完了です！

---

## ✅ 追加できたか確認する方法

1. Googleカレンダーアプリを開く
2. 左上の「≡」メニューをタップ
3. カレンダー一覧に **「RZP Whiteroom」** が表示されていればOK

---

## ❓ よくあるトラブル

| 困っていること | 解決方法 |
|:--|:--|
| リンクを押しても何も起きない | ブラウザ（Safari/Chrome）で開いてみてください |
| 「+ Google カレンダー」が見つからない | 画面を一番下までスクロールしてください |
| カレンダーに予定が表示されない | アプリの設定で「RZP Whiteroom」にチェックが入っているか確認してください |

---

## 📞 それでも分からない場合

お気軽にスタッフまでお声がけください。一緒に設定をお手伝いします！`,
  },
];
