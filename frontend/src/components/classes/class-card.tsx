import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, Users, LogIn } from 'lucide-react';
import { ClassItem } from '@/lib/api/classes';

interface ClassCardProps {
  data: ClassItem;
  onEnroll: (classId: string) => void;
  isStudent: boolean;
  enrolled: boolean;
}

export function ClassCard({ data, onEnroll, isStudent, enrolled }: ClassCardProps) {
  const router = useRouter();

  return (
    <Card className="flex flex-col h-full hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl line-clamp-2">{data.name}</CardTitle>
          <div className="bg-primary/10 text-primary px-2 py-1 rounded-md text-xs font-semibold whitespace-nowrap">
            {data.subject}
          </div>
        </div>
        <CardDescription className="line-clamp-2 pt-2 h-10">
          {data.description || 'Không có mô tả cho lớp học này.'}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="flex-grow">
        <div className="flex flex-col gap-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            <span>GV: {data.tutor?.fullName || 'Chưa cập nhật'}</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span>Sĩ số: {data._count?.students || 0} học viên</span>
          </div>
        </div>
      </CardContent>
      
      <CardFooter>
        {isStudent ? (
          enrolled ? (
            <Button 
              variant="default" 
              className="w-full bg-green-600 hover:bg-green-700 text-white" 
              onClick={() => router.push(`/dashboard/class/${data.id}`)}
            >
              Tiến vào Lớp học
            </Button>
          ) : (
            <Button 
              className="w-full" 
              variant="default"
              onClick={() => onEnroll(data.id)}
            >
              <span className="flex items-center gap-2"><LogIn className="h-4 w-4" /> Tham gia lớp</span>
            </Button>
          )
        ) : (
          <Button variant="outline" className="w-full" onClick={() => router.push(`/dashboard/class/${data.id}`)}>Xem chi tiết</Button>
        )}
      </CardFooter>
    </Card>
  );
}
