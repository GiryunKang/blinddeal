# BlindDeal Platform — Full Design Spec

## 1. 플랫폼 개요

### 비전
**BlindDeal** — 부동산과 M&A 딜 정보를 공개/비공개로 연결하는 전문 딜 정보 플랫폼. 개인 투자자/자산가(A)와 기업/법인(B)이 직접 만나되, 검증된 신뢰 체계와 딜 프로세스 관리(매칭→협상→실사→계약) 위에서 거래 당사자 간 직접 거래를 지원한다. 플랫폼은 거래를 중개하지 않으며, 딜 정보 연결과 프로세스 관리 도구를 제공한다.

### 핵심 차별점
- **공개/비공개 이중 구조**: 등록자가 선택, 비공개 딜은 자격 검증된 사용자에게만 노출
- **비대칭 인증**: 공급자(매도자)는 점진적 경량 인증, 수요자(매수자)는 등급별 자격 검증
- **딜 프로세스 관리 + 전문가 네트워크**: 매칭→협상→실사→계약 단계 추적 + 법무/회계/세무 전문가 연결 (거래는 당사자 간 직접 수행)
- **체류 유도 콘텐츠**: 시장 인사이트 + 커뮤니티 + 맞춤 매칭/알림

### 수익 모델
1. **멤버십 구독**: 비공개 딜 접근, 프리미엄 리포트, 우선 매칭, 고급 분석 도구 등 유료 구독 (Basic/Premium/Enterprise 티어)
2. **전문가 연결 수수료**: 플랫폼 제휴 전문가(법무/회계/세무) 연결 시 연결 수수료 (실제 자문 수수료는 전문가에게 귀속)
3. **광고/스폰서**: 법무법인, 회계법인, 금융기관 등 관련 업종 광고
4. **프리미엄 딜 리스팅**: 딜 상위 노출, 추천 배치 등 유료 리스팅 옵션

> **법적 유의**: 플랫폼은 거래를 중개하지 않으며, 딜 정보 연결 및 프로세스 관리 도구를 제공하는 정보 플랫폼이다. 거래 계약 및 자금 이동은 당사자 간 직접 또는 제휴 전문가를 통해 수행한다.

### 타겟 시장
한국 국내 → 아시아 → 글로벌 단계적 확장. 초기 언어 한국어, 이후 영어/일본어/중국어 추가.

### 브랜드 톤
V1 클린 미니멀 — 다크 배경, 절제된 그라데이션 카드, 라운드 모서리, 부드러운 컬러 코딩. 모던 SaaS 대시보드 느낌.

---

## 2. 기술 스택

| 레이어 | 기술 | 이유 |
|--------|------|------|
| 프론트엔드 | Next.js 15 (App Router) + TypeScript | SSR/SEO, i18n, 글로벌 확장 |
| 스타일링 | Tailwind CSS + shadcn/ui | 다크 테마, 일관된 디자인 시스템 |
| 백엔드/DB | Supabase (PostgreSQL + Auth + Storage + Realtime) | RLS 기반 접근제어, 빠른 개발 |
| 실시간 | Supabase Realtime | 메시징, 딜 상태 라이브 업데이트 |
| 결제 | Toss Payments | 국내 결제, 에스크로 계좌 |
| 검색 | PostgreSQL Full-text Search → Elasticsearch(확장 시) | 단계적 고도화 |
| 알림 | Supabase Edge Functions + Resend(이메일) + FCM(푸시) | 맞춤 알림 |
| 배포 | Vercel | Next.js 최적화, 글로벌 CDN |
| 모니터링 | Sentry + Vercel Analytics | 에러 추적, 성능 |

---

## 3. 데이터베이스 스키마

### 3.1 사용자 & 인증

