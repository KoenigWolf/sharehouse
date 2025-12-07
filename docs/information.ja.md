import type { BaseLang } from "./types";

export const ja: BaseLang = {
  meta: {
    title: "ShareHouse - 居住者情報",
    description: "シェアハウス居住者情報管理システム",
    appTitle: "ShareHouse",
  },
  nav: {
    home: "ホーム",
    residents: "居住者一覧",
    members: "メンバー",
    meetings: "議事録",
    events: "イベント",
    updates: "更新情報",
    houseRules: "ルール",
    accounting: "会計",
    accountingAdmin: "会計管理",
    notices: "お知らせ",
    settings: "設定",
    editProfile: "プロフィール編集",
    more: "その他",
    signIn: "ログイン",
    signOut: "ログアウト",
  },
  common: {
    loading: "読み込み中...",
    errorPrefix: "読み込みに失敗しました",
    attendees: "参加者",
    viewOriginal: "原本を見る",
    emptyCell: "-",
    notFound: "データが見つかりません。",
    skipLink: "メインコンテンツへスキップ",
    closeMenu: "メニューを閉じる",
    openMenu: "メニューを開く",
    tryAgain: "再試行",
    reload: "再読み込み",
    clear: "クリア",
    close: "閉じる",
  },
  pages: {
    home: {
      eyebrow: "居住者",
      title: "シェアハウス",
      titleAccent: "コミュニティ",
      subtitle: "40名が暮らすシェアハウスの情報ハブです。ハウスルール、議事録、イベント情報などを確認できます。",
      residentsLabel: "全員",
      vacantLabel: "空室",
      moveInsLabel: "入居",
      moveOutsLabel: "退去",
      errorTitle: "エラーが発生しました",
      errorMessage: "データを取得できませんでした。",
      quickAccess: "クイックアクセス",
      houseRulesTitle: "ハウスルール",
      houseRulesDesc: "共有スペースの使い方や静音時間など",
      meetingsTitle: "議事録",
      meetingsDesc: "住民会議の決定事項とアクション",
      eventsTitle: "イベント",
      eventsDesc: "コミュニティイベントの案内",
      noticesTitle: "お知らせ",
      noticesDesc: "荒天・設備などの運用情報",
      updatesTitle: "アップデート",
      updatesDesc: "サイトの更新情報",
      membersTitle: "メンバー",
      membersDesc: "居住者一覧と詳細情報",
      membersAuth: "要認証",
      viewHouseRules: "ハウスルールを見る",
      memberArea: "メンバー専用エリア",
      privacyTitle: "プライバシーについて",
      privacyText: "居住者の個人情報（顔写真、部屋番号など）は{highlight}に集約されており、認証済みユーザーのみがアクセスできます。ハウスルールや議事録などの一般情報は誰でも閲覧可能です。",
      privacyHighlight: "メンバー専用エリア",
    },
    members: {
      eyebrow: "Members",
      authenticated: "認証済み",
      title: "居住者",
      titleAccent: "ディレクトリ",
      description: "シェアハウスのメンバー情報です。このページは認証済みユーザーのみアクセスできます。",
    },
    meetings: {
      eyebrow: "住民会議",
      title: "月次議事録アーカイブ",
      description: "毎月の住民会議の決定事項・アクションを保存します。日付順で最新から並びます。",
      loading: "議事録を読み込み中...",
      notes: "メモ",
      heroSub: "決定理由と次のアクションがひと目で追える、住民のナレッジログ。",
      heroNote: "新しい提案やゲスト招待の前に一読しておくとスムーズです。",
      highlightTitle: "まずここをチェック",
      highlightItems: [
        "決定には担当者と日付を付与して重複議論を防止",
        "アクションは次回まで残し、完了を確認してからクローズ",
        "議題は会議前の水曜夜までにSlackへ草案を投稿",
      ],
      stats: {
        entries: "記録数",
        decisions: "決定事項",
        actionItems: "オープンなアクション",
        nextMeeting: "次回予定",
      },
      sidebarTitle: "ミーティング習慣",
      sidebarDescription: "短く・明確に・オーナーを示すための運用ルール。",
      sidebarChecks: [
        "担当の人はSlackで ✅ リアクションを付ける",
        "リンクやスクショを添付し、再議論を避ける",
        "各トピックは時間を決め、深掘りは駐車場に入れる",
      ],
      sidebarCTA: "#house-meeting に議題を投稿",
      sidebarCTANote: "Who/What/期待する結果を書き添えると助かります。",
    },
    houseRules: {
      eyebrow: "ハウスルール",
      title: "ハウスルール",
      description: "共有スペースの使い方や静音時間など、全員で守る基本ルールをまとめています。",
      loading: "ルールを読み込み中...",
      effectiveFrom: "適用開始: ",
      heroSub: "暮らしを整えるためのプレイブック。朝の30秒で全体を俯瞰できます。",
      heroNote: "来客前や夜の作業前にざっと確認するとスムーズです。",
      focusTitle: "特に大事にしたいこと",
      focusItems: [
        "静音時間とゲスト予定の透明性をキープ",
        "共用テーブル・カウンターは使い終わりにリセット",
        "備蓄や備品の変更はすぐSlack共有",
      ],
      stats: {
        rules: "ルール数",
        categories: "カテゴリー",
        quietHours: "静音時間",
        review: "見直し頻度",
      },
      quietHoursValue: "平日22:00 / 休日23:00",
      reviewValue: "月1アップデート",
      sidebarTitle: "暮らしのリズム",
      sidebarDescription: "迷った時のベースライン。運営チームのように回す感覚で。",
      sidebarChecks: [
        "冷蔵庫の共有品は名前と日付をラベル",
        "備品が壊れた/足りないときは #house-info に一言",
        "調理後はシンクと五徳を軽くリセット＆換気",
      ],
      sidebarContact: "相談・更新は #house-info へ",
      sidebarContactNote: "一言メモがあるとすぐ反映できます。",
      viewDetails: "詳細を見る",
    },
    events: {
      eyebrow: "イベント",
      title: "イベント案内 & アーカイブ",
      description: "これからのイベントと過去の開催記録をまとめています。参加申込やアイデア提案はSlackでどうぞ。",
      loading: "イベントを読み込み中...",
      upcomingTitle: "これからのイベント",
      upcomingEmpty: "予定されているイベントはありません。",
      pastTitle: "過去のイベント",
      pastEmpty: "過去イベントの記録はまだありません。",
      allEvents: "すべてのイベント",
      viewDetails: "詳細を見る",
      backToEvents: "イベント一覧に戻る",
      location: "場所",
      date: "日時",
      tags: "タグ",
      noDescription: "説明はありません。",
      heroStats: {
        upcoming: "予定",
        past: "開催済み",
        thisMonth: "今月",
      },
    },
    accounting: {
      eyebrow: "会計",
      title: "月次の集金と収支管理",
      description: "PayPay・現金での月次集金をまとめ、会計担当が収支を管理します。最新月を上部に表示します。",
      loading: "会計データを読み込み中...",
      dashboard: "ダッシュボード",
      history: "履歴",
      totalBalance: "累計残高",
      recentTrend: "直近3ヶ月の推移",
      income: "収入",
      expense: "支出",
      noData: "会計データがありません",
      noDataDescription: "まだ会計データが登録されていません。管理者が会計管理ページからデータを追加すると、ここに表示されます。",
      monthsOfData: "ヶ月のデータ",
      selectMonth: "月を選択",
      latest: "最新",
      year: "年",
      month: "月",
      surplus: "黒字",
      errorOccurred: "エラーが発生しました",
      totalIncome: "総収入",
      totalExpense: "総支出",
    },
    accountingAdmin: {
      eyebrow: "会計管理",
      title: "会計管理者ページ",
      description: "月次の収支を登録・確認します。ここでの追加はモック環境内のみで動作し、実データには影響しません。",
      selectMonthTitle: "月を選択",
      selectMonthDescription: "追加する収支を反映する対象の月を選びます。",
      form: {
        date: "日付",
        amount: "金額",
        type: "種別",
        income: "収入",
        expense: "支出",
        method: "支払い方法",
        paypay: "PayPay",
        cash: "現金",
        bank: "銀行振込",
        category: "カテゴリ",
        description: "内容",
        descriptionPlaceholder: "例: 12月分会費 / 備品購入 など",
        submit: "収支を追加",
        descriptionRequired: "内容を入力してください",
        amountRequired: "金額は0より大きい値を入力してください",
      },
      selectMonthPrompt: "月を選択してください。",
      accessDenied: "アクセス権限がありません",
      accessDeniedDescription: "このページは会計管理者のみがアクセスできます。",
      backToAccounting: "会計ページに戻る",
      newEntry: "新規登録",
      registered: "登録しました",
      addIncome: "収入を追加",
      addExpense: "支出を追加",
      categories: ["会費", "備品", "イベント", "光熱費", "修繕", "その他"],
      preview: "プレビュー",
      previewNote: "この月のデータをプレビューしています。",
      selectMonth: "月を選択",
      noData: "データがありません",
      save: "保存",
      saved: "保存しました",
    },
    login: {
      subtitle: "居住者情報を見るにはサインインしてください",
      emailLabel: "メールアドレス",
      emailPlaceholder: "your@email.com",
      passwordLabel: "パスワード",
      passwordPlaceholder: "パスワードを入力",
      errorMessage: "サインインに失敗しました。認証情報を確認してください。",
      signingIn: "サインイン中...",
      signInButton: "サインイン",
      forgotPassword: "パスワードをお忘れですか？",
      resetPassword: "パスワードリセット",
      resetEmailSent: "リセット用のメールを送信しました",
      resetEmailSentDescription: "メールに記載されたリンクからパスワードを再設定してください。",
      backToLogin: "ログインに戻る",
      sendResetEmail: "リセットメールを送信",
      sending: "送信中...",
      newResident: "新規入居者の方",
      newResidentDescription: "管理者から招待メールを受け取っていない場合は、メールで登録を依頼してください。",
      requestInvite: "招待を依頼する",
      backToHome: "ホームに戻る",
      troubleshootingTitle: "ログインできない場合",
      accountIssuesTitle: "アカウントがない・わからない場合",
      accountIssuesList: [
        "新規入居者はまず管理者に登録を依頼してください",
        "メールアドレスが不明な場合は管理者に確認",
        "退去済みの方はアクセス権限がありません",
      ],
      goToContactForm: "問い合わせフォームへ",
      tipTitle: "ヒント",
      tipText: "ブラウザのパスワードマネージャーを使うと、次回から自動入力できます。",
    },
    resetPassword: {
      title: "パスワード再設定",
      subtitle: "新しいパスワードを入力してください",
      newPassword: "新しいパスワード",
      newPasswordPlaceholder: "新しいパスワードを入力",
      confirmPassword: "パスワード確認",
      confirmPasswordPlaceholder: "パスワードを再入力",
      updateButton: "パスワードを更新",
      updating: "更新中...",
      success: "パスワードを更新しました",
      successDescription: "新しいパスワードでログインできます。",
      goToLogin: "ログインページへ",
      passwordMismatch: "パスワードが一致しません",
      passwordTooShort: "パスワードは6文字以上で入力してください",
    },
    invite: {
      title: "新規居住者を招待",
      subtitle: "招待メールを送信して新しい居住者を追加します",
      emailLabel: "メールアドレス",
      emailPlaceholder: "resident@example.com",
      roomLabel: "部屋番号",
      roomPlaceholder: "101",
      floorLabel: "フロア",
      sendInvite: "招待メールを送信",
      sending: "送信中...",
      success: "招待メールを送信しました",
      successDescription: "招待されたユーザーにメールが届きます。リンクからアカウントを作成できます。",
      sendAnother: "別のユーザーを招待",
      errorOnlyAdmin: "管理者のみがユーザーを招待できます",
    },
    acceptInvite: {
      title: "アカウント作成",
      subtitle: "シェアハウスコミュニティへようこそ！プロフィールを設定してください",
      nicknameLabel: "ニックネーム",
      nicknamePlaceholder: "呼ばれたい名前",
      passwordLabel: "パスワード",
      passwordPlaceholder: "6文字以上",
      confirmPasswordLabel: "パスワード確認",
      confirmPasswordPlaceholder: "パスワードを再入力",
      createAccount: "アカウントを作成",
      creating: "作成中...",
      success: "アカウントを作成しました",
      successDescription: "シェアハウスコミュニティへようこそ！",
      goToHome: "ホームへ",
    },
    contact: {
      title: "招待を依頼",
      subtitle: "管理者に招待メールの送信を依頼します",
      nameLabel: "お名前",
      namePlaceholder: "山田 太郎",
      emailLabel: "メールアドレス",
      emailPlaceholder: "your@email.com",
      messageLabel: "メッセージ",
      messagePlaceholder: "入居予定日や部屋番号など",
      send: "送信",
      sending: "送信中...",
      success: "送信しました",
      successDescription: "管理者から招待メールが届くまでお待ちください。",
      sendAnother: "別の内容を送信",
      backToLogin: "ログインに戻る",
    },
    profileEdit: {
      title: "プロフィール編集",
      description: "写真とニックネームを更新して、他の居住者に認識してもらいやすくしましょう",
      loading: "プロフィールを読み込み中...",
      errorTitle: "プロフィールの読み込みに失敗しました",
      notFound: "プロフィールが見つかりません",
      notFoundMessage: "居住者プロフィールがまだ作成されていません",
      backLink: "居住者一覧に戻る",
      photoHint: "写真をクリックして変更",
      breadcrumbHome: "ホーム",
      breadcrumbEdit: "プロフィール編集",
    },
    notices: {
      eyebrow: "お知らせ",
      title: "共有掲示・案内",
      description: "フロアマップ、防災、Wi-Fi、窓の施錠、空調設定などの共有情報をまとめています。",
    },
    settings: {
      eyebrow: "設定",
      title: "アプリ設定",
      description: "表示言語の選択やデータソース（モック/本番）を確認できます。",
      language: "言語",
      languageDesc: "UIテキストの表示言語を選択します。",
      saved: "保存しました",
      dataSource: "データソース",
      mockMode: "モックデータ（Supabase無効）",
      liveMode: "Supabase利用",
      applyNote: "言語設定は即座に反映されます。",
      theme: "テーマ",
      themeDesc: "ライト/ダークモードを切り替えます。",
      themeLight: "ライト",
      themeDark: "ダーク",
      themeSystem: "システム設定に従う",
    },
    residentDetail: {
      backToList: "一覧に戻る",
      loading: "読み込み中...",
      floor: "フロア",
      room: "部屋番号",
      nickname: "ニックネーム",
      fullName: "氏名",
      moveIn: "入居日",
      moveOut: "退去予定日",
      notSet: "未設定",
      heroSub: "部屋・役割・タイムラインを一目で。ゲスト対応や管理確認をスムーズに。",
      statusActive: "滞在中",
      statusMovingOut: "退去予定",
      stayLength: "滞在日数",
      daysUntilMoveOut: "退去までの日数",
      bioTitle: "自己紹介",
      bioEmpty: "まだ自己紹介が入力されていません。",
      role: "役割",
      roleLabels: {
        admin: "管理者",
        accounting_admin: "会計管理",
        resident: "住民",
      },
    },
  },
  components: {
    residentGrid: {
      searchPlaceholder: "名前や部屋番号で検索...",
      searchResult: (count: number) => `${count}件見つかりました`,
      emptyTitle: "居住者が見つかりません",
      emptyDescriptionSearch: "検索条件やフィルターを変更してください",
      emptyDescriptionDefault: "登録された居住者がここに表示されます",
      clearFilters: "フィルターをクリア",
    },
    residentCard: {
      roomLabel: "部屋",
      moveIn: "入居",
      moveOut: "退去予定",
    },
    meetingNotes: {
      decisions: "決定事項",
      actions: "アクション",
      attendees: "参加者",
    },
    houseRules: {
      categories: {
        living: "暮らし",
        cleaning: "清掃",
        noise: "騒音",
        safety: "安全",
        other: "その他",
      },
      effectiveFrom: "適用開始: ",
    },
    events: {
      countLabel: (count: number) => `${count}件`,
      upcoming: "開催予定",
      past: "開催済み",
      daysUntil: (days: number) => `${days}日後`,
      daysAgo: (days: number) => `${days}日前`,
      today: "今日",
      tomorrow: "明日",
      yesterday: "昨日",
      eyebrow: "イベント",
      title: "イベント",
      spotlight: "注目",
      archive: "アーカイブ",
    },
    accounting: {
      status: {
        surplus: "黒字",
        deficit: "赤字",
      },
      summary: {
        income: "収入",
        expense: "支出",
        balance: "残高",
        incomePercent: (percent: number) => `収入 ${percent}%`,
        expensePercent: (percent: number) => `支出 ${percent}%`,
      },
      transactions: {
        title: "取引明細",
        date: "日付",
        method: "方法",
        description: "内容",
        category: "カテゴリ",
        amount: "金額",
        noRecords: "この月の記録はありません。",
        paypay: "PayPay",
        cash: "現金",
        count: (count: number) => `${count}件`,
        noMatch: "該当する取引がありません",
        clearFilter: "フィルターをクリア",
        close: "閉じる",
        search: "検索...",
      },
    },
    floorPlan: {
      loading: "読み込み中...",
      roomTitlePrefix: "部屋",
      roomNumberLabel: "部屋番号",
      floorLabel: "フロア",
    },
    profileForm: {
      saving: "保存中...",
      saved: "保存しました！",
      saveButton: "変更を保存",
      successTitle: "プロフィールを更新しました！",
      redirecting: "ホームへ移動中...",
      nicknameLabel: "ニックネーム",
      nicknamePlaceholder: "ニックネームを入力",
      fullNameLabel: "氏名",
      fullNamePlaceholder: "フルネームを入力",
      bioLabel: "自己紹介",
      bioPlaceholder: "簡単な紹介・趣味・シェアハウスで大事にしていることなど",
      roomNumber: "部屋番号",
      floor: "フロア",
      errorMessage: "プロフィールの更新に失敗しました",
    },
  },
  footer: {
    sections: {
      navigation: "ナビゲーション",
      resources: "リソース",
      community: "コミュニティ",
    },
    brandDescription: "居住者をつなぎ、シェアライフをより良くするコミュニティプラットフォーム。",
    communityJoin: "コミュニティに参加しよう",
    residentsCount: "40名以上の居住者",
    copyright: "All rights reserved",
    social: {
      slack: "Slack",
      discord: "Discord",
      instagram: "Instagram",
    },
  },
};

