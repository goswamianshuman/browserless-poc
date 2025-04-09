import { AuthService } from 'src/auth/auth.service';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UnauthorizedException } from '@nestjs/common';
import { UserRole } from 'src/users/user.entity'; // ✅ Import the enum

describe('AuthService', () => {
  let authService: AuthService;
  let usersService: Partial<UsersService>;
  let jwtService: Partial<JwtService>;

  beforeEach(() => {
    usersService = {
      create: jest.fn().mockImplementation(async (dto) => ({
        id: 'user123',
        ...dto,
      })),
      findByEmail: jest.fn().mockImplementation(async (email) => {
        if (email === 'test@example.com') {
          return {
            id: 'user123',
            email,
            passwordHash: await bcrypt.hash('password123', 10),
            role: UserRole.Customer,
          };
        }
        return null;
      }),
    };

    jwtService = {
      sign: jest.fn().mockReturnValue('fake-jwt-token'),
    };

    authService = new AuthService(usersService as UsersService, jwtService as JwtService);
  });

  it('should register a user and return access token', async () => {
    const result = await authService.register({
      name: 'John',
      email: 'john@example.com',
      password: 'securePass',
      role: UserRole.Customer,
    });

    expect(result).toEqual({ accessToken: 'fake-jwt-token' });
    expect(jwtService.sign).toHaveBeenCalled();
  });

  it('should login valid user and return access token', async () => {
    const result = await authService.login({
      email: 'test@example.com',
      password: 'password123',
    });

    expect(result).toEqual({ accessToken: 'fake-jwt-token' });
  });

  it('should throw UnauthorizedException for invalid user', async () => {
    await expect(
      authService.login({ email: 'unknown@example.com', password: 'wrong' }),
    ).rejects.toThrow(UnauthorizedException);
  });

  it('should throw UnauthorizedException for wrong password', async () => {
    await expect(
      authService.login({ email: 'test@example.com', password: 'wrongpass' }),
    ).rejects.toThrow(UnauthorizedException);
  });
});
