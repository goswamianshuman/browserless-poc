
import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Restaurant } from './restaurant.entity';
import { CreateRestaurantDto } from './dto/create-restorant.dto';
import { UpdateRestaurantDto } from './dto/update-restorant.dto';
import { User } from '../users/user.entity';

@Injectable()
export class RestaurantsService {
  constructor(
    @InjectRepository(Restaurant)
    private restaurantsRepository: Repository<Restaurant>,
  ) {}

  async create(createRestaurantDto: CreateRestaurantDto, owner: User): Promise<Restaurant> {
    const restaurant = this.restaurantsRepository.create({ ...createRestaurantDto, owner });
    return this.restaurantsRepository.save(restaurant);
  }

  async findAll(): Promise<Restaurant[]> {
    return this.restaurantsRepository.find({ relations: ['owner'] }); //any fix nidded ?
  }

  async findAllByOwner(ownerId: string): Promise<Restaurant[]> {
    return this.restaurantsRepository.find({ where: { owner: { id: ownerId } } });
  }

  async update(id: string, updateRestaurantDto: UpdateRestaurantDto, ownerId: string): Promise<Restaurant> {
    const restaurant = await this.restaurantsRepository.findOne({ where: { id }, relations: ['owner'] });
    if (!restaurant) {
      throw new NotFoundException(`Restaurant with ID ${id} not found`);
    }
    if (restaurant.owner.id !== ownerId) {
      throw new ForbiddenException('You do not have permission to update this restaurant');
    }
    Object.assign(restaurant, updateRestaurantDto);
    return this.restaurantsRepository.save(restaurant);
  }

  async remove(id: string, ownerId: string): Promise<void> {
    const restaurant = await this.restaurantsRepository.findOne({ where: { id }, relations: ['owner'] });
    if (!restaurant) {
      throw new NotFoundException(`Restaurant with ID ${id} not found`);
    }
    if (restaurant.owner.id !== ownerId) {
      throw new ForbiddenException('You do not have permission to delete this restaurant');
    }
    await this.restaurantsRepository.remove(restaurant);
  }
}
