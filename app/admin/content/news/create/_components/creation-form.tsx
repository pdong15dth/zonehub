'use client';

import { useState, useRef } from 'react';
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
import { toast } from "@/components/ui/use-toast"
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
import { CKEditorField } from '@/components/ui/ckeditor';
import { useSupabase } from '@/components/providers/supabase-provider';
import { v4 as uuidv4 } from 'uuid';
import { createSlug } from "@/lib/utils";

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
  }),
  summary: z.string().min(10, {
    message: 'Tóm tắt phải có ít nhất 10 ký tự.',
  }).max(200, {
    message: 'Tóm tắt không được quá 200 ký tự.',
  }),
  cover_image: z.string().url({
    message: 'Vui lòng nhập URL hợp lệ cho ảnh bìa.',
  }),
  content: z.string().min(50, {
    message: 'Nội dung phải có ít nhất 50 ký tự.',
  }),
  category: z.string({
    required_error: 'Vui lòng chọn danh mục.',
  }),
  tags: z.string().optional(),
  is_featured: z.boolean().default(false),
  publish_date: z.date().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export function CreationForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSavingDraft, setIsSavingDraft] = useState(false);
  const [previewMode, setPreviewMode] = useState<'edit' | 'preview'>('edit');
  const [articleId, setArticleId] = useState<string | null>(null);
  const router = useRouter();
  const { supabase, user } = useSupabase();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      slug: '',
      summary: '',
      cover_image: '',
      content: '',
      category: '',
      tags: '',
      is_featured: false,
      publish_date: undefined,
    },
  });

  // Auto-generate slug from title
  const onTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    form.setValue('title', title);

    // Use the createSlug utility to generate a proper slug
    const slug = createSlug(title);
    form.setValue('slug', slug);
  };

  // Function to save article (either as draft or published)
  const saveArticle = async (values: FormValues, status: 'draft' | 'published') => {
    try {
      if (status === 'draft') {
        setIsSavingDraft(true);
      } else {
        setIsSubmitting(true);
      }

      // Process tags into an array
      const tagsArray = values.tags
        ? values.tags.split(',').map(tag => tag.trim()).filter(Boolean)
        : [];

      // Prepare article data
      const articleData = {
        id: articleId || uuidv4(),
        title: values.title,
        slug: values.slug,
        summary: values.summary,
        content: values.content,
        cover_image: values.cover_image,
        category: values.category,
        tags: tagsArray,
        is_featured: values.is_featured,
        publish_date: values.publish_date ? values.publish_date.toISOString() : null,
        status: status,
        user_id: user?.id // Include user ID
      };

      // Send to API
      const response = await fetch('/api/articles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(articleData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Lỗi khi lưu bài viết');
      }

      // Store article ID for future updates
      setArticleId(result.id);

      // Show success message
      if (status === 'draft') {
        toast({
          title: 'Thành công',
          description: 'Đã lưu bản nháp thành công!',
          duration: 3000,
        })
      } else {
        toast({
          title: 'Thành công',
          description: 'Bài viết đã được đăng thành công!',
          duration: 3000,
        })
        router.push('/admin/content/news'); // Redirect to news listing only when publishing
      }
    } catch (error) {
      console.error('Lỗi khi lưu bài viết:', error);
      toast({
        title: 'Lỗi',
        description: `Không thể ${status === 'draft' ? 'lưu nháp' : 'đăng bài'}. Vui lòng thử lại.`,
        duration: 3000,
      })
    } finally {
      if (status === 'draft') {
        setIsSavingDraft(false);
      } else {
        setIsSubmitting(false);
      }
    }
  };

  // Handle form submission for publishing
  const onSubmit = async (values: FormValues) => {
    await saveArticle(values, 'published');
  };

  // Handle saving as draft
  const handleSaveDraft = async () => {
    // Perform custom validation (lighter than full validation)
    const values = form.getValues();

    // Basic validation for draft - only title and slug are required
    if (!values.title || values.title.length < 5) {
      toast({
        title: 'Lỗi',
        description: 'Tiêu đề phải có ít nhất 5 ký tự',
        duration: 3000,
      })
      return;
    }

    if (!values.slug || values.slug.length < 5) {
      toast({
        title: 'Lỗi',
        description: 'Slug phải có ít nhất 5 ký tự',
        duration: 3000,
      })
      return;
    }

    await saveArticle(values, 'draft');
  };

  const renderPreview = () => {
    const values = form.getValues();
    const formattedDate = values.publish_date ? format(values.publish_date, 'dd/MM/yyyy') : 'Chưa xác định';

    return (
      <div className="space-y-8">
        <div className="aspect-video w-full max-h-[400px] rounded-xl overflow-hidden bg-muted">
          {values.cover_image ? (
            <img
              src={values.cover_image}
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
            {values.is_featured && (
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
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="flex justify-between items-center mb-4">
          <Tabs defaultValue="edit" className="w-full" onValueChange={(value) => setPreviewMode(value as 'edit' | 'preview')}>
            <div className="flex flex-col sm:flex-row sm:items-center w-full justify-between gap-4">
              <TabsList>
                <TabsTrigger value="edit" className="flex items-center">
                  <FileText className="h-4 w-4 mr-2" />
                  Chỉnh sửa
                </TabsTrigger>
                <TabsTrigger value="preview" className="flex items-center">
                  <Eye className="h-4 w-4 mr-2" />
                  Xem trước
                </TabsTrigger>
              </TabsList>

              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push('/admin/content/news')}
                  size="sm"
                >
                  Hủy
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={handleSaveDraft}
                  disabled={isSavingDraft}
                  size="sm"
                >
                  <Save className="h-4 w-4 mr-2" />
                  {isSavingDraft ? 'Đang lưu...' : 'Lưu nháp'}
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  size="sm"
                  className="bg-primary"
                >
                  <FileText className="h-4 w-4 mr-2" />
                  {isSubmitting ? 'Đang đăng...' : 'Đăng bài'}
                </Button>
              </div>
            </div>

            <TabsContent value="edit" className="mt-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Card - Main Content */}
                <div className="lg:col-span-2">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Thông tin chính</CardTitle>
                      <CardDescription>Nhập các thông tin cơ bản của bài viết</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                          control={form.control}
                          name="title"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="font-medium">Tiêu đề <span className="text-red-500">*</span></FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Nhập tiêu đề bài viết"
                                  {...field}
                                  onChange={onTitleChange}
                                  className="h-10"
                                />
                              </FormControl>
                              <FormDescription>
                                Tiêu đề ngắn gọn, hấp dẫn (5-100 ký tự).
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
                              <FormLabel className="font-medium">Slug <span className="text-red-500">*</span></FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="ten-bai-viet"
                                  {...field}
                                  className="h-10"
                                />
                              </FormControl>
                              <FormDescription>
                                URL thân thiện (tự động tạo từ tiêu đề, giữ nguyên ký tự đặc biệt).
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={form.control}
                        name="summary"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="font-medium">Tóm tắt <span className="text-red-500">*</span></FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Mô tả ngắn gọn về bài viết"
                                className="resize-none min-h-24"
                                {...field}
                              />
                            </FormControl>
                            <FormDescription>
                              Đoạn giới thiệu ngắn gọn, hấp dẫn (10-200 ký tự).
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div>
                        <FormLabel className="font-medium">Nội dung <span className="text-red-500">*</span></FormLabel>
                        <div className="mt-2">
                          <FormControl>
                            <CKEditorField
                              value={form.watch('content')}
                              onChange={(data: string) => form.setValue('content', data)}
                              placeholder="Nhập nội dung chi tiết của bài viết..."
                              minHeight="500px"
                            />
                          </FormControl>
                          <FormDescription className="mt-2">
                            Nội dung chi tiết của bài viết (tối thiểu 50 ký tự).
                          </FormDescription>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Right Card - Settings */}
                <div className="lg:col-span-1">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Cài đặt hiển thị</CardTitle>
                      <CardDescription>Cấu hình các thông tin bổ sung</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <FormField
                        control={form.control}
                        name="cover_image"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="font-medium">URL ảnh bìa <span className="text-red-500">*</span></FormLabel>
                            <FormControl>
                              <Input
                                placeholder="https://example.com/image.jpg"
                                {...field}
                                className="h-10"
                              />
                            </FormControl>
                            <FormDescription>
                              Đường dẫn đến ảnh đại diện cho bài viết.
                            </FormDescription>
                            <FormMessage />
                            <div className="mt-2 aspect-video rounded-md overflow-hidden bg-muted">
                              {field.value ? (
                                <img
                                  src={field.value}
                                  alt="Cover image preview"
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  <Image className="h-10 w-10 text-muted-foreground opacity-20" />
                                </div>
                              )}
                            </div>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="category"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="font-medium">Danh mục <span className="text-red-500">*</span></FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger className="h-10">
                                  <SelectValue placeholder="Chọn danh mục" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="thong-bao">Thông báo</SelectItem>
                                <SelectItem value="su-kien">Sự kiện</SelectItem>
                                <SelectItem value="tin-tuc">Tin tức</SelectItem>
                                <SelectItem value="bao-chi">Báo chí</SelectItem>
                                <SelectItem value="tuyen-dung">Tuyển dụng</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormDescription>
                              Phân loại bài viết theo danh mục.
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
                            <FormLabel className="font-medium">Thẻ</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="tag1, tag2, tag3"
                                {...field}
                                className="h-10"
                              />
                            </FormControl>
                            <FormDescription>
                              Các từ khóa liên quan, phân cách bằng dấu phẩy.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="publish_date"
                        render={({ field }) => (
                          <FormItem className="flex flex-col">
                            <FormLabel className="font-medium">Ngày xuất bản</FormLabel>
                            <Popover>
                              <PopoverTrigger asChild>
                                <FormControl>
                                  <Button
                                    variant={"outline"}
                                    className={cn(
                                      "h-10 w-full pl-3 text-left font-normal",
                                      !field.value && "text-muted-foreground"
                                    )}
                                  >
                                    {field.value ? (
                                      format(field.value, "dd/MM/yyyy")
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
                              Thời gian bài viết sẽ được xuất bản.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="is_featured"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                            <FormControl>
                              <input
                                type="checkbox"
                                checked={field.value}
                                onChange={field.onChange}
                                className="h-4 w-4 mt-1 accent-primary"
                                aria-label="Bài viết nổi bật"
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel className="font-medium">Bài viết nổi bật</FormLabel>
                              <FormDescription>
                                Hiển thị bài viết ở vị trí nổi bật trên trang chủ.
                              </FormDescription>
                            </div>
                          </FormItem>
                        )}
                      />

                      <div className="bg-muted/40 rounded-lg p-4 border border-dashed space-y-3 mt-4">
                        <h3 className="text-sm font-medium">Lưu ý:</h3>
                        <ul className="text-xs text-muted-foreground space-y-2">
                          <li>• Tiêu đề nên ngắn gọn và hấp dẫn</li>
                          <li>• Tóm tắt giúp người đọc nắm được nội dung chính</li>
                          <li>• Sử dụng ảnh bìa có tỷ lệ 16:9 để hiển thị tốt nhất</li>
                          <li>• Thêm thẻ (tags) để giúp phân loại và tìm kiếm</li>
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                </div>
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