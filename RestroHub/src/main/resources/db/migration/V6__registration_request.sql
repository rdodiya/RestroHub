-- Self-service registration: one row per sign-up awaiting email verification / superadmin approval.
-- No FKs (user_id / restaurant_id) because V1 is still a placeholder for Hibernate-created tables.
CREATE TABLE IF NOT EXISTS registration_request (
    id                    BIGSERIAL PRIMARY KEY,
    user_id               BIGINT       NOT NULL,
    requested_restaurant  VARCHAR(255) NOT NULL,
    restaurant_id         BIGINT,
    status                VARCHAR(32)  NOT NULL,
    verification_token    VARCHAR(64),
    token_expiry          TIMESTAMP,
    review_note           VARCHAR(500),
    reviewed_by           VARCHAR(255),
    reviewed_at           TIMESTAMP,
    created_at            TIMESTAMP    NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX IF NOT EXISTS uq_registration_request_user ON registration_request (user_id);
CREATE UNIQUE INDEX IF NOT EXISTS uq_registration_request_token ON registration_request (verification_token);
