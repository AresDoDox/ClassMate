import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const messageResponse =
      exception instanceof HttpException
        ? exception.getResponse()
        : 'Lỗi hệ thống nội bộ (Internal Server Error)';

    let errorMessage = messageResponse;

    // Nếu message trả về từ ValidationPipe là một Object { message: [...] } thì ta lấy mảng lỗi đó ra
    if (typeof messageResponse === 'object' && messageResponse !== null) {
      if ('message' in messageResponse) {
        errorMessage = (messageResponse as any).message;
      }
    }

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message: errorMessage,
    });
  }
}
