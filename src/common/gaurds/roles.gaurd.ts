import {
    Injectable,
    CanActivate,
    ExecutionContext,
    ForbiddenException,
  } from '@nestjs/common';
  import { Reflector } from '@nestjs/core';
  import { ROLES_KEY } from '../decorators/roles.decorator';
  import { UserRole } from '../../users/user.entity';
  
  @Injectable()
  export class RolesGuard implements CanActivate {
    constructor(private readonly reflector: Reflector) {}
  
    canActivate(ctx: ExecutionContext): boolean {
      const requiredRoles = this.reflector.get<UserRole[]>(
        ROLES_KEY,
        ctx.getHandler(),
      );
      // If no roles are specified, allow access
      if (!requiredRoles || requiredRoles.length === 0) {
        return true;
      }
  
      const request = ctx.switchToHttp().getRequest();
      const user = request.user; // populated by JwtAuthGuard
  
      if (!user || !requiredRoles.includes(user.role)) {
        throw new ForbiddenException(
          `Requires one of roles: ${requiredRoles.join(', ')}`,
        );
      }
  
      return true;
    }
  }
  