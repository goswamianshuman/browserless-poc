import { Test, TestingModule } from '@nestjs/testing';
import { RestaurantsService } from 'src/restaurants/restaurants.service';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Restaurant } from 'src/restaurants/restaurant.entity';
import { User, UserRole } from 'src/users/user.entity';
import { CreateRestaurantDto } from 'src/restaurants/dto/create-restorant.dto';
import { UpdateRestaurantDto } from 'src/restaurants/dto/update-restorant.dto';
import { NotFoundException, ForbiddenException } from '@nestjs/common';

describe('RestaurantsService', () => {
    let service: RestaurantsService;
    let repo: Repository<Restaurant>;
  
    const mockOwner: User = {
      id: 'owner-id',
      email: 'owner@example.com',
      name: 'Owner',
      passwordHash: 'hashed',
      role: UserRole.RestaurantOwner,
      createdAt: new Date(),
      updatedAt: new Date(),
      restaurants: [],
    };
  
    const mockRestaurant: Restaurant = {
      id: 'rest-1',
      name: 'Test Resto',
      description: 'Yummy food',
      createdAt: new Date(),
      updatedAt: new Date(),
      owner: mockOwner,
      meals: [],
    };
  
    const mockRepo = {
      create: jest.fn(),
      save: jest.fn(),
      find: jest.fn(),
      findOne: jest.fn(),
      remove: jest.fn(),
    };
  
    beforeEach(async () => {
      const module: TestingModule = await Test.createTestingModule({
        providers: [
          RestaurantsService,
          {
            provide: getRepositoryToken(Restaurant),
            useValue: mockRepo,
          },
        ],
      }).compile();
  
      service = module.get<RestaurantsService>(RestaurantsService);
      repo = module.get<Repository<Restaurant>>(getRepositoryToken(Restaurant));
    });
  
    afterEach(() => jest.clearAllMocks());
  
    it('should create a restaurant', async () => {
      const dto: CreateRestaurantDto = { name: 'Resto', description: 'Tasty' };
      const restaurantEntity = { ...dto, owner: mockOwner };
  
      mockRepo.create.mockReturnValue(restaurantEntity);
      mockRepo.save.mockResolvedValue({ ...restaurantEntity, id: 'rest-id' });
  
      const result = await service.create(dto, mockOwner);
      expect(result).toEqual(expect.objectContaining({ name: dto.name }));
      expect(mockRepo.create).toHaveBeenCalledWith({ ...dto, owner: mockOwner });
      expect(mockRepo.save).toHaveBeenCalled();
    });
  
    it('should return all restaurants', async () => {
      mockRepo.find.mockResolvedValue([mockRestaurant]);
      const result = await service.findAll();
      expect(result).toEqual([mockRestaurant]);
      expect(mockRepo.find).toHaveBeenCalledWith({ relations: ['owner'] });
    });
  
    it('should return restaurants owned by a specific user', async () => {
      mockRepo.find.mockResolvedValue([mockRestaurant]);
      const result = await service.findAllByOwner(mockOwner.id);
      expect(result).toEqual([mockRestaurant]);
      expect(mockRepo.find).toHaveBeenCalledWith({
        where: { owner: { id: mockOwner.id } },
      });
    });
  
    it('should update a restaurant', async () => {
      const updateDto: UpdateRestaurantDto = { name: 'Updated' };
      mockRepo.findOne.mockResolvedValue(mockRestaurant);
      mockRepo.save.mockResolvedValue({ ...mockRestaurant, ...updateDto });
  
      const result = await service.update('rest-1', updateDto, mockOwner.id);
      expect(result.name).toBe(updateDto.name);
      expect(mockRepo.save).toHaveBeenCalled();
    });
  
    it('should throw ForbiddenException if update attempted by non-owner', async () => {
      mockRepo.findOne.mockResolvedValue(mockRestaurant);
      await expect(
        service.update('rest-1', { name: 'Oops' }, 'wrong-owner'),
      ).rejects.toThrow(ForbiddenException);
    });
  
    it('should delete a restaurant', async () => {
      mockRepo.findOne.mockResolvedValue(mockRestaurant);
      mockRepo.remove.mockResolvedValue(mockRestaurant);
  
      await expect(service.remove('rest-1', mockOwner.id)).resolves.toBeUndefined();
      expect(mockRepo.remove).toHaveBeenCalledWith(mockRestaurant);
    });
  
    it('should throw NotFoundException when deleting non-existent restaurant', async () => {
      mockRepo.findOne.mockResolvedValue(null);
      await expect(service.remove('invalid-id', mockOwner.id)).rejects.toThrow(NotFoundException);
    });
  
    it('should throw ForbiddenException when deleting someone else’s restaurant', async () => {
      mockRepo.findOne.mockResolvedValue(mockRestaurant);
      await expect(service.remove('rest-1', 'wrong-id')).rejects.toThrow(ForbiddenException);
    });
  });