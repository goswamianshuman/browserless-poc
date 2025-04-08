import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
  } from 'typeorm';
  import { Order } from 'src/orders/order.entity';
  import { Meal } from 'src/meals/meal.entity';
  
  @Entity('order_items')
  export class OrderItem {
    @PrimaryGeneratedColumn('uuid')
    id: string;
  
    @ManyToOne(() => Order, (order) => order.items, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'order_id' })
    order: Order;
  
    @ManyToOne(() => Meal, { onDelete: 'SET NULL' })
    @JoinColumn({ name: 'meal_id' })
    meal: Meal;
  
    @Column('int')
    quantity: number;
  
    @Column('numeric', { precision: 10, scale: 2, name: 'unit_price' })
    unitPrice: number;
  }