import { api as axiosClient } from '../axios';

export interface ClassItem {
  id: string;
  name: string;
  description: string;
  subject: string;
  tutorId: string;
  createdAt: string;
  tutor: { fullName: string; email: string };
  _count: { students: number };
}

// 1. Lấy danh sách toàn bộ Lớp học
export const fetchClasses = async (): Promise<ClassItem[]> => {
  const { data } = await axiosClient.get('/classes');
  // Backend đã áp dụng TransformInterceptor nên cấu trúc chuẩn là { statusCode, message, data }
  return data.data;
};

// 2. Giáo viên Tạo lớp học mới
export const createClass = async (payload: { name: string; subject: string; description?: string }) => {
  const { data } = await axiosClient.post('/classes', payload);
  return data.data;
};

// 3. Học sinh tham gia lớp học
export const enrollClass = async (classId: string) => {
  const { data } = await axiosClient.post(`/classes/${classId}/enroll`);
  return data;
};
