import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import configuration from './config/configuration';

import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { RestaurantsModule } from './restaurants/restaurants.module';

import { User } from './users/user.entity';
import { Restaurant } from './restaurants/restaurant.entity';
import { Meal } from './meals/meal.entity';
import { MealsModule } from './meals/meals.module';
import { OrdersModule } from './orders/orders.module';
import { Order } from './orders/order.entity';
import { OrderItem } from './order-items/order-items.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [configuration] }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get('database.host'),
        port: config.get<number>('database.port'),
        username: config.get('database.username'),
        password: config.get('database.password'),
        database: config.get('database.name'),
        synchronize: true,
        entities: [User, Restaurant, Meal, Order, OrderItem],
      }),
    }),
    AuthModule,
    UsersModule,
    RestaurantsModule,
    MealsModule,
    OrdersModule
  ],
})
export class AppModule {}
