-- PHASE1 1.3: manual payment tracking and order origin on t_order_master.
-- No FKs; safe to re-run. Existing rows become UNPAID.
ALTER TABLE t_order_master ADD COLUMN IF NOT EXISTS payment_status VARCHAR(32) NOT NULL DEFAULT 'UNPAID';
ALTER TABLE t_order_master ADD COLUMN IF NOT EXISTS order_source   VARCHAR(32);
CREATE INDEX IF NOT EXISTS idx_order_branch_created ON t_order_master (branch_id, created_at);
