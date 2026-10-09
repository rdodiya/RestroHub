-- =============================================================================
-- Restroly — 03_seed_superadmin.mssql.sql   (SQL Server / T-SQL)
-- =============================================================================
-- Creates (or re-enables) the platform SUPER_ADMIN login. PostgreSQL users: use
-- 03_seed_superadmin.sql instead.
--
-- SQL Server cannot compute BCrypt, so generate the hash first and paste it into @Hash:
--   python -c "import bcrypt,sys;print(bcrypt.hashpw(sys.argv[1].encode(),bcrypt.gensalt(10)).decode())" "<your-password>"
--   (pip install bcrypt; a hash starting $2b$ is accepted by Spring Security)
-- Do not commit a real hash. Start the backend once first so Hibernate creates the tables.
-- Safe to re-run: resets the password, unlocks the account, keeps a single SUPER_ADMIN link.
-- =============================================================================

DECLARE @Email NVARCHAR(255) = N'roydodia@gmail.com';
DECLARE @Name  NVARCHAR(255) = N'Super Admin';
DECLARE @Hash  NVARCHAR(255) = N'';   -- <-- paste the BCrypt hash here

IF @Hash NOT LIKE '$2[abxy]$%' OR LEN(@Hash) <> 60
    THROW 50001, 'Set @Hash to a valid BCrypt password hash before running', 1;

SET @Email = LOWER(LTRIM(RTRIM(@Email)));

DECLARE @RestId BIGINT, @RoleId BIGINT, @UserId BIGINT;

BEGIN TRAN;

-- user_role_restaurant.restaurant_id is NOT NULL, so the superadmin hangs off a platform tenant.
SELECT TOP 1 @RestId = rest_id FROM t_restaurant_master WHERE name = N'Restroly Platform' ORDER BY rest_id;
IF @RestId IS NULL
BEGIN
    INSERT INTO t_restaurant_master (name, description, is_active, service_request_enabled, created_at, updated_date)
    VALUES (N'Restroly Platform', N'Platform tenant for the super admin account', 1, 0, SYSDATETIME(), SYSDATETIME());
    SET @RestId = SCOPE_IDENTITY();
END

-- Reuse the role whether stored as SUPER_ADMIN or ROLE_SUPER_ADMIN; else insert ROLE_SUPER_ADMIN.
SELECT TOP 1 @RoleId = role_id FROM t_role_master
WHERE UPPER(role_name) IN (N'SUPER_ADMIN', N'ROLE_SUPER_ADMIN') ORDER BY role_id;
IF @RoleId IS NULL
BEGIN
    INSERT INTO t_role_master (role_name, role_desc, is_active)
    VALUES (N'ROLE_SUPER_ADMIN', N'Platform owner: plans, features, users, role linking', 1);
    SET @RoleId = SCOPE_IDENTITY();
END

SELECT @UserId = user_id FROM t_usr_master WHERE user_email = @Email;
IF @UserId IS NULL
BEGIN
    INSERT INTO t_usr_master (user_name, user_email, user_password, is_active, is_locked, auth_provider, created_at, updated_date)
    VALUES (@Name, @Email, @Hash, 1, 0, N'LOCAL', SYSDATETIME(), SYSDATETIME());
    SET @UserId = SCOPE_IDENTITY();
END
ELSE
    UPDATE t_usr_master
       SET user_password = @Hash, is_active = 1, is_locked = 0, updated_date = SYSDATETIME()
     WHERE user_id = @UserId;

IF NOT EXISTS (SELECT 1 FROM user_role_restaurant WHERE user_id = @UserId AND role_id = @RoleId AND restaurant_id = @RestId)
    INSERT INTO user_role_restaurant (user_id, role_id, restaurant_id) VALUES (@UserId, @RoleId, @RestId);

-- A superadmin must not be blocked by the self-registration login gate.
IF OBJECT_ID(N'registration_request', N'U') IS NOT NULL
    DELETE FROM registration_request WHERE user_id = @UserId;

COMMIT;
PRINT 'Super admin ready: ' + @Email + ' (user_id ' + CAST(@UserId AS VARCHAR(20)) + ')';
