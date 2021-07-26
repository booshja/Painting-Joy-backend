CREATE EXTENSION IF NOT EXISTS pgcrypto;

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
    message VARCHAR(200) NOT NULL,
    image BYTEA DEFAULT NULL
);

CREATE TABLE murals (
    id SERIAL PRIMARY KEY,
    title VARCHAR(50) NOT NULL,
    description VARCHAR(200) NOT NULL,
    image1 BYTEA DEFAULT NULL,
    image2 BYTEA DEFAULT NULL,
    image3 BYTEA DEFAULT NULL,
    is_archived BOOLEAN NOT NULL DEFAULT false
);

CREATE TABLE messages (
    id SERIAL PRIMARY KEY,
    email VARCHAR(40) NOT NULL,
    name VARCHAR(40) NOT NULL,
    message VARCHAR(200) NOT NULL,
    received TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    is_archived BOOLEAN NOT NULL DEFAULT false
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
    shipping NUMERIC NOT NULL,
    quantity INTEGER NOT NULL,
    is_sold BOOLEAN NOT NULL DEFAULT false,
    created TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    image BYTEA DEFAULT NULL
);

CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    name BYTEA NOT NULL,
    email BYTEA NOT NULL,
    street BYTEA NOT NULL,
    unit BYTEA,
    city BYTEA NOT NULL,
    state_code BYTEA NOT NULL,
    zipcode BYTEA NOT NULL,
    phone BYTEA NOT NULL,
    transaction_id BYTEA NOT NULL,
    amount NUMERIC NOT NULL,
    status VARCHAR(10) NOT NULL DEFAULT 'Confirmed',
    is_deleted BOOLEAN NOT NULL DEFAULT false
);

CREATE TABLE orders_items (
    id SERIAL PRIMARY KEY,
    order_id INTEGER REFERENCES orders ON DELETE CASCADE,
    item_id INTEGER REFERENCES items ON DELETE CASCADE
);
