CREATE TABLE admins (
    username VARCHAR(25) PRIMARY KEY,
    password TEXT NOT NULL,
    email VARCHAR(40) NOT NULL CHECK (position('@' IN email) > 1),
    first_name VARCHAR(20) NOT NULL,
    secret_question VARCHAR(100) NOT NULL,
    secret_answer VARCHAR(100) NOT NULL
);

CREATE TABLE homepages (
    id SERIAL PRIMARY KEY,
    greeting VARCHAR(50) NOT NULL,
    message VARCHAR(200) NOT NULL
    -- image BYTEA NOT NULL
);

CREATE TABLE murals (
    id SERIAL PRIMARY KEY,
    title VARCHAR(50) NOT NULL,
    description VARCHAR(200) NOT NULL,
    price NUMERIC NOT NULL,
    -- photo_1_type TEXT,
    -- photo_1_name TEXT,
    -- photo_1_data BYTEA,
    -- photo_2_type TEXT,
    -- photo_2_name TEXT,
    -- photo_2_data BYTEA,
    -- photo_3_type TEXT,
    -- photo_3_name TEXT,
    -- photo_3_data BYTEA,
    is_archived BOOLEAN NOT NULL DEFAULT false
);

CREATE TABLE messages (
    id SERIAL PRIMARY KEY,
    email VARCHAR(40) NOT NULL,
    name VARCHAR(40) NOT NULL,
    message VARCHAR(200) NOT NULL,
    received TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    is_archived BOOLEAN NOT NULL DEFAULT false,
    is_deleted BOOLEAN NOT NULL DEFAULT false
);

CREATE TABLE igposts (
    ig_id TEXT PRIMARY KEY,
    caption VARCHAR(100) NOT NULL,
    perm_url VARCHAR(100) NOT NULL,
    image_url VARCHAR(100) NOT NULL
);

CREATE TABLE items (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    description VARCHAR(100) NOT NULL,
    price NUMERIC NOT NULL,
    -- photo_type TEXT NOT NULL,
    -- photo_name TEXT NOT NULL,
    -- photo_data BYTEA NOT NULL,
    quantity INTEGER NOT NULL,
    is_archived BOOLEAN NOT NULL DEFAULT false,
    is_sold BOOLEAN NOT NULL DEFAULT false,
    created TIMESTAMPTZ NOT NULL
);

CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    email VARCHAR(40) NOT NULL,
    name VARCHAR(40) NOT NULL,
    street VARCHAR(50) NOT NULL,
    unit VARCHAR(50),
    city VARCHAR(50) NOT NULL,
    state_code VARCHAR(2) NOT NULL,
    zipcode INTEGER CHECK (zipcode < 100000) NOT NULL,
    phone NUMERIC NOT NULL,
    transaction_id TEXT NOT NULL,
    status VARCHAR(10) NOT NULL DEFAULT 'Confirmed',
    amount NUMERIC NOT NULL,
    is_deleted BOOLEAN NOT NULL DEFAULT false
);

CREATE TABLE orders_items (
    id SERIAL PRIMARY KEY,
    order_id INTEGER REFERENCES orders ON DELETE CASCADE,
    item_id INTEGER REFERENCES items ON DELETE CASCADE
);
