-- =============================================================================
-- Restroly — 01_seed_users.sql  (LOCAL / DEV ONLY — never run against production)
-- =============================================================================
-- Creates one login user per role so every permission in security/Permission.java
-- can be tested, plus the minimum restaurants those users must be linked to
-- (user_role_restaurant.restaurant_id is NOT NULL).
--
-- Prerequisite: start the backend once so Hibernate/Flyway create the tables.
-- Run:          psql -U postgres -d RestroHub_DB -f scripts/db/01_seed_users.sql
-- Safe to re-run: roles/users/links are matched by name/email and never duplicated;
-- re-running resets the test users' password and unlocks them.
--
-- Password for every test user: Test@1234   (login with the email as username)
-- =============================================================================

CREATE EXTENSION IF NOT EXISTS pgcrypto;   -- crypt()/gen_salt('bf') → BCrypt hash Spring accepts

DO $$
DECLARE
    v_password CONSTANT TEXT := 'Test@1234';
    v_hash     TEXT := crypt(v_password, gen_salt('bf', 10));
    v_role     RECORD;
    v_user     RECORD;
    v_rest_id  BIGINT;
    v_role_id  BIGINT;
    v_user_id  BIGINT;
BEGIN
    -- -------------------------------------------------------------------------
    -- 1. Restaurants the users belong to (two tenants for cross-tenant tests)
    -- -------------------------------------------------------------------------
    INSERT INTO t_restaurant_master (name, description, phone_number, is_active, service_request_enabled, created_at, updated_date)
    SELECT v.name, v.description, v.phone, TRUE, v.svc, NOW(), NOW()
    FROM (VALUES
        ('Restroly Platform', 'Platform tenant for the super admin account', '9000000000', FALSE),
        ('Spice Route',       'Demo restaurant A — North Indian, 2 branches', '9000000001', TRUE),
        ('Ocean Grill',       'Demo restaurant B — Seafood, 1 branch (other tenant)', '9000000002', FALSE)
    ) AS v(name, description, phone, svc)
    WHERE NOT EXISTS (SELECT 1 FROM t_restaurant_master r WHERE r.name = v.name);

    -- -------------------------------------------------------------------------
    -- 2. Roles — reuse an existing row whether it is stored as "ADMIN" or
    --    "ROLE_ADMIN" (AppRole.authority() treats both the same); else insert ROLE_X.
    -- -------------------------------------------------------------------------
    FOR v_role IN SELECT * FROM (VALUES
        ('SUPER_ADMIN',      'Platform owner: plans, features, users, role linking'),
        ('ADMIN',            'Restaurant admin: full access to own restaurant'),
        ('RESTAURANT_OWNER', 'Restaurant owner: same as admin'),
        ('MANAGER',          'Operations, menus, tables, KDS; no settings/UPI/billing'),
        ('MANAGER_USER',     'Read-only operations; no financial data'),
        ('STAFF',            'Live orders and KDS: status updates only'),
        ('CUSTOMER',         'Default customer role')
    ) AS r(name, description)
    LOOP
        IF NOT EXISTS (SELECT 1 FROM t_role_master
                       WHERE regexp_replace(upper(role_name), '^(ROLE_)+', '') = v_role.name) THEN
            INSERT INTO t_role_master (role_name, role_desc, is_active)
            VALUES (CASE WHEN v_role.name = 'CUSTOMER' THEN 'CUSTOMER' ELSE 'ROLE_' || v_role.name END,
                    v_role.description, TRUE);
            RAISE NOTICE 'Inserted missing role %', v_role.name;
        END IF;
        UPDATE t_role_master SET is_active = TRUE
        WHERE regexp_replace(upper(role_name), '^(ROLE_)+', '') = v_role.name;
    END LOOP;

    -- -------------------------------------------------------------------------
    -- 3. Users (one per role) + role/restaurant links
    -- -------------------------------------------------------------------------
    FOR v_user IN SELECT * FROM (VALUES
        ('superadmin@restroly.test',   'Super Admin',          'SUPER_ADMIN',      'Restroly Platform', '9100000001'),
        ('admin.a@restroly.test',      'Asha Admin (A)',       'ADMIN',            'Spice Route',       '9100000002'),
        ('owner.a@restroly.test',      'Omkar Owner (A)',      'RESTAURANT_OWNER', 'Spice Route',       '9100000003'),
        ('manager.a@restroly.test',    'Meera Manager (A)',    'MANAGER',          'Spice Route',       '9100000004'),
        ('manageruser.a@restroly.test','Mohan ManagerUser (A)','MANAGER_USER',     'Spice Route',       '9100000005'),
        ('staff.a@restroly.test',      'Sunil Staff (A)',      'STAFF',            'Spice Route',       '9100000006'),
        ('customer.a@restroly.test',   'Chitra Customer (A)',  'CUSTOMER',         'Spice Route',       '9100000007'),
        ('admin.b@restroly.test',      'Bala Admin (B)',       'ADMIN',            'Ocean Grill',       '9100000008')
    ) AS u(email, name, role, restaurant, phone)
    LOOP
        INSERT INTO t_usr_master (user_name, user_email, user_password, phone_number,
                                  is_active, is_locked, auth_provider, created_at, updated_date)
        VALUES (v_user.name, v_user.email, v_hash, v_user.phone, TRUE, FALSE, 'LOCAL', NOW(), NOW())
        ON CONFLICT (user_email) DO UPDATE
            SET user_password = EXCLUDED.user_password,
                is_active     = TRUE,
                is_locked     = FALSE,
                updated_date  = NOW()
        RETURNING user_id INTO v_user_id;

        SELECT rest_id INTO v_rest_id FROM t_restaurant_master WHERE name = v_user.restaurant ORDER BY rest_id LIMIT 1;
        SELECT role_id INTO v_role_id FROM t_role_master
        WHERE regexp_replace(upper(role_name), '^(ROLE_)+', '') = v_user.role ORDER BY role_id LIMIT 1;

        INSERT INTO user_role_restaurant (user_id, role_id, restaurant_id)
        VALUES (v_user_id, v_role_id, v_rest_id)
        ON CONFLICT (user_id, role_id, restaurant_id) DO NOTHING;
    END LOOP;

    RAISE NOTICE 'Test users ready. Password for all: %', v_password;
END $$;

-- -----------------------------------------------------------------------------
-- Check: every test user, its role and restaurant (expect 8 rows)
-- -----------------------------------------------------------------------------
SELECT u.user_email           AS login_email,
       r.role_name            AS role,
       rm.name                AS restaurant,
       u.is_active, u.is_locked,
       (u.user_password = crypt('Test@1234', u.user_password)) AS password_ok
FROM t_usr_master u
JOIN user_role_restaurant urr ON urr.user_id = u.user_id
JOIN t_role_master r          ON r.role_id = urr.role_id
JOIN t_restaurant_master rm   ON rm.rest_id = urr.restaurant_id
WHERE u.user_email LIKE '%@restroly.test'
ORDER BY rm.name, r.role_name;
