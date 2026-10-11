-- Renames the tables of an EXISTING dev database to the standard names (see CLAUDE.md), so that data is kept.
-- Run once BEFORE starting the new backend (otherwise Hibernate creates empty tables with the new names).
-- Safe to re-run: a table is only renamed if the old name exists and the new one does not.

IF OBJECT_ID(N't_order_items', N'U') IS NOT NULL AND OBJECT_ID(N't_order_detail', N'U') IS NULL EXEC sp_rename N't_order_items', N't_order_detail';
IF OBJECT_ID(N't_upi_links', N'U') IS NOT NULL AND OBJECT_ID(N't_upi_link_master', N'U') IS NULL EXEC sp_rename N't_upi_links', N't_upi_link_master';
IF OBJECT_ID(N't_rel_menu_cat', N'U') IS NOT NULL AND OBJECT_ID(N't_menu_category_rel', N'U') IS NULL EXEC sp_rename N't_rel_menu_cat', N't_menu_category_rel';
IF OBJECT_ID(N't_rel_menucat', N'U') IS NOT NULL AND OBJECT_ID(N't_menu_category_rel', N'U') IS NULL EXEC sp_rename N't_rel_menucat', N't_menu_category_rel';
IF OBJECT_ID(N'user_role_restaurant', N'U') IS NOT NULL AND OBJECT_ID(N't_usr_role_restaurant_rel', N'U') IS NULL EXEC sp_rename N'user_role_restaurant', N't_usr_role_restaurant_rel';
IF OBJECT_ID(N't_plan_feature_mapping', N'U') IS NOT NULL AND OBJECT_ID(N't_plan_feature_rel', N'U') IS NULL EXEC sp_rename N't_plan_feature_mapping', N't_plan_feature_rel';
IF OBJECT_ID(N't_audit_log', N'U') IS NOT NULL AND OBJECT_ID(N't_audit_history', N'U') IS NULL EXEC sp_rename N't_audit_log', N't_audit_history';
IF OBJECT_ID(N't_password_reset_token', N'U') IS NOT NULL AND OBJECT_ID(N't_password_reset_master', N'U') IS NULL EXEC sp_rename N't_password_reset_token', N't_password_reset_master';
IF OBJECT_ID(N't_service_request', N'U') IS NOT NULL AND OBJECT_ID(N't_service_request_master', N'U') IS NULL EXEC sp_rename N't_service_request', N't_service_request_master';
IF OBJECT_ID(N't_subscription_plan', N'U') IS NOT NULL AND OBJECT_ID(N't_subscription_plan_master', N'U') IS NULL EXEC sp_rename N't_subscription_plan', N't_subscription_plan_master';
IF OBJECT_ID(N't_subscription_feature', N'U') IS NOT NULL AND OBJECT_ID(N't_subscription_feature_master', N'U') IS NULL EXEC sp_rename N't_subscription_feature', N't_subscription_feature_master';
IF OBJECT_ID(N't_restaurant_subscription', N'U') IS NOT NULL AND OBJECT_ID(N't_restaurant_subscription_master', N'U') IS NULL EXEC sp_rename N't_restaurant_subscription', N't_restaurant_subscription_master';
IF OBJECT_ID(N'payment_verification', N'U') IS NOT NULL AND OBJECT_ID(N't_payment_verification_master', N'U') IS NULL EXEC sp_rename N'payment_verification', N't_payment_verification_master';
IF OBJECT_ID(N'themes', N'U') IS NOT NULL AND OBJECT_ID(N't_theme_master', N'U') IS NULL EXEC sp_rename N'themes', N't_theme_master';
IF OBJECT_ID(N'registration_request', N'U') IS NOT NULL AND OBJECT_ID(N't_registration_request_master', N'U') IS NULL EXEC sp_rename N'registration_request', N't_registration_request_master';
IF OBJECT_ID(N'support_ticket', N'U') IS NOT NULL AND OBJECT_ID(N't_support_ticket_master', N'U') IS NULL EXEC sp_rename N'support_ticket', N't_support_ticket_master';
