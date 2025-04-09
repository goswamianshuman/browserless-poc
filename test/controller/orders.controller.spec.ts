import { Test, TestingModule } from '@nestjs/testing';
import { OrdersController } from 'src/orders/orders.controller';
import { OrdersService } from 'src/orders/orders.service';
import { CreateOrderDto } from 'src/orders/dto/create-order.dto';
import { UpdateOrderStatusDto } from 'src/orders/dto/update-order-status.dto';
import { OrderStatus } from 'src/orders/order.entity';
import { User } from 'src/users/user.entity';
import { UserRole } from 'src/users/user.entity';

const mockUser: User = {
    id: 'user-id',
    email: 'test@example.com',
    name: 'Test User',
    passwordHash: 'hashed-password',
    role: UserRole.Customer,
    createdAt: new Date(),
    updatedAt: new Date(),
    restaurants: [],
  };
  
  describe('OrdersController', () => {
    let controller: OrdersController;
    let service: OrdersService;
  
    const mockService = {
      create: jest.fn(),
      findMyOrders: jest.fn(),
      findOne: jest.fn(),
      findAvailableOrders: jest.fn(),
      acceptOrder: jest.fn(),
      updateStatus: jest.fn(),
    };
  
    beforeEach(async () => {
      const module: TestingModule = await Test.createTestingModule({
        controllers: [OrdersController],
        providers: [
          {
            provide: OrdersService,
            useValue: mockService,
          },
        ],
      }).compile();
  
      controller = module.get<OrdersController>(OrdersController);
      service = module.get<OrdersService>(OrdersService);
    });
  
    it('should create an order', async () => {
      const dto: CreateOrderDto = {
        restaurantId: 'restaurant-id',
        items: [{ mealId: 'meal-1', quantity: 2 }],
      };
      const expectedResult = { id: 'order-id' };
      mockService.create.mockResolvedValue(expectedResult);
  
      const result = await controller.create(dto, { user: mockUser } as any);
      expect(result).toEqual(expectedResult);
      expect(service.create).toHaveBeenCalledWith(mockUser, dto);
    });
  
    it('should get user orders', async () => {
      const expectedOrders = [{ id: 'order1' }];
      mockService.findMyOrders.mockResolvedValue(expectedOrders);
  
      const result = await controller.findMy({ user: mockUser } as any);
      expect(result).toEqual(expectedOrders);
      expect(service.findMyOrders).toHaveBeenCalledWith(mockUser);
    });
  
    it('should get a specific order', async () => {
      const order = { id: 'order1' };
      mockService.findOne.mockResolvedValue(order);
  
      const result = await controller.findOne('order1', { user: mockUser } as any);
      expect(result).toEqual(order);
      expect(service.findOne).toHaveBeenCalledWith('order1', mockUser);
    });
  
    it('should get available orders', async () => {
      const orders = [{ id: 'order1' }];
      mockService.findAvailableOrders.mockResolvedValue(orders);
  
      const result = await controller.findAvailable();
      expect(result).toEqual(orders);
      expect(service.findAvailableOrders).toHaveBeenCalled();
    });
  
    it('should accept an order', async () => {
      const accepted = { id: 'order1' };
      mockService.acceptOrder.mockResolvedValue(accepted);
  
      const result = await controller.accept('order1', { user: mockUser } as any);
      expect(result).toEqual(accepted);
      expect(service.acceptOrder).toHaveBeenCalledWith('order1', mockUser);
    });
  
    it('should update order status', async () => {
      const dto: UpdateOrderStatusDto = {
        status: OrderStatus.PICKED_UP,
      };
      const updated = { id: 'order1', status: OrderStatus.PICKED_UP };
      mockService.updateStatus.mockResolvedValue(updated);
  
      const result = await controller.updateStatus('order1', dto, { user: mockUser } as any);
      expect(result).toEqual(updated);
      expect(service.updateStatus).toHaveBeenCalledWith('order1', dto, mockUser);
    });
  });
  