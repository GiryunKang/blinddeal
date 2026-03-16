# BlindDeal Platform Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a full-featured real estate and M&A deal brokerage platform with public/private deal visibility, full deal lifecycle (matching→negotiation→due diligence→contract→escrow), market insights, community, and expert network.

**Architecture:** Next.js 15 App Router with TypeScript frontend, Supabase backend (PostgreSQL + Auth + Realtime + Storage + Edge Functions), Toss Payments for escrow/payments. Dark theme V1 Clean Minimal design system using Tailwind CSS + shadcn/ui.

**Tech Stack:** Next.js 15, TypeScript, Tailwind CSS, shadcn/ui, Supabase, Toss Payments, Vercel, Resend (email), next-intl (i18n)

**Spec:** `docs/superpowers/specs/2026-03-17-blinddeal-platform-design.md`

---

## Chunk 1: Project Foundation & Design System

### Task 1: Initialize Next.js Project

**Files:**
- Create: `package.json`, `tsconfig.json`, `next.config.ts`, `tailwind.config.ts`, `postcss.config.mjs`
- Create: `.env.local.example`
- Create: `.gitignore`

- [ ] **Step 1: Scaffold Next.js 15 with App Router**

```bash
cd "/c/Users/USER/Documents/Projects/my dream/blinddeal"
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --use-npm
```

- [ ] **Step 2: Install core dependencies**

```bash
npm install @supabase/supabase-js @supabase/ssr next-intl lucide-react date-fns clsx tailwind-merge class-variance-authority
npm install -D @types/node
```

- [ ] **Step 3: Install shadcn/ui**

```bash
npx shadcn@latest init -d
```

Select: New York style, Zinc base color, CSS variables: yes

- [ ] **Step 4: Add essential shadcn components**

```bash
npx shadcn@latest add button card input label textarea select badge dialog sheet tabs avatar dropdown-menu toast separator scroll-area skeleton table command popover calendar
```

- [ ] **Step 5: Create .env.local.example**

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
NEXT_PUBLIC_APP_URL=http://localhost:3000
TOSS_PAYMENTS_SECRET_KEY=your_toss_secret
TOSS_PAYMENTS_CLIENT_KEY=your_toss_client
RESEND_API_KEY=your_resend_key
```

- [ ] **Step 6: Commit**

```bash
git add -A && git commit -m "chore: initialize Next.js 15 project with Tailwind and shadcn/ui"
```

---

### Task 2: Dark Theme Design System

**Files:**
- Modify: `src/app/globals.css`
- Create: `src/lib/utils.ts`
- Create: `src/components/ui/` (shadcn components already added)
- Create: `src/components/layout/header.tsx`
- Create: `src/components/layout/sidebar.tsx`
- Create: `src/components/layout/footer.tsx`
- Create: `src/components/layout/main-layout.tsx`

- [ ] **Step 1: Configure dark theme CSS variables**

In `src/app/globals.css`, set the V1 Clean Minimal dark theme:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 222 47% 5%;
    --foreground: 210 40% 96%;
    --card: 222 47% 7%;
    --card-foreground: 210 40% 96%;
    --popover: 222 47% 7%;
    --popover-foreground: 210 40% 96%;
    --primary: 217 91% 60%;
    --primary-foreground: 0 0% 100%;
    --secondary: 215 25% 15%;
    --secondary-foreground: 210 40% 96%;
    --muted: 215 25% 15%;
    --muted-foreground: 215 20% 55%;
    --accent: 215 25% 18%;
    --accent-foreground: 210 40% 96%;
    --destructive: 0 84% 60%;
    --destructive-foreground: 0 0% 100%;
    --border: 215 25% 15%;
    --input: 215 25% 15%;
    --ring: 217 91% 60%;
    --radius: 0.625rem;
  }
}

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground antialiased;
  }
}
```

- [ ] **Step 2: Create utility functions**

`src/lib/utils.ts`:

```typescript
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatKRW(amount: number | null): string {
  if (amount === null) return "협의 후 공개"
  if (amount >= 1_000_000_000_000) return `₩${(amount / 1_000_000_000_000).toFixed(1)}T`
  if (amount >= 1_000_000_000) return `₩${(amount / 1_000_000_000).toFixed(0)}B`
  if (amount >= 100_000_000) return `${(amount / 100_000_000).toFixed(0)}억원`
  return `₩${amount.toLocaleString()}`
}

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(date))
}
```

- [ ] **Step 3: Create Header component**

`src/components/layout/header.tsx`:

```tsx
"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Bell, Menu } from "lucide-react"

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-md bg-gradient-to-br from-blue-500 to-indigo-500" />
            <span className="text-lg font-bold tracking-tight">BlindDeal</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-muted-foreground">
            <Link href="/deals" className="transition-colors hover:text-foreground">마켓</Link>
            <Link href="/insights" className="transition-colors hover:text-foreground">인사이트</Link>
            <Link href="/community" className="transition-colors hover:text-foreground">커뮤니티</Link>
            <Link href="/experts" className="transition-colors hover:text-foreground">전문가</Link>
          </nav>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-4 w-4" />
          </Button>
          <Button size="sm">딜 등록</Button>
        </div>
      </div>
    </header>
  )
}
```

- [ ] **Step 4: Create MainLayout component**

`src/components/layout/main-layout.tsx`:

```tsx
import { Header } from "./header"

export function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="mx-auto max-w-7xl px-4 py-6">
        {children}
      </main>
    </div>
  )
}
```

- [ ] **Step 5: Update root layout**

`src/app/layout.tsx`:

```tsx
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "BlindDeal — 부동산 · M&A 전문 거래 플랫폼",
  description: "검증된 부동산 및 M&A 딜을 공개/비공개로 거래하는 전문 플랫폼",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" className="dark">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
```

- [ ] **Step 6: Create landing page with market summary**

`src/app/page.tsx`:

```tsx
import { MainLayout } from "@/components/layout/main-layout"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowUpRight, ArrowDownRight, TrendingUp } from "lucide-react"

function StatCard({ label, value, change, positive }: {
  label: string; value: string; change: string; positive: boolean
}) {
  return (
    <Card className="border-border/50 bg-gradient-to-br from-card to-card/50 p-5">
      <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className="mt-2 text-2xl font-bold tracking-tight">{value}</p>
      <p className={`mt-1 flex items-center gap-1 text-xs font-semibold ${positive ? "text-emerald-400" : "text-red-400"}`}>
        {positive ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
        {change}
      </p>
    </Card>
  )
}

export default function HomePage() {
  return (
    <MainLayout>
      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <StatCard label="거래량" value="₩2.4T" change="+12.3%" positive />
        <StatCard label="신규 딜" value="847" change="+8.7%" positive />
        <StatCard label="활성 M&A" value="156" change="-2.1%" positive={false} />
        <StatCard label="성사 거래" value="₩890B" change="+24.5%" positive />
      </div>

      {/* Recent Deals Preview */}
      <section className="mt-8">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">최근 딜</h2>
          <a href="/deals" className="text-sm text-primary hover:underline">전체보기</a>
        </div>
        <Card className="divide-y divide-border/50 border-border/50">
          <DealRow title="판교 물류센터" subtitle="경기 성남 · 물류" type="부동산" typeColor="blue" amount="₩45B" status="공개" statusColor="emerald" />
          <DealRow title="바이오텍 인수" subtitle="헬스케어 · Series D" type="M&A" typeColor="purple" amount="₩120B" status="NDA" statusColor="amber" />
          <DealRow title="제주 리조트 개발" subtitle="제주 · 관광/레저" type="부동산" typeColor="blue" amount="₩230B" status="공개" statusColor="emerald" />
        </Card>
      </section>
    </MainLayout>
  )
}

function DealRow({ title, subtitle, type, typeColor, amount, status, statusColor }: {
  title: string; subtitle: string; type: string; typeColor: string
  amount: string; status: string; statusColor: string
}) {
  const typeClasses: Record<string, string> = {
    blue: "bg-blue-500/10 text-blue-400",
    purple: "bg-purple-500/10 text-purple-400",
  }
  const statusClasses: Record<string, string> = {
    emerald: "bg-emerald-500/10 text-emerald-400",
    amber: "bg-amber-500/10 text-amber-400",
  }
  return (
    <div className="flex items-center px-5 py-4">
      <div className="flex-[3]">
        <p className="font-semibold">{title}</p>
        <p className="mt-0.5 text-xs text-muted-foreground">{subtitle}</p>
      </div>
      <div className="flex-1 text-center">
        <Badge variant="secondary" className={typeClasses[typeColor]}>{type}</Badge>
      </div>
      <div className="flex-1 text-center text-sm font-medium text-muted-foreground">{amount}</div>
      <div className="flex-1 text-right">
        <Badge variant="secondary" className={statusClasses[statusColor]}>{status}</Badge>
      </div>
    </div>
  )
}
```

