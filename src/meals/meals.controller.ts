import {
    Controller,
    Post,
    Get,
    Patch,
    Delete,
    Body,
    Param,
    UseGuards,
    Request,
    ParseUUIDPipe,
  } from '@nestjs/common';
  import { MealsService } from './meals.service';
  import { JwtAuthGuard } from '../auth/gaurds/jwt_auth.gaurd';
  import { CreateMealDto } from './dto/create-meal.dto';
  import { UpdateMealDto } from './dto/update-meal.dto';
  import { Request as RequestProp } from 'express';
  import { User } from '../users/user.entity';
  
  @UseGuards(JwtAuthGuard)
  @Controller('restaurants')
  export class MealsController {
    constructor(private readonly mealsService: MealsService) {}
  
    // ✅ Create Meal
    @Post(':restaurantId/menu-items')
    async create(
      @Param('restaurantId', ParseUUIDPipe) restaurantId: string,
      @Body() createMealDto: CreateMealDto,
      @Request() req: RequestProp,
    ) {
      const user = req.user as User;
      return this.mealsService.create(restaurantId, createMealDto, user);
    }
  
    // ✅ Get Meals by Restaurant
    @Get(':restaurantId/menu-items')
    async findByRestaurant(
      @Param('restaurantId', ParseUUIDPipe) restaurantId: string,
    ) {
      return this.mealsService.findByRestaurant(restaurantId);
    }
  
    // ✅ Update Meal
    @Patch('menu-items/:id')
    async update(
      @Param('id', ParseUUIDPipe) id: string,
      @Body() updateMealDto: UpdateMealDto,
      @Request() req: RequestProp,
    ) {
      const user = req.user as User;
      return this.mealsService.update(id, updateMealDto, user);
    }
  
    // ✅ Delete Meal
    @Delete('menu-items/:id')
    async remove(
      @Param('id', ParseUUIDPipe) id: string,
      @Request() req: RequestProp,
    ) {
      const user = req.user as User;
      await this.mealsService.remove(id, user);
      return {
        message: 'Meal removed successfully!',
      };
    }
  }
  