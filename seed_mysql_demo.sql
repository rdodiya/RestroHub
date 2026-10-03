-- =============================================================================
-- MySQL Demo Data Seeding matching JPA Entities
-- =============================================================================

-- 1. Addresses
INSERT IGNORE INTO t_address_master (address_id, address_line1, address_line2, city, state, country, postal_code)
VALUES
(101, 'Shop 4, Link Road', 'Near Infiniti Mall', 'Mumbai', 'Maharashtra', 'India', '400053'),
(102, '12 Waterfield Road', 'Opposite Bandra Gymkhana', 'Mumbai', 'Maharashtra', 'India', '400050'),
(103, 'Miramar Beach Road', 'Near Circle', 'Panaji', 'Goa', 'India', '403001');

-- 2. Branches
INSERT IGNORE INTO t_branch_master (branch_id, name, description, is_delete, branch_upi_id, rest_id, address_id, created_date, updated_date)
VALUES
(101, 'Andheri West', 'Flagship branch near Infiniti Mall', 0, 'spiceroute@upi', 11, 101, NOW(), NOW()),
(102, 'Bandra West', 'Boutique dining on Waterfield Road', 0, 'spiceroute.bandra@upi', 11, 102, NOW(), NOW()),
(103, 'Panjim Beach', 'Seaside casual dining at Miramar', 0, 'oceangrill@upi', 12, 103, NOW(), NOW());

-- 3. Menus
INSERT IGNORE INTO t_menu_master (menu_id, menu_name, menu_desc, is_deleted, branch_id, created_date, updated_date)
VALUES
(101, 'Spice Route Andheri Dining', 'Signature North Indian & Mughlai dishes', 0, 101, CURDATE(), CURDATE()),
(102, 'Ocean Grill Catch of the Day', 'Fresh Goan seafood & coastal delicacies', 0, 103, CURDATE(), CURDATE()),
(103, 'Spice Route Bandra Dining', 'Bandra boutique delicacies', 0, 102, CURDATE(), CURDATE());

UPDATE t_branch_master SET menu_id = 101 WHERE branch_id = 101;
UPDATE t_branch_master SET menu_id = 103 WHERE branch_id = 102;
UPDATE t_branch_master SET menu_id = 102 WHERE branch_id = 103;

-- 4. Categories
INSERT IGNORE INTO t_category_master (category_id, name, description, is_delete, branch_id, updated_date)
VALUES
(101, 'Starters', 'Spice Route - tandoor & chaat', 0, 101, NOW()),
(102, 'Main Course', 'Spice Route - curries & gravies', 0, 101, NOW()),
(103, 'Breads & Rice', 'Spice Route - naan, roti, biryani', 0, 101, NOW()),
(104, 'Beverages', 'Spice Route - lassi, chai, coolers', 0, 101, NOW()),
(105, 'Desserts', 'Spice Route - Indian sweets', 0, 101, NOW()),
(106, 'Seafood Starters', 'Ocean Grill - fried & grilled', 0, 103, NOW()),
(107, 'Goan Curries', 'Ocean Grill - xacuti, cafreal, curry rice', 0, 103, NOW()),
(108, 'Ocean Coolers', 'Ocean Grill - sol kadhi, fresh juices', 0, 103, NOW());

-- 5. Rel Menu Category
INSERT IGNORE INTO t_rel_menu_cat (menu_id, category_id)
VALUES
(101, 101), (101, 102), (101, 103), (101, 104), (101, 105),
(102, 106), (102, 107), (102, 108);

