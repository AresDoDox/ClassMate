import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiConsumes, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import { multerConfig } from './multer.config';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import * as dotenv from 'dotenv';
dotenv.config();

@ApiTags('Uploads')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('upload')
export class UploadController {
  @Post()
  @UseInterceptors(FileInterceptor('file', multerConfig))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'Chọn file ảnh hoặc tài liệu (Tối đa 5MB)',
        },
      },
    },
  })
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('Không tìm thấy file để upload!');
    }

    // Lấy URL của Server từ biến môi trường (Hoặc localhost nếu chưa có)
    const serverUrl = process.env.APP_URL || 'http://localhost:3001';
    const fileUrl = `${serverUrl}/uploads/${file.filename}`;

    return {
      message: 'Upload file thành công!',
      fileUrl,
      fileName: file.originalname,
      size: file.size,
    };
  }
}