// その他ドキュメント (旧 information.md から移設)
// THE WHITE ROOM カレンダー追加ガイド
// 取扱説明書 文字起こし ほか

// ここから下は旧 information.md の移設コンテンツ（UI 文言とは別枠）

## 📅 THE WHITE ROOM カレンダーの追加ガイド
THE WHITE ROOMの予定を自分のスマホやパソコンでいつでも確認できるようになります。一度追加すれば、カレンダーが自動で更新されるのでとても便利です。

---

### 🔰 はじめに確認してください
**Q. Googleカレンダーを使ったことはありますか？**
- **はい** → 「ステップ２」へ進んでください
- **いいえ・わからない** → 「ステップ１」から始めてください

---

### ステップ１：Googleカレンダーをインストールする（初めての方のみ）
#### iPhoneの方
1. App Storeを開く
2. 「Googleカレンダー」と検索
3. インストールして、Googleアカウントでログイン

#### Androidの方
1. 最初からインストールされている場合が多いです
2. なければGoogle Playストアで「Googleカレンダー」を検索してインストール
> 💡 Googleアカウント（Gmailアドレス）をお持ちでない方は、先にアカウントを作成してください。

---

### ステップ２：THE WHITE ROOMカレンダーを追加する
1. 下のリンクをタップ（またはクリック）
   👉 [THE WHITE ROOMカレンダーを開く](https://calendar.google.com/calendar/embed?src=83upqlen06th406lpatlcutha0%40group.calendar.google.com&ctz=Asia%2FTokyo)
2. 画面右下の「+ Google カレンダー」をタップ
3. 自分のGoogleアカウントを選んで追加

これで完了です！

---

### ✅ 追加できたか確認する方法
1. Googleカレンダーアプリを開く
2. 左上の「≡」メニューをタップ
3. カレンダー一覧に **「RZP Whiteroom」** が表示されていればOK

---

### ❓ よくあるトラブル
| 困っていること | 解決方法 |
|:--|:--|
| リンクを押しても何も起きない | ブラウザ（Safari/Chrome）で開いてみてください |
| 「+ Google カレンダー」が見つからない | 画面を一番下までスクロールしてください |
| カレンダーに予定が表示されない | アプリの設定で「RZP Whiteroom」にチェックが入っているか確認してください |

---

### 📞 それでも分からない場合
お気軽にスタッフまでお声がけください。一緒に設定をお手伝いします！

---

## RYOZAN PARK 取扱説明書 文字起こし
### 目次（画像1）
**取扱説明書一覧**
1. メールボックス
2. 宅配ボックス
3. 各お部屋の冷暖房の設定
4. 各お部屋の避難はしごの使い方
5. 各お部屋のエアコンフィルターの外し方、清掃方法
6. 各お部屋のインターネット接続、テレビ接続
7. シャワー室の使い方
8. 洗濯機の使い方
9. 洗濯乾燥機の使い方（電気式）
10. 洗濯乾燥機の使い方（ガス式）
11. 区の資源回収、ごみ収集のお知らせ
12. 個人用火災総合保険の見積もり書
13. 各階の避難経路
14. RZP 規約
※持ち出し厳禁！

---

### 1. メールボックス・宅配ボックス（画像2）
- 集合ポスト 集合サインシリーズ / 型番：98号室 F1053
- 管理者の方へ: 入居者に本書を配布してください
- 解錠番号: つのる 号室のお客様の解錠番号
- 使用前にシールを剥がすこと。取扱説明を読んで保管。転居時は次居住者へ引き渡し。
- 注意マークに従い、扉にぶら下がらない／開け放しにしない／郵便物はこまめに取り出す。
- 金庫用途には不可。定期点検・騒音配慮。
- 連絡先: 田島メタルワーク株式会社 サービスセンター 0120-090-630（平日9-12/13-17）

### 2. オプション錠前（画像3）
- シリンダー錠の解錠/施錠手順（キーを90°回転など）
- 注意: 無理にキーを抜かない。紛失防止。
- 点検: 防火対策室等では6ヶ月に1回機能点検、年1回総合点検が必要。その他でも年1回点検推奨。
- 連絡先: サービスセンター 0120-090-630

---

### 🔥 安全にお使いいただくために
- 配線などを本体に近づけない。
- 使用前に取扱説明書を読む。

### 3. RZP 規約（画像14 抜粋）
- 当施設は個室を1週間/1日単位で貸す（シェアハウスではない）。
- 共有設備は自由に利用可。申込みをもって規約承認とみなす。
- 第三者の立ち入りや備品利用は禁止。事故・盗難・騒音の責任は負わない。
- 設備破損は無断修理禁止、スタッフ報告必須。無報告なら修繕費請求の可能性。
- 施設内禁煙。飲酒トラブルはお断りする場合あり。ペット持ち込み不可。
- その他緊急時対応や注意事項は元資料参照。

