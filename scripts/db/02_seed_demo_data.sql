-- =============================================================================
-- Restroly — 02_seed_demo_data.sql  (LOCAL / DEV ONLY — never run against production)
-- =============================================================================
-- Demo data for every feature table, for the two tenants created by 01_seed_users.sql:
--   Spice Route (A) — 2 branches (Andheri, Bandra), Pro plan, published "modern" site
--   Ocean Grill (B) — 1 branch (Panjim), Free plan, published "classic" site
-- Covers: addresses, branches, menus, categories, foods, menu↔category links, tables,
-- UPI links, orders + items (every status, last 14 days), payment verifications,
-- service requests, subscription features/plans/mappings/assignments, themes,
-- site configs and website sections.
--
-- Run AFTER 01_seed_users.sql:
--   psql -U postgres -d RestroHub_DB -f scripts/db/02_seed_demo_data.sql
-- Safe to re-run: every block skips rows that already exist (matched by name/key),
-- and orders are only generated for a branch that has none yet.
-- =============================================================================

DO $$
DECLARE
    v_rest_a  BIGINT;
    v_rest_b  BIGINT;
    v_branch  RECORD;
    v_addr_id BIGINT;
    v_br_id   BIGINT;
    v_menu_id BIGINT;
    v_cat     RECORD;
    v_cat_id  BIGINT;
    v_food    RECORD;
    v_table   BIGINT;
    v_order   BIGINT;
    v_status  TEXT;
    v_total   NUMERIC(10,2);
    v_plan_free BIGINT;
    v_plan_pro  BIGINT;
    v_theme_id  BIGINT;
    v_site_id   BIGINT;
    i INT;
    j INT;
    v_statuses TEXT[] := ARRAY['PENDING','PREPARING','READY','BILLED','BILLED','BILLED','CANCELLED','SERVED','COMPLETED','CONFIRMED'];
    v_names    TEXT[] := ARRAY['Rahul Sharma','Priya Nair','Amit Patel','Sneha Iyer','Vikram Rao','Anjali Gupta','Karan Mehta','Divya Menon','Arjun Singh','Neha Joshi'];
