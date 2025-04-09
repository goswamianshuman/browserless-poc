// File: src/orders/orders.service.ts

import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { Order, OrderStatus } from './order.entity';
import { OrderItem } from '../order-items/order-items.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { User } from '../users/user.entity';
import { Restaurant } from '../restaurants/restaurant.entity';
import { Meal } from '../meals/meal.entity';
import { OrdersGateway } from './orders.gateway';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order) private readonly orderRepo: Repository<Order>,
    @InjectRepository(OrderItem) private readonly itemRepo: Repository<OrderItem>,
    @InjectRepository(Restaurant) private readonly restRepo: Repository<Restaurant>,
    @InjectRepository(Meal) private readonly mealRepo: Repository<Meal>,
    private readonly ordersGateway: OrdersGateway,            // ← injected
  ) {}

  /** Place a new order */
  async create(user: User, dto: CreateOrderDto): Promise<Order> {
    // 1. Validate restaurant
    const restaurant = await this.restRepo.findOne({ where: { id: dto.restaurantId } });
    if (!restaurant) throw new NotFoundException('Restaurant not found');

    // 2. Create and save order (without items)
    const order = this.orderRepo.create({
      customer: user,
      restaurant,
      status: OrderStatus.PENDING,
    });
    const savedOrder = await this.orderRepo.save(order);

    // 3. Create order items and save separately
    const items: OrderItem[] = [];
    for (const it of dto.items) {
      const meal = await this.mealRepo.findOne({ where: { id: it.mealId } });
      if (!meal) throw new NotFoundException(`Meal ${it.mealId} not found`);
      const item = this.itemRepo.create({
        order: savedOrder,
        meal,
        quantity: it.quantity,
        unitPrice: Number(meal.price),
      });
      items.push(item);
    }
    await this.itemRepo.save(items);

    // 4. Load full order with relations
    const fullOrder = await this.orderRepo.findOne({
      where: { id: savedOrder.id },
      relations: ['items', 'items.meal', 'restaurant', 'rider'],
    });
    if (!fullOrder) throw new NotFoundException('Order not found');

    // 5. Broadcast to restaurant owners
    this.ordersGateway.broadcastOrderCreated(fullOrder);

    return fullOrder;
  }

  /** Customer: view their order history */
  async findMyOrders(user: User): Promise<Order[]> {
    return this.orderRepo.find({
      where: { customer: { id: user.id } },
      relations: ['items', 'items.meal', 'restaurant', 'rider'],
    });
  }

  /** Customer: view one order detail */
  async findOne(id: string, user: User): Promise<Order> {
    const order = await this.orderRepo.findOne({
      where: { id },
      relations: ['customer', 'items', 'items.meal', 'restaurant', 'rider'],
    });
    if (!order) throw new NotFoundException('Order not found');
    if (!order.customer || order.customer.id !== user.id) {
      throw new ForbiddenException('Not your order');
    }
    return order;
  }

  /** Rider: list unassigned orders */
  async findAvailableOrders(): Promise<Order[]> {
    return this.orderRepo.find({
      where: { status: OrderStatus.PENDING, rider: IsNull() },
      relations: ['items', 'items.meal', 'restaurant'],
    });
  }

  /** Rider: accept an order */
  async acceptOrder(id: string, user: User): Promise<Order> {
    // ensure rider has no other active order
    const active = await this.orderRepo.findOne({
      where: [
        { rider: { id: user.id }, status: OrderStatus.ACCEPTED },
        { rider: { id: user.id }, status: OrderStatus.PICKED_UP },
      ],
    });
    if (active) throw new ForbiddenException('You already have an active order');

    const order = await this.orderRepo.findOne({ where: { id }, relations: ['restaurant'] });
    if (!order) throw new NotFoundException('Order not found');
    if (order.status !== OrderStatus.PENDING) throw new ForbiddenException('Order not available');

    order.rider = user;
    order.status = OrderStatus.ACCEPTED;
    const updated = await this.orderRepo.save(order);

    // Broadcast status update to the customer
    this.ordersGateway.broadcastOrderStatusUpdated(updated);

    return updated;
  }

  /** Rider: update delivery status */
  async updateStatus(id: string, dto: UpdateOrderStatusDto, user: User): Promise<Order> {
    const order = await this.orderRepo.findOne({ where: { id }, relations: ['rider'] });
    if (!order) throw new NotFoundException('Order not found');
    if (!order.rider || order.rider.id !== user.id) throw new ForbiddenException('Not your order');

    order.status = dto.status;
    if (dto.status === OrderStatus.PICKED_UP) order.pickedUpAt = new Date();
    if (dto.status === OrderStatus.DELIVERED) order.deliveredAt = new Date();

    const updated = await this.orderRepo.save(order);

    // Broadcast status update to the customer
    this.ordersGateway.broadcastOrderStatusUpdated(updated);

    return updated;
  }
}
