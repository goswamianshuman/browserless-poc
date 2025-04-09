-- Note: This file is used to seed the database with initial data.
-- i will recommend to test all things with new data and not with the old data.
-- This file is not used in production, but it is useful for local development.

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Insert users
INSERT INTO users (id, name, email, password_hash, role)
VALUES
  ('b3a50ef6-c0ba-48e9-8bfa-cbec60d88bf6', 'Bob the builder', 'Bob@gmail.com',
   '$2b$10$eYQzRG/hARkftvx913M4eeYCrVMs3may3jywrbkoupMaw83OjZxNi', 'DeliveryRider'),

  ('33ec890a-764b-4264-965d-19450790edb5', 'Jhon Abacus', 'Jhon@gmail.com',
   '$2b$10$eoNJ3wL232njnN.gbWLJY.ViBvCthLrEI7zTgShxdS2xhjpnoevue', 'RestaurantOwner'),

  ('7f3ad665-f15e-42dc-a009-ce34c6ee7864', 'William Woods', 'woods@gmail.com',
   '$2b$10$UrW3i2vDG5naBkJfuX8BReHlkwYsjeqs/szwZ3K0txQ9X2oZ1CdlS', 'Customer');

-- Insert restaurant
INSERT INTO restaurants (id, name, description, owner_id)
VALUES (
  '85b65ce7-bfbe-4648-8481-0312b40bc582',
  'Seedy’s Kitchen',
  'Tasty meals by seed script.',
  '33ec890a-764b-4264-965d-19450790edb5' -- Jhon the owner
);

-- Insert menu item
INSERT INTO meals (id, restaurant_id, name, description, price)
VALUES (
  '1fec69cc-c586-45d7-8c6d-4dd590fe1f66',
  '85b65ce7-bfbe-4648-8481-0312b40bc582',
  'Seeded Burger',
  'Juicy seeded test burger',
  9.99
);

-- Insert order
INSERT INTO orders (
  id, customer_id, restaurant_id, rider_id,
  status, ordered_at, picked_up_at, delivered_at
)
VALUES (
  '33333333-aaaa-bbbb-cccc-444444444444',
  '7f3ad665-f15e-42dc-a009-ce34c6ee7864',  -- William
  '85b65ce7-bfbe-4648-8481-0312b40bc582',  -- Seedy’s Kitchen
  'b3a50ef6-c0ba-48e9-8bfa-cbec60d88bf6',  -- Bob
  'picked_up',
  NOW(),
  NOW(),
  NULL
);

-- Insert order item
INSERT INTO order_items (id, order_id, meal_id, quantity, unit_price)
VALUES (
  '44444444-aaaa-bbbb-cccc-555555555555',
  '33333333-aaaa-bbbb-cccc-444444444444',
  '22222222-aaaa-bbbb-cccc-333333333333',
  2,
  9.99
);
