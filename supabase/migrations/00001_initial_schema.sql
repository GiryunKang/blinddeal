-- ============================================================================
-- BlindDeal Platform — Initial Database Schema
-- Complete migration: 23 tables, indexes, RLS policies, triggers, functions
-- ============================================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================================
-- Helper Functions & Triggers
-- ============================================================================

-- Function to auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to create a profile on user signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name, email)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'display_name', NEW.email),
    NEW.email
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to increment deal view count
CREATE OR REPLACE FUNCTION increment_deal_view_count(deal_uuid UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE deals SET view_count = view_count + 1 WHERE id = deal_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to increment article view count
CREATE OR REPLACE FUNCTION increment_article_view_count(article_uuid UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE articles SET view_count = view_count + 1 WHERE id = article_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to increment post view count
CREATE OR REPLACE FUNCTION increment_post_view_count(post_uuid UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE posts SET view_count = view_count + 1 WHERE id = post_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to update deal interest_count
CREATE OR REPLACE FUNCTION update_deal_interest_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE deals SET interest_count = interest_count + 1 WHERE id = NEW.deal_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE deals SET interest_count = interest_count - 1 WHERE id = OLD.deal_id;
    RETURN OLD;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to update post comment_count
CREATE OR REPLACE FUNCTION update_post_comment_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE posts SET comment_count = comment_count + 1 WHERE id = NEW.post_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE posts SET comment_count = comment_count - 1 WHERE id = OLD.post_id;
    RETURN OLD;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to generate slug from title
CREATE OR REPLACE FUNCTION generate_unique_slug(title_text TEXT, table_name TEXT)
RETURNS TEXT AS $$
DECLARE
  base_slug TEXT;
  new_slug TEXT;
  counter INT := 0;
  slug_exists BOOLEAN;
BEGIN
  -- Transliterate and slugify
  base_slug := lower(regexp_replace(title_text, '[^a-zA-Z0-9가-힣\s-]', '', 'g'));
  base_slug := regexp_replace(base_slug, '\s+', '-', 'g');
  base_slug := regexp_replace(base_slug, '-+', '-', 'g');
  base_slug := trim(both '-' from base_slug);

  -- Append random suffix for uniqueness
  new_slug := base_slug || '-' || substr(gen_random_uuid()::text, 1, 8);

  RETURN new_slug;
END;
$$ LANGUAGE plpgsql;


-- ============================================================================
-- 3.1 사용자 & 인증 (Users & Verification)
-- ============================================================================

-- 사용자 프로필 (Supabase Auth 확장)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  avatar_url TEXT,
  user_type TEXT NOT NULL DEFAULT 'individual' CHECK (user_type IN ('individual', 'corporation')),
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


-- ============================================================================
-- 3.5 전문가 네트워크 (Experts) — created before deals/DD for FK dependencies
-- ============================================================================

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


-- ============================================================================
-- 3.2 딜 (Deals — 부동산 + M&A)
-- ============================================================================

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
  -- 금액
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


-- ============================================================================
-- 3.3 협상 & 메시징 (Negotiation & Messaging)
-- ============================================================================

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


-- ============================================================================
-- 3.4 실사 (Due Diligence)
-- ============================================================================

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


-- ============================================================================
-- 3.5 전문가 배정 (Expert Assignments)
-- ============================================================================

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


-- ============================================================================
-- 3.6 에스크로 & 결제 (Escrow & Payments)
-- ============================================================================

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


-- ============================================================================
-- 3.7 콘텐츠 & 인사이트 (Content & Insights)
-- ============================================================================

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


-- ============================================================================
-- 3.8 커뮤니티 (Community)
-- ============================================================================

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


-- ============================================================================
-- 3.9 매칭 & 알림 (Matching & Notifications)
-- ============================================================================

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


-- ============================================================================
-- 3.10 광고 (Advertisements)
-- ============================================================================

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


-- ============================================================================
-- 3.11 관리자 (Admin)
-- ============================================================================

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


-- ============================================================================
-- Indexes
-- ============================================================================

-- profiles
CREATE INDEX idx_profiles_user_type ON profiles(user_type);
CREATE INDEX idx_profiles_verification_level ON profiles(verification_level);
CREATE INDEX idx_profiles_membership_tier ON profiles(membership_tier);
CREATE INDEX idx_profiles_email ON profiles(email);

-- verification_records
CREATE INDEX idx_verification_records_user_id ON verification_records(user_id);
CREATE INDEX idx_verification_records_status ON verification_records(status);

-- deals
CREATE INDEX idx_deals_owner_id ON deals(owner_id);
CREATE INDEX idx_deals_deal_category ON deals(deal_category);
CREATE INDEX idx_deals_deal_type ON deals(deal_type);
CREATE INDEX idx_deals_visibility ON deals(visibility);
CREATE INDEX idx_deals_status ON deals(status);
CREATE INDEX idx_deals_city ON deals(city);
CREATE INDEX idx_deals_district ON deals(district);
CREATE INDEX idx_deals_industry ON deals(industry);
CREATE INDEX idx_deals_asking_price ON deals(asking_price);
CREATE INDEX idx_deals_featured ON deals(featured) WHERE featured = true;
CREATE INDEX idx_deals_admin_approved ON deals(admin_approved);
CREATE INDEX idx_deals_created_at ON deals(created_at DESC);
CREATE INDEX idx_deals_published_at ON deals(published_at DESC);
CREATE INDEX idx_deals_slug ON deals(slug);
CREATE INDEX idx_deals_tags ON deals USING GIN(tags);

-- deal_interests
CREATE INDEX idx_deal_interests_deal_id ON deal_interests(deal_id);
CREATE INDEX idx_deal_interests_user_id ON deal_interests(user_id);

-- nda_agreements
CREATE INDEX idx_nda_agreements_deal_id ON nda_agreements(deal_id);
CREATE INDEX idx_nda_agreements_user_id ON nda_agreements(user_id);

-- deal_rooms
CREATE INDEX idx_deal_rooms_deal_id ON deal_rooms(deal_id);
CREATE INDEX idx_deal_rooms_buyer_id ON deal_rooms(buyer_id);
CREATE INDEX idx_deal_rooms_seller_id ON deal_rooms(seller_id);
CREATE INDEX idx_deal_rooms_status ON deal_rooms(status);

-- messages
CREATE INDEX idx_messages_room_id ON messages(room_id);
CREATE INDEX idx_messages_sender_id ON messages(sender_id);
CREATE INDEX idx_messages_created_at ON messages(created_at DESC);

-- loi_documents
CREATE INDEX idx_loi_documents_room_id ON loi_documents(room_id);
CREATE INDEX idx_loi_documents_status ON loi_documents(status);

-- due_diligence
CREATE INDEX idx_due_diligence_room_id ON due_diligence(room_id);
CREATE INDEX idx_due_diligence_deal_id ON due_diligence(deal_id);
CREATE INDEX idx_due_diligence_status ON due_diligence(status);

-- dd_checklist_items
CREATE INDEX idx_dd_checklist_items_dd_id ON dd_checklist_items(dd_id);
CREATE INDEX idx_dd_checklist_items_status ON dd_checklist_items(status);
CREATE INDEX idx_dd_checklist_items_assigned_expert ON dd_checklist_items(assigned_expert_id);

-- experts
CREATE INDEX idx_experts_user_id ON experts(user_id);
CREATE INDEX idx_experts_expert_type ON experts(expert_type);
CREATE INDEX idx_experts_verified ON experts(verified) WHERE verified = true;
CREATE INDEX idx_experts_rating ON experts(rating DESC);
CREATE INDEX idx_experts_specializations ON experts USING GIN(specializations);

-- expert_assignments
CREATE INDEX idx_expert_assignments_dd_id ON expert_assignments(dd_id);
CREATE INDEX idx_expert_assignments_deal_id ON expert_assignments(deal_id);
CREATE INDEX idx_expert_assignments_expert_id ON expert_assignments(expert_id);
CREATE INDEX idx_expert_assignments_status ON expert_assignments(status);

-- escrow_accounts
CREATE INDEX idx_escrow_accounts_room_id ON escrow_accounts(room_id);
CREATE INDEX idx_escrow_accounts_deal_id ON escrow_accounts(deal_id);
CREATE INDEX idx_escrow_accounts_buyer_id ON escrow_accounts(buyer_id);
CREATE INDEX idx_escrow_accounts_seller_id ON escrow_accounts(seller_id);
CREATE INDEX idx_escrow_accounts_status ON escrow_accounts(status);

-- transactions
CREATE INDEX idx_transactions_escrow_id ON transactions(escrow_id);
CREATE INDEX idx_transactions_user_id ON transactions(user_id);
CREATE INDEX idx_transactions_transaction_type ON transactions(transaction_type);
CREATE INDEX idx_transactions_status ON transactions(status);
CREATE INDEX idx_transactions_created_at ON transactions(created_at DESC);

-- subscriptions
CREATE INDEX idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX idx_subscriptions_status ON subscriptions(status);
CREATE INDEX idx_subscriptions_tier ON subscriptions(tier);

-- articles
CREATE INDEX idx_articles_author_id ON articles(author_id);
CREATE INDEX idx_articles_category ON articles(category);
CREATE INDEX idx_articles_status ON articles(status);
CREATE INDEX idx_articles_is_premium ON articles(is_premium);
CREATE INDEX idx_articles_published_at ON articles(published_at DESC);
CREATE INDEX idx_articles_slug ON articles(slug);
CREATE INDEX idx_articles_tags ON articles USING GIN(tags);

-- market_data
CREATE INDEX idx_market_data_data_type ON market_data(data_type);
CREATE INDEX idx_market_data_region ON market_data(region);
CREATE INDEX idx_market_data_industry ON market_data(industry);
CREATE INDEX idx_market_data_period ON market_data(period);

-- posts
CREATE INDEX idx_posts_author_id ON posts(author_id);
CREATE INDEX idx_posts_board ON posts(board);
CREATE INDEX idx_posts_is_pinned ON posts(is_pinned) WHERE is_pinned = true;
CREATE INDEX idx_posts_created_at ON posts(created_at DESC);
CREATE INDEX idx_posts_tags ON posts USING GIN(tags);

-- comments
CREATE INDEX idx_comments_post_id ON comments(post_id);
CREATE INDEX idx_comments_author_id ON comments(author_id);
CREATE INDEX idx_comments_parent_id ON comments(parent_id);
CREATE INDEX idx_comments_created_at ON comments(created_at DESC);

-- match_preferences
CREATE INDEX idx_match_preferences_user_id ON match_preferences(user_id);
CREATE INDEX idx_match_preferences_is_active ON match_preferences(is_active) WHERE is_active = true;
CREATE INDEX idx_match_preferences_deal_categories ON match_preferences USING GIN(deal_categories);

-- notifications
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_type ON notifications(type);
CREATE INDEX idx_notifications_read ON notifications(read);
CREATE INDEX idx_notifications_created_at ON notifications(created_at DESC);
CREATE INDEX idx_notifications_user_unread ON notifications(user_id, created_at DESC) WHERE read = false;

-- ad_placements
CREATE INDEX idx_ad_placements_advertiser_id ON ad_placements(advertiser_id);
CREATE INDEX idx_ad_placements_slot ON ad_placements(slot);
CREATE INDEX idx_ad_placements_status ON ad_placements(status);
CREATE INDEX idx_ad_placements_active_dates ON ad_placements(starts_at, ends_at) WHERE status = 'active';

-- admin_logs
CREATE INDEX idx_admin_logs_admin_id ON admin_logs(admin_id);
CREATE INDEX idx_admin_logs_action ON admin_logs(action);
CREATE INDEX idx_admin_logs_target ON admin_logs(target_type, target_id);
CREATE INDEX idx_admin_logs_created_at ON admin_logs(created_at DESC);


-- ============================================================================
-- Triggers
-- ============================================================================

-- Auto-update updated_at triggers
CREATE TRIGGER set_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER set_deals_updated_at
  BEFORE UPDATE ON deals
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER set_deal_rooms_updated_at
  BEFORE UPDATE ON deal_rooms
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER set_articles_updated_at
  BEFORE UPDATE ON articles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER set_posts_updated_at
  BEFORE UPDATE ON posts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER set_comments_updated_at
  BEFORE UPDATE ON comments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER set_match_preferences_updated_at
  BEFORE UPDATE ON match_preferences
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Deal interest count trigger
CREATE TRIGGER update_deal_interest_count_trigger
  AFTER INSERT OR DELETE ON deal_interests
  FOR EACH ROW EXECUTE FUNCTION update_deal_interest_count();

-- Post comment count trigger
CREATE TRIGGER update_post_comment_count_trigger
  AFTER INSERT OR DELETE ON comments
  FOR EACH ROW EXECUTE FUNCTION update_post_comment_count();

-- Auto-create profile on auth.users insert
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();


-- ============================================================================
-- Row Level Security (RLS)
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE verification_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE experts ENABLE ROW LEVEL SECURITY;
ALTER TABLE deals ENABLE ROW LEVEL SECURITY;
ALTER TABLE deal_interests ENABLE ROW LEVEL SECURITY;
ALTER TABLE nda_agreements ENABLE ROW LEVEL SECURITY;
ALTER TABLE deal_rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE loi_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE due_diligence ENABLE ROW LEVEL SECURITY;
ALTER TABLE dd_checklist_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE expert_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE escrow_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE market_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE match_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE ad_placements ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_logs ENABLE ROW LEVEL SECURITY;


-- ============================================================================
-- RLS Policies: profiles
-- ============================================================================

-- Anyone can view profiles (public directory)
CREATE POLICY "profiles_select_public" ON profiles
  FOR SELECT USING (true);

-- Users can update their own profile
CREATE POLICY "profiles_update_own" ON profiles
  FOR UPDATE USING (id = auth.uid());

-- Users can insert their own profile (handled by trigger, but allow manual)
CREATE POLICY "profiles_insert_own" ON profiles
  FOR INSERT WITH CHECK (id = auth.uid());


-- ============================================================================
-- RLS Policies: verification_records
-- ============================================================================

-- Users can view their own verification records
CREATE POLICY "verification_records_select_own" ON verification_records
  FOR SELECT USING (user_id = auth.uid());

-- Users can insert their own verification requests
CREATE POLICY "verification_records_insert_own" ON verification_records
  FOR INSERT WITH CHECK (user_id = auth.uid());


-- ============================================================================
-- RLS Policies: experts
-- ============================================================================

-- Anyone can view verified experts
CREATE POLICY "experts_select_public" ON experts
  FOR SELECT USING (true);

-- Expert can update their own record
CREATE POLICY "experts_update_own" ON experts
  FOR UPDATE USING (user_id = auth.uid());

-- Authenticated users can register as expert
CREATE POLICY "experts_insert_own" ON experts
  FOR INSERT WITH CHECK (user_id = auth.uid());


-- ============================================================================
-- RLS Policies: deals
-- ============================================================================

-- 공개 딜: 누구나 열람 / 비공개 딜: verification_level 충족 또는 딜 소유자
CREATE POLICY "deals_select" ON deals
  FOR SELECT USING (
    visibility = 'public'
    OR owner_id = auth.uid()
    OR (
      visibility = 'private'
      AND EXISTS (
        SELECT 1 FROM profiles
        WHERE id = auth.uid()
        AND verification_level >= deals.required_verification_level
      )
    )
  );

-- 딜 등록: 인증된 사용자
CREATE POLICY "deals_insert_authenticated" ON deals
  FOR INSERT WITH CHECK (owner_id = auth.uid());

-- 딜 수정: 소유자만
CREATE POLICY "deals_update_owner" ON deals
  FOR UPDATE USING (owner_id = auth.uid());

-- 딜 삭제: 소유자만 (draft 상태)
CREATE POLICY "deals_delete_owner" ON deals
  FOR DELETE USING (owner_id = auth.uid() AND status = 'draft');


-- ============================================================================
-- RLS Policies: deal_interests
-- ============================================================================

-- Users can view their own interests and deal owners can see who is interested
CREATE POLICY "deal_interests_select" ON deal_interests
  FOR SELECT USING (
    user_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM deals WHERE deals.id = deal_interests.deal_id AND deals.owner_id = auth.uid()
    )
  );

-- Authenticated users can express interest
CREATE POLICY "deal_interests_insert" ON deal_interests
  FOR INSERT WITH CHECK (user_id = auth.uid());

-- Users can remove their own interest
CREATE POLICY "deal_interests_delete" ON deal_interests
  FOR DELETE USING (user_id = auth.uid());


-- ============================================================================
-- RLS Policies: nda_agreements
-- ============================================================================

-- Users can view their own NDA agreements; deal owners can see who signed
CREATE POLICY "nda_agreements_select" ON nda_agreements
  FOR SELECT USING (
    user_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM deals WHERE deals.id = nda_agreements.deal_id AND deals.owner_id = auth.uid()
    )
  );

-- Authenticated users can sign NDA
CREATE POLICY "nda_agreements_insert" ON nda_agreements
  FOR INSERT WITH CHECK (user_id = auth.uid());


-- ============================================================================
-- RLS Policies: deal_rooms
-- ============================================================================

-- Room participants can view
CREATE POLICY "deal_rooms_select" ON deal_rooms
  FOR SELECT USING (buyer_id = auth.uid() OR seller_id = auth.uid());

-- Buyer can create room
CREATE POLICY "deal_rooms_insert" ON deal_rooms
  FOR INSERT WITH CHECK (buyer_id = auth.uid());

-- Participants can update room status
CREATE POLICY "deal_rooms_update" ON deal_rooms
  FOR UPDATE USING (buyer_id = auth.uid() OR seller_id = auth.uid());


-- ============================================================================
-- RLS Policies: messages
-- ============================================================================

-- 해당 룸 참가자만 메시지 열람
CREATE POLICY "messages_select" ON messages
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM deal_rooms
      WHERE deal_rooms.id = messages.room_id
      AND (deal_rooms.buyer_id = auth.uid() OR deal_rooms.seller_id = auth.uid())
    )
  );