```sql
-- 사용자 프로필 (Supabase Auth 확장)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  avatar_url TEXT,
  user_type TEXT NOT NULL CHECK (user_type IN ('individual', 'corporation')),
  -- 법인 정보 (user_type = 'corporation' 시)
  company_name TEXT,
  business_registration_number TEXT,
  corporate_registration_number TEXT,
  representative_name TEXT,
  -- 인증 등급
  verification_level INT NOT NULL DEFAULT 0,
  -- 0: 이메일만, 1: 휴대폰 인증, 2: 사업자 확인, 3: 자산 증빙, 4: 전문 검증
  -- 멤버십
  membership_tier TEXT NOT NULL DEFAULT 'free' CHECK (membership_tier IN ('free', 'basic', 'premium', 'enterprise')),
  membership_expires_at TIMESTAMPTZ,
  -- 메타
  bio TEXT,
  interests TEXT[], -- 관심 분야: 'real_estate', 'ma', 'logistics', 'tech' 등
  preferred_deal_size_min BIGINT,
  preferred_deal_size_max BIGINT,
  preferred_regions TEXT[],
  is_admin BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 인증 이력
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
```

### 3.2 딜 (부동산 + M&A)

```sql
-- 딜 메인 테이블
CREATE TABLE deals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  -- 기본 정보
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT NOT NULL,
  deal_category TEXT NOT NULL CHECK (deal_category IN ('real_estate', 'ma')),
  deal_type TEXT NOT NULL, -- 부동산: 'office','retail','logistics','land','development','residential'
                           -- M&A: 'full_acquisition','partial_stake','division_sale','merger'
  -- 공개/비공개
  visibility TEXT NOT NULL DEFAULT 'public' CHECK (visibility IN ('public', 'private')),
  required_verification_level INT NOT NULL DEFAULT 0, -- 비공개 딜 접근에 필요한 인증 등급
  -- 금액 (모든 금액은 해당 통화의 최소 단위. KRW=원, USD=센트)
  asking_price BIGINT, -- NULL이면 "협의 후 공개"
  price_currency TEXT NOT NULL DEFAULT 'KRW',
  price_negotiable BOOLEAN NOT NULL DEFAULT true,
  -- 상태
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN (
    'draft', 'pending_review', 'active', 'under_negotiation',
    'due_diligence', 'contract', 'escrow', 'closed', 'cancelled'
  )),
  -- 위치 (부동산)
  address TEXT,
  city TEXT,
  district TEXT,
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  -- 부동산 상세
  property_area_sqm DOUBLE PRECISION,
  building_area_sqm DOUBLE PRECISION,
  floor_count INT,
  built_year INT,
  zoning TEXT,
  -- M&A 상세
  industry TEXT,
  annual_revenue BIGINT,
  annual_profit BIGINT,
  employee_count INT,
  founded_year INT,
  -- 공통 상세
  highlight_points TEXT[], -- 핵심 매력 포인트
  risk_factors TEXT[],
  -- 미디어
  thumbnail_url TEXT,
  image_urls TEXT[],
  document_urls TEXT[], -- 비공개 문서 (NDA 후 접근)
  -- 검색/필터
  tags TEXT[],
  -- 통계
  view_count INT NOT NULL DEFAULT 0,
  interest_count INT NOT NULL DEFAULT 0,
  inquiry_count INT NOT NULL DEFAULT 0,
  -- 메타
  featured BOOLEAN NOT NULL DEFAULT false,
  admin_approved BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  published_at TIMESTAMPTZ,
  closed_at TIMESTAMPTZ
);

-- 딜 관심 표시
CREATE TABLE deal_interests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  deal_id UUID NOT NULL REFERENCES deals(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(deal_id, user_id)
);

-- NDA 서명 기록
CREATE TABLE nda_agreements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  deal_id UUID NOT NULL REFERENCES deals(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  nda_version TEXT NOT NULL DEFAULT 'v1',
  signed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  ip_address INET,
  UNIQUE(deal_id, user_id)
);
```

### 3.3 협상 & 메시징

```sql
-- 딜 룸 (매도자-매수자 1:1 협상 공간)
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

-- 메시지
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

-- 의향서 (LOI)
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
```

### 3.4 전문가 네트워크

> **주의**: experts 테이블은 dd_checklist_items에서 참조하므로 반드시 먼저 생성해야 합니다.

