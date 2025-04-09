import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from 'src/auth/auth.controller';
import { AuthService } from 'src/auth/auth.service';
import { JwtAuthGuard } from 'src/auth/gaurds/jwt_auth.gaurd';
import { ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from 'src/users/user.entity'; // ✅ Import the enum

describe('AuthController', () => {
  let controller: AuthController;
  let service: AuthService;

  const mockAuthService = {
    register: jest.fn().mockResolvedValue({ accessToken: 'register-token' }),
    login: jest.fn().mockResolvedValue({ accessToken: 'login-token' }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
        JwtAuthGuard,
        Reflector,
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({
        canActivate: (context: ExecutionContext) => {
          const request = context.switchToHttp().getRequest();
          request.user = { id: 'user123', email: 'test@example.com', role: UserRole.Customer };
          return true;
        },
      })
      .compile();

    controller = module.get<AuthController>(AuthController);
    service = module.get<AuthService>(AuthService);
  });

  it('should call register and return access token', async () => {
    const result = await controller.register({
      name: 'Test',
      email: 'test@example.com',
      password: '123456',
      role: UserRole.Customer,
    });

    expect(result).toEqual({ accessToken: 'register-token' });
    expect(service.register).toHaveBeenCalled();
  });

  it('should call login and return access token', async () => {
    const result = await controller.login({
      email: 'test@example.com',
      password: '123456',
    });

    expect(result).toEqual({ accessToken: 'login-token' });
    expect(service.login).toHaveBeenCalled();
  });

  it('should return user profile', () => {
    const mockRequest = {
      user: { id: 'user123', email: 'test@example.com', role: UserRole.Customer },
    };

    const result = controller.getProfile(mockRequest as any);
    expect(result).toEqual(mockRequest.user);
  });
});
