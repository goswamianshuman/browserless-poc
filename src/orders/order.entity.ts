import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    OneToMany,
    CreateDateColumn,
    UpdateDateColumn,
    JoinColumn,
  } from 'typeorm';
  import { User } from 'src/users/user.entity';
  import { Restaurant } from 'src/restaurants/restaurant.entity';
  import { OrderItem } from 'src/order-items/order-items.entity';
  
  export enum OrderStatus {
    PENDING = 'pending',
    ACCEPTED = 'accepted',
    PICKED_UP = 'picked_up',
    DELIVERED = 'delivered',
  }
  
  @Entity('orders')
  export class Order {
    @PrimaryGeneratedColumn('uuid')
    id: string;
  
    @ManyToOne(() => User, { onDelete: 'SET NULL' })
    @JoinColumn({ name: 'customer_id' })
    customer: User;
  
    @ManyToOne(() => Restaurant, { onDelete: 'SET NULL' })
    @JoinColumn({ name: 'restaurant_id' })
    restaurant: Restaurant;
  
    @ManyToOne(() => User, { onDelete: 'SET NULL', nullable: true })
    @JoinColumn({ name: 'rider_id' })
    rider?: User;
  
    @Column({ type: 'enum', enum: OrderStatus, default: OrderStatus.PENDING })
    status: OrderStatus;
  
    @CreateDateColumn({ name: 'ordered_at' })
    orderedAt: Date;
  
    @Column({ name: 'picked_up_at', type: 'timestamptz', nullable: true })
    pickedUpAt?: Date;
  
    @Column({ name: 'delivered_at', type: 'timestamptz', nullable: true })
    deliveredAt?: Date;
  
    @OneToMany(() => OrderItem, (item) => item.order, { cascade: true })
    items: OrderItem[];
  }
  
  