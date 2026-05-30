# 💰 ExpenseTracker - Modern Expense Management Application

A premium, production-ready expense tracking application built with React, TypeScript, Vite, Tailwind CSS, and Supabase. Features a beautiful dark minimalist theme with advanced analytics, budget management, and transaction tracking.

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![React](https://img.shields.io/badge/React-18+-blue.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5+-blue.svg)

## ✨ Features

### 🔐 Authentication
- User registration and login
- Secure password management
- Google OAuth integration (UI ready)
- Persistent session management
- Protected routes

### 📊 Dashboard
- Total balance display
- Income and expense cards
- Savings overview
- Recent transactions section
- Expense category breakdown (Pie chart)
- Monthly summary statistics
- Animated cards with smooth transitions

### 💳 Transaction Management
- Add, edit, and delete transactions
- Multiple transaction categories (10+ categories)
- Income and expense types
- Date tracking
- Notes and descriptions
- Transaction history with filtering

### 📈 Advanced Analytics
- Monthly income vs expense bar charts
- Spending trend line charts
- Category breakdown pie charts
- Top 5 expense categories
- Detailed category analysis
- Interactive charts with Recharts

### 💰 Budget Management
- Set monthly budgets by category
- Track budget utilization
- Visual progress indicators
- Budget overspend alerts
- Budget summary dashboard

### 🎨 UI/UX Features
- Dark glassmorphism design
- Smooth animations with Framer Motion
- Responsive design (mobile, tablet, desktop)
- Sidebar navigation
- Toast notifications
- Loading skeletons
- Empty states
- Floating action button (FAB)
- Gradient highlights

## 🛠️ Tech Stack

### Frontend
- React 18
- TypeScript
- Vite
- Tailwind CSS
- React Router DOM
- Recharts
- Framer Motion
- React Hook Form
- Zod
- Lucide React
- React Hot Toast

### Backend
- Supabase
- PostgreSQL
- Supabase Auth

## 📋 Project Structure

```
src/
├── components/          # Reusable UI components
├── pages/               # Page components
├── layouts/             # Layout wrappers
├── context/             # React context
├── hooks/               # Custom React hooks
├── services/            # API and external services
├── lib/                 # Library configurations
├── types/               # TypeScript types
├── utils/               # Utility functions
├── routes/              # Route configuration
├── assets/              # Static assets
├── App.tsx              # Main app component
├── main.tsx             # Entry point
└── index.css            # Global styles
```

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ and npm/yarn
- Supabase account (free tier available)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd expense-tracker
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Update `.env.local` with your Supabase credentials:
   ```
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key-here
   ```

4. **Set up Supabase Database**
   
   Create the following tables:
   
   **Users Table:**
   ```sql
   create table users (
     id uuid primary key references auth.users(id) on delete cascade,
     email varchar(255) not null unique,
     name varchar(255),
     created_at timestamp with time zone default now()
   );
   ```
   
   **Transactions Table:**
   ```sql
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
   create index transactions_user_id_idx on transactions(user_id);
   ```
   
   **Budgets Table:**
   ```sql
   create table budgets (
     id uuid primary key default gen_random_uuid(),
     user_id uuid not null references users(id) on delete cascade,
     category varchar(100) not null,
     limit_amount decimal(12,2) not null,
     created_at timestamp with time zone default now(),
     unique(user_id, category)
   );
   create index budgets_user_id_idx on budgets(user_id);
   ```
   
   **Enable Row Level Security (RLS):**
   ```sql
   alter table users enable row level security;
   alter table transactions enable row level security;
   alter table budgets enable row level security;
   
   -- Users RLS
   create policy "Users can view their own profile"
     on users for select
     using (auth.uid() = id);
   
   -- Transactions RLS
   create policy "Users can manage their own transactions"
     on transactions for all
     using (auth.uid() = user_id);
   
   -- Budgets RLS
   create policy "Users can manage their own budgets"
     on budgets for all
     using (auth.uid() = user_id);
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

## 📦 Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run linter
```

## 🎨 Color Scheme

- **Primary Background**: `#243642`
- **Secondary**: `#387478`
- **Accent**: `#629584`
- **Light Text**: `#E2F1E7`

## 🔐 Security

- Row-level security in PostgreSQL
- Secure Supabase authentication
- Protected routes
- Session management
- No sensitive data in localStorage

## 📱 Responsive Design

- Mobile (< 768px): Optimized layout
- Tablet (768px - 1024px): Partial sidebar
- Desktop (> 1024px): Full sidebar + content

## 🚢 Deployment

### Vercel
```bash
npm install -g vercel
vercel
```

### Netlify
```bash
npm run build
# Upload dist folder to Netlify
```

## 📚 Documentation

- [React](https://react.dev)
- [Supabase](https://supabase.com/docs)
- [Tailwind CSS](https://tailwindcss.com)
- [Recharts](https://recharts.org)
- [Framer Motion](https://www.framer.com/motion/)

## 📄 License

MIT License - feel free to use for personal and commercial projects.

## 🙏 Acknowledgments

- Design inspiration from modern fintech applications
- Supabase for excellent backend infrastructure
- React and TypeScript communities

---

Made with ❤️ using React, TypeScript, and Supabase