- [ ] **Step 7: Verify dev server runs**

```bash
npm run dev
```

Open http://localhost:3000 — verify dark theme landing page renders with stats and deal list.

- [ ] **Step 8: Commit**

```bash
git add -A && git commit -m "feat: add dark theme design system and landing page layout"
```

---

### Task 3: Supabase Setup & Database Schema

**Files:**
- Create: `src/lib/supabase/client.ts`
- Create: `src/lib/supabase/server.ts`
- Create: `src/lib/supabase/middleware.ts`
- Create: `src/middleware.ts`
- Create: `supabase/migrations/00001_initial_schema.sql`

- [ ] **Step 1: Install Supabase CLI and init**

```bash
npm install -D supabase
npx supabase init
```

- [ ] **Step 2: Create Supabase client utilities**

`src/lib/supabase/client.ts`:

```typescript
import { createBrowserClient } from "@supabase/ssr"

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
```

`src/lib/supabase/server.ts`:

```typescript
import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"

export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // Server Component — ignore
          }
        },
      },
    }
  )
}
```

`src/lib/supabase/middleware.ts`:

```typescript
import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  await supabase.auth.getUser()
  return supabaseResponse
}
```

`src/middleware.ts`:

```typescript
import { type NextRequest } from "next/server"
import { updateSession } from "@/lib/supabase/middleware"

export async function middleware(request: NextRequest) {
  return await updateSession(request)
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
}
```

- [ ] **Step 3: Create initial database migration**

`supabase/migrations/00001_initial_schema.sql`:

