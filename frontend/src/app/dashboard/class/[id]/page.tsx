'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store/store';
import { setCredentials } from '@/store/slices/authSlice';
import { fetchClassInfo } from '@/lib/api/classes';
// Mở rộng thêm nếu có Material type

// UI Components
import { Button, buttonVariants } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, BookOpen, Users, FileText, Download } from 'lucide-react';
import { CreateMaterialDialog } from '@/components/materials/create-material-dialog';

interface ClassDetailType {
  id: string;
  name: string;
  description: string;
  subject: string;
  tutorId: string;
  createdAt: string;
  tutor: { fullName: string; email: string };
  _count: { students: number };
  materials: {
    id: string;
    title: string;
    description: string;
    type: 'DOCUMENT' | 'VIDEO' | 'ASSIGNMENT';
    fileUrl: string;
    createdAt: string;
  }[];
  students: {
    student: {
      id: string;
      fullName: string;
      email: string;
      role: string;
    };
  }[];
}

export default function ClassDetailPage() {
  const router = useRouter();
  const params = useParams(); // URL params: /dashboard/class/[id]
  const classId = params.id as string;
  const dispatch = useDispatch();

  const user = useSelector((state: RootState) => state.auth.user);
  
  const [loading, setLoading] = useState(true);
  const [classData, setClassData] = useState<ClassDetailType | null>(null);

  const loadData = async () => {
    try {
      setLoading(true);
      const info = await fetchClassInfo(classId);
      setClassData(info);
    } catch (error) {
      console.error(error);
      alert('Không tìm thấy thông tin lớp học hoặc bạn không có quyền!');
      router.push('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Phân quyền nội bộ phía UI
    const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
    const localUser = typeof window !== 'undefined' ? localStorage.getItem('user') : null;
    
    if (!user) {
      if (localUser && token) {
        dispatch(setCredentials({ user: JSON.parse(localUser), access_token: token }));
      } else {
        router.push('/login');
        return;
      }
    }

    if (classId) {
      loadData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [classId, user, router]);

  if (loading || !classData) {
    return <div className="min-h-screen flex items-center justify-center font-bold text-primary animate-pulse">Đang tải Phòng Học Ảo...</div>;
  }

  // Teacher Group => Hiện Tool Upload tài liệu
  const isTutor = user?.role === 'TUTOR' || user?.role === 'ADMIN';

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header Quay Lại */}
      <header className="bg-background border-b border-border shadow-sm sticky top-0 z-10 w-full">
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.push('/dashboard')} className="hover:bg-muted">
            <ArrowLeft className="h-5 w-5 text-muted-foreground" />
          </Button>
          <div className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-primary" />
            <h1 className="text-lg font-bold text-foreground">Trở về Thư viện</h1>
          </div>
        </div>
      </header>

      {/* Thông tin Overview */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in zoom-in-95 duration-500">
        <div className="bg-card border border-border shadow-md rounded-2xl p-8 mb-8 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-8 opacity-5">
             {/* Background Icon */}
             <BookOpen className="w-32 h-32" />
          </div>
          <h2 className="text-4xl font-extrabold mb-3 text-foreground tracking-tight">{classData.name}</h2>
          <p className="text-lg text-muted-foreground mb-6 max-w-2xl leading-relaxed">{classData.description || 'Chưa có thông tin mô tả chi tiết cho lớp học này.'}</p>
          
          <div className="flex flex-wrap items-center gap-4 sm:gap-8 text-sm">
            <div className="bg-muted px-4 py-2 rounded-full font-medium">✨ Môn học: {classData.subject}</div>
            <div className="bg-primary/10 text-primary px-4 py-2 rounded-full font-medium">👨‍🏫 GV: {classData.tutor?.fullName}</div>
            <div className="bg-green-500/10 text-green-600 px-4 py-2 rounded-full font-medium flex items-center gap-2"><Users className="w-4 h-4"/> Học viên: {classData._count?.students}</div>
          </div>
        </div>

        {/* Nội dung Môn Học bằng View Tabs */}
        <Tabs defaultValue="materials" className="w-full">
          <TabsList className="grid w-full grid-cols-2 p-1 bg-muted/50 rounded-xl mb-6 shadow-inner !h-auto cursor-pointer">
            <TabsTrigger value="materials" className="rounded-lg py-2 data-[state=active]:shadow-sm cursor-pointer">Tài nguyên Lớp</TabsTrigger>
            <TabsTrigger value="students" className="rounded-lg py-2 data-[state=active]:shadow-sm cursor-pointer">Danh sách Sinh viên</TabsTrigger>
          </TabsList>
          
          {/* TAB TÀI NGUYÊN (MATERIALS) */}
          <TabsContent value="materials" className="space-y-6">
            <div className="flex items-center justify-between mt-4">
              <div>
                 <h3 className="text-2xl font-bold flex items-center gap-3">
                   <FileText className="h-6 w-6 text-blue-500" /> Tài liệu Khóa học
                 </h3>
                 <p className="text-muted-foreground text-sm mt-1">Nơi lưu trữ File, Video, Bài giảng của Giáo viên.</p>
              </div>
              {/* Tool Upload */}
              {isTutor && <CreateMaterialDialog classId={classData.id} onCreated={loadData} />}
            </div>

            {(!classData.materials || classData.materials.length === 0) ? (
              <div className="p-12 border-2 border-dashed border-border rounded-xl text-center flex flex-col items-center bg-card/50">
                <FileText className="w-12 h-12 text-muted-foreground mb-4 opacity-50" />
                <h4 className="text-lg font-semibold text-foreground mb-1">Trống trải quá!</h4>
                <p className="text-muted-foreground">Hiện tại Giáo viên vẫn chưa tải lên bất kì File tài liệu nào. Vui lòng quay lại sau.</p>
              </div>
            ) : (
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-4">
               {classData.materials.map((mat) => {
                 let tagColor = "bg-slate-100 text-slate-700";
                 if (mat.type === 'VIDEO') tagColor = "bg-red-100 text-red-700";
                 if (mat.type === 'ASSIGNMENT') tagColor = "bg-orange-100 text-orange-700";

                 return (
                   <div key={mat.id} className="p-5 bg-card border border-border/60 rounded-xl shadow-sm hover:shadow-md hover:-translate-y-1 transition-all flex flex-col justify-between">
                     <div>
                       <div className="flex justify-between items-start gap-2">
                         <h4 className="font-bold text-lg text-foreground line-clamp-1">{mat.title}</h4>
                         <span className={`text-[10px] font-bold px-2 py-0.5 rounded-sm uppercase tracking-wider ${tagColor}`}>
                           {mat.type}
                         </span>
                       </div>
                       <p className="text-sm text-muted-foreground mt-2 line-clamp-3">{mat.description || 'Tài liệu không bao gồm chú thích.'}</p>
                     </div>
                     
                     <div className="mt-6 flex items-center justify-between">
                        <span className="text-xs text-muted-foreground font-mono">{new Date(mat.createdAt).toLocaleDateString('vi-VN')}</span>
                        {mat.fileUrl ? (
                          <a 
                            href={mat.fileUrl} 
                            target="_blank" 
                            rel="noreferrer"
                            className={buttonVariants({ variant: 'default', size: 'sm', className: 'rounded-full shadow-sm' })}
                          >
                            <Download className="h-4 w-4 mr-2" /> Tải Xuống
                          </a>
                        ) : (
                          <Button variant="ghost" size="sm" className="rounded-full" disabled>Không đính kèm file</Button>
                        )}
                     </div>
                   </div>
                 );
               })}
             </div>
            )}
          </TabsContent>

          {/* TAB SINH VIÊN (STUDENTS) */}
          <TabsContent value="students" className="space-y-6">
            <div className="bg-card border border-border shadow-sm rounded-xl p-8">
              <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
                <Users className="h-6 w-6 text-green-500" /> Sĩ số: <span className="text-primary">{classData._count?.students}</span>
              </h3>
              
              {(!classData.students || classData.students.length === 0) ? (
                 <div className="text-center p-8 bg-muted/30 rounded-lg text-muted-foreground">Lớp học hiện tại chưa có học sinh nào điểm danh.</div>
              ) : (
                <div className="divide-y divide-border">
                  {classData.students.map((enroll, i: number) => (
                    <div key={enroll.student?.id} className="py-4 flex justify-between items-center group hover:bg-muted/20 px-2 rounded-lg transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                          {i + 1}
                        </div>
                        <div>
                          <span className="font-semibold text-foreground text-[15px]">{enroll.student?.fullName}</span>
                          <div className="text-sm text-muted-foreground">{enroll.student?.email}</div>
                        </div>
                      </div>
                      <div className="text-[11px] font-bold uppercase tracking-widest px-3 py-1 bg-green-100 text-green-700 rounded-full">
                        {enroll.student?.role}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
