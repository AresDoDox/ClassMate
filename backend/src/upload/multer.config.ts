import { diskStorage } from 'multer';
import { extname } from 'path';
import { HttpException, HttpStatus } from '@nestjs/common';
import * as fs from 'fs';

// Tự động tạo thư mục uploads nếu chưa tồn tại
const uploadPath = './uploads';
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath);
}

export const multerConfig = {
  storage: diskStorage({
    destination: uploadPath,
    filename: (req, file, cb) => {
      // Đổi tên file để tránh trùng lặp: chuỗi random + đuôi gốc (VD: a1b2c3d4.jpg)
      const randomName = Array(32)
        .fill(null)
        .map(() => Math.round(Math.random() * 16).toString(16))
        .join('');
      return cb(null, `${randomName}${extname(file.originalname)}`);
    },
  }),
  fileFilter: (req: any, file: any, cb: any) => {
    // Chỉ cho phép upload hình ảnh và tài liệu thông thường
    if (file.mimetype.match(/\/(jpg|jpeg|png|gif|pdf|doc|docx)$/)) {
      cb(null, true);
    } else {
      cb(
        new HttpException(
          `Định dạng file không được hỗ trợ (Chỉ nhận jpg, png, pdf, docx)`,
          HttpStatus.BAD_REQUEST,
        ),
        false,
      );
    }
  },
  limits: {
    // Giới hạn kích thước file 5MB
    fileSize: 5 * 1024 * 1024,
  },
};
