// src/meals/meals.service.ts
import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Meal } from './meal.entity';
import { Restaurant } from '../restaurants/restaurant.entity';
import { CreateMealDto } from './dto/create-meal.dto';
import { UpdateMealDto } from './dto/update-meal.dto';
import { User } from '../users/user.entity';

@Injectable()
export class MealsService {
  constructor(
    @InjectRepository(Meal) private mealRepo: Repository<Meal>,
    @InjectRepository(Restaurant) private restaurantRepo: Repository<Restaurant>,
  ) {}

  async create(restaurantId: string, dto: CreateMealDto, user: User): Promise<Meal> {
    const restaurant = await this.restaurantRepo.findOne({
      where: { id: restaurantId },
      relations: ['owner'],
    });

    if (!restaurant) throw new NotFoundException('Restaurant not found');
    if (restaurant.owner.id !== user.id) throw new ForbiddenException('Not your restaurant');

    const meal = this.mealRepo.create({ ...dto, restaurant });
    return this.mealRepo.save(meal);
  }

  async findByRestaurant(restaurantId: string): Promise<Meal[]> {
    return this.mealRepo.find({ where: { restaurant: { id: restaurantId } } });
  }

  async update(id: string, dto: UpdateMealDto, user: User): Promise<Meal> {
    const meal = await this.mealRepo.findOne({
      where: { id },
      relations: ['restaurant', 'restaurant.owner'],
    });

    if (!meal) throw new NotFoundException('Meal not found');
    if (meal.restaurant.owner.id !== user.id) throw new ForbiddenException('Unauthorized');

    Object.assign(meal, dto);
    return this.mealRepo.save(meal);
  }

  async remove(id: string, user: User): Promise<void> {
    const meal = await this.mealRepo.findOne({
      where: { id },
      relations: ['restaurant', 'restaurant.owner'],
    });

    if (!meal) throw new NotFoundException('Meal not found');
    if (meal.restaurant.owner.id !== user.id) throw new ForbiddenException('Unauthorized');

    await this.mealRepo.delete(id);
  }
}
