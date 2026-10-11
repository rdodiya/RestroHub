-- Renames the tables of an EXISTING dev database to the standard names (see CLAUDE.md), so that data is kept.
-- Run once BEFORE starting the new backend (otherwise Hibernate creates empty tables with the new names).
-- Safe to re-run: a table is only renamed if the old name exists and the new one does not.
-- Run: psql -U postgres -d RestroHub_DB -f scripts/db/04_rename_tables.sql

DO $$
BEGIN
    IF to_regclass('t_order_items') IS NOT NULL AND to_regclass('t_order_detail') IS NULL THEN ALTER TABLE t_order_items RENAME TO t_order_detail; END IF;
    IF to_regclass('t_upi_links') IS NOT NULL AND to_regclass('t_upi_link_master') IS NULL THEN ALTER TABLE t_upi_links RENAME TO t_upi_link_master; END IF;
    IF to_regclass('t_rel_menu_cat') IS NOT NULL AND to_regclass('t_menu_category_rel') IS NULL THEN ALTER TABLE t_rel_menu_cat RENAME TO t_menu_category_rel; END IF;
    IF to_regclass('t_rel_menucat') IS NOT NULL AND to_regclass('t_menu_category_rel') IS NULL THEN ALTER TABLE t_rel_menucat RENAME TO t_menu_category_rel; END IF;
    IF to_regclass('user_role_restaurant') IS NOT NULL AND to_regclass('t_usr_role_restaurant_rel') IS NULL THEN ALTER TABLE user_role_restaurant RENAME TO t_usr_role_restaurant_rel; END IF;
    IF to_regclass('t_plan_feature_mapping') IS NOT NULL AND to_regclass('t_plan_feature_rel') IS NULL THEN ALTER TABLE t_plan_feature_mapping RENAME TO t_plan_feature_rel; END IF;
    IF to_regclass('t_audit_log') IS NOT NULL AND to_regclass('t_audit_history') IS NULL THEN ALTER TABLE t_audit_log RENAME TO t_audit_history; END IF;
    IF to_regclass('t_password_reset_token') IS NOT NULL AND to_regclass('t_password_reset_master') IS NULL THEN ALTER TABLE t_password_reset_token RENAME TO t_password_reset_master; END IF;
    IF to_regclass('t_service_request') IS NOT NULL AND to_regclass('t_service_request_master') IS NULL THEN ALTER TABLE t_service_request RENAME TO t_service_request_master; END IF;
    IF to_regclass('t_subscription_plan') IS NOT NULL AND to_regclass('t_subscription_plan_master') IS NULL THEN ALTER TABLE t_subscription_plan RENAME TO t_subscription_plan_master; END IF;
    IF to_regclass('t_subscription_feature') IS NOT NULL AND to_regclass('t_subscription_feature_master') IS NULL THEN ALTER TABLE t_subscription_feature RENAME TO t_subscription_feature_master; END IF;
    IF to_regclass('t_restaurant_subscription') IS NOT NULL AND to_regclass('t_restaurant_subscription_master') IS NULL THEN ALTER TABLE t_restaurant_subscription RENAME TO t_restaurant_subscription_master; END IF;
    IF to_regclass('payment_verification') IS NOT NULL AND to_regclass('t_payment_verification_master') IS NULL THEN ALTER TABLE payment_verification RENAME TO t_payment_verification_master; END IF;
    IF to_regclass('themes') IS NOT NULL AND to_regclass('t_theme_master') IS NULL THEN ALTER TABLE themes RENAME TO t_theme_master; END IF;
    IF to_regclass('registration_request') IS NOT NULL AND to_regclass('t_registration_request_master') IS NULL THEN ALTER TABLE registration_request RENAME TO t_registration_request_master; END IF;
    IF to_regclass('support_ticket') IS NOT NULL AND to_regclass('t_support_ticket_master') IS NULL THEN ALTER TABLE support_ticket RENAME TO t_support_ticket_master; END IF;
END $$;