-- 해당 룸 참가자만 메시지 전송
CREATE POLICY "messages_insert" ON messages
  FOR INSERT WITH CHECK (
    sender_id = auth.uid()
    AND EXISTS (
      SELECT 1 FROM deal_rooms
      WHERE deal_rooms.id = messages.room_id
      AND (deal_rooms.buyer_id = auth.uid() OR deal_rooms.seller_id = auth.uid())
    )
  );

-- Sender can update (for read receipts etc.)
CREATE POLICY "messages_update" ON messages
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM deal_rooms
      WHERE deal_rooms.id = messages.room_id
      AND (deal_rooms.buyer_id = auth.uid() OR deal_rooms.seller_id = auth.uid())
    )
  );


-- ============================================================================
-- RLS Policies: loi_documents
-- ============================================================================

-- Room participants can view LOI
CREATE POLICY "loi_documents_select" ON loi_documents
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM deal_rooms
      WHERE deal_rooms.id = loi_documents.room_id
      AND (deal_rooms.buyer_id = auth.uid() OR deal_rooms.seller_id = auth.uid())
    )
  );

-- Room participants can create LOI
CREATE POLICY "loi_documents_insert" ON loi_documents
  FOR INSERT WITH CHECK (
    sender_id = auth.uid()
    AND EXISTS (
      SELECT 1 FROM deal_rooms
      WHERE deal_rooms.id = loi_documents.room_id
      AND (deal_rooms.buyer_id = auth.uid() OR deal_rooms.seller_id = auth.uid())
    )
  );