BEGIN
    SELECT rest_id INTO v_rest_a FROM t_restaurant_master WHERE name = 'Spice Route' ORDER BY rest_id LIMIT 1;
    SELECT rest_id INTO v_rest_b FROM t_restaurant_master WHERE name = 'Ocean Grill' ORDER BY rest_id LIMIT 1;
    IF v_rest_a IS NULL OR v_rest_b IS NULL THEN
        RAISE EXCEPTION 'Run scripts/db/01_seed_users.sql first (restaurants Spice Route / Ocean Grill missing)';
    END IF;

    -- -------------------------------------------------------------------------
    -- 1. Categories (global table — no tenant owner yet, see PRD §8 item 7)
    -- -------------------------------------------------------------------------
    INSERT INTO t_category_master (name, description, is_delete, updated_date)
    SELECT v.name, v.description, FALSE, NOW()
    FROM (VALUES
        ('Starters',          'Spice Route — tandoor & chaat'),
        ('Main Course',       'Spice Route — curries & gravies'),
        ('Breads & Rice',     'Spice Route — naan, roti, biryani'),
        ('Beverages',         'Spice Route — lassi, chai, coolers'),
        ('Desserts',          'Spice Route — Indian sweets'),
        ('Seafood Starters',  'Ocean Grill — fried & grilled'),
        ('Goan Curries',      'Ocean Grill — xacuti, cafreal, curry rice'),
        ('Ocean Coolers',     'Ocean Grill — sol kadhi, fresh juices')
    ) AS v(name, description)
    WHERE NOT EXISTS (SELECT 1 FROM t_category_master c WHERE c.name = v.name);

    -- -------------------------------------------------------------------------
    -- 2. Foods (prices in INR, NUMERIC)
    -- -------------------------------------------------------------------------
    INSERT INTO t_food_master (name, description, price, image_url, is_available, is_veg, is_delete, date_created, updated_date, category_id)
    SELECT v.name, v.description, v.price, NULL, v.available, v.veg, FALSE, NOW(), NOW(), c.category_id
    FROM (VALUES
        ('Starters',         'Paneer Tikka',          'Cottage cheese, tandoor-roasted',      260.00, TRUE,  TRUE),
        ('Starters',         'Chicken Tikka',         'Boneless chicken, yoghurt marinade',   320.00, FALSE, TRUE),
        ('Starters',         'Dahi Puri',             'Crisp puris, sweet curd, chutneys',    150.00, TRUE,  TRUE),
        ('Starters',         'Hara Bhara Kebab',      'Spinach & pea patties',                210.00, TRUE,  FALSE),
        ('Main Course',      'Paneer Butter Masala',  'Rich tomato-butter gravy',             290.00, TRUE,  TRUE),
        ('Main Course',      'Butter Chicken',        'Classic murgh makhani',                360.00, FALSE, TRUE),
        ('Main Course',      'Dal Makhani',           'Slow-cooked black lentils',            240.00, TRUE,  TRUE),
        ('Main Course',      'Mutton Rogan Josh',     'Kashmiri lamb curry',                  420.00, FALSE, TRUE),
        ('Breads & Rice',    'Butter Naan',           'Tandoor flatbread',                     60.00, TRUE,  TRUE),
        ('Breads & Rice',    'Garlic Naan',           'Naan with garlic & coriander',          75.00, TRUE,  TRUE),
        ('Breads & Rice',    'Veg Biryani',           'Dum-cooked basmati, vegetables',       260.00, TRUE,  TRUE),
        ('Breads & Rice',    'Chicken Biryani',       'Hyderabadi dum biryani',               340.00, FALSE, TRUE),
        ('Beverages',        'Sweet Lassi',           'Chilled yoghurt drink',                 90.00, TRUE,  TRUE),
        ('Beverages',        'Masala Chai',           'Spiced Indian tea',                     40.00, TRUE,  TRUE),
        ('Beverages',        'Fresh Lime Soda',       'Sweet or salted',                       80.00, TRUE,  TRUE),
        ('Desserts',         'Gulab Jamun',           'Two pieces, warm',                     110.00, TRUE,  TRUE),
        ('Desserts',         'Rasmalai',              'Saffron milk dumplings',               130.00, TRUE,  TRUE),
        ('Seafood Starters', 'Prawn Rava Fry',        'Semolina-crusted prawns',              380.00, FALSE, TRUE),
        ('Seafood Starters', 'Calamari Rings',        'Crispy squid, garlic aioli',           340.00, FALSE, TRUE),
        ('Seafood Starters', 'Recheado Pomfret',      'Whole pomfret, recheado masala',       520.00, FALSE, FALSE),
        ('Goan Curries',     'Fish Curry Rice',       'Kingfish curry with rice',             360.00, FALSE, TRUE),
        ('Goan Curries',     'Chicken Xacuti',        'Roasted coconut & spice gravy',        340.00, FALSE, TRUE),
        ('Goan Curries',     'Mushroom Cafreal',      'Green masala mushrooms',               280.00, TRUE,  TRUE),
        ('Ocean Coolers',    'Sol Kadhi',             'Kokum & coconut milk',                  90.00, TRUE,  TRUE),
        ('Ocean Coolers',    'Watermelon Juice',      'Fresh, no sugar',                      110.00, TRUE,  TRUE)
    ) AS v(category, name, description, price, veg, available)
    JOIN t_category_master c ON c.name = v.category
    WHERE NOT EXISTS (SELECT 1 FROM t_food_master f WHERE f.name = v.name AND f.category_id = c.category_id);

    -- -------------------------------------------------------------------------
    -- 3. Branches (address → branch → menu → branch.menu_id), menu↔category, tables, UPI
    -- -------------------------------------------------------------------------
    FOR v_branch IN SELECT * FROM (VALUES
        (v_rest_a, 'Spice Route - Andheri', 'Flagship, 60 covers',      '12 Link Road, Andheri West', 'Mumbai', 'Maharashtra', '400053', 'Andheri All-Day Menu',
            ARRAY['Starters','Main Course','Breads & Rice','Beverages','Desserts'], 'spiceroute.andheri@okaxis', 6),
        (v_rest_a, 'Spice Route - Bandra',  'Express outlet, 30 covers', '45 Hill Road, Bandra West',  'Mumbai', 'Maharashtra', '400050', 'Bandra Express Menu',
            ARRAY['Starters','Main Course','Beverages'],                          'spiceroute.bandra@okicici', 4),
        (v_rest_b, 'Ocean Grill - Panjim',  'Riverside seafood grill',  '8 Campal Promenade',         'Panaji', 'Goa',         '403001', 'Ocean Grill Menu',
            ARRAY['Seafood Starters','Goan Curries','Ocean Coolers'],             'oceangrill.panjim@oksbi', 5)
    ) AS b(rest_id, name, description, line1, city, state, pin, menu_name, categories, upi, table_count)
    LOOP
        SELECT branch_id INTO v_br_id FROM t_branch_master WHERE rest_id = v_branch.rest_id AND name = v_branch.name;
        IF v_br_id IS NULL THEN
            INSERT INTO t_address_master (address_line1, address_line2, city, state, country, postal_code)
            VALUES (v_branch.line1, NULL, v_branch.city, v_branch.state, 'India', v_branch.pin)
            RETURNING address_id INTO v_addr_id;

            INSERT INTO t_branch_master (name, description, is_delete, created_date, updated_date, rest_id, address_id, branch_upi_id)
            VALUES (v_branch.name, v_branch.description, FALSE, NOW(), NOW(), v_branch.rest_id, v_addr_id, v_branch.upi)
            RETURNING branch_id INTO v_br_id;
        END IF;

        -- Menu (one per branch: t_menu_master.branch_id and t_branch_master.menu_id are both unique)
        SELECT menu_id INTO v_menu_id FROM t_menu_master WHERE branch_id = v_br_id;
        IF v_menu_id IS NULL THEN
            INSERT INTO t_menu_master (menu_name, menu_desc, is_deleted, created_date, updated_date, start_date, end_date, day_of_week, branch_id)
            VALUES (v_branch.menu_name, 'Demo menu for ' || v_branch.name, FALSE, CURRENT_DATE, CURRENT_DATE,
                    CURRENT_DATE - 30, CURRENT_DATE + 335, 'ALL', v_br_id)
            RETURNING menu_id INTO v_menu_id;
        END IF;
        UPDATE t_branch_master SET menu_id = v_menu_id WHERE branch_id = v_br_id AND menu_id IS DISTINCT FROM v_menu_id;

        INSERT INTO t_rel_menu_cat (menu_id, category_id)
        SELECT v_menu_id, c.category_id FROM t_category_master c
        WHERE c.name = ANY (v_branch.categories)
          AND NOT EXISTS (SELECT 1 FROM t_rel_menu_cat mc WHERE mc.menu_id = v_menu_id AND mc.category_id = c.category_id);

        -- Tables 1..N (mix of statuses)
        INSERT INTO t_table_master (table_number, capacity, status, qr_code_url, is_active, created_date, updated_date, branch_id)
        SELECT n, CASE WHEN n % 3 = 0 THEN 6 WHEN n % 2 = 0 THEN 4 ELSE 2 END,
               CASE WHEN n = 2 THEN 'occupied' WHEN n = 3 THEN 'reserved' ELSE 'available' END,
               NULL, TRUE, NOW(), NOW(), v_br_id
        FROM generate_series(1, v_branch.table_count) AS n
        WHERE NOT EXISTS (SELECT 1 FROM t_table_master t WHERE t.branch_id = v_br_id AND t.table_number = n);

        -- UPI links: one default (matches branch_upi_id) + one spare
        INSERT INTO t_upi_links (name, upi_id, is_default, is_active, transactions_count, total_revenue, created_date, updated_date, branch_id)
        SELECT v.name, v.upi, v.is_default, TRUE, 0, 0, NOW(), NOW(), v_br_id
        FROM (VALUES ('Primary counter', v_branch.upi, TRUE),
                     ('Backup (owner)',  replace(v_branch.upi, '@', '.owner@'), FALSE)) AS v(name, upi, is_default)
        WHERE NOT EXISTS (SELECT 1 FROM t_upi_links u WHERE u.branch_id = v_br_id AND u.upi_id = v.upi);
        UPDATE t_branch_master SET branch_upi_id = v_branch.upi WHERE branch_id = v_br_id;

        -- Orders: 10 per branch over the last 14 days, every status; totals computed from items
        IF NOT EXISTS (SELECT 1 FROM t_order_master o WHERE o.branch_id = v_br_id) THEN
            FOR i IN 1..10 LOOP
                v_status := v_statuses[i];
                SELECT table_id INTO v_table FROM t_table_master
                WHERE branch_id = v_br_id ORDER BY table_number OFFSET ((i - 1) % v_branch.table_count) LIMIT 1;

                INSERT INTO t_order_master (created_at, customer_name, customer_phone, special_instructions, status, total_amount, branch_id, table_id)
                VALUES (NOW() - ((i - 1) * INTERVAL '33 hours') - (i * INTERVAL '7 minutes'),
                        v_names[i], '98' || lpad((10000000 + v_br_id * 100 + i)::TEXT, 8, '0'),
                        CASE WHEN i % 4 = 0 THEN 'Less spicy please' END,
                        v_status, 0, v_br_id, v_table)
                RETURNING order_id INTO v_order;

                -- 2-3 items from this branch's menu
                j := 0;
                FOR v_food IN
                    SELECT f.food_id, f.price FROM t_food_master f
                    JOIN t_rel_menu_cat mc ON mc.category_id = f.category_id AND mc.menu_id = v_menu_id
                    WHERE f.is_delete = FALSE
                    ORDER BY (f.food_id * 7 + i * 13) % 97
                    LIMIT 2 + (i % 2)
                LOOP
                    j := j + 1;
                    INSERT INTO t_order_items (quantity, unit_price, subtotal, special_request, food_id, order_id)
                    VALUES (j, v_food.price, v_food.price * j, NULL, v_food.food_id, v_order);
                END LOOP;

                SELECT COALESCE(SUM(subtotal), 0) INTO v_total FROM t_order_items WHERE order_id = v_order;
                UPDATE t_order_master SET total_amount = v_total WHERE order_id = v_order;

                -- Billed orders get a recorded UPI payment
                IF v_status = 'BILLED' THEN
                    INSERT INTO payment_verification (payment_id, order_id, amount, verified, transaction_id)
                    VALUES ('PAY-' || v_order, v_order, v_total, 'SUCCESS', 'UPI' || lpad(v_order::TEXT, 10, '0'))
                    ON CONFLICT DO NOTHING;
                    UPDATE t_upi_links SET transactions_count = transactions_count + 1,
                                           total_revenue = total_revenue + v_total
                    WHERE branch_id = v_br_id AND is_default = TRUE;
                END IF;
            END LOOP;
        END IF;

        -- Service requests (waiter call pending, bill request acknowledged)
        INSERT INTO t_service_request (restaurant_id, branch_id, table_number, request_type, status, created_at, resolved_at)
        SELECT v_branch.rest_id, v_br_id, v.table_no, v.req_type, v.status, NOW() - v.age, v.resolved
        FROM (VALUES (1, 'CALL_WAITER',  'PENDING',      INTERVAL '3 minutes',  NULL::TIMESTAMP),
                     (2, 'REQUEST_BILL', 'ACKNOWLEDGED', INTERVAL '12 minutes', NULL::TIMESTAMP),
                     (3, 'CALL_WAITER',  'COMPLETED',    INTERVAL '2 hours',    NOW() - INTERVAL '110 minutes')) AS v(table_no, req_type, status, age, resolved)
        WHERE NOT EXISTS (SELECT 1 FROM t_service_request s
                          WHERE s.branch_id = v_br_id AND s.table_number = v.table_no AND s.request_type = v.req_type);
    END LOOP;

    -- -------------------------------------------------------------------------
    -- 4. Subscriptions: feature catalogue, plans, mappings, assignments
    -- -------------------------------------------------------------------------
    INSERT INTO t_subscription_feature (feature_key, display_name, description, is_active)
    SELECT v.k, v.n, v.d, TRUE FROM (VALUES
        ('WHATSAPP_NOTIFICATIONS',   'WhatsApp notifications',  'Order confirmations & status updates on WhatsApp'),
        ('KDS_ACCESS',               'Kitchen Display System',  'Live kitchen order board'),
        ('MULTI_BRANCH',             'Multiple branches',       'Max number of branches'),
        ('EXCEL_IMPORT_EXPORT',      'Excel import/export',     'Bulk menu upload and export'),
        ('CUSTOM_WEBSITE_TEMPLATES', 'Website templates',       'Number of website templates available'),
        ('ADVANCED_ANALYTICS',       'Advanced analytics',      'Dashboard charts and reports')
    ) AS v(k, n, d)
    WHERE NOT EXISTS (SELECT 1 FROM t_subscription_feature f WHERE f.feature_key = v.k);

    INSERT INTO t_subscription_plan (name, description, price, billing_cycle, is_active, created_at, updated_at)
    SELECT v.n, v.d, v.p, 'MONTHLY', TRUE, NOW(), NOW() FROM (VALUES
        ('Free', 'Starter plan: 1 branch, 2 templates', 0.0::DOUBLE PRECISION),
        ('Pro',  'Growing restaurants: multi-branch, KDS, WhatsApp', 999.0::DOUBLE PRECISION)
    ) AS v(n, d, p)
    WHERE NOT EXISTS (SELECT 1 FROM t_subscription_plan sp WHERE sp.name = v.n);

    SELECT id INTO v_plan_free FROM t_subscription_plan WHERE name = 'Free';
    SELECT id INTO v_plan_pro  FROM t_subscription_plan WHERE name = 'Pro';

    INSERT INTO t_plan_feature_mapping (plan_id, feature_id, feature_value)
    SELECT p.id, f.id, v.val
    FROM (VALUES
        ('Free', 'WHATSAPP_NOTIFICATIONS', 'false'), ('Free', 'KDS_ACCESS', 'false'),
        ('Free', 'MULTI_BRANCH', '1'),               ('Free', 'EXCEL_IMPORT_EXPORT', 'false'),
        ('Free', 'CUSTOM_WEBSITE_TEMPLATES', '2'),   ('Free', 'ADVANCED_ANALYTICS', 'false'),
        ('Pro',  'WHATSAPP_NOTIFICATIONS', 'true'),  ('Pro',  'KDS_ACCESS', 'true'),
        ('Pro',  'MULTI_BRANCH', '5'),               ('Pro',  'EXCEL_IMPORT_EXPORT', 'true'),
        ('Pro',  'CUSTOM_WEBSITE_TEMPLATES', 'ALL'), ('Pro',  'ADVANCED_ANALYTICS', 'true')
    ) AS v(plan, feature, val)
    JOIN t_subscription_plan p ON p.name = v.plan
    JOIN t_subscription_feature f ON f.feature_key = v.feature
    WHERE NOT EXISTS (SELECT 1 FROM t_plan_feature_mapping m WHERE m.plan_id = p.id AND m.feature_id = f.id);

    INSERT INTO t_restaurant_subscription (restaurant_id, plan_id, start_date, end_date, status, is_auto_renew, created_at, updated_at)
    SELECT v.rest_id, v.plan_id, NOW() - INTERVAL '10 days', NOW() + INTERVAL '20 days', 'ACTIVE', TRUE, NOW(), NOW()
    FROM (VALUES (v_rest_a, v_plan_pro), (v_rest_b, v_plan_free)) AS v(rest_id, plan_id)
    WHERE NOT EXISTS (SELECT 1 FROM t_restaurant_subscription s WHERE s.restaurant_id = v.rest_id AND s.status = 'ACTIVE');

    -- -------------------------------------------------------------------------
    -- 5. Website: themes (one per site — t_site_config.theme_id is unique), sites, sections
    -- -------------------------------------------------------------------------
    INSERT INTO themes (name, theme_key, description, primary_color, color_primary_hover, color_primary_dark, secondary_color,
                        color_accent, bg_primary, bg_secondary, bg_tertiary, primary_text_color, secondary_text_color, text_muted,
                        header_bg, footer_bg, button_bg, button_text, border_color, font_primary, font_heading, font_size_base,
                        is_active, is_default, is_dark_mode, created_at, updated_at)
    SELECT v.* , NOW(), NOW() FROM (VALUES
        ('Saffron Light', 'SAFFRON_LIGHT', 'Warm saffron accents on light background',
         '#f59e0b', '#fbbf24', '#d97706', '#b45309', '#f97316', '#ffffff', '#fff7ed', '#ffedd5',
         '#1f2937', '#4b5563', '#9ca3af', '#ffffff', '#1f2937', '#f59e0b', '#ffffff', '#fde68a',
         'Inter, sans-serif', 'Playfair Display, serif', '16px', TRUE, TRUE, FALSE),
        ('Ocean Blue Dark', 'OCEAN_BLUE_DARK', 'Default dark theme with ocean blue accents',
         '#3b82f6', '#60a5fa', '#2563eb', '#2563eb', '#3b82f6', '#0a0a0a', '#111111', '#1a1a1a',
         '#ffffff', '#9ca3af', '#6b7280', '#0a0a0a', '#0a0a0a', '#3b82f6', '#ffffff', '#374151',
         'Inter, sans-serif', 'Playfair Display, serif', '16px', TRUE, FALSE, TRUE)
    ) AS v
    WHERE NOT EXISTS (SELECT 1 FROM themes t WHERE t.theme_key = v.column2);

    FOR v_branch IN SELECT * FROM (VALUES
        (v_rest_a, 'spice-route', 'Spice Route', 'modern',  'SAFFRON_LIGHT',   'Spice Route - Andheri',
         'Authentic North Indian since 2009', 'Tandoor, curries and biryanis cooked the slow way.'),
        (v_rest_b, 'ocean-grill', 'Ocean Grill', 'classic', 'OCEAN_BLUE_DARK', 'Ocean Grill - Panjim',
         'Fresh Goan catch, grilled to order', 'Family-run seafood grill on the Mandovi riverfront.')
    ) AS s(rest_id, site_key, site_name, template, theme_key, branch_name, hero_title, about_text)
    LOOP
        SELECT id INTO v_site_id FROM t_site_config WHERE site_id = v_branch.site_key;
        IF v_site_id IS NULL THEN
            SELECT id INTO v_theme_id FROM themes WHERE theme_key = v_branch.theme_key;
            SELECT m.menu_id INTO v_menu_id FROM t_menu_master m
            JOIN t_branch_master b ON b.branch_id = m.branch_id WHERE b.name = v_branch.branch_name;

            INSERT INTO t_site_config (site_id, restaurant_id, site_name, page_slug, template_key, theme_id, menu_id, is_published, created_at, updated_at)
            VALUES (v_branch.site_key, v_branch.rest_id, v_branch.site_name, v_branch.site_key, v_branch.template,
                    v_theme_id, v_menu_id, TRUE, NOW(), NOW())
            RETURNING id INTO v_site_id;

            INSERT INTO t_section_master (section_key, display_order, is_visible, content, styles, site_config_id, created_at, updated_at)
            VALUES
              ('NAVIGATION', 1, TRUE, jsonb_build_object('brandName', v_branch.site_name,
                    'links', jsonb_build_array('Home', 'Menu', 'About', 'Contact')), '{}'::jsonb, v_site_id, NOW(), NOW()),
              ('HERO',       2, TRUE, jsonb_build_object('title', v_branch.hero_title,
                    'ctaPrimary', 'View Menu', 'ctaSecondary', 'Book a Table'), '{}'::jsonb, v_site_id, NOW(), NOW()),
              ('ABOUT',      3, TRUE, jsonb_build_object('title', 'About ' || v_branch.site_name,
                    'description', v_branch.about_text), '{}'::jsonb, v_site_id, NOW(), NOW()),
              ('FOOTER',     4, TRUE, jsonb_build_object('copyright', '© ' || v_branch.site_name), '{}'::jsonb, v_site_id, NOW(), NOW());
        END IF;
    END LOOP;

    RAISE NOTICE 'Demo data ready (Spice Route id=%, Ocean Grill id=%)', v_rest_a, v_rest_b;
