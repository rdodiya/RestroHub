-- =============================================================================
-- Restroly — 03_seed_superadmin.sql
-- =============================================================================
-- Creates (or re-enables) the platform SUPER_ADMIN login. Safe for any environment:
-- the password is NOT stored in this file, you pass it on the command line.
--
-- Prerequisite: start the backend once so the tables exist.
-- Run:
--   psql -U postgres -d RestroHub_DB -v password='<choose-a-strong-password>' -f scripts/db/03_seed_superadmin.sql
-- Optional: -v email='someone@example.com' -v name='Full Name' (defaults below).
-- Re-running resets the password, unlocks the account and keeps a single SUPER_ADMIN link.
-- =============================================================================

\if :{?password}
\else
  \echo 'ERROR: pass the password with  -v password=...'
  \quit
\endif
\if :{?email}
\else
  \set email roydodia@gmail.com
\endif
\if :{?name}
\else
  \set name 'Super Admin'
\endif

CREATE EXTENSION IF NOT EXISTS pgcrypto;   -- crypt()/gen_salt('bf') -> BCrypt hash Spring accepts

-- psql does not expand :'var' inside a $$ block, so hand the values over as session settings.
SELECT set_config('sa.email', lower(trim(:'email')), false),
       set_config('sa.name', :'name', false),
       set_config('sa.hash', crypt(:'password', gen_salt('bf', 10)), false) \gset

DO $$
DECLARE
    v_email   TEXT := current_setting('sa.email');
    v_hash    TEXT := current_setting('sa.hash');
    v_rest_id BIGINT;
    v_role_id BIGINT;
    v_user_id BIGINT;
BEGIN
    -- t_usr_role_restaurant_rel.restaurant_id is NOT NULL, so the superadmin hangs off a platform tenant.
    SELECT rest_id INTO v_rest_id FROM t_restaurant_master WHERE name = 'Restroly Platform' ORDER BY rest_id LIMIT 1;
    IF v_rest_id IS NULL THEN
        INSERT INTO t_restaurant_master (name, description, is_active, service_request_enabled, created_at, updated_date)
        VALUES ('Restroly Platform', 'Platform tenant for the super admin account', TRUE, FALSE, NOW(), NOW())
        RETURNING rest_id INTO v_rest_id;
    END IF;

    -- Reuse the role whether stored as SUPER_ADMIN or ROLE_SUPER_ADMIN; else insert ROLE_SUPER_ADMIN.
    SELECT role_id INTO v_role_id FROM t_role_master
    WHERE regexp_replace(upper(role_name), '^(ROLE_)+', '') = 'SUPER_ADMIN' ORDER BY role_id LIMIT 1;
    IF v_role_id IS NULL THEN
        INSERT INTO t_role_master (role_name, role_desc, is_active)
        VALUES ('ROLE_SUPER_ADMIN', 'Platform owner: plans, features, users, role linking', TRUE)
        RETURNING role_id INTO v_role_id;
    END IF;

    INSERT INTO t_usr_master (user_name, user_email, user_password, is_active, is_locked, auth_provider, created_at, updated_date)
    VALUES (current_setting('sa.name'), v_email, v_hash, TRUE, FALSE, 'LOCAL', NOW(), NOW())
    ON CONFLICT (user_email) DO UPDATE
        SET user_password = EXCLUDED.user_password,
            is_active     = TRUE,
            is_locked     = FALSE,
            updated_date  = NOW()
    RETURNING user_id INTO v_user_id;

    INSERT INTO t_usr_role_restaurant_rel (user_id, role_id, restaurant_id)
    VALUES (v_user_id, v_role_id, v_rest_id)
    ON CONFLICT (user_id, role_id, restaurant_id) DO NOTHING;

    -- A superadmin must not be blocked by the self-registration login gate.
    IF to_regclass('t_registration_request_master') IS NOT NULL THEN
        DELETE FROM t_registration_request_master WHERE user_id = v_user_id;
    END IF;

    RAISE NOTICE 'Super admin ready: % (user_id %)', v_email, v_user_id;
END $$;

RESET sa.hash;
