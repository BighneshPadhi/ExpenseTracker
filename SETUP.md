# 🚀 ExpenseTracker - Complete Setup Guide

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Project Setup](#project-setup)
3. [Supabase Configuration](#supabase-configuration)
4. [Database Setup](#database-setup)
5. [Environment Variables](#environment-variables)
6. [Development](#development)
7. [Deployment](#deployment)
8. [Troubleshooting](#troubleshooting)

## Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v16 or higher) - [Download](https://nodejs.org/)
- **npm** (comes with Node.js) or **yarn**
- **Git** - [Download](https://git-scm.com/)
- A **Supabase account** - [Sign up for free](https://supabase.com)
- A modern web browser (Chrome, Firefox, Safari, Edge)

## Project Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd expense-tracker
```

### 2. Install Dependencies

```bash
npm install
```

This will install all the required packages:
- React 18
- TypeScript
- Vite
- Tailwind CSS
- Supabase
- Recharts
- Framer Motion
- React Hook Form
- And more...

### 3. Verify Installation

```bash
npm run dev
```

You should see output similar to:
```
VITE v8.0.14 ready in 437 ms
➜ Local:   http://localhost:5173/
```

Press `Ctrl+C` to stop the server.

## Supabase Configuration

### 1. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Click **"Start your project"** or **"New project"**
3. Sign in or create an account
4. Click **"+ New project"**
5. Fill in the form:
   - **Project Name**: `expense-tracker` (or your preferred name)
   - **Database Password**: Create a strong password (save this!)
   - **Region**: Choose the region closest to you
6. Click **"Create new project"**

The project will be created (this takes a few minutes).

### 2. Get Your API Keys

Once your project is created:

1. Go to **Settings** (bottom left)
2. Click **API** in the sidebar
3. You'll see:
   - `Project URL` - Copy this as `VITE_SUPABASE_URL`
   - `anon` (public) key - Copy this as `VITE_SUPABASE_ANON_KEY`

## Database Setup

### 1. Create Tables

In your Supabase project:

1. Click **SQL Editor** in the left sidebar
2. Click **+ New Query**
3. Paste the entire SQL script below:

```sql
-- Create users table
create table users (
  id uuid primary key references auth.users(id) on delete cascade,
  email varchar(255) not null unique,
  name varchar(255),
  created_at timestamp with time zone default now()
);

-- Create transactions table
create table transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  title varchar(255) not null,
  amount decimal(12,2) not null,
  category varchar(100) not null,
  type varchar(20) not null check (type in ('income', 'expense')),
  notes text,
  date date not null,
  created_at timestamp with time zone default now()
);

-- Create budgets table
create table budgets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  category varchar(100) not null,
  limit_amount decimal(12,2) not null,
  created_at timestamp with time zone default now(),
  unique(user_id, category)
);

-- Create indexes for better query performance
create index transactions_user_id_idx on transactions(user_id);
create index transactions_category_idx on transactions(category);
create index transactions_type_idx on transactions(type);
create index budgets_user_id_idx on budgets(user_id);
```

4. Click **Run** button
5. You should see "2 rows returned" (for the tables)

### 2. Enable Row Level Security (RLS)

RLS ensures users can only access their own data.

Create a new query and paste:

```sql
-- Enable RLS on all tables
alter table users enable row level security;
alter table transactions enable row level security;
alter table budgets enable row level security;

-- Users table policies
create policy "Users can view their own profile"
  on users for select
  using (auth.uid() = id);

create policy "Users can update their own profile"
  on users for update
  using (auth.uid() = id);

-- Transactions table policies
create policy "Users can view their own transactions"
  on transactions for select
  using (auth.uid() = user_id);

create policy "Users can insert their own transactions"
  on transactions for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own transactions"
  on transactions for update
  using (auth.uid() = user_id);

create policy "Users can delete their own transactions"
  on transactions for delete
  using (auth.uid() = user_id);

-- Budgets table policies
create policy "Users can view their own budgets"
  on budgets for select
  using (auth.uid() = user_id);

create policy "Users can insert their own budgets"
  on budgets for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own budgets"
  on budgets for update
  using (auth.uid() = user_id);

create policy "Users can delete their own budgets"
  on budgets for delete
  using (auth.uid() = user_id);
```

Click **Run** to apply the policies.

### 3. Verify Setup

1. Go to **Table Editor** in the left sidebar
2. You should see three tables:
   - `users`
   - `transactions`
   - `budgets`

3. Click each table and verify the columns

## Environment Variables

### 1. Create `.env.local` file

In the project root directory, create a file named `.env.local`:

```bash
cp .env.example .env.local
```

### 2. Fill in your Supabase credentials

Edit `.env.local`:

```
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

Replace:
- `your-project-id` with your actual project ID
- `your-anon-key-here` with your actual anon key

**Important**: Never commit `.env.local` to git. It's already in `.gitignore`.

## Development

### Start Development Server

```bash
npm run dev
```

Navigate to `http://localhost:5173/` in your browser.

### Features to Test

1. **Sign Up**: Create a new account
2. **Dashboard**: View your financial overview
3. **Add Transaction**: Click the floating button to add a transaction
4. **View Analytics**: Check charts and spending patterns
5. **Set Budgets**: Create monthly budgets
6. **Settings**: Adjust preferences

### Hot Module Replacement (HMR)

The development server supports HMR, so changes you make will automatically refresh in the browser without losing state.

## Deployment

### Option 1: Deploy to Vercel (Recommended)

1. **Install Vercel CLI**:
   ```bash
   npm install -g vercel
   ```

2. **Deploy**:
   ```bash
   vercel
   ```

3. **Follow prompts** and configure environment variables in Vercel dashboard

### Option 2: Deploy to Netlify

1. **Build the project**:
   ```bash
   npm run build
   ```

2. **Upload `dist` folder** to Netlify via drag-and-drop
   - Or connect GitHub for automatic deployments

3. **Set environment variables** in Netlify dashboard under **Build & deploy > Environment**

### Option 3: Deploy to GitHub Pages

1. **Update `vite.config.ts`**:
   ```ts
   export default {
     base: '/expense-tracker/',
     // ... other config
   }
   ```

2. **Build**:
   ```bash
   npm run build
   ```

3. **Push to GitHub** and enable Pages in repository settings

### Option 4: Self-Hosted

1. **Build**:
   ```bash
   npm run build
   ```

2. **Upload `dist` folder** to your web server

3. **Set environment variables** on your server

4. **Ensure proper routing** (configure server to serve `index.html` for all routes)

## Troubleshooting

### Issue: "Missing Supabase credentials"

**Solution**: 
- Verify `.env.local` file exists
- Check that `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are set correctly
- Restart the development server

### Issue: "Supabase connection refused"

**Solution**:
- Check your internet connection
- Verify the Supabase project is active
- Check if the API keys are correct
- Try accessing Supabase dashboard to verify project status

### Issue: "Authentication failed"

**Solution**:
- Ensure RLS policies are correctly set
- Check that the user record is created in the `users` table
- Clear browser cookies and try again

### Issue: "Transactions not loading"

**Solution**:
- Check browser console for errors
- Verify RLS policies are correctly configured
- Ensure user is logged in
- Check Supabase dashboard for any database issues

### Issue: "Charts not displaying"

**Solution**:
- Ensure you have transaction data
- Check browser console for JavaScript errors
- Verify Recharts is properly installed: `npm list recharts`

### Issue: "Styling looks broken"

**Solution**:
- Clear browser cache (Ctrl+Shift+Delete)
- Restart development server: `npm run dev`
- Check that Tailwind CSS is properly compiled

### Issue: "Build is too large"

The chunk size warning is normal for React apps. To optimize:

1. Enable code splitting (already configured)
2. Use dynamic imports for heavy components
3. Consider using a Content Delivery Network (CDN)

## Database Backup

To backup your data regularly:

1. Go to Supabase dashboard
2. Click **Settings** > **Backups**
3. Enable backups
4. Download backups regularly

## Security Best Practices

1. **Never commit `.env.local` to git**
2. **Use strong database passwords**
3. **Enable 2FA on Supabase account**
4. **Regularly review Row Level Security policies**
5. **Keep dependencies updated**: `npm update`
6. **Use HTTPS in production**

## Support & Resources

- **React Docs**: https://react.dev
- **Supabase Docs**: https://supabase.com/docs
- **Tailwind CSS**: https://tailwindcss.com/docs
- **Vite Guide**: https://vitejs.dev/guide/

## Next Steps

1. Customize the color scheme in `tailwind.config.js`
2. Add more transaction categories in `src/utils/categories.ts`
3. Implement additional features like:
   - Export to CSV
   - Bill reminders
   - Recurring transactions
   - Multi-currency support
4. Deploy to production
5. Invite others to use your expense tracker

---

Happy tracking! If you encounter issues, check the troubleshooting section or reach out for support.