END $$;

-- -----------------------------------------------------------------------------
-- Check: what each tenant now has
-- -----------------------------------------------------------------------------
SELECT r.name AS restaurant,
       b.branch_id, b.name AS branch, b.menu_id, b.branch_upi_id,
       (SELECT COUNT(*) FROM t_table_master t WHERE t.branch_id = b.branch_id)  AS tables,
       (SELECT COUNT(*) FROM t_rel_menu_cat mc WHERE mc.menu_id = b.menu_id)    AS categories,
       (SELECT COUNT(*) FROM t_food_master f JOIN t_rel_menu_cat mc ON mc.category_id = f.category_id
         WHERE mc.menu_id = b.menu_id)                                          AS foods,
       (SELECT COUNT(*) FROM t_order_master o WHERE o.branch_id = b.branch_id)  AS orders,
       (SELECT COUNT(*) FROM t_service_request s WHERE s.branch_id = b.branch_id) AS service_requests
FROM t_branch_master b JOIN t_restaurant_master r ON r.rest_id = b.rest_id
WHERE r.name IN ('Spice Route', 'Ocean Grill')
ORDER BY r.name, b.name;

SELECT r.name AS restaurant, p.name AS plan, s.status, s.end_date::DATE AS ends,
       sc.site_id, sc.template_key, t.theme_key,
       (SELECT COUNT(*) FROM t_section_master sm WHERE sm.site_config_id = sc.id) AS sections
FROM t_restaurant_master r
LEFT JOIN t_restaurant_subscription s ON s.restaurant_id = r.rest_id AND s.status = 'ACTIVE'
LEFT JOIN t_subscription_plan p ON p.id = s.plan_id
LEFT JOIN t_site_config sc ON sc.restaurant_id = r.rest_id
LEFT JOIN themes t ON t.id = sc.theme_id
WHERE r.name IN ('Spice Route', 'Ocean Grill')
ORDER BY r.name;
