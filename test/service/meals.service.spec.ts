import { Test, TestingModule } from '@nestjs/testing';
import { MealsService } from 'src/meals/meals.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Meal } from 'src/meals/meal.entity';
import { Restaurant } from 'src/restaurants/restaurant.entity';
import { Repository } from 'typeorm';
import { NotFoundException, ForbiddenException } from '@nestjs/common';

describe('MealsService', () => {
  let service: MealsService;
  let mealRepo: Repository<Meal>;
  let restaurantRepo: Repository<Restaurant>;

  const mockUser = { id: 'owner-id' } as any;

  const mockMealRepo = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    delete: jest.fn(),
  };

  const mockRestaurantRepo = {
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MealsService,
        { provide: getRepositoryToken(Meal), useValue: mockMealRepo },
        { provide: getRepositoryToken(Restaurant), useValue: mockRestaurantRepo },
      ],
    }).compile();

    service = module.get<MealsService>(MealsService);
    mealRepo = module.get<Repository<Meal>>(getRepositoryToken(Meal));
    restaurantRepo = module.get<Repository<Restaurant>>(getRepositoryToken(Restaurant));
  });

  describe('create', () => {
    it('should throw if restaurant not found', async () => {
      mockRestaurantRepo.findOne.mockResolvedValue(null);
      await expect(
        service.create('rest-id', { name: 'Pizza', price: 10 }, mockUser),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw if not owner', async () => {
      mockRestaurantRepo.findOne.mockResolvedValue({ id: 'rest-id', owner: { id: 'someone-else' } });
      await expect(
        service.create('rest-id', { name: 'Pizza', price: 10 }, mockUser),
      ).rejects.toThrow(ForbiddenException);
    });

    it('should create and return meal', async () => {
      const dto = { name: 'Pizza', price: 10 };
      const restaurant = { id: 'rest-id', owner: mockUser };
      const meal = { id: 'meal-id', ...dto, restaurant };

      mockRestaurantRepo.findOne.mockResolvedValue(restaurant);
      mockMealRepo.create.mockReturnValue(meal);
      mockMealRepo.save.mockResolvedValue(meal);

      const result = await service.create('rest-id', dto, mockUser);
      expect(result).toEqual(meal);
    });
  });

  describe('findByRestaurant', () => {
    it('should return meals', async () => {
      const meals = [{ name: 'Pizza' }];
      mockMealRepo.find.mockResolvedValue(meals);
      const result = await service.findByRestaurant('rest-id');
      expect(result).toEqual(meals);
    });
  });

  describe('update', () => {
    it('should throw if meal not found', async () => {
      mockMealRepo.findOne.mockResolvedValue(null);
      await expect(service.update('meal-id', {}, mockUser)).rejects.toThrow(NotFoundException);
    });

    it('should throw if user is not owner', async () => {
      const meal = { restaurant: { owner: { id: 'someone-else' } } };
      mockMealRepo.findOne.mockResolvedValue(meal);
      await expect(service.update('meal-id', {}, mockUser)).rejects.toThrow(ForbiddenException);
    });

    it('should update and return meal', async () => {
      const meal = {
        id: 'meal-id',
        name: 'Pizza',
        restaurant: { owner: mockUser },
      };
      mockMealRepo.findOne.mockResolvedValue(meal);
      mockMealRepo.save.mockResolvedValue({ ...meal, name: 'Burger' });

      const result = await service.update('meal-id', { name: 'Burger' }, mockUser);
      expect(result).toEqual({ ...meal, name: 'Burger' });
    });
  });

  describe('remove', () => {
    it('should throw if meal not found', async () => {
      mockMealRepo.findOne.mockResolvedValue(null);
      await expect(service.remove('meal-id', mockUser)).rejects.toThrow(NotFoundException);
    });

    it('should throw if user is not owner', async () => {
      const meal = { restaurant: { owner: { id: 'someone-else' } } };
      mockMealRepo.findOne.mockResolvedValue(meal);
      await expect(service.remove('meal-id', mockUser)).rejects.toThrow(ForbiddenException);
    });

    it('should delete the meal', async () => {
      const meal = { restaurant: { owner: mockUser } };
      mockMealRepo.findOne.mockResolvedValue(meal);
      mockMealRepo.delete.mockResolvedValue(undefined);
      await service.remove('meal-id', mockUser);
      expect(mockMealRepo.delete).toHaveBeenCalledWith('meal-id');
    });
  });
});