-- 6. Foods
INSERT IGNORE INTO t_food_master (food_id, name, description, price, is_available, is_veg, is_delete, category_id, date_created, updated_date)
VALUES
(101, 'Paneer Tikka', 'Cottage cheese, tandoor-roasted', 260.00, 1, 1, 0, 101, NOW(), NOW()),
(102, 'Chicken Tikka', 'Boneless chicken, yoghurt marinade', 320.00, 1, 0, 0, 101, NOW(), NOW()),
(103, 'Dahi Puri', 'Crisp puris, sweet curd, chutneys', 150.00, 1, 1, 0, 101, NOW(), NOW()),
(104, 'Hara Bhara Kebab', 'Spinach & pea patties', 210.00, 1, 1, 0, 101, NOW(), NOW()),
(105, 'Paneer Butter Masala', 'Rich tomato-butter gravy', 290.00, 1, 1, 0, 102, NOW(), NOW()),
(106, 'Butter Chicken', 'Classic murgh makhani', 360.00, 1, 0, 0, 102, NOW(), NOW()),
(107, 'Dal Makhani', 'Slow-cooked black lentils', 240.00, 1, 1, 0, 102, NOW(), NOW()),
(108, 'Mutton Rogan Josh', 'Kashmiri lamb curry', 420.00, 1, 0, 0, 102, NOW(), NOW()),
(109, 'Butter Naan', 'Tandoor flatbread', 60.00, 1, 1, 0, 103, NOW(), NOW()),
(110, 'Garlic Naan', 'Naan with garlic & coriander', 75.00, 1, 1, 0, 103, NOW(), NOW()),
(111, 'Veg Biryani', 'Dum-cooked basmati, vegetables', 260.00, 1, 1, 0, 103, NOW(), NOW()),
(112, 'Chicken Biryani', 'Hyderabadi dum biryani', 340.00, 1, 0, 0, 103, NOW(), NOW()),
(113, 'Sweet Lassi', 'Chilled yoghurt drink', 90.00, 1, 1, 0, 104, NOW(), NOW()),
(114, 'Masala Chai', 'Spiced Indian tea', 40.00, 1, 1, 0, 104, NOW(), NOW()),
(115, 'Gulab Jamun', 'Two pieces, warm', 110.00, 1, 1, 0, 105, NOW(), NOW()),
(116, 'Prawn Rava Fry', 'Semolina-crusted prawns', 380.00, 1, 0, 0, 106, NOW(), NOW()),
(117, 'Fish Curry Rice', 'Kingfish curry with rice', 360.00, 1, 0, 0, 107, NOW(), NOW()),
(118, 'Sol Kadhi', 'Kokum & coconut milk', 90.00, 1, 1, 0, 108, NOW(), NOW());

-- 7. Tables (Branches 101, 102, 103)
INSERT IGNORE INTO t_table_master (table_id, branch_id, table_number, capacity, status, is_active, created_date, updated_date)
VALUES
(101, 101, 1, 2, 'AVAILABLE', 1, NOW(), NOW()),
(102, 101, 2, 4, 'OCCUPIED', 1, NOW(), NOW()),
(103, 101, 3, 4, 'AVAILABLE', 1, NOW(), NOW()),
(104, 101, 4, 6, 'AVAILABLE', 1, NOW(), NOW()),
(105, 101, 5, 8, 'AVAILABLE', 1, NOW(), NOW()),
(106, 102, 1, 2, 'AVAILABLE', 1, NOW(), NOW()),
(107, 102, 2, 4, 'AVAILABLE', 1, NOW(), NOW()),
(108, 102, 3, 4, 'AVAILABLE', 1, NOW(), NOW()),
(109, 103, 1, 4, 'AVAILABLE', 1, NOW(), NOW()),
(110, 103, 2, 4, 'AVAILABLE', 1, NOW(), NOW());

-- 8. UPI Links
INSERT IGNORE INTO t_upi_links (id, branch_id, name, upi_id, is_active, is_default, created_date, updated_date)
VALUES
(101, 101, 'Spice Route Andheri', 'spiceroute@upi', 1, 1, NOW(), NOW()),
(102, 102, 'Spice Route Bandra', 'spiceroute.bandra@upi', 1, 1, NOW(), NOW()),
(103, 103, 'Ocean Grill Panjim', 'oceangrill@upi', 1, 1, NOW(), NOW());

-- 9. Subscription Features & Plans
INSERT IGNORE INTO t_subscription_feature (id, feature_key, display_name, description, is_active)
VALUES
(1, 'WHATSAPP_NOTIFICATIONS', 'WhatsApp Notifications', 'Order updates via WhatsApp', 1),
(2, 'KDS_ACCESS', 'Kitchen Display System', 'Real-time kitchen order view', 1),
(3, 'MULTI_BRANCH', 'Multi Branch Support', 'Manage multiple restaurant branches', 1),
(4, 'EXCEL_IMPORT_EXPORT', 'Excel Import/Export', 'Bulk catalog management', 1),
(5, 'CUSTOM_WEBSITE_TEMPLATES', 'Custom Website Templates', 'Access to premium website templates', 1),
(6, 'ADVANCED_ANALYTICS', 'Advanced Analytics', 'Detailed sales and revenue metrics', 1);

