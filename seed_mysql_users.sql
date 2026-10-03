-- Seed users for MySQL
-- 1. Restaurants
INSERT IGNORE INTO t_restaurant_master (rest_id, name, description, phone_number, is_active, service_request_enabled, created_at, updated_date)
VALUES
(10, 'Restroly Platform', 'Platform tenant for the super admin account', '9000000000', 1, 0, NOW(), NOW()),
(11, 'Spice Route', 'Demo restaurant A - North Indian, 2 branches', '9000000001', 1, 1, NOW(), NOW()),
(12, 'Ocean Grill', 'Demo restaurant B - Seafood, 1 branch (other tenant)', '9000000002', 1, 0, NOW(), NOW());

-- 2. Roles
INSERT IGNORE INTO t_role_master (role_id, role_name, role_desc, is_active)
VALUES
(1, 'SUPER_ADMIN', 'Platform owner: plans, features, users, role linking', 1),
(2, 'ADMIN', 'Restaurant admin: full access to own restaurant', 1),
(3, 'RESTAURANT_OWNER', 'Restaurant owner: same as admin', 1),
(4, 'STAFF', 'Live orders and KDS: status updates only', 1),
(5, 'CUSTOMER', 'Default customer role', 1),
(7, 'MANAGER', 'Operations, menus, tables, KDS; no settings/UPI/billing', 1),
(8, 'MANAGER_USER', 'Read-only operations; no financial data', 1)
ON DUPLICATE KEY UPDATE is_active = 1;

-- Also ensure ROLE_ prefixed roles if needed:
INSERT IGNORE INTO t_role_master (role_name, role_desc, is_active)
VALUES
('ROLE_SUPER_ADMIN', 'Super admin authority', 1),
('ROLE_ADMIN', 'Admin authority', 1),
('ROLE_RESTAURANT_OWNER', 'Owner authority', 1),
('ROLE_MANAGER', 'Manager authority', 1),
('ROLE_MANAGER_USER', 'Manager user authority', 1),
('ROLE_STAFF', 'Staff authority', 1),
('ROLE_CUSTOMER', 'Customer authority', 1)
ON DUPLICATE KEY UPDATE is_active = 1;

-- 3. Users with password Test@1234
DELETE FROM t_usr_master WHERE user_email LIKE '%@restroly.test';

INSERT INTO t_usr_master (user_name, user_email, user_password, phone_number, is_active, is_locked, auth_provider, created_at, updated_date)
VALUES
('Super Admin', 'superadmin@restroly.test', '$2a$10$s602DzWMIPZ/p5qdI8TBhuJ9elk.GpjKq6DrgEtrh/cnH6Dw/O6Qy', '9100000001', 1, 0, 'LOCAL', NOW(), NOW()),
('Asha Admin (A)', 'admin.a@restroly.test', '$2a$10$s602DzWMIPZ/p5qdI8TBhuJ9elk.GpjKq6DrgEtrh/cnH6Dw/O6Qy', '9100000002', 1, 0, 'LOCAL', NOW(), NOW()),
('Omkar Owner (A)', 'owner.a@restroly.test', '$2a$10$s602DzWMIPZ/p5qdI8TBhuJ9elk.GpjKq6DrgEtrh/cnH6Dw/O6Qy', '9100000003', 1, 0, 'LOCAL', NOW(), NOW()),
('Meera Manager (A)', 'manager.a@restroly.test', '$2a$10$s602DzWMIPZ/p5qdI8TBhuJ9elk.GpjKq6DrgEtrh/cnH6Dw/O6Qy', '9100000004', 1, 0, 'LOCAL', NOW(), NOW()),
('Mohan ManagerUser (A)', 'manageruser.a@restroly.test', '$2a$10$s602DzWMIPZ/p5qdI8TBhuJ9elk.GpjKq6DrgEtrh/cnH6Dw/O6Qy', '9100000005', 1, 0, 'LOCAL', NOW(), NOW()),
('Sunil Staff (A)', 'staff.a@restroly.test', '$2a$10$s602DzWMIPZ/p5qdI8TBhuJ9elk.GpjKq6DrgEtrh/cnH6Dw/O6Qy', '9100000006', 1, 0, 'LOCAL', NOW(), NOW()),
('Chitra Customer (A)', 'customer.a@restroly.test', '$2a$10$s602DzWMIPZ/p5qdI8TBhuJ9elk.GpjKq6DrgEtrh/cnH6Dw/O6Qy', '9100000007', 1, 0, 'LOCAL', NOW(), NOW()),
('Bala Admin (B)', 'admin.b@restroly.test', '$2a$10$s602DzWMIPZ/p5qdI8TBhuJ9elk.GpjKq6DrgEtrh/cnH6Dw/O6Qy', '9100000008', 1, 0, 'LOCAL', NOW(), NOW());

-- 4. User Role Restaurant Links
INSERT INTO user_role_restaurant (user_id, role_id, restaurant_id)
SELECT u.user_id, r.role_id, rm.rest_id
FROM t_usr_master u
JOIN (
  SELECT 'superadmin@restroly.test' AS email, 'SUPER_ADMIN' AS role_name, 'Restroly Platform' AS rest_name UNION ALL
  SELECT 'admin.a@restroly.test', 'ADMIN', 'Spice Route' UNION ALL
  SELECT 'owner.a@restroly.test', 'RESTAURANT_OWNER', 'Spice Route' UNION ALL
  SELECT 'manager.a@restroly.test', 'MANAGER', 'Spice Route' UNION ALL
  SELECT 'manageruser.a@restroly.test', 'MANAGER_USER', 'Spice Route' UNION ALL
  SELECT 'staff.a@restroly.test', 'STAFF', 'Spice Route' UNION ALL
  SELECT 'customer.a@restroly.test', 'CUSTOMER', 'Spice Route' UNION ALL
  SELECT 'admin.b@restroly.test', 'ADMIN', 'Ocean Grill'
) m ON u.user_email = m.email
JOIN t_role_master r ON (r.role_name = m.role_name OR r.role_name = CONCAT('ROLE_', m.role_name))
JOIN t_restaurant_master rm ON rm.name = m.rest_name;