```sql
-- 전문가 (법무, 회계, 세무 등)
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

-- 전문가 배정
CREATE TABLE expert_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  dd_id UUID REFERENCES due_diligence(id),
  deal_id UUID NOT NULL REFERENCES deals(id),
  expert_id UUID NOT NULL REFERENCES experts(id),
  role TEXT NOT NULL, -- 'legal_review', 'financial_audit', 'tax_review', 'valuation', 'appraisal'
  status TEXT NOT NULL DEFAULT 'requested' CHECK (status IN ('requested', 'accepted', 'in_progress', 'completed', 'declined')),
  fee BIGINT,
  report_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  completed_at TIMESTAMPTZ
);
```

### 3.5 실사 (Due Diligence)

```sql
-- 실사 프로세스
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

-- 실사 체크리스트
CREATE TABLE dd_checklist_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  dd_id UUID NOT NULL REFERENCES due_diligence(id) ON DELETE CASCADE,
  category TEXT NOT NULL, -- 'legal', 'financial', 'tax', 'operational', 'environmental'
  item_name TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'issue_found')),
  assigned_expert_id UUID REFERENCES experts(id),
  documents TEXT[],
  notes TEXT,
  completed_at TIMESTAMPTZ
);

-- 딜 상태 변경 이력 (감사 추적용)
CREATE TABLE deal_status_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  deal_id UUID NOT NULL REFERENCES deals(id) ON DELETE CASCADE,
  old_status TEXT NOT NULL,
  new_status TEXT NOT NULL,
  changed_by UUID NOT NULL REFERENCES profiles(id),
  reason TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

### 3.6 에스크로 & 결제

```sql
-- 에스크로 계좌
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

-- 결제 트랜잭션
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
  payment_method TEXT, -- 'bank_transfer', 'card', 'virtual_account'
  payment_provider TEXT, -- 'toss_payments'
  provider_transaction_id TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'cancelled')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  completed_at TIMESTAMPTZ
);

-- 멤버십 구독
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
```

### 3.7 콘텐츠 & 인사이트

```sql
-- 인사이트 아티클
CREATE TABLE articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id UUID NOT NULL REFERENCES profiles(id),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  content TEXT NOT NULL, -- Markdown
  excerpt TEXT,
  category TEXT NOT NULL CHECK (category IN (
    'market_trend', 'real_estate_analysis', 'ma_insight',
    'industry_report', 'expert_column', 'deal_review', 'guide'
  )),
  tags TEXT[],
  thumbnail_url TEXT,
  is_premium BOOLEAN NOT NULL DEFAULT false, -- 멤버십 전용
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  view_count INT NOT NULL DEFAULT 0,
  like_count INT NOT NULL DEFAULT 0,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 시장 데이터 (시세 트렌드)
CREATE TABLE market_data (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  data_type TEXT NOT NULL, -- 'real_estate_price_index', 'ma_volume', 'cap_rate', 'industry_multiple'
  region TEXT,
  industry TEXT,
  period TEXT NOT NULL, -- '2026-Q1', '2026-03'
  value DOUBLE PRECISION NOT NULL,
  unit TEXT NOT NULL,
  source TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

### 3.8 커뮤니티

```sql
-- 게시판
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

-- 댓글
CREATE TABLE comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  author_id UUID NOT NULL REFERENCES profiles(id),
  parent_id UUID REFERENCES comments(id), -- 대댓글
  content TEXT NOT NULL,
  like_count INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

### 3.9 매칭 & 알림

```sql
-- 매칭 조건 (사용자가 설정)
CREATE TABLE match_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  deal_categories TEXT[] NOT NULL, -- ['real_estate', 'ma']
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

-- 알림
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN (
    'deal_match', 'deal_status_change', 'new_message', 'loi_received',
    'dd_update', 'escrow_update', 'article_published', 'system'
  )),
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  data JSONB, -- 관련 링크, ID 등
  read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

### 3.10 광고

