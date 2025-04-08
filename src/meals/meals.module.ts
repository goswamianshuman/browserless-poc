import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Meal } from './meal.entity';
import { Restaurant } from '../restaurants/restaurant.entity';
import { MealsService } from './meals.service';
import { MealsController } from './meals.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Meal, Restaurant])],
  providers: [MealsService],
  controllers: [MealsController],
})
export class MealsModule {}