-- Room participants can update LOI (accept/reject)
CREATE POLICY "loi_documents_update" ON loi_documents
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM deal_rooms
      WHERE deal_rooms.id = loi_documents.room_id
      AND (deal_rooms.buyer_id = auth.uid() OR deal_rooms.seller_id = auth.uid())
    )
  );


-- ============================================================================
-- RLS Policies: due_diligence
-- ============================================================================

-- Room participants can view DD
CREATE POLICY "due_diligence_select" ON due_diligence
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM deal_rooms
      WHERE deal_rooms.id = due_diligence.room_id
      AND (deal_rooms.buyer_id = auth.uid() OR deal_rooms.seller_id = auth.uid())
    )
  );

-- Room participants can create DD
CREATE POLICY "due_diligence_insert" ON due_diligence
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM deal_rooms
      WHERE deal_rooms.id = due_diligence.room_id
      AND (deal_rooms.buyer_id = auth.uid() OR deal_rooms.seller_id = auth.uid())
    )
  );

-- Room participants can update DD
CREATE POLICY "due_diligence_update" ON due_diligence
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM deal_rooms
      WHERE deal_rooms.id = due_diligence.room_id
      AND (deal_rooms.buyer_id = auth.uid() OR deal_rooms.seller_id = auth.uid())
    )
  );