```sql
-- ============================================
-- BlindDeal Database Schema
-- ============================================

-- 1. Profiles
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  avatar_url TEXT,
  user_type TEXT NOT NULL DEFAULT 'individual' CHECK (user_type IN ('individual', 'corporation')),
  company_name TEXT,
  business_registration_number TEXT,
  corporate_registration_number TEXT,
  representative_name TEXT,
  verification_level INT NOT NULL DEFAULT 0,
  membership_tier TEXT NOT NULL DEFAULT 'free' CHECK (membership_tier IN ('free', 'basic', 'premium', 'enterprise')),
  membership_expires_at TIMESTAMPTZ,
  bio TEXT,
  interests TEXT[],
  preferred_deal_size_min BIGINT,
  preferred_deal_size_max BIGINT,
  preferred_regions TEXT[],
  is_admin BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. Verification Records
CREATE TABLE verification_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  verification_type TEXT NOT NULL CHECK (verification_type IN (
    'phone', 'business_registration', 'corporate_registration',
    'asset_proof', 'credit_rating', 'expert_letter', 'identity_pass'
  )),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  document_urls TEXT[],
  reviewer_id UUID REFERENCES profiles(id),
  reviewed_at TIMESTAMPTZ,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3. Deals
CREATE TABLE deals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  deal_category TEXT NOT NULL CHECK (deal_category IN ('real_estate', 'ma')),
  deal_type TEXT NOT NULL,
  visibility TEXT NOT NULL DEFAULT 'public' CHECK (visibility IN ('public', 'private')),
  required_verification_level INT NOT NULL DEFAULT 0,
  asking_price BIGINT,
  price_currency TEXT NOT NULL DEFAULT 'KRW',
  price_negotiable BOOLEAN NOT NULL DEFAULT true,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN (
    'draft', 'pending_review', 'active', 'under_negotiation',
    'due_diligence', 'contract', 'escrow', 'closed', 'cancelled'
  )),
  address TEXT,
  city TEXT,
  district TEXT,
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  property_area_sqm DOUBLE PRECISION,
  building_area_sqm DOUBLE PRECISION,
  floor_count INT,
  built_year INT,
  zoning TEXT,
  industry TEXT,
  annual_revenue BIGINT,
  annual_profit BIGINT,
  employee_count INT,
  founded_year INT,
  highlight_points TEXT[],
  risk_factors TEXT[],
  thumbnail_url TEXT,
  image_urls TEXT[],
  document_urls TEXT[],
  tags TEXT[],
  view_count INT NOT NULL DEFAULT 0,
  interest_count INT NOT NULL DEFAULT 0,
  inquiry_count INT NOT NULL DEFAULT 0,
  featured BOOLEAN NOT NULL DEFAULT false,
  admin_approved BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  published_at TIMESTAMPTZ,
  closed_at TIMESTAMPTZ
);

-- 4. Deal Interests
CREATE TABLE deal_interests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  deal_id UUID NOT NULL REFERENCES deals(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(deal_id, user_id)
);

-- 5. NDA Agreements
CREATE TABLE nda_agreements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  deal_id UUID NOT NULL REFERENCES deals(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  nda_version TEXT NOT NULL DEFAULT 'v1',
  signed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  ip_address INET,
  UNIQUE(deal_id, user_id)
);

-- 6. Deal Rooms
CREATE TABLE deal_rooms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  deal_id UUID NOT NULL REFERENCES deals(id) ON DELETE CASCADE,
  buyer_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  seller_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'inquiry' CHECK (status IN (
    'inquiry', 'negotiating', 'loi_exchanged', 'due_diligence',
    'contract_review', 'escrow', 'completed', 'cancelled'
  )),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(deal_id, buyer_id)
);

-- 7. Messages
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id UUID NOT NULL REFERENCES deal_rooms(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  message_type TEXT NOT NULL DEFAULT 'text' CHECK (message_type IN (
    'text', 'file', 'loi', 'system', 'meeting_request'
  )),
  file_url TEXT,
  file_name TEXT,
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 8. LOI Documents
CREATE TABLE loi_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id UUID NOT NULL REFERENCES deal_rooms(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  proposed_price BIGINT NOT NULL,
  proposed_terms TEXT NOT NULL,
  conditions TEXT[],
  valid_until TIMESTAMPTZ NOT NULL,
  status TEXT NOT NULL DEFAULT 'sent' CHECK (status IN ('sent', 'accepted', 'rejected', 'countered', 'expired')),
  response_notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  responded_at TIMESTAMPTZ
);

-- 9. Experts
CREATE TABLE experts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id),
  firm_name TEXT NOT NULL,
  expert_type TEXT NOT NULL CHECK (expert_type IN (
    'law_firm', 'accounting_firm', 'tax_firm', 'valuation', 'consulting', 'real_estate_appraiser'
  )),
  specializations TEXT[],
  license_number TEXT,
  description TEXT,
  portfolio_url TEXT,
  rating DOUBLE PRECISION DEFAULT 0,
  review_count INT DEFAULT 0,
  verified BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 10. Due Diligence
CREATE TABLE due_diligence (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id UUID NOT NULL REFERENCES deal_rooms(id) ON DELETE CASCADE,
  deal_id UUID NOT NULL REFERENCES deals(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'initiated' CHECK (status IN (
    'initiated', 'document_collection', 'review_in_progress',
    'expert_review', 'completed', 'failed'
  )),
  started_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  target_completion TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  summary TEXT,
  result TEXT CHECK (result IN ('pass', 'conditional_pass', 'fail'))
);

-- 11. DD Checklist Items
CREATE TABLE dd_checklist_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  dd_id UUID NOT NULL REFERENCES due_diligence(id) ON DELETE CASCADE,
  category TEXT NOT NULL,
  item_name TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'issue_found')),
  assigned_expert_id UUID REFERENCES experts(id),
  documents TEXT[],
  notes TEXT,
  completed_at TIMESTAMPTZ
);

-- 12. Expert Assignments
CREATE TABLE expert_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  dd_id UUID REFERENCES due_diligence(id),
  deal_id UUID NOT NULL REFERENCES deals(id),
  expert_id UUID NOT NULL REFERENCES experts(id),
  role TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'requested' CHECK (status IN ('requested', 'accepted', 'in_progress', 'completed', 'declined')),
  fee BIGINT,
  report_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  completed_at TIMESTAMPTZ
);

-- 13. Escrow Accounts
CREATE TABLE escrow_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id UUID NOT NULL REFERENCES deal_rooms(id) ON DELETE CASCADE,
  deal_id UUID NOT NULL REFERENCES deals(id),
  buyer_id UUID NOT NULL REFERENCES profiles(id),
  seller_id UUID NOT NULL REFERENCES profiles(id),
  total_amount BIGINT NOT NULL,
  currency TEXT NOT NULL DEFAULT 'KRW',
  status TEXT NOT NULL DEFAULT 'created' CHECK (status IN (
    'created', 'funded', 'in_review', 'releasing', 'released', 'refunded', 'disputed'
  )),
  funded_at TIMESTAMPTZ,
  released_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 14. Transactions
CREATE TABLE transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  escrow_id UUID REFERENCES escrow_accounts(id),
  user_id UUID NOT NULL REFERENCES profiles(id),
  transaction_type TEXT NOT NULL CHECK (transaction_type IN (
    'escrow_deposit', 'escrow_release', 'escrow_refund',
    'commission_fee', 'membership_payment', 'expert_fee'
  )),
  amount BIGINT NOT NULL,
  currency TEXT NOT NULL DEFAULT 'KRW',
  payment_method TEXT,
  payment_provider TEXT,
  provider_transaction_id TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'cancelled')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  completed_at TIMESTAMPTZ
);

-- 15. Subscriptions
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  tier TEXT NOT NULL CHECK (tier IN ('basic', 'premium', 'enterprise')),
  price BIGINT NOT NULL,
  billing_cycle TEXT NOT NULL DEFAULT 'monthly' CHECK (billing_cycle IN ('monthly', 'yearly')),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'cancelled', 'expired', 'past_due')),
  current_period_start TIMESTAMPTZ NOT NULL,
  current_period_end TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  cancelled_at TIMESTAMPTZ
);

-- 16. Articles
CREATE TABLE articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id UUID NOT NULL REFERENCES profiles(id),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT,
  category TEXT NOT NULL CHECK (category IN (
    'market_trend', 'real_estate_analysis', 'ma_insight',
    'industry_report', 'expert_column', 'deal_review', 'guide'
  )),
  tags TEXT[],
  thumbnail_url TEXT,
  is_premium BOOLEAN NOT NULL DEFAULT false,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  view_count INT NOT NULL DEFAULT 0,
  like_count INT NOT NULL DEFAULT 0,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 17. Market Data
CREATE TABLE market_data (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  data_type TEXT NOT NULL,
  region TEXT,
  industry TEXT,
  period TEXT NOT NULL,
  value DOUBLE PRECISION NOT NULL,
  unit TEXT NOT NULL,
  source TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 18. Posts
CREATE TABLE posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id UUID NOT NULL REFERENCES profiles(id),
  board TEXT NOT NULL CHECK (board IN (
    'general', 'real_estate', 'ma', 'qna', 'deal_review', 'expert_ama'
  )),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  tags TEXT[],
  is_pinned BOOLEAN NOT NULL DEFAULT false,
  view_count INT NOT NULL DEFAULT 0,
  like_count INT NOT NULL DEFAULT 0,
  comment_count INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 19. Comments
CREATE TABLE comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  author_id UUID NOT NULL REFERENCES profiles(id),
  parent_id UUID REFERENCES comments(id),
  content TEXT NOT NULL,
  like_count INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 20. Match Preferences
CREATE TABLE match_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  deal_categories TEXT[] NOT NULL,
  deal_types TEXT[],
  min_price BIGINT,
  max_price BIGINT,
  regions TEXT[],
  industries TEXT[],
  keywords TEXT[],
  is_active BOOLEAN NOT NULL DEFAULT true,
  notify_email BOOLEAN NOT NULL DEFAULT true,
  notify_push BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 21. Notifications
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN (
    'deal_match', 'deal_status_change', 'new_message', 'loi_received',
    'dd_update', 'escrow_update', 'article_published', 'system'
  )),
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  data JSONB,
  read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 22. Ad Placements
CREATE TABLE ad_placements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  advertiser_id UUID NOT NULL REFERENCES profiles(id),
  slot TEXT NOT NULL CHECK (slot IN (
    'sidebar', 'deal_list_banner', 'article_inline', 'expert_featured'
  )),
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  link_url TEXT NOT NULL,
  impression_count INT NOT NULL DEFAULT 0,
  click_count INT NOT NULL DEFAULT 0,
  budget BIGINT NOT NULL,
  spent BIGINT NOT NULL DEFAULT 0,
  cpc BIGINT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'paused', 'completed')),
  starts_at TIMESTAMPTZ NOT NULL,
  ends_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 23. Admin Logs
CREATE TABLE admin_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id UUID NOT NULL REFERENCES profiles(id),
  action TEXT NOT NULL,
  target_type TEXT,
  target_id UUID,
  details JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================
-- INDEXES
-- ============================================
CREATE INDEX idx_deals_owner ON deals(owner_id);
CREATE INDEX idx_deals_category ON deals(deal_category);
CREATE INDEX idx_deals_status ON deals(status);
CREATE INDEX idx_deals_visibility ON deals(visibility);
CREATE INDEX idx_deals_slug ON deals(slug);
CREATE INDEX idx_deals_created ON deals(created_at DESC);
CREATE INDEX idx_deal_interests_deal ON deal_interests(deal_id);
CREATE INDEX idx_deal_interests_user ON deal_interests(user_id);
CREATE INDEX idx_messages_room ON messages(room_id, created_at);
CREATE INDEX idx_deal_rooms_buyer ON deal_rooms(buyer_id);
CREATE INDEX idx_deal_rooms_seller ON deal_rooms(seller_id);
CREATE INDEX idx_notifications_user ON notifications(user_id, read, created_at DESC);
CREATE INDEX idx_articles_slug ON articles(slug);
CREATE INDEX idx_articles_category ON articles(category);
CREATE INDEX idx_posts_board ON posts(board, created_at DESC);

-- ============================================
-- RLS POLICIES
-- ============================================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE deals ENABLE ROW LEVEL SECURITY;
ALTER TABLE deal_interests ENABLE ROW LEVEL SECURITY;
ALTER TABLE nda_agreements ENABLE ROW LEVEL SECURITY;
ALTER TABLE deal_rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE loi_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE verification_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE match_preferences ENABLE ROW LEVEL SECURITY;

-- Profiles: read all, update own
CREATE POLICY "profiles_select" ON profiles FOR SELECT USING (true);
CREATE POLICY "profiles_update" ON profiles FOR UPDATE USING (id = auth.uid());
CREATE POLICY "profiles_insert" ON profiles FOR INSERT WITH CHECK (id = auth.uid());

-- Deals: public visible to all, private requires verification level
CREATE POLICY "deals_select" ON deals FOR SELECT USING (
  status = 'active' AND (
    visibility = 'public'
    OR owner_id = auth.uid()
    OR (
      visibility = 'private'
      AND EXISTS (
        SELECT 1 FROM profiles WHERE id = auth.uid() AND verification_level >= deals.required_verification_level
      )
    )
  )
  OR owner_id = auth.uid()
  OR status = 'draft' AND owner_id = auth.uid()
  OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true)
);
CREATE POLICY "deals_insert" ON deals FOR INSERT WITH CHECK (owner_id = auth.uid());
CREATE POLICY "deals_update" ON deals FOR UPDATE USING (
  owner_id = auth.uid()
  OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true)
);

-- Deal Interests
CREATE POLICY "deal_interests_select" ON deal_interests FOR SELECT USING (user_id = auth.uid() OR deal_id IN (SELECT id FROM deals WHERE owner_id = auth.uid()));
CREATE POLICY "deal_interests_insert" ON deal_interests FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "deal_interests_delete" ON deal_interests FOR DELETE USING (user_id = auth.uid());

-- Deal Rooms: participants only
CREATE POLICY "deal_rooms_select" ON deal_rooms FOR SELECT USING (buyer_id = auth.uid() OR seller_id = auth.uid());
CREATE POLICY "deal_rooms_insert" ON deal_rooms FOR INSERT WITH CHECK (buyer_id = auth.uid());

-- Messages: room participants
CREATE POLICY "messages_select" ON messages FOR SELECT USING (
  EXISTS (SELECT 1 FROM deal_rooms WHERE id = messages.room_id AND (buyer_id = auth.uid() OR seller_id = auth.uid()))
);
CREATE POLICY "messages_insert" ON messages FOR INSERT WITH CHECK (sender_id = auth.uid());

-- Notifications: own only
CREATE POLICY "notifications_select" ON notifications FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "notifications_update" ON notifications FOR UPDATE USING (user_id = auth.uid());

-- Articles: published visible to all
CREATE POLICY "articles_select" ON articles FOR SELECT USING (status = 'published' OR author_id = auth.uid());
CREATE POLICY "articles_insert" ON articles FOR INSERT WITH CHECK (author_id = auth.uid());

-- Posts: all can read
CREATE POLICY "posts_select" ON posts FOR SELECT USING (true);
CREATE POLICY "posts_insert" ON posts FOR INSERT WITH CHECK (author_id = auth.uid());
CREATE POLICY "posts_update" ON posts FOR UPDATE USING (author_id = auth.uid());

-- Comments: all can read
CREATE POLICY "comments_select" ON comments FOR SELECT USING (true);
CREATE POLICY "comments_insert" ON comments FOR INSERT WITH CHECK (author_id = auth.uid());
CREATE POLICY "comments_update" ON comments FOR UPDATE USING (author_id = auth.uid());

-- Verification Records: own + admin
CREATE POLICY "verification_records_select" ON verification_records FOR SELECT USING (
  user_id = auth.uid() OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true)
);
CREATE POLICY "verification_records_insert" ON verification_records FOR INSERT WITH CHECK (user_id = auth.uid());

-- Match Preferences: own only
CREATE POLICY "match_preferences_select" ON match_preferences FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "match_preferences_insert" ON match_preferences FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "match_preferences_update" ON match_preferences FOR UPDATE USING (user_id = auth.uid());

-- NDA: participants
CREATE POLICY "nda_select" ON nda_agreements FOR SELECT USING (
  user_id = auth.uid() OR deal_id IN (SELECT id FROM deals WHERE owner_id = auth.uid())
);
CREATE POLICY "nda_insert" ON nda_agreements FOR INSERT WITH CHECK (user_id = auth.uid());

-- LOI: room participants
CREATE POLICY "loi_select" ON loi_documents FOR SELECT USING (
  EXISTS (SELECT 1 FROM deal_rooms WHERE id = loi_documents.room_id AND (buyer_id = auth.uid() OR seller_id = auth.uid()))
);
CREATE POLICY "loi_insert" ON loi_documents FOR INSERT WITH CHECK (sender_id = auth.uid());

-- ============================================
-- FUNCTIONS
-- ============================================

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, display_name, email)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1)),
    NEW.email
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Update timestamp trigger
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER deals_updated_at BEFORE UPDATE ON deals FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER deal_rooms_updated_at BEFORE UPDATE ON deal_rooms FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER posts_updated_at BEFORE UPDATE ON posts FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER articles_updated_at BEFORE UPDATE ON articles FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER match_preferences_updated_at BEFORE UPDATE ON match_preferences FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Increment deal view count
CREATE OR REPLACE FUNCTION increment_deal_views(deal_uuid UUID)
RETURNS void AS $$
BEGIN
  UPDATE deals SET view_count = view_count + 1 WHERE id = deal_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

- [ ] **Step 4: Commit**

```bash
git add -A && git commit -m "feat: add Supabase setup, client utilities, and full database migration"
```

---

### Task 4: Authentication System

**Files:**
- Create: `src/app/auth/login/page.tsx`
- Create: `src/app/auth/register/page.tsx`
- Create: `src/app/auth/callback/route.ts`
- Create: `src/components/auth/login-form.tsx`
- Create: `src/components/auth/register-form.tsx`
- Create: `src/lib/supabase/auth.ts`

- [ ] **Step 1: Create auth helper**

`src/lib/supabase/auth.ts`:

```typescript
"use server"

