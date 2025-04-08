import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    JoinColumn,
    OneToMany
  } from 'typeorm';
  import { User } from '../users/user.entity';
  import { Meal } from 'src/meals/meal.entity';
  
  @Entity('restaurants')
  export class Restaurant {
    @PrimaryGeneratedColumn('uuid')
    id: string;
  
    @Column({ length: 150 })
    name: string;
  
    @Column({ type: 'text', nullable: true })
    description: string;
  
    @ManyToOne(() => User, user => user.restaurants, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'owner_id' })
    owner: User;
  
    // ✅ Add this line to fix the error
    @OneToMany(() => Meal, meal => meal.restaurant)
    meals: Meal[];
  
    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;
  
    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;
  }
  