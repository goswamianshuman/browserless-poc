-- 2. Seed initial users
INSERT INTO users (
  id, name, email, password_hash, role, created_at, updated_at
) VALUES
  (
    '06ff6443-a67d-4c15-9169-358e8d572d7c',
    'customer',
    'customer@gmail.com',
    '$2b$10$yZRPtzmmtzmEY.hHh8zXr.6uFsiXAgQaIp12yg1pJOLAbg6m3Y8Cq',
    'Customer',
    '2025-04-10 09:52:10.620+05:30',
    '2025-04-10 09:52:10.620+05:30'
  ),
  (
    '693b4222-88d7-45c8-894f-31b98788ed0e',
    'RestaurantOwner',
    'restaurant@gmail.com',
    '$2b$10$nvml9JBpZnQohDWRyxCgOu/duAes9pZetsZa6h2udXI4ZIW.BbEb2',
    'RestaurantOwner',
    '2025-04-10 09:58:21.259+05:30',
    '2025-04-10 09:58:21.259+05:30'
  ),
  (
    '3fb222bb-d3e4-418e-a07e-202d08679272',
    'rider',
    'rider@gmail.com',
    '$2b$10$1i8EgYzHmOtkLFjsYBz43OoK/2jYIbZI8i2/BDUp4sTsxZAffc30q',
    'DeliveryRider',
    '2025-04-10 10:02:17.095+05:30',
    '2025-04-10 10:02:17.095+05:30'
  );

-- 3. Seed restaurants
INSERT INTO restaurants (
  id, name, description, owner_id, created_at, updated_at
) VALUES
  (
    '7e39c59c-52e8-411b-a80c-34b84b8606f5',
    'Pizzeria',
    'we make pizza from heart',
    '693b4222-88d7-45c8-894f-31b98788ed0e',
    '2025-04-10 09:59:05.755+05:30',
    '2025-04-10 09:59:44.433+05:30'
  );

-- 4. Seed meals
INSERT INTO meals (
  id, restaurant_id, name, description, price, created_at, updated_at
) VALUES
  (
    '24196783-3ddb-4a6e-8ac8-b6feb372b509',
    '7e39c59c-52e8-411b-a80c-34b84b8606f5',
    'margarita',
    'simple cheese pizza',
    8.00,
    '2025-04-10 10:00:26.883+05:30',
    '2025-04-10 10:00:26.883+05:30'
  ),
  (
    '397be912-63ad-4300-9462-37ec48cc520d',
    '7e39c59c-52e8-411b-a80c-34b84b8606f5',
    'pessto',
    'a pesto sause pizza',
    10.00,
    '2025-04-10 10:00:53.672+05:30',
    '2025-04-10 10:00:53.672+05:30'
  );

-- 5. Seed orders
INSERT INTO orders (
  id, customer_id, restaurant_id, rider_id, status,
  ordered_at, picked_up_at, delivered_at
) VALUES
  (
    '9e32c6f6-924f-402d-9ade-e2deea52844d',
    '06ff6443-a67d-4c15-9169-358e8d572d7c',
    '7e39c59c-52e8-411b-a80c-34b84b8606f5',
    '3fb222bb-d3e4-418e-a07e-202d08679272',
    'delivered',
    '2025-04-10 10:05:13.101+05:30',
    '2025-04-10 10:22:36.075+05:30',
    '2025-04-10 10:22:58.828+05:30'
  );

-- 6. Seed order_items
INSERT INTO order_items (
  id, order_id, meal_id, quantity, unit_price
) VALUES
  (
    'ef9e5f27-0c9b-4f18-aeb1-b4437461fecf',
    '9e32c6f6-924f-402d-9ade-e2deea52844d',
    '24196783-3ddb-4a6e-8ac8-b6feb372b509',
    2,
    8.00
  ),
  (
    'd9558f97-6fbe-4ce3-81e4-c81d8cd64d1a',
    '9e32c6f6-924f-402d-9ade-e2deea52844d',
    '397be912-63ad-4300-9462-37ec48cc520d',
    1,
    10.00
  );
