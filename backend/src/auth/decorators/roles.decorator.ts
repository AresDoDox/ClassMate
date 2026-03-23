import { SetMetadata } from '@nestjs/common';
import { Role } from '@prisma/client';

export const ROLES_KEY = 'roles';
// Decorator này chấp nhận 1 mảng các Role (VD: @Roles(Role.ADMIN, Role.TUTOR))
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);
