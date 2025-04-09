import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Order } from '../orders/order.entity';
import { Meal } from '../meals/meal.entity';

@Entity('order_items')
export class OrderItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Order, (order) => order.items, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'order_id' })
  order: Order;

  @ManyToOne(() => Meal, { onDelete: 'SET NULL', nullable: false })
  @JoinColumn({ name: 'meal_id' })
  meal: Meal;

  @Column('int', { nullable: false })
  quantity: number;

  @Column('numeric', { precision: 10, scale: 2, name: 'unit_price', nullable: false })
  unitPrice: number;
}
