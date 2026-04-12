-- Migration 00006: profiles column-level protection + transactions insert restriction
--
-- Fix 1: profiles SELECT column-level protection
-- PostgreSQL RLS operates at ROW level, not COLUMN level.
-- The existing "profiles_select_public" policy (SELECT for all roles) stays.
-- Sensitive column protection is enforced at the application layer:
-- Server actions MUST use explicit .select("id, display_name, avatar_url, ...")
-- instead of .select("*") when querying profiles for public display.
-- Verified: deals.ts, rooms.ts, community.ts, experts.ts, matching-engine.ts
-- all already use explicit column lists. admin.ts getUsers() is admin-only
-- (behind requireAdmin()) so SELECT * is acceptable there.
-- profile.ts getProfile() queries the owner's own row — SELECT * is correct.

COMMENT ON TABLE profiles IS
  'Public profile data. Sensitive columns (phone, email, business_registration_number, '
  'corporate_registration_number, representative_name) must NOT be selected in '
  'public-facing server actions. Use explicit column lists: '
  'id, display_name, avatar_url, user_type, company_name, verification_level, '
  'membership_tier, bio, created_at. '
  'SELECT * is only acceptable when querying the authenticated owner''s own row.';

-- Fix 2: transactions INSERT — restrict to service_role only
-- Remove the permissive user-level insert policy.
-- With no INSERT policy for authenticated users, RLS blocks all user inserts.
-- Transactions are only created via service_role from payment webhooks or admin ops.

DROP POLICY IF EXISTS "transactions_insert_own" ON transactions;

COMMENT ON COLUMN transactions.transaction_type IS
  'Transactions are inserted exclusively via service_role from payment provider '
  'webhooks or admin operations. No user-level INSERT policy exists.';
