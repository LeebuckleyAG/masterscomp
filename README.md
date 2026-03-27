# Masters Golf Competition

A fantasy golf competition app for The Masters tournament. Players enter teams and compete based on odds-based scoring.

## Features

- **Live Odds Scraping**: Fetches current odds from OddsChecker
- **Team Entry**: Players select:
  - 2 Bankers (top 5 shortest odds)
  - 4 Strongly Fancied (ranks 6-12)
  - 4 Good Lads (mid-field)
  - 2 Outsiders (bottom 10)
- **Points Scoring**: Points based on odds (e.g., 500/1 = 500 points)
- **Live Leaderboard**: Automatic ranking by total points

## Tech Stack

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Cheerio (web scraping)
- Vercel deployment

## Getting Started

### Install Dependencies

```bash
npm install
```

### Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Build for Production

```bash
npm run build
npm start
```

## Deployment to Vercel

1. Push code to GitHub
2. Import project in Vercel dashboard
3. Deploy automatically

### One-Click Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=YOUR_REPO_URL)

## How It Works

### Team Composition
Each team consists of 12 golfers across 4 categories:
- **Bankers (2)**: Top 5 favorites
- **Strongly Fancied (4)**: Ranks 6-12
- **Good Lads (4)**: Mid-field contenders
- **Outsiders (2)**: Bottom 10 longshots

### Scoring
Points are awarded based on odds:
- If an outsider at 500/1 wins → 500 points
- If a banker at 5/1 wins → 5 points
- Total team points = sum of all 12 golfers' points

### APIs

- `GET /api/odds` - Fetches current odds from OddsChecker
- `POST /api/teams` - Submit team entry
- `GET /api/teams` - View all teams
- `GET /api/leaderboard` - Calculate rankings

## Data Persistence

Currently uses in-memory storage. For production:
- Add Vercel Postgres/KV for persistence
- Or integrate with Supabase/Firebase

## Future Enhancements

- Live tournament results integration
- Real-time scoring updates
- Email notifications
- Team editing
- Private leagues
- Mobile app

## License

MIT
