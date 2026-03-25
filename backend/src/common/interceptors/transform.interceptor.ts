import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface StandardResponse<T> {
  statusCode: number;
  message: string;
  data: T;
}

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<
  T,
  StandardResponse<T>
> {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<StandardResponse<T>> {
    return next.handle().pipe(
      map((resData) => {
        const statusCode = context.switchToHttp().getResponse().statusCode;

        // Xử lý nương tay đối với dữ liệu phân trang hoặc dữ liệu lộn xộn từ Auth
        if (resData && typeof resData === 'object' && resData.message) {
          const { message, ...otherData } = resData;
          return {
            statusCode,
            message: message,
            // Nếu có key data riêng thì lấy thẳng, không thì bọc hết đống rác lại
            data:
              resData.data !== undefined
                ? resData.data
                : Object.keys(otherData).length > 0
                  ? otherData
                  : null,
          };
        }

        // Response Trả về mặc định cho đa số API (CRUD)
        return {
          statusCode,
          message: 'Xử lý thành công',
          data: resData || null,
        };
      }),
    );
  }
}
