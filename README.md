# ShareHouse

40名規模のシェアハウス向け居住者情報共有Webアプリケーション

## Overview

居住者の顔写真、ニックネーム、部屋番号を一覧表示し、コミュニティの顔が見える環境を提供します。

### Documentation Hub

ドキュメントは `docs/README.md` を正本とし、全てのガイドへのリンクを集約しています。

### 主な機能

- **居住者一覧** - フロア別フィルター、名前/部屋番号検索
- **プロフィール編集** - 顔写真・ニックネームの更新
- **部屋図面表示** - 部屋番号クリックで間取り確認
- **会議議事録** - 月次ミーティングの記録
- **イベント管理** - コミュニティイベントの案内
- **ハウスルール** - 共有スペースのルール
- **会計管理** - 月次収支の管理
- **多言語対応** - 日本語/英語

## Tech Stack

| Category | Technology |
|----------|------------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript 5 |
| UI | React 19 |
| Styling | Tailwind CSS 4 |
| Backend | Supabase (Auth, DB, Storage) |
| Database | PostgreSQL |

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account (optional - mock mode available)

### Installation

```bash
# Clone
git clone https://github.com/your-username/sharehouse.git
cd sharehouse

# Install dependencies
npm install

# Setup environment
cp .env.example .env.local
```

### Environment Variables

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Development (set to "true" to use mock data)
NEXT_PUBLIC_USE_MOCK_DATA=true
```

### Development

```bash
# Start dev server
npm run dev

# Build
npm run build

# Lint
npm run lint

# Type check
npx tsc --noEmit
```

Open [http://localhost:3000](http://localhost:3000)

## Project Structure

```
sharehouse/
├── app/                    # Next.js App Router
│   ├── page.tsx            # Home (resident list)
│   ├── login/              # Authentication
│   ├── profile/edit/       # Profile editing
│   ├── meetings/           # Meeting notes
│   ├── events/             # Events
│   ├── house-rules/        # House rules
│   ├── accounting/         # Accounting
│   └── settings/           # App settings
│
├── src/
│   ├── config/             # Environment config
│   ├── lib/                # Core libraries
│   │   ├── supabase/       # Supabase client
│   │   └── utils/          # Utilities
│   ├── shared/             # Shared resources
│   │   ├── ui/             # UI components
│   │   ├── layouts/        # Layout components
│   │   ├── types/          # Domain types
│   │   └── constants/      # Constants
│   └── features/           # Feature modules
│       ├── residents/      # Resident management
│       ├── auth/           # Authentication
│       ├── rooms/          # Room management
│       ├── meetings/       # Meeting notes
│       ├── events/         # Events
│       └── accounting/     # Accounting
│
└── docs/                   # Documentation
    ├── ARCHITECTURE.md     # Architecture guide
    ├── CODING_GUIDELINES.md # Coding standards
    └── API.md              # API reference
```

## Architecture

Feature-Sliced Design (FSD) パターンを採用。

```
app/           → Pages (routing)
  ↓
features/      → Feature modules (business logic)
  ↓
shared/        → Shared UI & types
  ↓
lib/           → Core utilities
  ↓
config/        → Environment config
```

詳細は [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) を参照。

## Development Mode

### Mock Data Mode

Supabase未設定でも開発可能：

```env
NEXT_PUBLIC_USE_MOCK_DATA=true
```

40名のサンプル居住者データが使用されます。

### Live Mode

Supabase接続して実データを使用：

```env
NEXT_PUBLIC_USE_MOCK_DATA=false
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbG...
```

## Database Schema

```sql
-- Residents
CREATE TABLE residents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  nickname TEXT NOT NULL,
  room_number TEXT NOT NULL,
  floor TEXT NOT NULL,
  photo_url TEXT,
  move_in_date DATE,
  move_out_date DATE,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Rooms
CREATE TABLE rooms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_number TEXT UNIQUE NOT NULL,
  floor TEXT NOT NULL,
  floor_plan_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

コーディング規約は [docs/CODING_GUIDELINES.md](docs/CODING_GUIDELINES.md) を参照。

## License

Private - All rights reserved

## Acknowledgments

- [Next.js](https://nextjs.org/)
- [Supabase](https://supabase.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Heroicons](https://heroicons.com/)