INSERT IGNORE INTO t_subscription_plan (id, name, description, price, billing_cycle, is_active, created_at, updated_at)
VALUES
(1, 'FREE', 'Free tier for small food stalls', 0.00, 'MONTHLY', 1, NOW(), NOW()),
(2, 'PRO', 'Professional tier with full features', 999.00, 'MONTHLY', 1, NOW(), NOW());

-- Map features to plans: Free gets limited features, Pro gets all
INSERT IGNORE INTO t_plan_feature_mapping (id, plan_id, feature_id, feature_value)
VALUES
(1, 1, 2, 'true'),
(2, 2, 1, 'true'), (3, 2, 2, 'true'), (4, 2, 3, 'true'), (5, 2, 4, 'true'), (6, 2, 5, 'ALL'), (7, 2, 6, 'true');

-- Assign subscriptions to restaurants
INSERT IGNORE INTO t_restaurant_subscription (id, restaurant_id, plan_id, start_date, end_date, status, is_auto_renew, created_at, updated_at)
VALUES
(1, 11, 2, NOW(), DATE_ADD(NOW(), INTERVAL 365 DAY), 'ACTIVE', 1, NOW(), NOW()),
(2, 12, 1, NOW(), DATE_ADD(NOW(), INTERVAL 365 DAY), 'ACTIVE', 1, NOW(), NOW());

-- 10. Themes & Site Configs
INSERT IGNORE INTO themes (id, name, theme_key, primary_color, secondary_color, font_heading, font_primary, is_active, is_default, is_dark_mode)
VALUES
(1, 'Warm Sunset', 'warm_sunset', '#EA580C', '#FB923C', 'Inter', 'Inter', 1, 1, 0),
(2, 'Ocean Blue', 'ocean_blue', '#0284C7', '#38BDF8', 'Poppins', 'Poppins', 1, 0, 0);

INSERT IGNORE INTO t_site_config (id, site_id, restaurant_id, site_name, page_slug, template_key, is_published, theme_id, menu_id, created_at, updated_at)
VALUES
(101, 'spiceroute_site', 11, 'Spice Route', 'spiceroute', 'modern_v2', 1, 1, 101, NOW(), NOW()),
(102, 'oceangrill_site', 12, 'Ocean Grill', 'oceangrill', 'luxury_v1', 1, 2, 102, NOW(), NOW());

-- 11. Orders for Branch 101
INSERT IGNORE INTO t_order_master (order_id, branch_id, table_id, customer_name, customer_phone, total_amount, status, payment_status, order_source, created_at)
VALUES
(101, 101, 101, 'Rahul Sharma', '9876543210', 580.00, 'PENDING', 'UNPAID', 'TABLE_QR', NOW()),
(102, 101, 102, 'Priya Nair', '9876543211', 650.00, 'PREPARING', 'UNPAID', 'TABLE_QR', DATE_SUB(NOW(), INTERVAL 30 MINUTE)),
(103, 101, 103, 'Amit Patel', '9876543212', 400.00, 'READY', 'UNPAID', 'TABLE_QR', DATE_SUB(NOW(), INTERVAL 1 HOUR)),
(104, 101, 104, 'Sneha Iyer', '9876543213', 820.00, 'COMPLETED', 'VERIFIED_BY_STAFF', 'TABLE_QR', DATE_SUB(NOW(), INTERVAL 2 HOUR)),
(105, 101, 101, 'Karan Mehta', '9876543214', 350.00, 'CANCELLED', 'UNPAID', 'COUNTER_QR', DATE_SUB(NOW(), INTERVAL 3 HOUR));

-- Order Items
INSERT IGNORE INTO t_order_items (order_itemid, order_id, food_id, quantity, unit_price, subtotal)
VALUES
(101, 101, 101, 1, 260.00, 260.00),
(102, 101, 102, 1, 320.00, 320.00),
(103, 102, 105, 1, 290.00, 290.00),
(104, 102, 106, 1, 360.00, 360.00),
(105, 103, 107, 1, 240.00, 240.00),
(106, 103, 103, 1, 150.00, 150.00);
