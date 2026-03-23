import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '@prisma/client';
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // Lấy danh sách các quyền tối thiểu từ Decorator @Roles
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // Nếu không ai cắm biển cấm (@Roles) -> Cho phép đi qua tự do
    if (!requiredRoles) {
      return true;
    }

    // Lấy thông tin người dùng được giải mã từ Token (đứng sau JwtAuthGuard)
    const { user } = context.switchToHttp().getRequest();

    // Check xem chức vụ của người dùng có nằm trong danh sách cho phép không
    const hasPermission = requiredRoles.some((role) => user?.role === role);

    if (!hasPermission) {
      throw new ForbiddenException(
        'Bạn không có quyền truy cập chức năng này!',
      );
    }

    return true;
  }
}
