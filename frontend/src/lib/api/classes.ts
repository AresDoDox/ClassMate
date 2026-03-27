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

export const fetchClasses = async (): Promise<ClassItem[]> => {
  const { data } = await axiosClient.get('/classes');
  return data.data;
};

export const createClass = async (payload: { name: string; subject: string; description?: string }) => {
  const { data } = await axiosClient.post('/classes', payload);
  return data.data;
};

export const enrollClass = async (classId: string) => {
  const response = await axiosClient.post(`/classes/${classId}/enroll`);
  return response.data.data;
};

export const fetchClassInfo = async (classId: string) => {
  const response = await axiosClient.get(`/classes/${classId}`);
  return response.data.data;
};
