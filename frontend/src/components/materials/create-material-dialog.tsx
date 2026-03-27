/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { FileUp, Loader2 } from 'lucide-react';
import { createMaterial } from '@/lib/api/materials';
import { api } from '@/lib/axios';

const formSchema = z.object({
  title: z.string().min(3, { message: 'Tên tài liệu tối thiểu 3 ký tự' }),
  description: z.string().optional(),
  type: z.enum(['DOCUMENT', 'VIDEO', 'ASSIGNMENT']),
});

export function CreateMaterialDialog({ classId, onCreated }: { classId: string; onCreated: () => void }) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { title: '', description: '', type: 'DOCUMENT' },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsSubmitting(true);
      let uploadedFileUrl = '';

      // 1. Upload File trước (Nếu có chọn file)
      if (selectedFile) {
        const formData = new FormData();
        formData.append('file', selectedFile);

        const uploadRes = await api.post('/upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        
        // uploadRes.data.data chứa thông tin do API UploadController trả về
        uploadedFileUrl = uploadRes.data.data.fileUrl;
      }

      // 2. Lưu thông tin tài liệu vào CSDL
      await createMaterial({
        classId,
        title: values.title,
        description: values.description,
        type: values.type,
        fileUrl: uploadedFileUrl || undefined,
      });

      setOpen(false);
      form.reset();
      setSelectedFile(null);
      onCreated(); // Gọi refresh dữ liệu tại thẻ cha
    } catch (error: unknown) {
      console.error(error);
      alert((error as any)?.response?.data?.message || 'Tải lên tài liệu thất bại');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground shadow hover:bg-primary/90 h-9 px-4 py-2">
        <FileUp className="h-4 w-4" /> Tải lên Tài nguyên
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Thêm tài liệu học tập</DialogTitle>
          <DialogDescription>
            Đăng tải tài liệu (PDF, Word, hoặc Ảnh) để học sinh trong lớp có thể xem và tải về.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tên tài liệu</FormLabel>
                  <FormControl>
                    <Input placeholder="Vd: Bài giảng Slide Chương 1..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormItem>
              <FormLabel>File đính kèm (Tuỳ chọn)</FormLabel>
              <FormControl>
                <Input type="file" onChange={handleFileChange} className="cursor-pointer" />
              </FormControl>
              <FormMessage />
            </FormItem>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mô tả chi tiết</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Vd: Đọc kỹ slide slide 10-15 nhé..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end mt-6">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isSubmitting ? 'Đang xử lý...' : 'Xác nhận tạo'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