```sql
-- 광고 슬롯
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
  cpc BIGINT, -- cost per click
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'paused', 'completed')),
  starts_at TIMESTAMPTZ NOT NULL,
  ends_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

### 3.11 관리자

```sql
-- 관리자 활동 로그
CREATE TABLE admin_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id UUID NOT NULL REFERENCES profiles(id),
  action TEXT NOT NULL,
  target_type TEXT, -- 'deal', 'user', 'article', 'expert', 'ad'
  target_id UUID,
  details JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

---

## 4. 주요 페이지 & 라우트 구조

```
/                              → 랜딩/대시보드 (시장 요약 + 추천 딜)
/auth/login                    → 로그인
/auth/register                 → 회원가입 (개인/법인 선택)
/auth/verify                   → 인증 단계별 진행

/deals                         → 딜 마켓플레이스 (필터/검색/정렬)
/deals/[slug]                  → 딜 상세 (공개 정보 + NDA 후 비공개 정보)
/deals/new                     → 딜 등록 (부동산/M&A 선택 → 폼)
/deals/my                      → 내 딜 관리

/rooms                         → 내 협상 룸 목록
/rooms/[id]                    → 협상 룸 (메시징 + LOI + 실사 + 에스크로)

/insights                      → 인사이트 아티클 목록
/insights/[slug]               → 아티클 상세
/insights/market               → 시장 데이터 대시보드

/community                     → 커뮤니티 게시판
/community/[board]             → 게시판별
/community/[board]/[id]        → 게시글 상세

/experts                       → 전문가 디렉토리
/experts/[id]                  → 전문가 프로필

/profile                       → 내 프로필 & 설정
/profile/verification          → 인증 등급 관리
/profile/membership            → 멤버십 관리
/profile/notifications         → 알림 설정
/profile/matches               → 매칭 조건 설정

/admin                         → 관리자 대시보드
/admin/deals                   → 딜 승인/관리
/admin/users                   → 사용자 관리
/admin/articles                → 콘텐츠 관리
/admin/experts                 → 전문가 관리
/admin/ads                     → 광고 관리
/admin/reports                 → 통계/리포트
```

---

## 5. 핵심 비즈니스 로직

### 5.1 딜 등록 플로우

```
매도자 딜 등록 시작
  → 카테고리 선택 (부동산 / M&A)
  → 기본 정보 입력 (제목, 설명, 금액, 위치/업종)
  → 상세 정보 입력 (카테고리별 폼)
  → 이미지/문서 업로드
  → 공개/비공개 선택
    → 비공개 시: 필요 인증 등급 설정
  → 초안 저장 (draft)
  → 제출 (pending_review)
  → 관리자 승인 → active
  → 매칭 엔진이 조건 맞는 사용자에게 알림 발송
```

### 5.2 딜 접근 & NDA 플로우

```
사용자가 비공개 딜 발견
  → 인증 등급 확인
    → 미달 시: 인증 업그레이드 안내
    → 충족 시: 딜 요약 정보 열람 가능
  → 상세 정보 접근 요청
    → NDA 동의 화면 표시
    → 전자 서명 (IP, 타임스탬프 기록)
    → 비공개 문서/상세 정보 열람 가능
```

### 5.3 협상→성사 풀 프로세스

```
매수자가 딜에 문의
  → deal_room 생성 (inquiry)
  → 메시징으로 초기 소통
  → 매수자가 LOI 제출
    → 매도자 검토: 수락/거절/역제안
    → 수락 시: status → negotiating → loi_exchanged
  → 실사(DD) 착수
    → due_diligence 레코드 생성
    → 체크리스트 자동 생성 (카테고리별)
    → 전문가 배정 (법무/회계/세무)
    → 전문가들이 체크리스트 항목 검토
    → DD 결과 보고서 작성
  → 계약 검토
    → 계약서 초안 공유 (메시징)
    → 법무 전문가 검토
    → 양측 합의
  → 에스크로
    → escrow_account 생성
    → 매수자 자금 입금 (funded)
    → 소유권 이전 확인
    → 자금 방출 (released) — 은행/법무법인 에스크로 통해 당사자 간 직접 수행
    → 플랫폼 이용료 정산
  → 딜 종료 (closed)
```

### 5.4 매칭 엔진 로직

