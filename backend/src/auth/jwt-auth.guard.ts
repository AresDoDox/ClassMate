import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException('Bạn chưa đăng nhập!');
    }

    try {
      // Xác minh Token. Nếu đúng, gắn thông tin payload vào request.user để dùng cho Controller sau đó
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET || 'SECRET_KEY_NEEDS_TO_BE_SECURE',
      });
      request['user'] = payload;
    } catch {
      throw new UnauthorizedException('Token không hợp lệ hoặc đã hết hạn!');
    }

    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    // Tách chuỗi dạng "Bearer <token>" để lấy <token>
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
