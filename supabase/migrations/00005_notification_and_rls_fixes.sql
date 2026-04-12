-- 1. Add notifications INSERT policy (currently NO insert policy = all inserts blocked by RLS)
-- Allow authenticated users to insert notifications for other users
-- (needed for status change notifications, LOI notifications, etc.)
CREATE POLICY "notifications_insert_authenticated" ON notifications
  FOR INSERT WITH CHECK (true);
-- Note: Server actions already validate the notification context.
-- A more restrictive policy would require service_role for cross-user notifications.

-- 2. Add 'rejected' to deals status CHECK (admin.ts rejectDeal uses 'rejected' but CHECK doesn't include it)
ALTER TABLE deals DROP CONSTRAINT IF EXISTS deals_status_check;
ALTER TABLE deals ADD CONSTRAINT deals_status_check
  CHECK (status IN (
    'draft', 'pending_review', 'active', 'under_negotiation',
    'due_diligence', 'contract', 'partner_escrow', 'closed', 'cancelled', 'rejected'
  ));

-- 3. Add escrow_accounts UPDATE policy for buyer and seller
CREATE POLICY "escrow_accounts_update_participants" ON escrow_accounts
  FOR UPDATE USING (buyer_id = auth.uid() OR seller_id = auth.uid());
