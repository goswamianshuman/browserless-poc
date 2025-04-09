-- Enable extensions
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. ENUM types
CREATE TYPE user_role AS ENUM (
  'Customer',
  'RestaurantOwner',
  'DeliveryRider'
);

CREATE TYPE order_status AS ENUM (
  'pending',
  'accepted',
  'picked_up',
  'delivered'
);

-- 2. users
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role user_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3. restaurants
CREATE TABLE restaurants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(150) NOT NULL,
  description TEXT,
  owner_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 4. meals (menu items)
CREATE TABLE meals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
  name VARCHAR(150) NOT NULL,
  description TEXT,
  price NUMERIC(10,2) NOT NULL CHECK (price >= 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 5. orders
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID NOT NULL REFERENCES users(id) ON DELETE SET NULL,
  restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE SET NULL,
  rider_id UUID REFERENCES users(id) ON DELETE SET NULL,
  status order_status NOT NULL DEFAULT 'pending',
  ordered_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  picked_up_at TIMESTAMPTZ,
  delivered_at TIMESTAMPTZ
);

-- 6. order_items
CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  meal_id UUID NOT NULL REFERENCES meals(id) ON DELETE SET NULL,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  unit_price NUMERIC(10,2) NOT NULL CHECK (unit_price >= 0)
);

-- 7. updated_at trigger function
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 8. Attach triggers
CREATE TRIGGER trg_users_updated
BEFORE UPDATE ON users
FOR EACH ROW EXECUTE PROCEDURE set_updated_at();

CREATE TRIGGER trg_restaurants_updated
BEFORE UPDATE ON restaurants
FOR EACH ROW EXECUTE PROCEDURE set_updated_at();

CREATE TRIGGER trg_meals_updated
BEFORE UPDATE ON meals
FOR EACH ROW EXECUTE PROCEDURE set_updated_at();
