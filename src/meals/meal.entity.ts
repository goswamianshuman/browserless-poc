import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    CreateDateColumn,
    UpdateDateColumn,
  } from 'typeorm';
  import { Restaurant } from '../restaurants/restaurant.entity';
  
  @Entity('meals')
  export class Meal {
    @PrimaryGeneratedColumn('uuid')
    id: string;
  
    @Column({ length: 150 })
    name: string;
  
    @Column({ type: 'text', nullable: true })
    description: string;
  
    @Column({ type: 'numeric', precision: 10, scale: 2, nullable: false })
    price: number;
  
    @ManyToOne(() => Restaurant, (restaurant) => restaurant.meals, { onDelete: 'CASCADE' })
    restaurant: Restaurant;
  
    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;
  
    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;
  }
  