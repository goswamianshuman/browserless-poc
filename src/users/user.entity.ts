import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    OneToMany,
  } from 'typeorm';
  import { Restaurant } from '../restaurants/restaurant.entity'; 
  
  export enum UserRole {
    Customer = 'Customer',
    RestaurantOwner = 'RestaurantOwner',
    DeliveryRider = 'DeliveryRider',
  }
  
  @Entity('users')
  export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;
  
    @Column({ length: 100 })
    name: string;
  
    @Column({ unique: true })
    email: string;
  
    @Column({ name: 'password_hash' })
    passwordHash: string;
  
    @Column({ type: 'enum', enum: UserRole })
    role: UserRole;
  
    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;
  
    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;
  
    @OneToMany(() => Restaurant, restaurant => restaurant.owner)
    restaurants: Restaurant[];
  }
  