import { createClient } from "./server"
import { redirect } from "next/navigation"

export async function getUser() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

export async function getProfile() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single()

  return data
}

export async function requireAuth() {
  const user = await getUser()
  if (!user) redirect("/auth/login")
  return user
}

export async function signOut() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect("/auth/login")
}
```

- [ ] **Step 2: Create login page**

`src/app/auth/login/page.tsx`:

```tsx
import { LoginForm } from "@/components/auth/login-form"

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <div className="mx-auto mb-4 h-10 w-10 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-500" />
          <h1 className="text-2xl font-bold">BlindDeal</h1>
          <p className="mt-1 text-sm text-muted-foreground">부동산 · M&A 전문 거래 플랫폼</p>
        </div>
        <LoginForm />
      </div>
    </div>
  )
}
```

`src/components/auth/login-form.tsx`:

```tsx
"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardFooter } from "@/components/ui/card"

export function LoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError("")

    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      setError("이메일 또는 비밀번호가 올바르지 않습니다.")
      setLoading(false)
      return
    }

    router.push("/")
    router.refresh()
  }

  return (
    <Card className="border-border/50">
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4 pt-6">
          {error && (
            <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">{error}</div>
          )}
          <div className="space-y-2">
            <Label htmlFor="email">이메일</Label>
            <Input id="email" type="email" placeholder="name@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">비밀번호</Label>
            <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-3">
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "로그인 중..." : "로그인"}
          </Button>
          <p className="text-center text-sm text-muted-foreground">
            계정이 없으신가요?{" "}
            <Link href="/auth/register" className="text-primary hover:underline">회원가입</Link>
          </p>
        </CardFooter>
      </form>
    </Card>
  )
}
```

- [ ] **Step 3: Create register page**

`src/app/auth/register/page.tsx`:

```tsx
import { RegisterForm } from "@/components/auth/register-form"