-- ============================================================================
-- RLS Policies: dd_checklist_items
-- ============================================================================

-- Room participants and assigned experts can view checklist items
CREATE POLICY "dd_checklist_items_select" ON dd_checklist_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM due_diligence dd
      JOIN deal_rooms dr ON dr.id = dd.room_id
      WHERE dd.id = dd_checklist_items.dd_id
      AND (dr.buyer_id = auth.uid() OR dr.seller_id = auth.uid())
    )
    OR EXISTS (
      SELECT 1 FROM experts
      WHERE experts.id = dd_checklist_items.assigned_expert_id
      AND experts.user_id = auth.uid()
    )
  );

-- Room participants can insert checklist items
CREATE POLICY "dd_checklist_items_insert" ON dd_checklist_items
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM due_diligence dd
      JOIN deal_rooms dr ON dr.id = dd.room_id
      WHERE dd.id = dd_checklist_items.dd_id
      AND (dr.buyer_id = auth.uid() OR dr.seller_id = auth.uid())
    )
  );

-- Room participants and assigned experts can update
CREATE POLICY "dd_checklist_items_update" ON dd_checklist_items
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM due_diligence dd
      JOIN deal_rooms dr ON dr.id = dd.room_id
      WHERE dd.id = dd_checklist_items.dd_id
      AND (dr.buyer_id = auth.uid() OR dr.seller_id = auth.uid())
    )
    OR EXISTS (
      SELECT 1 FROM experts
      WHERE experts.id = dd_checklist_items.assigned_expert_id
      AND experts.user_id = auth.uid()
    )
  );


