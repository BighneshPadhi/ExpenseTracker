# ⚡ Quick Start Guide

Get ExpenseTracker running in 5 minutes!

## Step 1: Clone and Install (2 minutes)

```bash
# Clone the repository
git clone <repository-url>
cd expense-tracker

# Install dependencies
npm install
```

## Step 2: Get Supabase Keys (2 minutes)

1. Go to [supabase.com](https://supabase.com) and sign up (free)
2. Create a new project
3. Go to **Settings > API**
4. Copy:
   - `Project URL` → `VITE_SUPABASE_URL`
   - `anon` key → `VITE_SUPABASE_ANON_KEY`

## Step 3: Setup Database (1 minute)

1. In Supabase, go to **SQL Editor**
2. Click **+ New Query**
3. Copy-paste the entire content of `SETUP.md` (Database Setup section)
4. Click **Run**

That's it! Your database is ready.

## Step 4: Configure Environment

Create `.env.local` in the project root:

```env
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=xxxxxx
```

## Step 5: Start Development Server

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser!

## Create Your First Account

1. Click **"Sign Up"**
2. Enter email and password
3. Done! You're logged in
4. Start adding transactions

## Available Commands

```bash
npm run dev       # Start development server
npm run build     # Build for production
npm run preview   # Preview production build
npm run lint      # Run TypeScript checker
```

## Project Structure

```
src/
├── components/       # Reusable UI components
├── pages/           # Page components (Dashboard, Transactions, etc.)
├── context/         # React Context (Auth, Transactions)
├── hooks/           # Custom React hooks
├── utils/           # Helper functions
├── types/           # TypeScript types
├── lib/             # Library config (Supabase)
└── routes/          # Route configuration
```

## Features Overview

### Dashboard
- Total balance, income, expense
- Recent transactions
- Expense breakdown chart
- Monthly statistics

### Transactions
- Add, edit, delete transactions
- Filter by category, type, date
- Search functionality

### Analytics
- Monthly income vs expense
- Spending trends
- Category breakdown
- Top categories analysis

### Budgets
- Set monthly budgets
- Track budget usage
- Visual progress indicators
- Budget alerts

### Settings
- Profile management
- Currency selection
- Notification preferences

## Customization

### Change Colors

Edit `tailwind.config.js`:

```js
colors: {
  primary: {
    800: '#243642',  // Change this
    // ...
  },
  secondary: '#387478',  // Or this
  accent: '#629584',      // Or this
}
```

### Add More Categories

Edit `src/utils/categories.ts`:

```ts
export const EXPENSE_CATEGORIES: CategoryItem[] = [
  { name: 'Food', icon: '🍔', color: '#FF6B6B' },
  // Add more...
];
```

### Add New Pages

1. Create component in `src/pages/`
2. Add route in `src/routes/index.tsx`
3. Update sidebar in `src/components/Sidebar.tsx`

## Deployment

### Simple: Vercel

```bash
npm install -g vercel
vercel
```

### Or: Netlify

1. `npm run build`
2. Drag `dist/` folder to Netlify
3. Add environment variables in dashboard

## Troubleshooting

**White screen?**
- Check browser console (F12)
- Verify `.env.local` exists
- Restart dev server

**Can't login?**
- Check Supabase project is active
- Verify API keys in `.env.local`
- Clear browser cookies

**Styling broken?**
- Clear browser cache (Ctrl+Shift+Delete)
- Restart dev server: `npm run dev`

## Need Help?

1. Check `SETUP.md` for detailed guide
2. Check browser console for errors (F12)
3. Verify Supabase connection
4. Check project README.md

## What's Next?

1. ✅ Project set up
2. ✅ Database ready
3. Add your first transaction
4. Set monthly budgets
5. Track your spending
6. Deploy to production

Happy tracking! 💰
