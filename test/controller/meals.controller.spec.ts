import { Test, TestingModule } from '@nestjs/testing';
import { MealsController } from 'src/meals/meals.controller';
import { MealsService } from 'src/meals/meals.service';
import { CreateMealDto } from 'src/meals/dto/create-meal.dto';
import { UpdateMealDto } from 'src/meals/dto/update-meal.dto';
describe('MealsController', () => {
  let controller: MealsController;
  let service: MealsService;

  const mockUser = { id: 'user-id' };
  const mockMeal = { id: 'meal-id', name: 'Pizza' };
  const mockService = {
    create: jest.fn().mockResolvedValue(mockMeal),
    findByRestaurant: jest.fn().mockResolvedValue([mockMeal]),
    update: jest.fn().mockResolvedValue({ ...mockMeal, name: 'Burger' }),
    remove: jest.fn().mockResolvedValue(undefined),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MealsController],
      providers: [{ provide: MealsService, useValue: mockService }],
    }).compile();

    controller = module.get<MealsController>(MealsController);
    service = module.get<MealsService>(MealsService);
  });

  it('should create a meal', async () => {
    const dto: CreateMealDto = { name: 'Pizza', price: 10 };
    const result = await controller.create('restaurant-id', dto, { user: mockUser } as any);
    expect(result).toEqual(mockMeal);
    expect(service.create).toHaveBeenCalledWith('restaurant-id', dto, mockUser);
  });

  it('should get meals by restaurant', async () => {
    const result = await controller.findByRestaurant('restaurant-id');
    expect(result).toEqual([mockMeal]);
    expect(service.findByRestaurant).toHaveBeenCalledWith('restaurant-id');
  });

  it('should update a meal', async () => {
    const dto: UpdateMealDto = { name: 'Burger' };
    const result = await controller.update('meal-id', dto, { user: mockUser } as any);
    expect(result).toEqual({ ...mockMeal, name: 'Burger' });
    expect(service.update).toHaveBeenCalledWith('meal-id', dto, mockUser);
  });

  it('should delete a meal', async () => {
    const result = await controller.remove('meal-id', { user: mockUser } as any);
    expect(result).toEqual({ message: 'Meal removed successfully!' });
    expect(service.remove).toHaveBeenCalledWith('meal-id', mockUser);
  });
});