-- ============================================================================
-- RLS Policies: expert_assignments
-- ============================================================================

-- Deal participants and assigned expert can view
CREATE POLICY "expert_assignments_select" ON expert_assignments
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM deals WHERE deals.id = expert_assignments.deal_id AND deals.owner_id = auth.uid()
    )
    OR EXISTS (
      SELECT 1 FROM experts WHERE experts.id = expert_assignments.expert_id AND experts.user_id = auth.uid()
    )
    OR EXISTS (
      SELECT 1 FROM due_diligence dd
      JOIN deal_rooms dr ON dr.id = dd.room_id
      WHERE dd.id = expert_assignments.dd_id
      AND (dr.buyer_id = auth.uid() OR dr.seller_id = auth.uid())
    )
  );

-- Deal owner can create assignment
CREATE POLICY "expert_assignments_insert" ON expert_assignments
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM deals WHERE deals.id = expert_assignments.deal_id AND deals.owner_id = auth.uid()
    )
  );

-- Deal owner and assigned expert can update
CREATE POLICY "expert_assignments_update" ON expert_assignments
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM deals WHERE deals.id = expert_assignments.deal_id AND deals.owner_id = auth.uid()
    )
    OR EXISTS (
      SELECT 1 FROM experts WHERE experts.id = expert_assignments.expert_id AND experts.user_id = auth.uid()
    )
  );


