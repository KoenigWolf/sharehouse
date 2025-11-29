import type { HouseRule } from "./types";

export const houseRules: HouseRule[] = [
  {
    id: "rule-01",
    title: "共用部の清掃",
    description: "キッチン・リビングの清掃担当は週替わりの当番制。担当表は玄関のホワイトボードに掲示。",
    category: "cleaning",
    details: "当番は毎週月曜に更新。担当が難しい場合は代役を見つけてホワイトボードに記入すること。清掃範囲: キッチンカウンター、シンク、ゴミの集約、床の簡易掃除。",
  },
  {
    id: "rule-02",
    title: "ゴミ出し",
    description: "分別を徹底。前日23時以降の持ち込みは禁止。回収日の朝8時までに所定の場所へ。",
    category: "living",
    details: "燃えるゴミ・プラ・瓶/缶/ペットボトルの分別を守る。大型ゴミは事前申請が必要。持ち込み禁止時間外の放置は厳禁。",
  },
  {
    id: "rule-03",
    title: "静音時間",
    description: "平日22時以降・休日23時以降は大音量の音楽や大人数での集まりを控える。",
    category: "noise",
    details: "ヘッドホン利用を推奨。来客がいる場合でも静音時間を尊重する。騒音で指摘を受けた場合は即対応。",
  },
  {
    id: "rule-04",
    title: "来客ルール",
    description: "宿泊ゲストは事前にSlackで共有。共用部の占有は2時間までを目安とする。",
    category: "living",
    details: "訪問予定の前日までにSlackに投稿し、時間帯と場所を共有。宿泊は他居住者の同意を得てから。ゲストのゴミ・片付けはホストが責任を持つ。",
  },
  {
    id: "rule-05",
    title: "防災備蓄",
    description: "備蓄棚の食料・水は持ち出し禁止。消費した場合は必ず補充を連絡。",
    category: "safety",
    details: "賞味期限の確認は四半期ごとに実施予定。補充が必要な場合は会計担当に連絡し、購入後に棚卸しリストを更新すること。",
  },
  {
    id: "rule-06",
    title: "共有Wi-Fi",
    description: "大容量ダウンロードは深夜帯に実施。ルーター設定は管理人のみ変更可。",
    category: "living",
    details: "速度低下時はまず再接続・周辺機器の再起動を試す。変更が必要な場合は管理人へ相談。個別SSID追加は原則不可。",
  },
];
