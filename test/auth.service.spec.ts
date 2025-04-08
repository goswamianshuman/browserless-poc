import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../src/auth/auth.service';
import { UsersService } from '../src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

describe('AuthService', () => {
  let authService: AuthService;
  let usersService: Partial<UsersService>;
  let jwtService: Partial<JwtService>;

  beforeEach(async () => {
    usersService = {
      create: jest.fn(),
      findByEmail: jest.fn(),
    };
    jwtService = {
      sign: jest.fn().mockReturnValue('test-token'),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: usersService },
        { provide: JwtService, useValue: jwtService },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
  });

  it('should register a user and return token', async () => {
    const dto = { name: 'Test', email: 'test@example.com', password: 'pass123', role: 'Customer' };
    (usersService.create as jest.Mock).mockResolvedValue({ id: '1', email: dto.email, role: dto.role });
    jest.spyOn(bcrypt, 'hash').mockResolvedValue('hashed');

    const result = await authService.register(dto as any);
    expect(result).toEqual({ accessToken: 'test-token' });
    expect(usersService.create).toHaveBeenCalled();
  });

  it('should login valid user and return token', async () => {
    const dto = { email: 'test@example.com', password: 'pass123' };
    (usersService.findByEmail as jest.Mock).mockResolvedValue({ passwordHash: await bcrypt.hash(dto.password, 10), id: '1', role: 'Customer' });

    const result = await authService.login(dto as any);
    expect(result).toEqual({ accessToken: 'test-token' });
  });

  it('should throw on invalid login', async () => {
    (usersService.findByEmail as jest.Mock).mockResolvedValue(null);
    await expect(authService.login({ email: 'x', password: 'y' } as any)).rejects.toThrow();
  });
});
