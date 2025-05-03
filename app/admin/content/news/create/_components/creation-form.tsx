'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon, Image, Save, Eye, FileText } from 'lucide-react';
import { format } from 'date-fns';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { FormCKEditor } from '@/components/ui/form-ckeditor';

const formSchema = z.object({
  title: z.string().min(5, {
    message: 'Tiêu đề phải có ít nhất 5 ký tự.',
  }).max(100, {
    message: 'Tiêu đề không được quá 100 ký tự.',
  }),
  slug: z.string().min(5, {
    message: 'Slug phải có ít nhất 5 ký tự.',
  }).max(100, {
    message: 'Slug không được quá 100 ký tự.',
  }).regex(/^[a-z0-9-]+$/, {
    message: 'Slug chỉ được chứa chữ thường, số và dấu gạch ngang.',
  }),
  summary: z.string().min(10, {
    message: 'Tóm tắt phải có ít nhất 10 ký tự.',
  }).max(200, {
    message: 'Tóm tắt không được quá 200 ký tự.',
  }),
  coverImage: z.string().url({
    message: 'Vui lòng nhập URL hợp lệ cho ảnh bìa.',
  }),
  content: z.string().min(50, {
    message: 'Nội dung phải có ít nhất 50 ký tự.',
  }),
  category: z.string({
    required_error: 'Vui lòng chọn danh mục.',
  }),
  tags: z.string().optional(),
  isFeatured: z.boolean().default(false),
  publishDate: z.date().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export function CreationForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewMode, setPreviewMode] = useState<'edit' | 'preview'>('edit');
  const router = useRouter();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      slug: '',
      summary: '',
      coverImage: '',
      content: '',
      category: '',
      tags: '',
      isFeatured: false,
      publishDate: undefined,
    },
  });

  // Auto-generate slug from title
  const onTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    form.setValue('title', title);
    
    // Generate slug
    const slug = title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '') // Remove special chars
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-'); // Replace multiple hyphens with single one
    
    form.setValue('slug', slug);
  };

  const onSubmit = async (values: FormValues) => {
    try {
      setIsSubmitting(true);
      
      // Process tags into an array
      const tagsArray = values.tags 
        ? values.tags.split(',').map(tag => tag.trim()).filter(Boolean) 
        : [];
      
      // Here you would normally send this data to your API
      console.log({
        ...values,
        tags: tagsArray,
      });
      
      // Simulate API call with delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success('Bài viết đã được tạo thành công!');
      router.push('/admin/content/news'); // Redirect to news listing
    } catch (error) {
      console.error('Lỗi khi tạo bài viết:', error);
      toast.error('Không thể tạo bài viết. Vui lòng thử lại.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderPreview = () => {
    const values = form.getValues();
    const formattedDate = values.publishDate ? format(values.publishDate, 'dd/MM/yyyy') : 'Chưa xác định';
    
    return (
      <div className="space-y-8">
        <div className="aspect-video w-full max-h-[400px] rounded-xl overflow-hidden bg-muted">
          {values.coverImage ? (
            <img 
              src={values.coverImage} 
              alt={values.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              <Image className="h-16 w-16 opacity-20" />
            </div>
          )}
        </div>
        
        <div className="space-y-2">
          <div className="flex gap-2">
            {values.category && (
              <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                {values.category}
              </span>
            )}
            {values.isFeatured && (
              <span className="text-xs bg-amber-500/10 text-amber-500 px-2 py-1 rounded-full">
                Nổi bật
              </span>
            )}
            <span className="text-xs bg-muted px-2 py-1 rounded-full">
              {formattedDate}
            </span>
          </div>
          
          <h1 className="text-3xl font-bold">{values.title || 'Tiêu đề bài viết'}</h1>
          
          <p className="text-muted-foreground text-sm pb-4 border-b">
            {values.summary || 'Tóm tắt bài viết sẽ hiển thị ở đây.'}
          </p>
        </div>
        
        <div className="prose prose-sm sm:prose lg:prose-lg max-w-none">
          {values.content ? (
            <div dangerouslySetInnerHTML={{ __html: values.content }} />
          ) : (
            <p className="text-muted-foreground">Nội dung bài viết sẽ hiển thị ở đây.</p>
          )}
        </div>
        
        {values.tags && (
          <div className="pt-4 border-t">
            <span className="text-sm font-medium">Thẻ:</span>
            <div className="flex flex-wrap gap-2 mt-2">
              {values.tags.split(',').map((tag, index) => (
                <span key={index} className="text-xs bg-muted px-2 py-1 rounded-full">
                  {tag.trim()}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="flex justify-between items-center">
          <Tabs defaultValue="edit" className="w-full" onValueChange={(value) => setPreviewMode(value as 'edit' | 'preview')}>
            <div className="flex justify-between items-center">
              <TabsList>
                <TabsTrigger value="edit">Chỉnh sửa</TabsTrigger>
                <TabsTrigger value="preview">Xem trước</TabsTrigger>
              </TabsList>
              
              <div className="flex items-center space-x-2">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => router.push('/admin/content/news')}
                >
                  Hủy
                </Button>
                <Button 
                  type="button" 
                  variant="secondary"
                  onClick={() => form.handleSubmit((data) => {
                    console.log("Lưu nháp:", data);
                    toast.success('Đã lưu bản nháp');
                  })()}
                >
                  <Save className="h-4 w-4 mr-2" />
                  Lưu nháp
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  <FileText className="h-4 w-4 mr-2" />
                  {isSubmitting ? 'Đang tạo...' : 'Đăng bài'}
                </Button>
              </div>
            </div>

            <TabsContent value="edit" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Thông tin cơ bản</CardTitle>
                    <CardDescription>
                      Thiết lập các thông tin cơ bản cho bài viết
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tiêu đề</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Nhập tiêu đề bài viết" 
                              {...field} 
                              onChange={onTitleChange}
                              className="text-lg font-medium"
                            />
                          </FormControl>
                          <FormDescription>
                            Tiêu đề hấp dẫn sẽ thu hút người đọc.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="slug"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Slug</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="ten-bai-viet" 
                              {...field} 
                            />
                          </FormControl>
                          <FormDescription>
                            URL thân thiện cho bài viết. Tự động tạo từ tiêu đề.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="summary"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tóm tắt</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Tóm tắt ngắn gọn bài viết" 
                              {...field} 
                              rows={3}
                            />
                          </FormControl>
                          <FormDescription>
                            Tóm tắt ngắn gọn, xuất hiện trong phần xem trước.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Phân loại & Xuất bản</CardTitle>
                    <CardDescription>
                      Thiết lập danh mục, thẻ và thời gian xuất bản
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <FormField
                      control={form.control}
                      name="category"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Danh mục</FormLabel>
                          <Select 
                            onValueChange={field.onChange} 
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Chọn danh mục" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="news">Tin tức</SelectItem>
                              <SelectItem value="events">Sự kiện</SelectItem>
                              <SelectItem value="guides">Hướng dẫn</SelectItem>
                              <SelectItem value="updates">Cập nhật</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormDescription>
                            Danh mục chính cho bài viết.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="tags"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Thẻ</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="tin-tuc, su-kien, cap-nhat (phân cách bằng dấu phẩy)" 
                              {...field} 
                            />
                          </FormControl>
                          <FormDescription>
                            Thêm các thẻ liên quan, phân cách bằng dấu phẩy.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="publishDate"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Ngày xuất bản</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant={"outline"}
                                  className={cn(
                                    "w-full pl-3 text-left font-normal",
                                    !field.value && "text-muted-foreground"
                                  )}
                                >
                                  {field.value ? (
                                    format(field.value, "PPP")
                                  ) : (
                                    <span>Chọn ngày</span>
                                  )}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                          <FormDescription>
                            Ngày xuất bản bài viết. Để trống nếu muốn xuất bản ngay.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="isFeatured"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                          <FormControl>
                            <input
                              type="checkbox"
                              checked={field.value}
                              onChange={field.onChange}
                              className="h-4 w-4 mt-1"
                              aria-label="Đánh dấu là bài viết nổi bật"
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>
                              Đánh dấu là bài viết nổi bật
                            </FormLabel>
                            <FormDescription>
                              Bài viết nổi bật sẽ được hiển thị ở vị trí đặc biệt.
                            </FormDescription>
                          </div>
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>
              </div>
              
              <div className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Nội dung</CardTitle>
                    <CardDescription>
                      Nội dung chi tiết của bài viết
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <FormField
                      control={form.control}
                      name="coverImage"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>URL ảnh bìa</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="https://example.com/image.jpg" 
                              {...field} 
                            />
                          </FormControl>
                          <FormDescription>
                            URL cho ảnh bìa của bài viết.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormCKEditor
                      control={form.control}
                      name="content"
                      label="Nội dung"
                      placeholder="Nội dung chi tiết của bài viết..."
                      description="Nội dung chi tiết của bài viết. Hỗ trợ định dạng phong phú."
                      minHeight="400px"
                    />
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="preview" className="mt-6">
              <Card>
                <CardContent className="pt-6">
                  {renderPreview()}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </form>
    </Form>
  );
} 