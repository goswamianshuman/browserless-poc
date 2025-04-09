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
import {
  ApiBearerAuth,
  ApiTags,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';

@ApiTags('meals')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('restaurants')
export class MealsController {
  constructor(private readonly mealsService: MealsService) {}

  @Post(':restaurantId/menu-items')
  @ApiOperation({ summary: 'Create a new meal item for a restaurant' })
  @ApiResponse({ status: 201, description: 'Meal created successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden – not the owner' })
  create(
    @Param('restaurantId', ParseUUIDPipe) restaurantId: string,
    @Body() createMealDto: CreateMealDto,
    @Request() req: RequestProp,
  ) {
    const user = req?.user as User;
    return this.mealsService.create(restaurantId, createMealDto, user);
  }

  @Get(':restaurantId/menu-items')
  @ApiOperation({ summary: 'Get all meals for a specific restaurant' })
  @ApiResponse({ status: 200, description: 'List of meals returned' })
  findByRestaurant(
    @Param('restaurantId', ParseUUIDPipe) restaurantId: string,
  ) {
    return this.mealsService.findByRestaurant(restaurantId);
  }

  @Patch('menu-items/:id')
  @ApiOperation({ summary: 'Update a specific meal item' })
  @ApiResponse({ status: 200, description: 'Meal updated successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden – not the owner' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateMealDto: UpdateMealDto,
    @Request() req: RequestProp,
  ) {
    const user = req.user as User;
    return this.mealsService.update(id, updateMealDto, user);
  }

  @Delete('menu-items/:id')
  @ApiOperation({ summary: 'Delete a specific meal item' })
  @ApiResponse({ status: 200, description: 'Meal removed successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden – not the owner' })
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
