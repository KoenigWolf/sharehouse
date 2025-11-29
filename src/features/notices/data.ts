import type { NoticeSection } from "./types";

export const noticeSections: NoticeSection[] = [
  {
    id: "floor-map",
    title: "2F フロアマップ",
    items: [
      {
        title: "部屋割り",
        table: {
          headers: ["部屋番号", "名前", "居住者"],
          rows: [
            ["201", "ヒロ Hiro", "Hiroyasu Ishisaki"],
            ["202", "じんべえ丸 JINBE", "Yuki Nakahashi"],
            ["203", "どん Don", "Manami Koido"],
            ["204", "", "Hisashi Wakayama"],
            ["205", "みかん🍊", "Catherine 9/16〜11/13 206"],
            ["206", "", ""],
            ["207", "シェフ Chef", "Shintaro Matsunaga"],
            ["208", "ザック ZACK", "Toshiki Sakuta"],
            ["209", "ニッピー Nippy", "Takashi Yoshida"],
            ["210", "ユーリ Yuri", "Yuri Aisaka"],
            ["211", "", ""],
            ["212", "マエストロ Maestro", "Keishiro Yamaguchi"],
            ["213", "エロボズ Erobozu", "Yutai Mizuno"],
          ],
        },
        content:
          "共用施設: Library, LivingRoom, Entrance, Hall, WC×3, Shower×2, BathRoom\n住民マップの更新リンク: //shorturl.at/IQS01",
      },
    ],
  },
  {
    id: "disaster-prep",
    title: "風水害に備えましょう",
    items: [
      {
        title: "空模様の変化に注意",
        list: [
          "真っ黒な雲が近づき暗くなる",
          "雷鳴が聞こえる/雷光が見える",
          "冷たい風が吹き出す",
          "大粒の雨やひょうが降り出す",
        ],
        content: "こんな空模様になったら身の安全を確保しましょう。",
      },
      {
        title: "大雨",
        list: ["雨が降り始めや異変を感じたら水辺から離れる", "浸水した場所には入らない"],
      },
      {
        title: "雷",
        list: ["雷鳴が聞こえたらすぐに建物の中や自動車へ避難", "木や電柱から4m以上離れる"],
      },
      {
        title: "竜巻",
        list: ["頑丈な建物の中へ避難", "屋内でも窓や壁から離れる"],
      },
      {
        title: "直前の備え / 早めの準備",
        list: [
          "屋外: 飛ばされそうな物がないか、排水の水はけ確認",
          "窓や雨戸を閉める（カーテンも有効）",
          "非常持ち出し品の確認",
          "飲料水・生活用水の確保",
          "避難所の場所を確認",
          "気象情報をこまめに確認",
        ],
        content:
          "警視庁災害対策ツイッター: @MPD_bousai / 警視庁警備部災害対策課\n外出時は必ず窓を閉めてください。Please close the window in your room, when you go out!!",
      },
    ],
  },
  {
    id: "windows",
    title: "窓の施錠",
    items: [
      {
        title: "部屋を離れる際は窓を閉める",
        content:
          "強風や雨風で窓が破損・内装が損傷した場合、修理費用負担の恐れがあります。\nWHEN YOU LEAVE THE ROOM CLOSE the WINDOW!",
      },
    ],
  },
  {
    id: "wifi",
    title: "インターネット",
    items: [
      {
        title: "1階キッチン＆ダイニング Wi-Fi",
        list: ["SSID: ryozan-1f-g / ryozan-1f-a", "パスワード: RyozanPark2012"],
        content: "新しい無線LANは導入禁止。必要な場合はオーナーに相談。",
      },
      {
        title: "2〜4階 Wi-Fi",
        list: ["SSID: RZP member", "パスワード: 8hnf7zf8"],
      },
      {
        title: "共有Googleアカウント（地下予約用）",
        list: [
          "メール: ryozanpark2012@gmail.com",
          "パスワード: ryozanpark2012-41",
          "地下利用予約時はカレンダー入力のうえオーナーに報告",
        ],
      },
    ],
  },
  {
    id: "ac",
    title: "エアコン設定温度",
    items: [
      {
        title: "電気料金高騰につきご協力ください",
        list: ["暖房: 23℃で開始", "冷房: 27℃で開始", "利用後は電源OFFを忘れずに"],
      },
    ],
  },
  {
    id: "shoes",
    title: "靴の収納",
    items: [
      {
        title: "シューズボックス利用",
        content: "靴はシューズボックスへ。入りきらない靴はお部屋へ。",
      },
      {
        title: "事務局休日・夜間 緊急連絡先",
        list: ["080-3508-8418", "090-7254-6212"],
      },
    ],
  },
};
