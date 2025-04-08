import {
    Controller,
    Post,
    Get,
    Patch,
    Delete,
    Param,
    Body,
    UseGuards,
    Request,
    ParseUUIDPipe,
  } from '@nestjs/common';
  import { MealsService } from './meals.service';
  import { JwtAuthGuard } from 'src/auth/gaurds/jwt_auth.gaurd';
  import { CreateMealDto } from './dto/create-meal.dto';
  import { UpdateMealDto } from './dto/update-meal.dto';
  import { Request as RequestProp } from 'express';
  import { User } from 'src/users/user.entity';
  
  @UseGuards(JwtAuthGuard)
  @Controller()
  export class MealsController {
    constructor(private readonly mealsService: MealsService) {}
  
    @Post('/restaurants/:restaurantId/menu-items')
    create(
      @Param('restaurantId', ParseUUIDPipe) restaurantId: string,
      @Body() dto: CreateMealDto,
      @Request() req: RequestProp,
    ) {
      const user = req.user as User;
      return this.mealsService.create(restaurantId, dto, user);
    }
  
    @Get('/restaurants/:restaurantId/menu-items')
    findByRestaurant(
      @Param('restaurantId', ParseUUIDPipe) restaurantId: string,
    ) {
      return this.mealsService.findByRestaurant(restaurantId);
    }
  
    @Patch('/menu-items/:id')
    update(
      @Param('id', ParseUUIDPipe) id: string,
      @Body() dto: UpdateMealDto,
      @Request() req: RequestProp, // ✅ Added type
    ) {
      const user = req.user as User;
      return this.mealsService.update(id, dto, user);
    }
  
    @Delete('/menu-items/:id')
    remove(
      @Param('id', ParseUUIDPipe) id: string,
      @Request() req: RequestProp, // ✅ Added type
    ) {
      const user = req.user as User;
      return this.mealsService.remove(id, user);
    }
  }
  