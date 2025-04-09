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
} from '@nestjs/common';
import { RestaurantsService } from './restaurants.service';
import { CreateRestaurantDto } from './dto/create-restorant.dto';
import { UpdateRestaurantDto } from './dto/update-restorant.dto';
import { JwtAuthGuard } from '../auth/gaurds/jwt_auth.gaurd';
import { RolesGuard } from '../common/gaurds/roles.gaurd';
import { Roles } from '../common/decorators/roles.decorator';
import { Request as RequestProp } from 'express';
import { User, UserRole } from '../users/user.entity';
import { RestaurantResponseDto } from './dto/response.dto';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';

@ApiTags('restaurants')
@Controller('restaurants')
export class RestaurantsController {
  constructor(private readonly restaurantsService: RestaurantsService) {}

  @Get()
  @ApiOperation({ summary: 'Browse all restaurants (public)' })
  @ApiResponse({ status: 200, description: 'List of restaurants' })
  async findAll(): Promise<RestaurantResponseDto[]> {
    const rests = await this.restaurantsService.findAll();
    return rests.map((r) => ({
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

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.RestaurantOwner)
  @ApiBearerAuth()
  @Post()
  @ApiOperation({ summary: 'Create a restaurant (Owner only)' })
  @ApiResponse({ status: 201, description: 'Restaurant created' })
  async create(
    @Body() createRestaurantDto: CreateRestaurantDto,
    @Request() req: RequestProp,
  ) {
    if (!req?.user) {
      throw new Error('User information is missing');
    }
    return this.restaurantsService.create(
      createRestaurantDto,
      req?.user as User,
    );
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.RestaurantOwner)
  @ApiBearerAuth()
  @Get('my')
  @ApiOperation({ summary: 'Get my owned restaurants (Owner only)' })
  @ApiResponse({ status: 200, description: 'List of owner\'s restaurants' })
  async findMyRestaurants(@Request() req: RequestProp) {
    const user = req?.user as User;
    return this.restaurantsService.findAllByOwner(user?.id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.RestaurantOwner)
  @ApiBearerAuth()
  @Patch(':id')
  @ApiOperation({ summary: 'Update a restaurant (Owner only)' })
  @ApiResponse({ status: 200, description: 'Restaurant updated' })
  async update(
    @Param('id') id: string,
    @Body() updateRestaurantDto: UpdateRestaurantDto,
    @Request() req: RequestProp,
  ) {
    const user = req?.user as User;
    return this.restaurantsService.update(id, updateRestaurantDto, user?.id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.RestaurantOwner)
  @ApiBearerAuth()
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a restaurant (Owner only)' })
  @ApiResponse({ status: 200, description: 'Restaurant deleted' })
  async remove(@Param('id') id: string, @Request() req: RequestProp) {
    const user = req?.user as User;
    await this.restaurantsService.remove(id, user?.id);
    return {
      message: 'restaurant removed successfully!',
    };
  }
}
