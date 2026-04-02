import { useState, useEffect } from 'react';
import { fetchSchedules, ScheduleItem } from '@/lib/api/schedules';
import { CreateScheduleDialog } from './create-schedule-dialog';
import { Calendar, Clock, MapPin, Video, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AttendanceDialog } from './attendance-dialog';

export function SchedulesTab({ classId, isTutor, classStudents }: { classId: string; isTutor: boolean; classStudents: any[] }) {
  const [schedules, setSchedules] = useState<ScheduleItem[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await fetchSchedules(classId);
      setSchedules(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [classId]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mt-4">
        <div>
           <h3 className="text-2xl font-bold flex items-center gap-3">
             <Calendar className="h-6 w-6 text-indigo-500" /> Quản lý Lịch Học
           </h3>
           <p className="text-muted-foreground text-sm mt-1">Lịch trình các buổi học và trạng thái điểm danh.</p>
        </div>
        {isTutor && <CreateScheduleDialog classId={classId} onCreated={loadData} />}
      </div>

      {loading ? (
        <div className="text-center py-12 text-muted-foreground animate-pulse">Đang tải lịch học...</div>
      ) : schedules.length === 0 ? (
        <div className="text-center p-12 bg-card rounded-xl border border-dashed text-muted-foreground">
          <Calendar className="w-12 h-12 mb-3 mx-auto opacity-20" />
          Chưa có lịch học nào được tạo cho lớp này.
        </div>
      ) : (
        <div className="space-y-4">
          {schedules.map((schedule) => (
            <div key={schedule.id} className="bg-card border p-5 rounded-xl shadow-sm flex flex-col md:flex-row gap-4 items-start md:items-center justify-between group hover:shadow-md transition-shadow">
              <div>
                <h4 className="font-bold text-lg mb-1">{schedule.title || 'Buổi học'}</h4>
                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4" /> {new Date(schedule.date).toLocaleDateString('vi-VN')}</span>
                  <span className="flex items-center gap-1.5 min-w-[120px]"><Clock className="w-4 h-4" /> {schedule.startTime} - {schedule.endTime}</span>
                  <span className="flex items-center gap-1.5 tracking-wider font-semibold">
                    {schedule.type === 'ONLINE' ? <><Video className="w-4 h-4 text-blue-500" /> ONLINE</> : <><MapPin className="w-4 h-4 text-rose-500" /> OFFLINE</>}
                  </span>
                </div>
              </div>
              
              <div className="flex w-full md:w-auto items-center justify-end">
                {isTutor ? (
                  <AttendanceDialog scheduleId={schedule.id} attendances={schedule.attendances || []} students={classStudents} onSuccess={loadData} />
                ) : (
                  <div className="px-4 py-2 bg-muted rounded-lg text-sm text-center">
                    Bạn chưa được điểm danh
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
