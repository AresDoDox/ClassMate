import { api } from '../axios';

export interface AttendanceItem {
  studentId: string;
  status: 'PRESENT' | 'ABSENT' | 'LATE';
  note?: string;
}

export interface ScheduleItem {
  id: string;
  title: string;
  date: string;
  startTime: string;
  endTime: string;
  type: 'ONLINE' | 'OFFLINE';
  classId: string;
  attendances: {
    id: string;
    status: 'PRESENT' | 'ABSENT' | 'LATE';
    note?: string;
    student: {
      id: string;
      fullName: string;
      email: string;
    };
  }[];
}

export const fetchSchedules = async (classId: string): Promise<ScheduleItem[]> => {
  const res = await api.get('/schedules', { params: { classId } });
  return res.data.data;
};

export const createSchedule = async (data: {
  classId: string;
  date: string;
  startTime: string;
  endTime: string;
  title?: string;
  type?: 'ONLINE' | 'OFFLINE';
}) => {
  const res = await api.post('/schedules', data);
  return res.data;
};

export const bulkUpdateAttendance = async (scheduleId: string, attendances: AttendanceItem[]) => {
  const res = await api.post('/attendances/bulk', { scheduleId, attendances });
  return res.data;
};
