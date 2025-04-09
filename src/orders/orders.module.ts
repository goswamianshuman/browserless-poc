import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './order.entity';
import { OrderItem } from '../order-items/order-items.entity';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { Restaurant } from '../restaurants/restaurant.entity';
import { Meal } from '../meals/meal.entity';
import { OrdersGateway } from './orders.gateway';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order, OrderItem, Restaurant, Meal]),
  ],
  providers: [OrdersService, OrdersGateway],
  controllers: [OrdersController],
})
export class OrdersModule {}