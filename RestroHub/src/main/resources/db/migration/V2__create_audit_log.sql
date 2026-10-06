-- PHASE1 §6.1: append-only audit log for sensitive actions.
-- No foreign keys on purpose: entries must outlive the users/restaurants they mention, and
-- V1 is still a placeholder baseline (tables it would reference may not exist yet on a fresh DB).
CREATE TABLE IF NOT EXISTS t_audit_log (
    id             BIGSERIAL    PRIMARY KEY,
    actor_user_id  BIGINT,
    actor_email    VARCHAR(255),
    action         VARCHAR(64)  NOT NULL,
    target_type    VARCHAR(64)  NOT NULL,
    target_id      VARCHAR(64),
    restaurant_id  BIGINT,
    metadata       TEXT,
    created_at     TIMESTAMP    NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_audit_log_restaurant_created ON t_audit_log (restaurant_id, created_at);
CREATE INDEX IF NOT EXISTS idx_audit_log_target ON t_audit_log (target_type, target_id);
