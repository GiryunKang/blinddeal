-- ============================================================================
-- Migration 00003: Legal Repositioning — Information Platform Model
-- ============================================================================
-- Aligns DB schema with the platform's legal position as a
-- "deal information connection platform" (딜 정보 연결 플랫폼),
-- not a brokerage or escrow operator.
-- ============================================================================

-- 1. Remove commission_fee from transactions CHECK constraint
-- The platform does not charge transaction-based commissions.
ALTER TABLE transactions
  DROP CONSTRAINT IF EXISTS transactions_transaction_type_check;

ALTER TABLE transactions
  ADD CONSTRAINT transactions_transaction_type_check
  CHECK (transaction_type IN (
    'escrow_deposit', 'escrow_release', 'escrow_refund',
    'membership_payment', 'expert_fee'
  ));

-- 2. Rename deal status 'escrow' to 'partner_escrow'
-- Clarifies that escrow is handled by external partners, not the platform.
-- Note: This requires updating existing data first.
UPDATE deals SET status = 'partner_escrow' WHERE status = 'escrow';

ALTER TABLE deals
  DROP CONSTRAINT IF EXISTS deals_status_check;

ALTER TABLE deals
  ADD CONSTRAINT deals_status_check
  CHECK (status IN (
    'draft', 'pending_review', 'active', 'under_negotiation',
    'due_diligence', 'contract', 'partner_escrow', 'closed', 'cancelled'
  ));

-- 3. Rename deal_rooms status 'escrow' to 'partner_escrow'
UPDATE deal_rooms SET status = 'partner_escrow' WHERE status = 'escrow';

ALTER TABLE deal_rooms
  DROP CONSTRAINT IF EXISTS deal_rooms_status_check;

ALTER TABLE deal_rooms
  ADD CONSTRAINT deal_rooms_status_check
  CHECK (status IN (
    'inquiry', 'negotiating', 'loi_exchanged', 'due_diligence',
    'contract_review', 'partner_escrow', 'completed', 'cancelled'
  ));

-- 4. Add comment clarifying escrow_accounts purpose
COMMENT ON TABLE escrow_accounts IS
  'Tracks escrow status as reported by external partner institutions (banks, law firms). '
  'The platform does NOT hold or manage funds directly. '
  'Status updates originate from partner notifications, not platform operations.';

COMMENT ON COLUMN escrow_accounts.total_amount IS
  'Deal amount as reported by the escrow partner. Platform does not hold this amount.';

COMMENT ON COLUMN escrow_accounts.funded_at IS
  'Timestamp when the escrow partner confirmed fund receipt. Recorded for tracking only.';

COMMENT ON COLUMN escrow_accounts.released_at IS
  'Timestamp when the escrow partner confirmed fund release. Recorded for tracking only.';

-- 5. Add comment clarifying transactions table purpose
COMMENT ON TABLE transactions IS
  'Records platform service fees (membership, expert connection) and '
  'escrow status events as reported by partners. '
  'The platform does NOT process escrow funds directly.';