-- ============================================================================
-- RLS Policies: escrow_accounts
-- ============================================================================

-- Buyer and seller can view their escrow accounts
CREATE POLICY "escrow_accounts_select" ON escrow_accounts
  FOR SELECT USING (buyer_id = auth.uid() OR seller_id = auth.uid());

-- Buyer can create escrow
CREATE POLICY "escrow_accounts_insert" ON escrow_accounts
  FOR INSERT WITH CHECK (buyer_id = auth.uid());


-- ============================================================================
-- RLS Policies: transactions
-- ============================================================================

-- User can view their own transactions
CREATE POLICY "transactions_select_own" ON transactions
  FOR SELECT USING (user_id = auth.uid());

-- User can create their own transactions
CREATE POLICY "transactions_insert_own" ON transactions
  FOR INSERT WITH CHECK (user_id = auth.uid());


-- ============================================================================
-- RLS Policies: subscriptions
-- ============================================================================

-- User can view their own subscriptions
CREATE POLICY "subscriptions_select_own" ON subscriptions
  FOR SELECT USING (user_id = auth.uid());

-- User can create their own subscriptions
CREATE POLICY "subscriptions_insert_own" ON subscriptions
  FOR INSERT WITH CHECK (user_id = auth.uid());

-- User can update their own subscriptions
CREATE POLICY "subscriptions_update_own" ON subscriptions
  FOR UPDATE USING (user_id = auth.uid());


-- ============================================================================
-- RLS Policies: articles
-- ============================================================================

-- Published articles are public; drafts visible to author only
CREATE POLICY "articles_select" ON articles
  FOR SELECT USING (
    status = 'published'
    OR author_id = auth.uid()
  );

-- Authors can insert articles
CREATE POLICY "articles_insert" ON articles
  FOR INSERT WITH CHECK (author_id = auth.uid());

-- Authors can update their own articles
CREATE POLICY "articles_update" ON articles
  FOR UPDATE USING (author_id = auth.uid());