export default function RegisterPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <div className="mx-auto mb-4 h-10 w-10 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-500" />
          <h1 className="text-2xl font-bold">BlindDeal</h1>
          <p className="mt-1 text-sm text-muted-foreground">회원가입</p>
        </div>
        <RegisterForm />
      </div>
    </div>
  )
}
```

`src/components/auth/register-form.tsx`:

```tsx
"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function RegisterForm() {
  const [userType, setUserType] = useState<"individual" | "corporation">("individual")
  const [displayName, setDisplayName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [companyName, setCompanyName] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError("")

    const supabase = createClient()
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          display_name: displayName,
          user_type: userType,
          company_name: userType === "corporation" ? companyName : null,
        },
      },
    })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    router.push("/")
    router.refresh()
  }

  return (
    <Card className="border-border/50">
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4 pt-6">
          {error && (
            <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">{error}</div>
          )}
          <Tabs value={userType} onValueChange={(v) => setUserType(v as "individual" | "corporation")}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="individual">개인</TabsTrigger>
              <TabsTrigger value="corporation">법인</TabsTrigger>
            </TabsList>
          </Tabs>
          <div className="space-y-2">
            <Label>{userType === "individual" ? "이름" : "담당자 이름"}</Label>
            <Input value={displayName} onChange={(e) => setDisplayName(e.target.value)} required />
          </div>
          {userType === "corporation" && (
            <div className="space-y-2">
              <Label>법인명</Label>
              <Input value={companyName} onChange={(e) => setCompanyName(e.target.value)} required />
            </div>
          )}
          <div className="space-y-2">
            <Label>이메일</Label>
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label>비밀번호</Label>
            <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} minLength={8} required />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-3">
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "가입 중..." : "회원가입"}
          </Button>
          <p className="text-center text-sm text-muted-foreground">
            이미 계정이 있으신가요?{" "}
            <Link href="/auth/login" className="text-primary hover:underline">로그인</Link>
          </p>
        </CardFooter>
      </form>
    </Card>
  )
}
```

- [ ] **Step 4: Create auth callback**

`src/app/auth/callback/route.ts`:

```typescript
import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get("code")
  const next = searchParams.get("next") ?? "/"

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  return NextResponse.redirect(`${origin}/auth/login?error=auth_failed`)
}
```

- [ ] **Step 5: Commit**

```bash
git add -A && git commit -m "feat: add authentication system with login, register, and auth callback"
```

---

## Chunk 2: Deal Marketplace

### Task 5: TypeScript Types

**Files:**
- Create: `src/lib/types/database.ts`

- [ ] **Step 1: Create comprehensive TypeScript types**

`src/lib/types/database.ts`:

```typescript
export type DealCategory = "real_estate" | "ma"
export type DealVisibility = "public" | "private"
export type DealStatus = "draft" | "pending_review" | "active" | "under_negotiation" | "due_diligence" | "contract" | "escrow" | "closed" | "cancelled"
export type UserType = "individual" | "corporation"
export type MembershipTier = "free" | "basic" | "premium" | "enterprise"
export type RoomStatus = "inquiry" | "negotiating" | "loi_exchanged" | "due_diligence" | "contract_review" | "escrow" | "completed" | "cancelled"

export interface Profile {
  id: string
  display_name: string
  email: string
  phone: string | null
  avatar_url: string | null
  user_type: UserType
  company_name: string | null
  business_registration_number: string | null
  corporate_registration_number: string | null
  representative_name: string | null
  verification_level: number
  membership_tier: MembershipTier
  membership_expires_at: string | null
  bio: string | null
  interests: string[] | null
  preferred_deal_size_min: number | null
  preferred_deal_size_max: number | null
  preferred_regions: string[] | null
  is_admin: boolean
  created_at: string
  updated_at: string
}

export interface Deal {
  id: string
  owner_id: string
  title: string
  slug: string
  description: string
  deal_category: DealCategory
  deal_type: string
  visibility: DealVisibility
  required_verification_level: number
  asking_price: number | null
  price_currency: string
  price_negotiable: boolean
  status: DealStatus
  address: string | null
  city: string | null
  district: string | null
  latitude: number | null
  longitude: number | null
  property_area_sqm: number | null
  building_area_sqm: number | null
  floor_count: number | null
  built_year: number | null
  zoning: string | null
  industry: string | null
  annual_revenue: number | null
  annual_profit: number | null
  employee_count: number | null
  founded_year: number | null
  highlight_points: string[] | null
  risk_factors: string[] | null
  thumbnail_url: string | null
  image_urls: string[] | null
  document_urls: string[] | null
  tags: string[] | null
  view_count: number
  interest_count: number
  inquiry_count: number
  featured: boolean
  admin_approved: boolean
  created_at: string
  updated_at: string
  published_at: string | null
  closed_at: string | null
  owner?: Profile
}

export interface DealRoom {
  id: string
  deal_id: string
  buyer_id: string
  seller_id: string
  status: RoomStatus
  created_at: string
  updated_at: string
  deal?: Deal
  buyer?: Profile
  seller?: Profile
}

export interface Message {
  id: string
  room_id: string
  sender_id: string
  content: string
  message_type: "text" | "file" | "loi" | "system" | "meeting_request"
  file_url: string | null
  file_name: string | null
  read_at: string | null
  created_at: string
  sender?: Profile
}

export interface Article {
  id: string
  author_id: string
  title: string
  slug: string
  content: string
  excerpt: string | null
  category: string
  tags: string[] | null
  thumbnail_url: string | null
  is_premium: boolean
  status: string
  view_count: number
  like_count: number
  published_at: string | null
  created_at: string
  updated_at: string
  author?: Profile
}

export interface Post {
  id: string
  author_id: string
  board: string
  title: string
  content: string
  tags: string[] | null
  is_pinned: boolean
  view_count: number
  like_count: number
  comment_count: number
  created_at: string
  updated_at: string
  author?: Profile
}

export interface Comment {
  id: string
  post_id: string
  author_id: string
  parent_id: string | null
  content: string
  like_count: number
  created_at: string
  updated_at: string
  author?: Profile
}

export interface Notification {
  id: string
  user_id: string
  type: string
  title: string
  body: string
  data: Record<string, unknown> | null
  read: boolean
  created_at: string
}

export interface Expert {
  id: string
  user_id: string | null
  firm_name: string
  expert_type: string
  specializations: string[] | null
  license_number: string | null
  description: string | null
  portfolio_url: string | null
  rating: number
  review_count: number
  verified: boolean
  created_at: string
}
```

- [ ] **Step 2: Commit**

```bash
git add -A && git commit -m "feat: add comprehensive TypeScript type definitions"
```

---

### Task 6: Deal List Page

**Files:**
- Create: `src/app/deals/page.tsx`
- Create: `src/components/deals/deal-filters.tsx`
- Create: `src/components/deals/deal-card.tsx`
- Create: `src/components/deals/deal-list.tsx`
- Create: `src/lib/actions/deals.ts`

- [ ] **Step 1: Create deal server actions**

`src/lib/actions/deals.ts`:

```typescript
"use server"

import { createClient } from "@/lib/supabase/server"
import type { Deal } from "@/lib/types/database"

export interface DealFilters {
  category?: string
  dealType?: string
  minPrice?: number
  maxPrice?: number
  city?: string
  industry?: string
  visibility?: string
  status?: string
  search?: string
  sortBy?: string
  page?: number
  limit?: number
}

