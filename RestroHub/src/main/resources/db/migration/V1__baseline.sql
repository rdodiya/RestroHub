-- Flyway baseline (V1).
-- PLACEHOLDER: replace with the real current schema. Generate it from a database
-- that already has the tables:
--   pg_dump -U postgres -d RestroHub_DB --schema-only --no-owner --no-privileges > V1__baseline.sql
-- Until then Hibernate (spring.jpa.hibernate.ddl-auto=update in dev) still creates tables.
-- Naming for new migrations:  V2__add_branch_table.sql, V3__add_subscription_plan.sql ...
-- Never edit a migration after it has been merged — add a new one.
SELECT 1;
