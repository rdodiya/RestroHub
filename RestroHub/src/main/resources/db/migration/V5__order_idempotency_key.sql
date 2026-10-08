-- PHASE1 6.2: client-supplied Idempotency-Key so a retried/double-submitted checkout creates one order.
-- Nullable (staff and legacy orders have none); Postgres allows many NULLs in a unique index. No FKs.
ALTER TABLE t_order_master ADD COLUMN IF NOT EXISTS idempotency_key VARCHAR(64);
CREATE UNIQUE INDEX IF NOT EXISTS uq_order_idempotency_key ON t_order_master (idempotency_key);
