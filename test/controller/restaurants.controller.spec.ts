import { Test, TestingModule } from '@nestjs/testing';
import { RestaurantsController } from 'src/restaurants/restaurants.controller';
import { RestaurantsService } from 'src/restaurants/restaurants.service';
import { CreateRestaurantDto } from 'src/restaurants/dto/create-restorant.dto';
import { UpdateRestaurantDto } from 'src/restaurants/dto/update-restorant.dto';
import { User , UserRole} from 'src/users/user.entity';

const mockUser: User = {
    id: 'user-id',
    name: 'Test Owner',
    email: 'owner@example.com',
    passwordHash: 'hashed-password',
    role: UserRole.RestaurantOwner,
    createdAt: new Date(),
    updatedAt: new Date(),
    restaurants: [],
  };
  
  describe('RestaurantsController', () => {
    let controller: RestaurantsController;
    let service: RestaurantsService;
  
    const mockService = {
      findAll: jest.fn(),
      create: jest.fn(),
      findAllByOwner: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
    };
  
    beforeEach(async () => {
      const module: TestingModule = await Test.createTestingModule({
        controllers: [RestaurantsController],
        providers: [
          {
            provide: RestaurantsService,
            useValue: mockService,
          },
        ],
      }).compile();
  
      controller = module.get<RestaurantsController>(RestaurantsController);
      service = module.get<RestaurantsService>(RestaurantsService);
    });
  
    it('should return all restaurants', async () => {
      const mockRestaurants = [
        {
          id: '1',
          name: 'Pizza Place',
          description: 'Delicious pizza',
          createdAt: new Date(),
          updatedAt: new Date(),
          owner: mockUser,
        },
      ];
      mockService.findAll.mockResolvedValue(mockRestaurants);
  
      const result = await controller.findAll();
      expect(result).toEqual([
        {
          id: '1',
          name: 'Pizza Place',
          description: 'Delicious pizza',
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date),
          owner: {
            id: mockUser.id,
            name: mockUser.name,
            email: mockUser.email,
          },
        },
      ]);
      expect(service.findAll).toHaveBeenCalled();
    });
  
    it('should create a restaurant', async () => {
      const dto: CreateRestaurantDto = { name: 'New Spot', description: 'Test desc' };
      const expected = { id: 'rest-id', ...dto };
      mockService.create.mockResolvedValue(expected);
  
      const result = await controller.create(dto, { user: mockUser } as any);
      expect(result).toEqual(expected);
      expect(service.create).toHaveBeenCalledWith(dto, mockUser);
    });
  
    it('should return my restaurants', async () => {
      const expected = [{ id: 'r1' }];
      mockService.findAllByOwner.mockResolvedValue(expected);
  
      const result = await controller.findMyRestaurants({ user: mockUser } as any);
      expect(result).toEqual(expected);
      expect(service.findAllByOwner).toHaveBeenCalledWith(mockUser.id);
    });
  
    it('should update a restaurant', async () => {
      const dto: UpdateRestaurantDto = { name: 'Updated' };
      const expected = { id: 'rest-id', name: 'Updated' };
      mockService.update.mockResolvedValue(expected);
  
      const result = await controller.update('rest-id', dto, { user: mockUser } as any);
      expect(result).toEqual(expected);
      expect(service.update).toHaveBeenCalledWith('rest-id', dto, mockUser.id);
    });
  
    it('should delete a restaurant', async () => {
      mockService.remove.mockResolvedValue(undefined);
  
      const result = await controller.remove('rest-id', { user: mockUser } as any);
      expect(result).toEqual({ message: 'restaurant removed successfully!' });
      expect(service.remove).toHaveBeenCalledWith('rest-id', mockUser.id);
    });
  });