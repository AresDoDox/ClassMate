import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { buttonVariants, Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CalendarPlus, Loader2 } from 'lucide-react';
import { createSchedule } from '@/lib/api/schedules';

const scheduleSchema = z.object({
  title: z.string().optional(),
  date: z.string().min(1, { message: 'Vui lòng chọn ngày học' }),
  startTime: z.string().min(1, { message: 'Vui lòng nhập giờ bắt đầu' }),
  endTime: z.string().min(1, { message: 'Vui lòng nhập giờ kết thúc' }),
  type: z.enum(['OFFLINE', 'ONLINE']),
});

export function CreateScheduleDialog({ classId, onCreated }: { classId: string; onCreated: () => void }) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof scheduleSchema>>({
    resolver: zodResolver(scheduleSchema),
    defaultValues: { title: '', date: '', startTime: '08:00', endTime: '10:00', type: 'OFFLINE' },
  });

  const onSubmit = async (values: z.infer<typeof scheduleSchema>) => {
    try {
      setIsSubmitting(true);
      await createSchedule({
        classId,
        date: new Date(values.date).toISOString(),
        startTime: values.startTime,
        endTime: values.endTime,
        title: values.title,
        type: values.type,
      });

      setOpen(false);
      form.reset();
      onCreated();
    } catch (error: any) {
      console.error(error);
      alert(error?.response?.data?.message || 'Tạo lịch học thất bại');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className={buttonVariants({ variant: 'default', className: 'gap-2 cursor-pointer' })}>
        <CalendarPlus className="h-4 w-4" /> Tạo Lịch Học
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Tạo buổi học mới</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Chủ đề (Tuỳ chọn)</FormLabel>
                  <FormControl>
                    <Input placeholder="Vd: Buổi 1: Ôn tập" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ngày học</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="startTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Giờ bắt đầu</FormLabel>
                    <FormControl>
                      <Input type="time" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="endTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Giờ kết thúc</FormLabel>
                    <FormControl>
                      <Input type="time" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Hình thức</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn hình thức học" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="OFFLINE">Học Trực tiếp (Offline)</SelectItem>
                      <SelectItem value="ONLINE">Học Trực tuyến (Online)</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end pt-4">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Xác nhận
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
