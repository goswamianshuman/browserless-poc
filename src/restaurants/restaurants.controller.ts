import { Controller, Post, Get, Patch, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { RestaurantsService } from './restaurants.service';
import { CreateRestaurantDto } from './dto/create-restorant.dto';
import { UpdateRestaurantDto } from './dto/update-restorant.dto';
import { JwtAuthGuard } from '../auth/gaurds/jwt_auth.gaurd';
import {Request as RequestProp} from 'express';
import { User } from 'src/users/user.entity';
import { RestaurantResponseDto } from './dto/response.dto';

@Controller('restaurants')
export class RestaurantsController {
  constructor(private readonly restaurantsService: RestaurantsService) {}

  @Get()
  async findAll(): Promise<RestaurantResponseDto[]> {
    const rests = await this.restaurantsService.findAll();  
    return rests.map(r => ({
      id: r.id,
      name: r.name,
      description: r.description,
      createdAt: r.createdAt,
      updatedAt: r.updatedAt,
      owner: {
        id: r.owner.id,
        name: r.owner.name,
        email: r.owner.email,
      },
    }));
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() createRestaurantDto: CreateRestaurantDto, @Request() req: RequestProp) {
    if (!req?.user) {
      throw new Error('User information is missing');
    }
    return this.restaurantsService.create(createRestaurantDto, req?.user as User);
  }

  @UseGuards(JwtAuthGuard)
  @Get('my')
  async findMyRestaurants(@Request() req: RequestProp) {
    const user = req?.user as User;
    return this.restaurantsService.findAllByOwner(user?.id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateRestaurantDto: UpdateRestaurantDto, @Request() req: RequestProp) {
    const user = req?.user as User;
    return this.restaurantsService.update(id, updateRestaurantDto, user?.id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: string, @Request() req: RequestProp) {
    const user = req?.user as User;
    await this.restaurantsService.remove(id, user?.id);
    return {
        message: "restaurant removed successfully!"
    }
  }
}