```
새 딜 등록 or 매칭 조건 변경 시:
  1. match_preferences 테이블에서 활성 조건 조회
  2. 새 딜과 조건 매칭:
     - deal_category ∈ preferences.deal_categories
     - price BETWEEN min_price AND max_price
     - region ∈ preferences.regions (부동산)
     - industry ∈ preferences.industries (M&A)
     - keywords ∩ deal.tags ≠ ∅
  3. 비공개 딜: 사용자 verification_level ≥ deal.required_verification_level
  4. 매칭된 사용자에게 notification 생성 + 이메일/푸시 발송
```

### 5.5 인증 등급 체계

| 등급 | 요구 조건 | 접근 가능 범위 |
|------|----------|---------------|
| 0 (기본) | 이메일 가입 | 공개 딜 열람, 인사이트 열람 |
| 1 (인증) | 휴대폰 인증 (PASS) | 공개 딜 문의, 커뮤니티 참여 |
| 2 (사업자) | 사업자등록증 / 법인등기부등본 | 비공개 딜 열람 (등급 2 이하) |
| 3 (검증) | 자산 증빙 + 신용 등급 제출 | 비공개 딜 열람 (등급 3 이하), 대형 딜 참여 |
| 4 (프리미엄) | 외부 기관 검증 레터 | 모든 딜 접근, 우선 매칭 |

**공급자(매도자)**: 등급 1이면 딜 등록 가능. 비공개 딜 등록은 등급 2 이상 권장.
**수요자(매수자)**: 딜의 required_verification_level에 따라 접근 제한.

---

## 6. Row Level Security (RLS) 정책

> **접근제어 전략 (2계층):**
> - **RLS (DB 레벨)**: 비공개 딜 목록 노출 자체를 인증 등급으로 제어
> - **앱 레이어**: document_urls 등 민감 상세 정보는 NDA 서명 여부를 앱에서 체크 후 반환
>
> **삭제 전략**: 모든 민감 테이블은 소프트 삭제(status 기반) 또는 삭제 불가. 하드 삭제 정책 없음.
>
> **금액 컨벤션**: 모든 BIGINT 금액 필드는 해당 통화의 최소 단위 (KRW=원, USD=센트).

모든 테이블에 RLS 활성화. 주요 정책은 구현 계획(migration)에 포함.

- **profiles**: 모든 사용자 열람 가능, 수정은 본인만
- **deals**: 공개 딜은 누구나, 비공개 딜은 verification_level 충족자 + 소유자 + 관리자
- **deals INSERT**: 인증 등급 1 이상만 등록 가능
- **deal_rooms, messages, loi_documents**: 해당 룸 참가자(buyer/seller)만
- **verification_records**: 본인 + 관리자만
- **escrow_accounts, transactions**: 해당 거래 참가자 + 관리자만
- **nda_agreements**: 서명자 본인 + 딜 소유자만
- **due_diligence, dd_checklist_items**: 해당 룸 참가자 + 배정된 전문가만
- **notifications, match_preferences**: 본인만
- **articles**: 게시된 것은 모두, 초안은 저자만
- **posts, comments**: 모두 열람, 수정은 저자만
- **admin_logs**: 관리자만
- **관리자 식별**: `profiles.is_admin = true`

---

## 7. API 엔드포인트 (Edge Functions)

| 엔드포인트 | 메서드 | 설명 |
|-----------|--------|------|
| `/api/deals/match` | POST | 새 딜 등록 시 매칭 실행 + 알림 발송 |
| `/api/deals/[id]/nda` | POST | NDA 전자 서명 처리 |
| `/api/rooms/[id]/loi` | POST | LOI 제출/응답 |
| `/api/dd/[id]/assign-expert` | POST | 실사에 전문가 배정 |
| `/api/escrow/create` | POST | 에스크로 계좌 생성 |
| `/api/escrow/[id]/fund` | POST | Toss Payments 결제 → 에스크로 입금 |
| `/api/escrow/[id]/release` | POST | 에스크로 자금 방출 |
| `/api/escrow/[id]/dispute` | POST | 에스크로 분쟁 제기 |
| `/api/payments/webhook` | POST | Toss Payments 웹훅 수신 |
| `/api/notifications/send` | POST | 알림 발송 (이메일/푸시) |
| `/api/admin/approve-deal` | POST | 관리자 딜 승인 |
| `/api/admin/verify-user` | POST | 관리자 사용자 인증 승인 |
| `/api/market-data/sync` | CRON | 시장 데이터 정기 수집 |

