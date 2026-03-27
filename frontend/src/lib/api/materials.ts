import { api } from '../axios';

export interface MaterialItem {
  id: string;
  classId: string;
  title: string;
  description?: string;
  fileUrl?: string;
  type: 'DOCUMENT' | 'VIDEO' | 'ASSIGNMENT';
  createdAt: string;
}

export const getMaterials = async (classId: string): Promise<MaterialItem[]> => {
  const response = await api.get(`/materials?classId=${classId}`);
  return response.data.data;
};

export const createMaterial = async (data: {
  classId: string;
  title: string;
  description?: string;
  fileUrl?: string;
  type?: string;
}) => {
  const response = await api.post('/materials', data);
  return response.data.data;
};
