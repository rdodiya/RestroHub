-- PHASE1 2.4: real baseline of the core tables, derived from the JPA entities (agent/Schema.md).
-- Safe on an existing database: every statement is IF NOT EXISTS, so tables Hibernate already
-- created are left untouched; on a fresh/prod database it creates them so ddl-auto=validate passes.
-- No foreign keys on purpose (V1 is a placeholder and existing tables may predate this file);
-- relations are plain BIGINT columns, tenant integrity is enforced in the application layer.
-- Column names follow the Spring naming strategy (isActive -> is_active).

CREATE TABLE IF NOT EXISTS t_restaurant_master (
    rest_id                 BIGSERIAL    PRIMARY KEY,
    name                    VARCHAR(255) NOT NULL,
    description             VARCHAR(255) NOT NULL,
    phone_number            VARCHAR(255),
    is_active               BOOLEAN,
    service_request_enabled BOOLEAN,
    created_at              TIMESTAMP,
    updated_date            TIMESTAMP
);

CREATE TABLE IF NOT EXISTS t_address_master (
    address_id    BIGSERIAL    PRIMARY KEY,
    city          VARCHAR(255) NOT NULL,
    state         VARCHAR(255) NOT NULL,
    country       VARCHAR(255) NOT NULL,
    postal_code   VARCHAR(255) NOT NULL,
    address_line1 VARCHAR(255) NOT NULL,
    address_line2 VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS t_branch_master (
    branch_id     BIGSERIAL    PRIMARY KEY,
    name          VARCHAR(255) NOT NULL,
    description   VARCHAR(255),
    is_delete     BOOLEAN,
    branch_upi_id VARCHAR(255),
    rest_id       BIGINT       NOT NULL,
    address_id    BIGINT       NOT NULL,
    menu_id       BIGINT,
    created_date  TIMESTAMP,
    updated_date  TIMESTAMP
);

CREATE TABLE IF NOT EXISTS t_table_master (
    table_id     BIGSERIAL   PRIMARY KEY,
    branch_id    BIGINT      NOT NULL,
    table_number INTEGER     NOT NULL,
    capacity     INTEGER     NOT NULL DEFAULT 4,
    status       VARCHAR(20) NOT NULL DEFAULT 'available',
    qr_code_url  VARCHAR(255),
    is_active    BOOLEAN,
    created_date TIMESTAMP,
    updated_date TIMESTAMP
);

CREATE TABLE IF NOT EXISTS t_usr_master (
    user_id       BIGSERIAL    PRIMARY KEY,
    user_name     VARCHAR(255) NOT NULL,
    user_email    VARCHAR(255) NOT NULL UNIQUE,
    user_password VARCHAR(255) NOT NULL,
    phone_number  VARCHAR(255),
    is_active     BOOLEAN      NOT NULL DEFAULT FALSE,
    is_locked     BOOLEAN      NOT NULL DEFAULT FALSE,
    google_sub    VARCHAR(255) UNIQUE,
    auth_provider VARCHAR(255),
    user_profile  BYTEA,
    date_of_birth VARCHAR(255),
    gender        VARCHAR(255),
    address       VARCHAR(255),
    city          VARCHAR(255),
    state         VARCHAR(255),
    pincode       VARCHAR(255),
    bio           VARCHAR(500),
    created_at    TIMESTAMP,
    updated_date  TIMESTAMP
);

CREATE TABLE IF NOT EXISTS t_role_master (
    role_id   BIGSERIAL    PRIMARY KEY,
    role_name VARCHAR(255) NOT NULL UNIQUE,
    role_desc VARCHAR(255),
    is_active BOOLEAN
);

CREATE TABLE IF NOT EXISTS user_role_restaurant (
    id            BIGSERIAL PRIMARY KEY,
    user_id       BIGINT    NOT NULL,
    role_id       BIGINT    NOT NULL,
    restaurant_id BIGINT    NOT NULL,
    UNIQUE (user_id, role_id, restaurant_id)
);

CREATE TABLE IF NOT EXISTS t_password_reset_token (
    id                 BIGSERIAL   PRIMARY KEY,
    otp_code           VARCHAR(10) NOT NULL,
    token              VARCHAR(100),
    reset_token        VARCHAR(100),
    user_id            BIGINT      NOT NULL,
    expiry_date        TIMESTAMP   NOT NULL,
    is_otp_verified    BOOLEAN,
    is_reset_completed BOOLEAN,
    failed_attempts    INTEGER,
    created_at         TIMESTAMP
);

CREATE TABLE IF NOT EXISTS t_menu_master (
    menu_id      BIGSERIAL    PRIMARY KEY,
    menu_name    VARCHAR(255) NOT NULL,
    menu_desc    VARCHAR(255),
    is_deleted   BOOLEAN      NOT NULL DEFAULT FALSE,
    start_date   DATE,
    end_date     DATE,
    day_of_week  VARCHAR(100),
    branch_id    BIGINT,
    created_date DATE,
    updated_date DATE
);

CREATE TABLE IF NOT EXISTS t_category_master (
    category_id  BIGSERIAL    PRIMARY KEY,
    name         VARCHAR(255) NOT NULL,
    description  VARCHAR(255),
    is_delete    BOOLEAN,
    updated_date TIMESTAMP
);

CREATE TABLE IF NOT EXISTS t_rel_menu_cat (
    menu_id     BIGINT NOT NULL,
    category_id BIGINT NOT NULL,
    PRIMARY KEY (menu_id, category_id)
);

CREATE TABLE IF NOT EXISTS t_food_master (
    food_id      BIGSERIAL      PRIMARY KEY,
    name         VARCHAR(255)   NOT NULL,
    description  VARCHAR(255),
    price        NUMERIC(10, 2) NOT NULL,
    image_url    VARCHAR(255),
    is_available BOOLEAN        NOT NULL DEFAULT TRUE,
    is_veg       BOOLEAN,
    is_delete    BOOLEAN,
    category_id  BIGINT         NOT NULL,
    date_created TIMESTAMP,
    updated_date TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_food_name      ON t_food_master (name);
CREATE INDEX IF NOT EXISTS idx_food_available ON t_food_master (is_available);
CREATE INDEX IF NOT EXISTS idx_food_category  ON t_food_master (category_id);

CREATE TABLE IF NOT EXISTS t_order_master (
    order_id             BIGSERIAL      PRIMARY KEY,
    branch_id            BIGINT         NOT NULL,
    table_id             BIGINT         NOT NULL,
    created_at           TIMESTAMP,
    total_amount         NUMERIC(19, 2),
    status               VARCHAR(255),
    customer_name        VARCHAR(255),
    customer_phone       VARCHAR(255),
    special_instructions VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS t_order_items (
    order_itemid    BIGSERIAL      PRIMARY KEY,
    order_id        BIGINT         NOT NULL,
    food_id         BIGINT         NOT NULL,
    quantity        INTEGER        NOT NULL,
    unit_price      NUMERIC(19, 2),
    subtotal        NUMERIC(19, 2),
    special_request VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS payment_verification (
    id             BIGSERIAL    PRIMARY KEY,
    payment_id     VARCHAR(255) NOT NULL UNIQUE,
    order_id       BIGINT       UNIQUE,
    amount         NUMERIC(19, 2),
    verified       VARCHAR(255) NOT NULL,
    transaction_id VARCHAR(255) UNIQUE
);

CREATE TABLE IF NOT EXISTS t_upi_links (
    id                 BIGSERIAL     PRIMARY KEY,
    branch_id          BIGINT        NOT NULL,
    name               VARCHAR(100)  NOT NULL,
    upi_id             VARCHAR(100)  NOT NULL,
    is_default         BOOLEAN,
    is_active          BOOLEAN,
    transactions_count INTEGER,
    total_revenue      NUMERIC(12, 2),
    created_date       TIMESTAMP,
    updated_date       TIMESTAMP
);

CREATE TABLE IF NOT EXISTS t_service_request (
    request_id    BIGSERIAL    PRIMARY KEY,
    restaurant_id BIGINT       NOT NULL,
    branch_id     BIGINT       NOT NULL,
    table_number  INTEGER      NOT NULL,
    request_type  VARCHAR(255) NOT NULL,
    status        VARCHAR(255),
    created_at    TIMESTAMP,
    resolved_at   TIMESTAMP
);

CREATE TABLE IF NOT EXISTS t_subscription_plan (
    id            BIGSERIAL        PRIMARY KEY,
    name          VARCHAR(255)     NOT NULL UNIQUE,
    description   VARCHAR(255),
    price         DOUBLE PRECISION NOT NULL,
    billing_cycle VARCHAR(255),
    is_active     BOOLEAN,
    created_at    TIMESTAMP,
    updated_at    TIMESTAMP
);

CREATE TABLE IF NOT EXISTS t_subscription_feature (
    id           BIGSERIAL    PRIMARY KEY,
    feature_key  VARCHAR(255) NOT NULL UNIQUE,
    display_name VARCHAR(255),
    description  VARCHAR(255),
    is_active    BOOLEAN
);

CREATE TABLE IF NOT EXISTS t_plan_feature_mapping (
    id            BIGSERIAL    PRIMARY KEY,
    plan_id       BIGINT       NOT NULL,
    feature_id    BIGINT       NOT NULL,
    feature_value VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS t_restaurant_subscription (
    id            BIGSERIAL    PRIMARY KEY,
    restaurant_id BIGINT       NOT NULL,
    plan_id       BIGINT       NOT NULL,
    start_date    TIMESTAMP    NOT NULL,
    end_date      TIMESTAMP    NOT NULL,
    status        VARCHAR(255) NOT NULL,
    is_auto_renew BOOLEAN,
    created_at    TIMESTAMP,
    updated_at    TIMESTAMP
);

CREATE TABLE IF NOT EXISTS themes (
    id                   BIGSERIAL    PRIMARY KEY,
    name                 VARCHAR(255) NOT NULL,
    theme_key            VARCHAR(255) NOT NULL UNIQUE,
    description          VARCHAR(500),
    primary_color        VARCHAR(20)  NOT NULL,
    color_primary_hover  VARCHAR(20),
    color_primary_dark   VARCHAR(20),
    secondary_color      VARCHAR(20),
    color_accent         VARCHAR(20),
    bg_primary           VARCHAR(20),
    bg_secondary         VARCHAR(20),
    bg_tertiary          VARCHAR(20),
    primary_text_color   VARCHAR(20),
    secondary_text_color VARCHAR(20),
    text_muted           VARCHAR(20),
    header_bg            VARCHAR(20),
    footer_bg            VARCHAR(20),
    button_bg            VARCHAR(20),
    button_text          VARCHAR(20),
    border_color         VARCHAR(20),
    font_primary         VARCHAR(100),
    font_heading         VARCHAR(100),
    font_size_base       VARCHAR(20),
    custom_styles        TEXT,
    is_active            BOOLEAN,
    is_default           BOOLEAN,
    is_dark_mode         BOOLEAN,
    created_at           TIMESTAMP,
    updated_at           TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_theme_key ON themes (theme_key);

CREATE TABLE IF NOT EXISTS t_site_config (
    id            BIGSERIAL    PRIMARY KEY,
    site_id       VARCHAR(100) NOT NULL UNIQUE,
    restaurant_id BIGINT       NOT NULL,
    site_name     VARCHAR(150),
    page_slug     VARCHAR(150) UNIQUE,
    template_key  VARCHAR(100) NOT NULL,
    theme_id      BIGINT,
    menu_id       BIGINT,
    is_published  BOOLEAN,
    created_at    TIMESTAMP,
    updated_at    TIMESTAMP
);

CREATE TABLE IF NOT EXISTS t_section_master (
    id             BIGSERIAL   PRIMARY KEY,
    section_key    VARCHAR(50) NOT NULL,
    display_order  INTEGER     NOT NULL,
    is_visible     BOOLEAN,
    content        JSONB,
    styles         JSONB,
    site_config_id BIGINT      NOT NULL,
    created_at     TIMESTAMP,
    updated_at     TIMESTAMP
);
