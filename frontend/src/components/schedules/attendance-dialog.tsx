import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { buttonVariants } from '@/components/ui/button';
import { Button } from '@/components/ui/button';
import { AttendanceItem, bulkUpdateAttendance } from '@/lib/api/schedules';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Users, Loader2 } from 'lucide-react';

export function AttendanceDialog({ scheduleId, attendances, students, onSuccess }: { scheduleId: string; attendances: any[]; students: any[]; onSuccess: () => void }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Khởi tạo state local array dựa trên prop passed in
  const [localAttendances, setLocalAttendances] = useState<AttendanceItem[]>([]);

  // Hydrate local state when opening dialog
  const handleOpenStatus = (isOpen: boolean) => {
    setOpen(isOpen);
    if (isOpen) {
      // Map students to local attendance state
      const initialAttendances = students.map((enroll) => {
        const studentId = enroll.student.id;
        const existRecord = attendances.find((a) => a.studentId === studentId || a.student?.id === studentId);
        
        return {
          studentId: studentId,
          status: existRecord ? existRecord.status : 'PRESENT',
          note: existRecord?.note || '',
        };
      });
      setLocalAttendances(initialAttendances as AttendanceItem[]);
    }
  };

  const updateRecord = (studentId: string, updates: Partial<AttendanceItem>) => {
    setLocalAttendances(prev => prev.map(item => 
      item.studentId === studentId ? { ...item, ...updates } : item
    ));
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      await bulkUpdateAttendance(scheduleId, localAttendances);
      setOpen(false);
      onSuccess();
    } catch (e: any) {
      console.error(e);
      alert('Không thể lưu kết quả điểm danh');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PRESENT': return 'text-green-600 bg-green-50 border-green-200';
      case 'ABSENT': return 'text-red-600 bg-red-50 border-red-200';
      case 'LATE': return 'text-orange-600 bg-orange-50 border-orange-200';
      default: return '';
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenStatus}>
      <DialogTrigger className={buttonVariants({ variant: 'outline', className: 'gap-2 border-indigo-200 text-indigo-700 hover:bg-indigo-50 cursor-pointer' })}>
        <Users className="w-4 h-4" /> Bảng Điểm Danh {attendances.length > 0 && `(${attendances.length})`}
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-[700px] max-h-[85vh] flex flex-col overflow-hidden">
        <DialogHeader>
          <DialogTitle>Điểm danh buổi học</DialogTitle>
        </DialogHeader>
        
        <div className="flex-1 overflow-y-auto py-4">
           {students.length === 0 ? (
             <div className="text-center p-8 text-muted-foreground">Lớp học chưa có học sinh nào.</div>
           ) : (
             <div className="space-y-4">
               {students.map((enroll) => {
                 const currentAtt = localAttendances.find(a => a.studentId === enroll.student.id);
                 if (!currentAtt) return null;
                 
                 return (
                   <div key={enroll.student.id} className="flex flex-col sm:flex-row gap-3 items-start sm:items-center p-3 border rounded-lg bg-card">
                     <div className="flex-1 font-medium">{enroll.student.fullName}</div>
                     
                     <div className="flex items-center gap-3 w-full sm:w-auto">
                       <Select 
                         value={currentAtt.status} 
                         onValueChange={(val: any) => updateRecord(enroll.student.id, { status: val })}
                       >
                         <SelectTrigger className={`w-[130px] font-semibold ${getStatusColor(currentAtt.status)}`}>
                           <SelectValue />
                         </SelectTrigger>
                         <SelectContent>
                           <SelectItem value="PRESENT" className="text-green-600 font-medium">Có mặt (P)</SelectItem>
                           <SelectItem value="ABSENT" className="text-red-600 font-medium">Vắng mặt (A)</SelectItem>
                           <SelectItem value="LATE" className="text-orange-600 font-medium">Đi trễ (L)</SelectItem>
                         </SelectContent>
                       </Select>
                       
                       <Input 
                         placeholder="Ghi chú..." 
                         className="w-full sm:w-[200px]"
                         value={currentAtt.note || ''}
                         onChange={(e) => updateRecord(enroll.student.id, { note: e.target.value })}
                       />
                     </div>
                   </div>
                 );
               })}
             </div>
           )}
        </div>
        
        <div className="flex justify-end pt-4 border-t">
          <Button onClick={handleSave} disabled={loading || students.length === 0}>
            {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            Lưu Điểm Danh
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
