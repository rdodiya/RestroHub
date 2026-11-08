-- 2026-11-08 - Table reservation schema - Store website table reservations and link with branch tables
CREATE TABLE IF NOT EXISTS t_table_reservation (
    id                  BIGSERIAL PRIMARY KEY,
    branch_id           BIGINT NOT NULL,
    table_id            BIGINT,
    table_number        INTEGER,
    customer_name       VARCHAR(100) NOT NULL,
    customer_email      VARCHAR(150),
    customer_phone      VARCHAR(50),
    reservation_date    VARCHAR(30) NOT NULL,
    time_slot           VARCHAR(50) NOT NULL,
    guests_count        INTEGER NOT NULL,
    special_requests    TEXT,
    status              VARCHAR(30) NOT NULL DEFAULT 'CONFIRMED',
    confirmation_number VARCHAR(64) NOT NULL UNIQUE,
    created_at          TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at          TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_table_resv_branch_date ON t_table_reservation (branch_id, reservation_date);
CREATE INDEX IF NOT EXISTS idx_table_resv_confirmation ON t_table_reservation (confirmation_number);
