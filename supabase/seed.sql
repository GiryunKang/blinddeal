-- ============================================================================
-- BlindDeal Seed Data
-- 테스트용 샘플 데이터
-- 실행 전 Supabase Auth로 사용자 2명을 먼저 생성해야 합니다
-- ============================================================================

-- 참고: profiles는 Auth trigger로 자동 생성됨
-- 아래는 Auth 사용자 생성 후 profiles 업데이트 + 딜/아티클/게시글 시드

-- ============================================================================
-- 1. 샘플 딜 (owner_id는 실제 사용자 ID로 교체 필요)
-- 아래 SQL은 execute_sql로 직접 실행할 수 있도록 준비됨
-- ============================================================================

-- 이 시드는 Supabase Dashboard에서 SQL Editor로 실행하거나,
-- 아래의 Edge Function 기반 시드 스크립트를 사용하세요.

-- 부동산 딜 샘플
-- INSERT INTO deals (owner_id, title, slug, description, deal_category, deal_type, visibility, asking_price, status, address, city, property_area_sqm, building_area_sqm, floor_count, built_year, highlight_points, tags, admin_approved, published_at)
-- VALUES (
--   '사용자_UUID', '판교 프라임 물류센터', 'pangyo-prime-logistics-center',
--   '판교테크노밸리 인근 프라임급 물류센터. 연면적 39,670㎡, 지상 5층 규모. 주요 IT기업 물류 허브로 활용 중이며, 안정적인 임대 수익 확보. 수도권 남부 핵심 물류 거점.',
--   'real_estate', 'logistics', 'public', 45000000000, 'active',
--   '경기도 성남시 분당구 판교로 123', '성남', 15000, 39670, 5, 2019,
--   ARRAY['수도권 남부 핵심 물류 거점', '연 임대수익률 5.8%', '주요 IT기업 장기 임차'],
--   ARRAY['물류', '판교', '수도권'], true, now()
-- );

-- 위의 INSERT는 사용자 생성 후 owner_id를 교체하여 실행합니다.
