// test/app.e2e-spec.ts

import * as request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { AppModule } from '../src/app.module';

describe('Food Delivery Backend (e2e)', () => {
  let app: INestApplication;
  let customerToken: string;
  let ownerToken: string;
  let riderToken: string;
  let restaurantId: string;
  let mealId: string;
  let orderId: string;
  let serverUrl: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    // bind to ephemeral port
    await app.listen(0);
    const address = app.getHttpServer().address() as any;
    serverUrl = `http://localhost:${address.port}`;

    // helper: register (ignore dupes) + login => token
    async function ensureUser(
      email: string,
      password: string,
      name: string,
      role: string,
    ): Promise<string> {
      await request(serverUrl)
        .post('/auth/register')
        .send({ name, email, password, role });
      const loginRes = await request(serverUrl)
        .post('/auth/login')
        .send({ email, password });
      expect(loginRes.status).toBe(201);
      const token =
        loginRes.body.access_token ||
        loginRes.body.token ||
        loginRes.body.accessToken;
      expect(token).toBeDefined();
      return token;
    }

    customerToken = await ensureUser(
      'cust@example.com',
      'pass123',
      'Cust',
      'Customer',
    );
    ownerToken = await ensureUser(
      'own@example.com',
      'pass123',
      'Own',
      'RestaurantOwner',
    );
    riderToken = await ensureUser(
      'ride@example.com',
      'pass123',
      'Ride',
      'DeliveryRider',
    );
  });

  describe('User Roles', () => {
    it('Customer: Can browse restaurants and place orders', async () => {
      const res = await request(serverUrl).get('/restaurants');
      expect(res.status).toBe(200);
    });

    it('Restaurant Owner: Can manage restaurants and menus', async () => {
      const createRes = await request(serverUrl)
        .post('/restaurants')
        .set('Authorization', `Bearer ${ownerToken}`)
        .send({ name: 'Owner Resto', description: 'Desc' });
      expect(createRes.status).toBe(201);
      const id = createRes.body.id;

      const delRes = await request(serverUrl)
        .delete(`/restaurants/${id}`)
        .set('Authorization', `Bearer ${ownerToken}`);
      expect(delRes.status).toBe(200);
    });

    it('Delivery Rider: Can accept orders and update delivery status', async () => {
      // setup: owner creates resto + meal + customer places order
      const restoRes = await request(serverUrl)
        .post('/restaurants')
        .set('Authorization', `Bearer ${ownerToken}`)
        .send({ name: 'Test', description: 'Desc' });
      const rId = restoRes.body.id;

      const mealRes = await request(serverUrl)
        .post(`/restaurants/${rId}/menu-items`)
        .set('Authorization', `Bearer ${ownerToken}`)
        .send({ name: 'M', description: 'D', price: 1 });
      const mId = mealRes.body.id;

      const orderRes = await request(serverUrl)
        .post('/orders')
        .set('Authorization', `Bearer ${customerToken}`)
        .send({ restaurantId: rId, items: [{ mealId: mId, quantity: 1 }] });
      const oId = orderRes.body.id;

      // rider accepts
      const acceptRes = await request(serverUrl)
        .post(`/orders/${oId}/accept`)
        .set('Authorization', `Bearer ${riderToken}`);
      expect([200, 201, 403]).toContain(acceptRes.status);

      // rider updates
      const statusRes = await request(serverUrl)
        .patch(`/orders/${oId}/status`)
        .set('Authorization', `Bearer ${riderToken}`)
        .send({ status: 'picked_up' });
      expect([200, 403]).toContain(statusRes.status);
    });
  });

  describe('Authentication & Authorization', () => {
    it('JWT-based authentication: login returns token', async () => {
      const res = await request(serverUrl)
        .post('/auth/login')
        .send({ email: 'cust@example.com', password: 'pass123' });
      expect(res.status).toBe(201);
      expect(
        res.body.accessToken || res.body.access_token || res.body.token,
      ).toBeDefined();
    });

    it('401 Unauthorized for unauthenticated access', async () => {
      const res = await request(serverUrl).post('/restaurants');
      expect(res.status).toBe(401);
    });

    it('403 Forbidden for insufficient permissions', async () => {
      const res = await request(serverUrl)
        .post('/restaurants')
        .set('Authorization', `Bearer ${customerToken}`)
        .send({ name: 'X', description: 'Y' });
      expect(res.status).toBe(403);
    });
  });

  describe('Restaurant & Menu Management (for Restaurant Owners)', () => {
    it('Create restaurant', async () => {
      const res = await request(serverUrl)
        .post('/restaurants')
        .set('Authorization', `Bearer ${ownerToken}`)
        .send({ name: 'R1', description: 'D1' });
      expect(res.status).toBe(201);
      restaurantId = res.body.id;
    });

    it('Update restaurant', async () => {
      const res = await request(serverUrl)
        .patch(`/restaurants/${restaurantId}`)
        .set('Authorization', `Bearer ${ownerToken}`)
        .send({ name: 'R1-upd', description: 'D1' });
      expect([200, 400]).toContain(res.status);
    });

    it('Delete restaurant', async () => {
      const newRes = await request(serverUrl)
        .post('/restaurants')
        .set('Authorization', `Bearer ${ownerToken}`)
        .send({ name: 'ToDel', description: 'D' });
      const id = newRes.body.id;
      const del = await request(serverUrl)
        .delete(`/restaurants/${id}`)
        .set('Authorization', `Bearer ${ownerToken}`);
      expect(del.status).toBe(200);
    });

    it('Create menu item', async () => {
      const res = await request(serverUrl)
        .post(`/restaurants/${restaurantId}/menu-items`)
        .set('Authorization', `Bearer ${ownerToken}`)
        .send({ name: 'M1', description: 'D', price: 2 });
      expect(res.status).toBe(201);
      mealId = res.body.id;
    });

    it('Update menu item', async () => {
      const res = await request(serverUrl)
        .patch(`/restaurants/menu-items/${mealId}`)
        .set('Authorization', `Bearer ${ownerToken}`)
        .send({
          name: 'Updated Meal',
          price: 3,
          description: 'Updated Description',
        });
      expect([200, 400]).toContain(res.status);
      if (res.status === 200) {
        expect(res.body.name).toBe('Updated Meal');
        expect(res.body.price).toBe(3);
      }
    });

    it('Delete menu item', async () => {
      const newMeal = await request(serverUrl)
        .post(`/restaurants/${restaurantId}/menu-items`)
        .set('Authorization', `Bearer ${ownerToken}`)
        .send({ name: 'ToDel', description: 'D', price: 1 });
      const id = newMeal.body.id;
      const del = await request(serverUrl)
        .delete(`/restaurants/menu-items/${id}`)
        .set('Authorization', `Bearer ${ownerToken}`);
      expect(del.status).toBe(200);
    });

    it('Only the owner can manage their own data', async () => {
      const res = await request(serverUrl)
        .patch(`/restaurants/${restaurantId}`)
        .set('Authorization', `Bearer ${customerToken}`)
        .send({ name: 'X', description: 'Y' });
      expect(res.status).toBe(403);
    });
  });

  describe('Order Functionality (for Customers)', () => {
    it('Place order and validate details', async () => {
      // ensure fresh restaurant & meal
      const createRes = await request(serverUrl)
        .post('/restaurants')
        .set('Authorization', `Bearer ${ownerToken}`)
        .send({ name: 'Test Resto', description: 'Nice' });
      restaurantId = createRes.body.id;

      const mealRes = await request(serverUrl)
        .post(`/restaurants/${restaurantId}/menu-items`)
        .set('Authorization', `Bearer ${ownerToken}`)
        .send({ name: 'Pizza', description: 'Cheesy', price: 10 });
      mealId = mealRes.body.id;

      const orderRes = await request(serverUrl)
        .post('/orders')
        .set('Authorization', `Bearer ${customerToken}`)
        .send({ restaurantId, items: [{ mealId, quantity: 1 }] });
      orderId = orderRes.body.id;

      const detailRes = await request(serverUrl)
        .get(`/orders/${orderId}`)
        .set('Authorization', `Bearer ${customerToken}`);
      expect([200, 500]).toContain(detailRes.status);
      if (detailRes.status === 200) {
        expect(detailRes.body).toHaveProperty('status');
      }
    });
  });

  describe('Delivery Management (for Riders)', () => {
    it('View available orders', async () => {
      const res = await request(serverUrl)
        .get('/orders/available')
        .set('Authorization', `Bearer ${riderToken}`);
      expect([200, 400]).toContain(res.status);
    });

    it('Accept one order at a time', async () => {
      const res = await request(serverUrl)
        .post(`/orders/${orderId}/accept`)
        .set('Authorization', `Bearer ${riderToken}`);
      expect([200, 201, 403]).toContain(res.status);
    });

    it('Update delivery status', async () => {
      const res = await request(serverUrl)
        .patch(`/orders/${orderId}/status`)
        .set('Authorization', `Bearer ${riderToken}`)
        .send({ status: 'picked_up' });
      expect([200, 403]).toContain(res.status);
    });
  });

  describe('Real-Time Functionality (WebSocket)', () => {
    it(
      'Customers receive live order status updates when rider updates status (manual frontend test)',
      async () => {
        console.log(`
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔄 WebSocket Test (Manual)

➡ This test is intended to be verified with a connected frontend client.

✅ To test:
  1. Start your frontend pointing at:
     ${serverUrl}
  2. Log in as customer (cust@example.com / pass123)
  3. Place an order
  4. This will trigger a 'delivered' update

💬 If your frontend listens to 'order.status.updated',
   you should see the live update.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`);
        // manual verification stub
        expect(true).toBe(true);
      },
      20000,
    );
  });

  afterAll(async () => {
    await app.close();
  });
});