> **결제 참고**: Toss Payments는 멤버십/수수료/전문가 비용 결제에 사용. 대형 부동산/M&A 거래의 에스크로는 향후 신탁회사/은행 에스크로 연동으로 확장 예정.

---

## 8. 구현 단계 (Phase)

### Phase 1: 기반 (Week 1-2)
- Next.js 프로젝트 셋업 (App Router, TypeScript, Tailwind, shadcn/ui)
- Supabase 프로젝트 연동
- DB 스키마 전체 마이그레이션
- RLS 정책 적용
- Auth 시스템 (로그인/회원가입/프로필)
- 다크 테마 디자인 시스템 (V1 클린 미니멀)

### Phase 2: 딜 마켓플레이스 (Week 3-4)
- 딜 등록 (부동산/M&A 폼)
- 딜 목록 (필터/검색/정렬)
- 딜 상세 페이지
- 공개/비공개 접근제어
- NDA 플로우
- 관리자 딜 승인

### Phase 3: 인증 & 멤버십 (Week 5)
- 인증 등급 시스템 (0-4)
- 인증 서류 업로드/관리자 검토
- 멤버십 결제 (Toss Payments)
- 등급별 접근제어

### Phase 4: 협상 & 메시징 (Week 6-7)
- Deal Room 생성/관리
- 실시간 메시징 (Supabase Realtime)
- LOI 교환 시스템
- 파일 공유

### Phase 5: 실사 & 전문가 (Week 8-9)
- Due Diligence 워크플로우
- 체크리스트 시스템
- 전문가 디렉토리
- 전문가 배정/리뷰

### Phase 6: 멤버십 결제 & 전문가 연결 (Week 10)
- 멤버십 구독 결제 (Toss Payments 정기결제)
- 전문가 연결 수수료 정산
- 프리미엄 딜 리스팅 결제
- 에스크로 파트너(법무법인/은행) 연결 안내 시스템

### Phase 7: 콘텐츠 & 커뮤니티 (Week 11-12)
- 인사이트 아티클 (작성/열람)
- 시장 데이터 대시보드
- 커뮤니티 게시판
- 댓글/좋아요

### Phase 8: 매칭 & 알림 (Week 13)
- 매칭 조건 설정
- 매칭 엔진 (Edge Function)
- 알림 시스템 (인앱/이메일/푸시)

### Phase 9: 관리자 패널 (Week 14)
- 관리자 대시보드
- 딜/사용자/콘텐츠/전문가/광고 관리
- 통계/리포트

### Phase 10: 광고 & 최적화 (Week 15-16)
- 광고 시스템
- SEO 최적화
- 성능 최적화
- 보안 감사
- 런칭 준비

---

## 9. 보안 고려사항

- **RLS**: 모든 테이블에 Row Level Security 적용
- **NDA**: 전자서명 시 IP, 타임스탬프, 브라우저 정보 기록
- **파일 접근**: Supabase Storage 정책으로 NDA 서명자만 접근
- **결제**: Toss Payments PCI DSS 준수, 서버 사이드 결제 처리
- **에스크로**: 자금 이동은 관리자 승인 + 양측 확인 후에만
- **개인정보**: 사업자등록번호, 신용정보 등 암호화 저장
- **CSRF/XSS**: Next.js 기본 보호 + CSP 헤더
- **Rate Limiting**: Edge Function 레벨 rate limit

---

## 10. 글로벌 확장 설계

- **i18n**: next-intl 기반 다국어 (ko → en → ja → zh)
- **다통화**: price_currency 필드 + 환율 API 연동
- **법적 요구사항**: 국가별 NDA 템플릿, 에스크로 규정 대응
- **인프라**: Vercel Edge + Supabase 리전 선택