-- Authors can delete their own draft articles
CREATE POLICY "articles_delete" ON articles
  FOR DELETE USING (author_id = auth.uid() AND status = 'draft');


-- ============================================================================
-- RLS Policies: market_data
-- ============================================================================

-- Market data is publicly readable
CREATE POLICY "market_data_select_public" ON market_data
  FOR SELECT USING (true);


-- ============================================================================
-- RLS Policies: posts
-- ============================================================================

-- All posts are publicly readable
CREATE POLICY "posts_select_public" ON posts
  FOR SELECT USING (true);

-- Authenticated users can create posts
CREATE POLICY "posts_insert_authenticated" ON posts
  FOR INSERT WITH CHECK (author_id = auth.uid());

-- Authors can update their own posts
CREATE POLICY "posts_update_own" ON posts
  FOR UPDATE USING (author_id = auth.uid());

-- Authors can delete their own posts
CREATE POLICY "posts_delete_own" ON posts
  FOR DELETE USING (author_id = auth.uid());


-- ============================================================================
-- RLS Policies: comments
-- ============================================================================

-- All comments are publicly readable
CREATE POLICY "comments_select_public" ON comments
  FOR SELECT USING (true);

-- Authenticated users can create comments
CREATE POLICY "comments_insert_authenticated" ON comments
  FOR INSERT WITH CHECK (author_id = auth.uid());

-- Authors can update their own comments
CREATE POLICY "comments_update_own" ON comments
  FOR UPDATE USING (author_id = auth.uid());

-- Authors can delete their own comments
CREATE POLICY "comments_delete_own" ON comments
  FOR DELETE USING (author_id = auth.uid());


-- ============================================================================
-- RLS Policies: match_preferences
-- ============================================================================

-- Users can view their own match preferences
CREATE POLICY "match_preferences_select_own" ON match_preferences
  FOR SELECT USING (user_id = auth.uid());

-- Users can create their own match preferences
CREATE POLICY "match_preferences_insert_own" ON match_preferences
  FOR INSERT WITH CHECK (user_id = auth.uid());

-- Users can update their own match preferences
CREATE POLICY "match_preferences_update_own" ON match_preferences
  FOR UPDATE USING (user_id = auth.uid());

-- Users can delete their own match preferences
CREATE POLICY "match_preferences_delete_own" ON match_preferences
  FOR DELETE USING (user_id = auth.uid());


-- ============================================================================
-- RLS Policies: notifications
-- ============================================================================

-- 본인 알림만 열람
CREATE POLICY "notifications_select_own" ON notifications
  FOR SELECT USING (user_id = auth.uid());

-- 본인 알림만 수정 (읽음 처리)
CREATE POLICY "notifications_update_own" ON notifications
  FOR UPDATE USING (user_id = auth.uid());

-- 본인 알림만 삭제
CREATE POLICY "notifications_delete_own" ON notifications
  FOR DELETE USING (user_id = auth.uid());


-- ============================================================================
-- RLS Policies: ad_placements
-- ============================================================================

-- Active ads are publicly visible
CREATE POLICY "ad_placements_select_public" ON ad_placements
  FOR SELECT USING (status = 'active' OR advertiser_id = auth.uid());

-- Advertiser can create ads
CREATE POLICY "ad_placements_insert_own" ON ad_placements
  FOR INSERT WITH CHECK (advertiser_id = auth.uid());

-- Advertiser can update their own ads
CREATE POLICY "ad_placements_update_own" ON ad_placements
  FOR UPDATE USING (advertiser_id = auth.uid());


-- ============================================================================
-- RLS Policies: admin_logs
-- ============================================================================

-- Admin logs: only the admin who created the log can view (admin role check via app layer)
CREATE POLICY "admin_logs_select_own" ON admin_logs
  FOR SELECT USING (admin_id = auth.uid());

-- Admins can insert logs
CREATE POLICY "admin_logs_insert" ON admin_logs
  FOR INSERT WITH CHECK (admin_id = auth.uid());


-- ============================================================================
-- Realtime subscriptions (enable for messaging-related tables)
-- ============================================================================

ALTER PUBLICATION supabase_realtime ADD TABLE messages;
ALTER PUBLICATION supabase_realtime ADD TABLE notifications;
ALTER PUBLICATION supabase_realtime ADD TABLE deal_rooms;