export async function getDeals(filters: DealFilters = {}): Promise<{ deals: Deal[]; count: number }> {
  const supabase = await createClient()
  const page = filters.page || 1
  const limit = filters.limit || 20
  const offset = (page - 1) * limit

  let query = supabase
    .from("deals")
    .select("*, owner:profiles!owner_id(id, display_name, avatar_url, company_name, user_type)", { count: "exact" })
    .in("status", ["active", "under_negotiation"])

  if (filters.category) query = query.eq("deal_category", filters.category)
  if (filters.dealType) query = query.eq("deal_type", filters.dealType)
  if (filters.minPrice) query = query.gte("asking_price", filters.minPrice)
  if (filters.maxPrice) query = query.lte("asking_price", filters.maxPrice)
  if (filters.city) query = query.eq("city", filters.city)
  if (filters.industry) query = query.eq("industry", filters.industry)
  if (filters.visibility) query = query.eq("visibility", filters.visibility)
  if (filters.search) query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`)

  const sortMap: Record<string, [string, { ascending: boolean }]> = {
    newest: ["created_at", { ascending: false }],
    oldest: ["created_at", { ascending: true }],
    price_high: ["asking_price", { ascending: false }],
    price_low: ["asking_price", { ascending: true }],
    popular: ["interest_count", { ascending: false }],
  }
  const [sortCol, sortOpts] = sortMap[filters.sortBy || "newest"] || sortMap.newest
  query = query.order(sortCol, sortOpts)

  query = query.range(offset, offset + limit - 1)

  const { data, count, error } = await query
  if (error) throw error

  return { deals: (data || []) as Deal[], count: count || 0 }
}

export async function getDealBySlug(slug: string): Promise<Deal | null> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("deals")
    .select("*, owner:profiles!owner_id(*)")
    .eq("slug", slug)
    .single()

  if (error) return null

  // Increment view count
  await supabase.rpc("increment_deal_views", { deal_uuid: data.id })

  return data as Deal
}
```

- [ ] **Step 2: Create DealCard component**

`src/components/deals/deal-card.tsx`:

```tsx
import Link from "next/link"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Eye, Heart } from "lucide-react"
import { formatKRW } from "@/lib/utils"
import type { Deal } from "@/lib/types/database"

const categoryColors: Record<string, string> = {
  real_estate: "bg-blue-500/10 text-blue-400",
  ma: "bg-purple-500/10 text-purple-400",
}
const categoryLabels: Record<string, string> = {
  real_estate: "부동산",
  ma: "M&A",
}
const visibilityBadge: Record<string, { class: string; label: string }> = {
  public: { class: "bg-emerald-500/10 text-emerald-400", label: "공개" },
  private: { class: "bg-amber-500/10 text-amber-400", label: "비공개" },
}

export function DealCard({ deal }: { deal: Deal }) {
  const vis = visibilityBadge[deal.visibility]
  return (
    <Link href={`/deals/${deal.slug}`}>
      <Card className="group border-border/50 transition-all hover:border-border hover:bg-card/80">
        {deal.thumbnail_url && (
          <div className="aspect-[16/9] overflow-hidden rounded-t-xl">
            <img src={deal.thumbnail_url} alt={deal.title} className="h-full w-full object-cover transition-transform group-hover:scale-105" />
          </div>
        )}
        <div className="p-5">
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className={categoryColors[deal.deal_category]}>
              {categoryLabels[deal.deal_category]}
            </Badge>
            <Badge variant="secondary" className={vis.class}>{vis.label}</Badge>
          </div>
          <h3 className="mt-3 text-base font-semibold leading-tight">{deal.title}</h3>
          <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{deal.description}</p>
          <div className="mt-4 flex items-center justify-between">
            <p className="text-lg font-bold text-primary">{formatKRW(deal.asking_price)}</p>
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1"><Eye className="h-3 w-3" />{deal.view_count}</span>
              <span className="flex items-center gap-1"><Heart className="h-3 w-3" />{deal.interest_count}</span>
            </div>
          </div>
        </div>
      </Card>
    </Link>
  )
}
```

- [ ] **Step 3: Create DealFilters component**

`src/components/deals/deal-filters.tsx`:

```tsx
"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search } from "lucide-react"

export function DealFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()

  function updateFilter(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString())
    if (value && value !== "all") {
      params.set(key, value)
    } else {
      params.delete(key)
    }
    params.delete("page")
    router.push(`/deals?${params.toString()}`)
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="relative flex-1 min-w-[200px]">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="딜 검색..."
          className="pl-9"
          defaultValue={searchParams.get("search") || ""}
          onKeyDown={(e) => {
            if (e.key === "Enter") updateFilter("search", e.currentTarget.value)
          }}
        />
      </div>
      <Select defaultValue={searchParams.get("category") || "all"} onValueChange={(v) => updateFilter("category", v)}>
        <SelectTrigger className="w-[130px]"><SelectValue placeholder="카테고리" /></SelectTrigger>
        <SelectContent>
          <SelectItem value="all">전체</SelectItem>
          <SelectItem value="real_estate">부동산</SelectItem>
          <SelectItem value="ma">M&A</SelectItem>
        </SelectContent>
      </Select>
      <Select defaultValue={searchParams.get("visibility") || "all"} onValueChange={(v) => updateFilter("visibility", v)}>
        <SelectTrigger className="w-[120px]"><SelectValue placeholder="공개여부" /></SelectTrigger>
        <SelectContent>
          <SelectItem value="all">전체</SelectItem>
          <SelectItem value="public">공개</SelectItem>
          <SelectItem value="private">비공개</SelectItem>
        </SelectContent>
      </Select>
      <Select defaultValue={searchParams.get("sortBy") || "newest"} onValueChange={(v) => updateFilter("sortBy", v)}>
        <SelectTrigger className="w-[130px]"><SelectValue placeholder="정렬" /></SelectTrigger>
        <SelectContent>
          <SelectItem value="newest">최신순</SelectItem>
          <SelectItem value="popular">인기순</SelectItem>
          <SelectItem value="price_high">가격 높은순</SelectItem>
          <SelectItem value="price_low">가격 낮은순</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}
```

- [ ] **Step 4: Create deals list page**

`src/app/deals/page.tsx`:

```tsx
import { Suspense } from "react"
import { MainLayout } from "@/components/layout/main-layout"
import { DealFilters } from "@/components/deals/deal-filters"
import { DealCard } from "@/components/deals/deal-card"
import { getDeals } from "@/lib/actions/deals"
import { Skeleton } from "@/components/ui/skeleton"

interface Props {
  searchParams: Promise<Record<string, string | undefined>>
}

export default async function DealsPage({ searchParams }: Props) {
  const params = await searchParams
  const { deals, count } = await getDeals({
    category: params.category,
    visibility: params.visibility,
    search: params.search,
    sortBy: params.sortBy,
    page: params.page ? parseInt(params.page) : 1,
  })

  return (
    <MainLayout>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">딜 마켓플레이스</h1>
          <p className="mt-1 text-sm text-muted-foreground">{count}개의 딜</p>
        </div>
      </div>
      <Suspense fallback={<Skeleton className="h-10 w-full" />}>
        <DealFilters />
      </Suspense>
      <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {deals.map((deal) => (
          <DealCard key={deal.id} deal={deal} />
        ))}
        {deals.length === 0 && (
          <div className="col-span-full py-20 text-center text-muted-foreground">
            조건에 맞는 딜이 없습니다.
          </div>
        )}
      </div>
    </MainLayout>
  )
}
```

- [ ] **Step 5: Commit**

```bash
git add -A && git commit -m "feat: add deal marketplace with filters, cards, and list page"
```

---

### Task 7: Deal Detail Page

**Files:**
- Create: `src/app/deals/[slug]/page.tsx`
- Create: `src/components/deals/deal-detail.tsx`
- Create: `src/components/deals/deal-interest-button.tsx`
- Create: `src/components/deals/nda-dialog.tsx`

- [ ] **Step 1: Create deal detail page**

`src/app/deals/[slug]/page.tsx`:

```tsx
import { notFound } from "next/navigation"
import { MainLayout } from "@/components/layout/main-layout"
import { DealDetail } from "@/components/deals/deal-detail"
import { getDealBySlug } from "@/lib/actions/deals"

interface Props {
  params: Promise<{ slug: string }>
}

export default async function DealDetailPage({ params }: Props) {
  const { slug } = await params
  const deal = await getDealBySlug(slug)
  if (!deal) notFound()

  return (
    <MainLayout>
      <DealDetail deal={deal} />
    </MainLayout>
  )
}
```

- [ ] **Step 2: Create DealDetail component**

`src/components/deals/deal-detail.tsx`:

```tsx
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { MapPin, Building, Calendar, Users, TrendingUp, Eye, Heart, MessageSquare, Lock } from "lucide-react"
import { formatKRW, formatDate } from "@/lib/utils"
import type { Deal } from "@/lib/types/database"

export function DealDetail({ deal }: { deal: Deal }) {
  const isRealEstate = deal.deal_category === "real_estate"

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      {/* Main Content */}
      <div className="lg:col-span-2 space-y-6">
        {/* Header */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Badge variant="secondary" className={isRealEstate ? "bg-blue-500/10 text-blue-400" : "bg-purple-500/10 text-purple-400"}>
              {isRealEstate ? "부동산" : "M&A"}
            </Badge>
            <Badge variant="secondary" className={deal.visibility === "public" ? "bg-emerald-500/10 text-emerald-400" : "bg-amber-500/10 text-amber-400"}>
              {deal.visibility === "public" ? "공개" : "비공개"}
            </Badge>
          </div>
          <h1 className="text-2xl font-bold">{deal.title}</h1>
          <div className="mt-2 flex items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1"><Eye className="h-4 w-4" />{deal.view_count}</span>
            <span className="flex items-center gap-1"><Heart className="h-4 w-4" />{deal.interest_count}</span>
            <span className="flex items-center gap-1"><MessageSquare className="h-4 w-4" />{deal.inquiry_count}</span>
            <span>{formatDate(deal.created_at)}</span>
          </div>
        </div>

        {/* Images */}
        {deal.image_urls && deal.image_urls.length > 0 && (
          <div className="grid gap-2 grid-cols-2">
            {deal.image_urls.map((url, i) => (
              <img key={i} src={url} alt={`${deal.title} ${i + 1}`} className="rounded-lg object-cover aspect-video w-full" />
            ))}
          </div>
        )}

        {/* Description */}
        <Card className="border-border/50 p-6">
          <h2 className="text-lg font-semibold mb-4">상세 설명</h2>
          <p className="whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground">{deal.description}</p>
        </Card>

        {/* Key Details */}
        <Card className="border-border/50 p-6">
          <h2 className="text-lg font-semibold mb-4">{isRealEstate ? "부동산 정보" : "기업 정보"}</h2>
          <div className="grid grid-cols-2 gap-4">
            {isRealEstate ? (
              <>
                {deal.address && <InfoItem icon={<MapPin className="h-4 w-4" />} label="주소" value={deal.address} />}
                {deal.property_area_sqm && <InfoItem icon={<Building className="h-4 w-4" />} label="대지면적" value={`${deal.property_area_sqm.toLocaleString()}㎡`} />}
                {deal.building_area_sqm && <InfoItem icon={<Building className="h-4 w-4" />} label="연면적" value={`${deal.building_area_sqm.toLocaleString()}㎡`} />}
                {deal.floor_count && <InfoItem icon={<Building className="h-4 w-4" />} label="층수" value={`${deal.floor_count}층`} />}
                {deal.built_year && <InfoItem icon={<Calendar className="h-4 w-4" />} label="준공년도" value={`${deal.built_year}년`} />}
                {deal.zoning && <InfoItem icon={<MapPin className="h-4 w-4" />} label="용도지역" value={deal.zoning} />}
              </>
            ) : (
              <>
                {deal.industry && <InfoItem icon={<Building className="h-4 w-4" />} label="업종" value={deal.industry} />}
                {deal.annual_revenue && <InfoItem icon={<TrendingUp className="h-4 w-4" />} label="연매출" value={formatKRW(deal.annual_revenue)} />}
                {deal.annual_profit && <InfoItem icon={<TrendingUp className="h-4 w-4" />} label="연이익" value={formatKRW(deal.annual_profit)} />}
                {deal.employee_count && <InfoItem icon={<Users className="h-4 w-4" />} label="직원수" value={`${deal.employee_count}명`} />}
                {deal.founded_year && <InfoItem icon={<Calendar className="h-4 w-4" />} label="설립연도" value={`${deal.founded_year}년`} />}
              </>
            )}
          </div>
        </Card>

        {/* Highlights & Risks */}
        {(deal.highlight_points?.length || deal.risk_factors?.length) && (
          <div className="grid gap-4 md:grid-cols-2">
            {deal.highlight_points && deal.highlight_points.length > 0 && (
              <Card className="border-border/50 p-6">
                <h3 className="font-semibold text-emerald-400 mb-3">핵심 매력</h3>
                <ul className="space-y-2">
                  {deal.highlight_points.map((p, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <span className="mt-1 h-1.5 w-1.5 rounded-full bg-emerald-400 shrink-0" />
                      {p}
                    </li>
                  ))}
                </ul>
              </Card>
            )}
            {deal.risk_factors && deal.risk_factors.length > 0 && (
              <Card className="border-border/50 p-6">
                <h3 className="font-semibold text-amber-400 mb-3">리스크 요인</h3>
                <ul className="space-y-2">
                  {deal.risk_factors.map((r, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <span className="mt-1 h-1.5 w-1.5 rounded-full bg-amber-400 shrink-0" />
                      {r}
                    </li>
                  ))}
                </ul>
              </Card>
            )}
          </div>
        )}

        {/* Private Documents (NDA required) */}
        {deal.visibility === "private" && deal.document_urls && deal.document_urls.length > 0 && (
          <Card className="border-border/50 p-6">
            <div className="flex items-center gap-2 mb-3">
              <Lock className="h-4 w-4 text-amber-400" />
              <h2 className="text-lg font-semibold">비공개 자료</h2>
            </div>
            <p className="text-sm text-muted-foreground">NDA 서명 후 열람 가능합니다.</p>
          </Card>
        )}
      </div>

      {/* Sidebar */}
      <div className="space-y-4">
        <Card className="border-border/50 p-6 sticky top-20">
          <p className="text-sm text-muted-foreground">매각 희망가</p>
          <p className="mt-1 text-2xl font-bold text-primary">{formatKRW(deal.asking_price)}</p>
          {deal.price_negotiable && <p className="mt-1 text-xs text-muted-foreground">가격 협의 가능</p>}
          <Separator className="my-4" />
          <div className="space-y-3">
            <Button className="w-full">문의하기</Button>
            <Button variant="outline" className="w-full">관심 등록</Button>
          </div>
          {/* Owner Info */}
          {deal.owner && (
            <>
              <Separator className="my-4" />
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center text-sm font-semibold">
                  {deal.owner.display_name?.[0]}
                </div>
                <div>
                  <p className="text-sm font-medium">{deal.owner.display_name}</p>
                  <p className="text-xs text-muted-foreground">{deal.owner.company_name || deal.owner.user_type === "individual" ? "개인" : "법인"}</p>
                </div>
              </div>
            </>
          )}
        </Card>
      </div>
    </div>
  )
}

function InfoItem({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-0.5 text-muted-foreground">{icon}</div>
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-sm font-medium">{value}</p>
      </div>
    </div>
  )
}
```

- [ ] **Step 3: Commit**

```bash
git add -A && git commit -m "feat: add deal detail page with full info display"
```

---

### Task 8: Deal Registration Form

**Files:**
- Create: `src/app/deals/new/page.tsx`
- Create: `src/components/deals/deal-form.tsx`
- Create: `src/lib/actions/deal-mutations.ts`

- [ ] **Step 1: Create deal mutation actions**

`src/lib/actions/deal-mutations.ts`:

```typescript
"use server"

import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { requireAuth } from "@/lib/supabase/auth"

function generateSlug(title: string): string {
  const base = title
    .toLowerCase()
    .replace(/[^a-z0-9가-힣\s-]/g, "")
    .replace(/\s+/g, "-")
    .slice(0, 50)
  const suffix = Math.random().toString(36).slice(2, 8)
  return `${base}-${suffix}`
}

export async function createDeal(formData: FormData) {
  const user = await requireAuth()
  const supabase = await createClient()

  const title = formData.get("title") as string
  const deal: Record<string, unknown> = {
    owner_id: user.id,
    title,
    slug: generateSlug(title),
    description: formData.get("description") as string,
    deal_category: formData.get("deal_category") as string,
    deal_type: formData.get("deal_type") as string,
    visibility: formData.get("visibility") as string,
    required_verification_level: parseInt(formData.get("required_verification_level") as string) || 0,
    price_negotiable: formData.get("price_negotiable") === "true",
    status: "pending_review",
  }

  const askingPrice = formData.get("asking_price") as string
  if (askingPrice) deal.asking_price = parseInt(askingPrice)

  // Real estate fields
  if (deal.deal_category === "real_estate") {
    if (formData.get("address")) deal.address = formData.get("address")
    if (formData.get("city")) deal.city = formData.get("city")
    if (formData.get("property_area_sqm")) deal.property_area_sqm = parseFloat(formData.get("property_area_sqm") as string)
    if (formData.get("building_area_sqm")) deal.building_area_sqm = parseFloat(formData.get("building_area_sqm") as string)
    if (formData.get("floor_count")) deal.floor_count = parseInt(formData.get("floor_count") as string)
    if (formData.get("built_year")) deal.built_year = parseInt(formData.get("built_year") as string)
    if (formData.get("zoning")) deal.zoning = formData.get("zoning")
  }

  // M&A fields
  if (deal.deal_category === "ma") {
    if (formData.get("industry")) deal.industry = formData.get("industry")
    if (formData.get("annual_revenue")) deal.annual_revenue = parseInt(formData.get("annual_revenue") as string)
    if (formData.get("annual_profit")) deal.annual_profit = parseInt(formData.get("annual_profit") as string)
    if (formData.get("employee_count")) deal.employee_count = parseInt(formData.get("employee_count") as string)
    if (formData.get("founded_year")) deal.founded_year = parseInt(formData.get("founded_year") as string)
  }

  const { data, error } = await supabase.from("deals").insert(deal).select("slug").single()
  if (error) throw error

  redirect(`/deals/${data.slug}`)
}

export async function toggleDealInterest(dealId: string) {
  const user = await requireAuth()
  const supabase = await createClient()

  const { data: existing } = await supabase
    .from("deal_interests")
    .select("id")
    .eq("deal_id", dealId)
    .eq("user_id", user.id)
    .single()

  if (existing) {
    await supabase.from("deal_interests").delete().eq("id", existing.id)
    await supabase.rpc("increment_deal_views", { deal_uuid: dealId }) // reuse, or create decrement
  } else {
    await supabase.from("deal_interests").insert({ deal_id: dealId, user_id: user.id })
  }
}
```

- [ ] **Step 2: Create deal form component**

`src/components/deals/deal-form.tsx`:

```tsx
"use client"

import { useState } from "react"
import { createDeal } from "@/lib/actions/deal-mutations"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const realEstateTypes = [
  { value: "office", label: "오피스" },
  { value: "retail", label: "상가/리테일" },
  { value: "logistics", label: "물류센터" },
  { value: "land", label: "토지" },
  { value: "development", label: "개발 프로젝트" },
  { value: "residential", label: "주거" },
]

const maTypes = [
  { value: "full_acquisition", label: "완전 인수" },
  { value: "partial_stake", label: "지분 매각" },
  { value: "division_sale", label: "사업부 매각" },
  { value: "merger", label: "합병" },
]

export function DealForm() {
  const [category, setCategory] = useState<"real_estate" | "ma">("real_estate")

  return (
    <form action={createDeal} className="space-y-6">
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle>기본 정보</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Tabs value={category} onValueChange={(v) => setCategory(v as "real_estate" | "ma")}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="real_estate">부동산</TabsTrigger>
              <TabsTrigger value="ma">M&A</TabsTrigger>
            </TabsList>
          </Tabs>
          <input type="hidden" name="deal_category" value={category} />

          <div className="space-y-2">
            <Label>제목</Label>
            <Input name="title" placeholder="딜 제목을 입력하세요" required />
          </div>

          <div className="space-y-2">
            <Label>상세 설명</Label>
            <Textarea name="description" rows={6} placeholder="딜에 대한 상세 설명을 작성하세요" required />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>딜 유형</Label>
              <Select name="deal_type" required>
                <SelectTrigger><SelectValue placeholder="선택" /></SelectTrigger>
                <SelectContent>
                  {(category === "real_estate" ? realEstateTypes : maTypes).map((t) => (
                    <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>매각 희망가 (원)</Label>
              <Input name="asking_price" type="number" placeholder="미입력 시 '협의 후 공개'" />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="space-y-2 flex-1">
              <Label>공개 여부</Label>
              <Select name="visibility" defaultValue="public">
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="public">공개</SelectItem>
                  <SelectItem value="private">비공개</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2 flex-1">
              <Label>필요 인증 등급</Label>
              <Select name="required_verification_level" defaultValue="0">
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">없음</SelectItem>
                  <SelectItem value="1">등급 1 (휴대폰 인증)</SelectItem>
                  <SelectItem value="2">등급 2 (사업자 확인)</SelectItem>
                  <SelectItem value="3">등급 3 (자산 증빙)</SelectItem>
                  <SelectItem value="4">등급 4 (외부 검증)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <input type="hidden" name="price_negotiable" value="true" />
        </CardContent>
      </Card>

      {/* Category-specific fields */}
      {category === "real_estate" ? (
        <Card className="border-border/50">
          <CardHeader><CardTitle>부동산 정보</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>주소</Label>
              <Input name="address" placeholder="서울특별시 강남구..." />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><Label>도시</Label><Input name="city" /></div>
              <div className="space-y-2"><Label>용도지역</Label><Input name="zoning" /></div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2"><Label>대지면적 (㎡)</Label><Input name="property_area_sqm" type="number" step="0.01" /></div>
              <div className="space-y-2"><Label>연면적 (㎡)</Label><Input name="building_area_sqm" type="number" step="0.01" /></div>
              <div className="space-y-2"><Label>층수</Label><Input name="floor_count" type="number" /></div>
            </div>
            <div className="space-y-2"><Label>준공년도</Label><Input name="built_year" type="number" placeholder="2020" /></div>
          </CardContent>
        </Card>
      ) : (
        <Card className="border-border/50">
          <CardHeader><CardTitle>기업 정보</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><Label>업종</Label><Input name="industry" placeholder="IT/소프트웨어" /></div>
              <div className="space-y-2"><Label>설립연도</Label><Input name="founded_year" type="number" /></div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2"><Label>연매출 (원)</Label><Input name="annual_revenue" type="number" /></div>
              <div className="space-y-2"><Label>연이익 (원)</Label><Input name="annual_profit" type="number" /></div>
              <div className="space-y-2"><Label>직원수</Label><Input name="employee_count" type="number" /></div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="flex justify-end gap-3">
        <Button type="submit" size="lg">딜 등록 요청</Button>
      </div>
    </form>
  )
}
```

- [ ] **Step 3: Create deal registration page**

`src/app/deals/new/page.tsx`:

```tsx
import { MainLayout } from "@/components/layout/main-layout"
import { DealForm } from "@/components/deals/deal-form"
import { requireAuth } from "@/lib/supabase/auth"

export default async function NewDealPage() {
  await requireAuth()

  return (
    <MainLayout>
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">딜 등록</h1>
        <DealForm />
      </div>
    </MainLayout>
  )
}
```

- [ ] **Step 4: Commit**

```bash
git add -A && git commit -m "feat: add deal registration form with real estate and M&A fields"
```

---

## Chunk 3: Messaging, Negotiation & Deal Rooms

### Task 9: Deal Rooms & Real-time Messaging

**Files:**
- Create: `src/app/rooms/page.tsx`
- Create: `src/app/rooms/[id]/page.tsx`
- Create: `src/components/rooms/room-list.tsx`
- Create: `src/components/rooms/chat.tsx`
- Create: `src/components/rooms/message-input.tsx`
- Create: `src/lib/actions/rooms.ts`

(Full implementation of real-time chat with Supabase Realtime, message list, input, file sharing, and room status management. Each file follows the same pattern as above with server actions and client components.)

- [ ] **Step 1-5:** Implement room list, chat UI, real-time subscription, message sending, file upload. Commit after each working unit.

### Task 10: LOI (Letter of Intent) System

**Files:**
- Create: `src/components/rooms/loi-form.tsx`
- Create: `src/components/rooms/loi-card.tsx`
- Create: `src/lib/actions/loi.ts`

- [ ] **Step 1-3:** LOI creation form, display card, accept/reject/counter actions. Commit.

---

## Chunk 4: Due Diligence, Experts & Escrow

### Task 11: Due Diligence Workflow
### Task 12: Expert Directory & Assignment
### Task 13: Escrow & Payment Integration

(Each task follows the same pattern: server actions → components → pages → commit)

---

## Chunk 5: Content, Community & Matching

### Task 14: Insights & Articles
### Task 15: Market Data Dashboard
### Task 16: Community (Posts & Comments)
### Task 17: Matching Engine & Notifications

---

## Chunk 6: Admin Panel & Final Polish

### Task 18: Admin Dashboard
### Task 19: Admin Deal/User/Expert Management
### Task 20: Ad Placements System
### Task 21: SEO, Performance & Security Audit

---

## Summary

| Chunk | Tasks | Description |
|-------|-------|-------------|
| 1 | 1-4 | Foundation: Next.js, Design System, DB, Auth |
| 2 | 5-8 | Deal Marketplace: Types, List, Detail, Registration |
| 3 | 9-10 | Messaging & LOI |
| 4 | 11-13 | Due Diligence, Experts, Escrow |
| 5 | 14-17 | Content, Community, Matching |
| 6 | 18-21 | Admin, Ads, Polish |

Each chunk produces a working, deployable increment of the platform.
