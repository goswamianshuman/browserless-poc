import { Test, TestingModule } from '@nestjs/testing';
import { OrdersService } from 'src/orders/orders.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Order } from 'src/orders/order.entity';
import { OrderItem } from 'src/order-items/order-items.entity';
import { Restaurant } from 'src/restaurants/restaurant.entity';
import { Meal } from 'src/meals/meal.entity';
import { OrdersGateway } from 'src/orders/orders.gateway';
import { CreateOrderDto } from 'src/orders/dto/create-order.dto';
import { User } from 'src/users/user.entity';

const mockRepo = () => ({
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
  });
  
  describe('OrdersService', () => {
    let service: OrdersService;
    let orderRepo: ReturnType<typeof mockRepo>;
    let itemRepo: ReturnType<typeof mockRepo>;
    let restRepo: ReturnType<typeof mockRepo>;
    let mealRepo: ReturnType<typeof mockRepo>;
    let ordersGateway: OrdersGateway;
  
    beforeEach(async () => {
      const module: TestingModule = await Test.createTestingModule({
        providers: [
          OrdersService,
          { provide: getRepositoryToken(Order), useFactory: mockRepo },
          { provide: getRepositoryToken(OrderItem), useFactory: mockRepo },
          { provide: getRepositoryToken(Restaurant), useFactory: mockRepo },
          { provide: getRepositoryToken(Meal), useFactory: mockRepo },
          {
            provide: OrdersGateway,
            useValue: {
              broadcastOrderCreated: jest.fn(),
              broadcastOrderStatusUpdated: jest.fn(),
            },
          },
        ],
      }).compile();
  
      service = module.get<OrdersService>(OrdersService);
      orderRepo = module.get(getRepositoryToken(Order));
      itemRepo = module.get(getRepositoryToken(OrderItem));
      restRepo = module.get(getRepositoryToken(Restaurant));
      mealRepo = module.get(getRepositoryToken(Meal));
      ordersGateway = module.get(OrdersGateway);
    });
  
    it('should create an order', async () => {
      const user = { id: '123' } as User;
  
      const createOrderDto: CreateOrderDto = {
        restaurantId: 'rest-id',
        items: [
          { mealId: 'meal-1', quantity: 2 },
          { mealId: 'meal-2', quantity: 1 },
        ],
      };
  
      restRepo.findOne.mockResolvedValue({ id: 'rest-id' });
      mealRepo.findOne.mockResolvedValue({ id: 'meal-1', price: 10 });
  
      orderRepo.create.mockReturnValue({ id: 'order-id' });
      orderRepo.save.mockResolvedValue({ id: 'order-id' });
  
      itemRepo.create.mockReturnValue({});
      itemRepo.save.mockResolvedValue([]);
  
      orderRepo.findOne.mockResolvedValue({
        id: 'order-id',
        restaurant: {},
        items: [],
      });
  
      const result = await service.create(user, createOrderDto);
  
      expect(result).toHaveProperty('id', 'order-id');
      expect(restRepo.findOne).toHaveBeenCalled();
      expect(orderRepo.save).toHaveBeenCalled();
      expect(itemRepo.save).toHaveBeenCalled();
      expect(ordersGateway.broadcastOrderCreated).toHaveBeenCalled();
    });
  });