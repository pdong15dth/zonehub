'use client';

import { useState, useRef, useEffect } from 'react';
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
import { useRouter, useParams } from 'next/navigation';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon, Image, Save, Eye, FileText, Loader2 } from 'lucide-react';
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
import { createServerSupabaseClient } from '@/lib/supabase-server';
import { createSlug } from "@/lib/utils";
import { Switch } from "@/components/ui/switch";

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

export function EditForm({ articleId }: { articleId: string }) {
  // Use params as a fallback if articleId isn't passed directly
  const params = useParams();
  const id = articleId || (params?.id as string);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSavingDraft, setIsSavingDraft] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [previewMode, setPreviewMode] = useState<'edit' | 'preview'>('edit');
  const router = useRouter();
  const { supabase, user } = useSupabase();

  useEffect(() => {
    // Log the authentication state
    console.log("User authenticated:", !!user);
    if (user) {
      console.log("User ID:", user.id);
    }
  }, [user]);

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

  // Fetch article data
  useEffect(() => {
    async function fetchArticle() {
      try {
        setIsLoading(true);
        const supabase = createServerSupabaseClient();
        
        const { data, error } = await supabase
          .from('articles')
          .select('*')
          .eq('id', id)
          .single();
          
        if (error) {
          console.error('Error fetching article:', error);
          setError('Không thể tải bài viết. Vui lòng thử lại sau.');
          return;
        }
        
        if (!data) {
          setError('Không tìm thấy bài viết.');
          return;
        }
        
        // Format publishedAt date if exists
        const publishedAt = data.publish_date ? new Date(data.publish_date) : undefined;
        
        // Format tags array to comma-separated string
        const tagsString = data.tags && Array.isArray(data.tags) 
          ? data.tags.join(', ') 
          : '';
        
        // Set form values
        form.reset({
          title: data.title || '',
          slug: data.slug || '',
          summary: data.summary || '',
          cover_image: data.cover_image || '',
          content: data.content || '',
          category: data.category || '',
          tags: tagsString,
          is_featured: data.is_featured || false,
          publish_date: publishedAt,
        });
      } catch (error) {
        console.error('Error in fetchArticle:', error);
        setError('Đã xảy ra lỗi khi tải dữ liệu bài viết.');
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchArticle();
  }, [id, form]);

  // Auto-generate slug from title
  const onTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    form.setValue('title', title);
    
    // Generate slug from title
    const slug = createSlug(title);
    form.setValue('slug', slug);
  };

  // Function to update article
  const updateArticle = async (values: FormValues, status: 'draft' | 'published') => {
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
        id: id,
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
        user_id: user?.id // Include user ID from context
      };
      
      // Send to API
      const response = await fetch('/api/articles', {
        method: 'PUT', // Using PUT for update
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user?.id || ''}` // Add user ID as token
        },
        body: JSON.stringify(articleData),
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Lỗi khi cập nhật bài viết');
      }
      
      // Show success message
      toast({
        title: 'Thành công',
        description: 'Bài viết đã được cập nhật thành công!',
        duration: 3000,
      })
      
      // Redirect to news listing
      router.push('/admin/content/news');
    } catch (error) {
      console.error('Lỗi khi cập nhật bài viết:', error);
      toast({
        title: 'Lỗi',
        description: 'Không thể cập nhật bài viết. Vui lòng thử lại.',
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
    await updateArticle(values, 'published');
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
    
    await updateArticle(values, 'draft');
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
        
        <div className="prose prose-sm max-w-none">
          <div dangerouslySetInnerHTML={{ __html: values.content }} />
        </div>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-12">
        <Loader2 className="h-10 w-10 animate-spin text-muted-foreground mb-4" />
        <p className="text-muted-foreground">Đang tải bài viết...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-destructive/10 p-6 rounded-lg text-center">
        <p className="text-destructive font-medium mb-4">{error}</p>
        <Button variant="outline" onClick={() => router.push('/admin/content/news')}>
          Quay lại danh sách
        </Button>
      </div>
    );
  }

  return (
    <Card className="max-w-[1200px]">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Chỉnh sửa bài viết</CardTitle>
            <CardDescription>Cập nhật thông tin cho bài viết</CardDescription>
          </div>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleSaveDraft}
              disabled={isSavingDraft || isSubmitting}
            >
              {isSavingDraft && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Lưu nháp
            </Button>
            <Button
              type="submit"
              size="sm"
              onClick={form.handleSubmit(onSubmit)}
              disabled={isSubmitting || isSavingDraft}
            >
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Cập nhật bài viết
            </Button>
          </div>
        </div>

        <Tabs defaultValue="edit" className="mt-4">
          <TabsList>
            <TabsTrigger 
              value="edit" 
              onClick={() => setPreviewMode('edit')}
              disabled={isSubmitting || isSavingDraft}
            >
              <FileText className="h-4 w-4 mr-2" />
              Chỉnh sửa
            </TabsTrigger>
            <TabsTrigger 
              value="preview" 
              onClick={() => setPreviewMode('preview')}
              disabled={isSubmitting || isSavingDraft}
            >
              <Eye className="h-4 w-4 mr-2" />
              Xem trước
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>
      <CardContent>
        {previewMode === 'edit' ? (
          <Form {...form}>
            <form className="space-y-6">
              <div className="space-y-4">
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
                        />
                      </FormControl>
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
                          placeholder="slug-cua-bai-viet" 
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Slug sẽ được sử dụng trong URL của bài viết
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Danh mục</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Chọn danh mục" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Tin tức">Tin tức</SelectItem>
                            <SelectItem value="Sự kiện">Sự kiện</SelectItem>
                            <SelectItem value="Cập nhật">Cập nhật</SelectItem>
                            <SelectItem value="Hướng dẫn">Hướng dẫn</SelectItem>
                            <SelectItem value="Review">Review</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="publish_date"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Ngày xuất bản</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "pl-3 text-left font-normal",
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
                          Để trống để sử dụng thời gian hiện tại
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="is_featured"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Bài viết nổi bật</FormLabel>
                        <FormDescription>
                          Bài viết nổi bật sẽ được hiển thị ở các vị trí đặc biệt.
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
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
                          placeholder="Nhập tóm tắt ngắn về bài viết" 
                          className="resize-none" 
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Tóm tắt ngắn gọn sẽ hiển thị ở trang danh sách bài viết
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="cover_image"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ảnh bìa</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="https://example.com/image.jpg" 
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Nhập URL ảnh bìa cho bài viết
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
                          placeholder="game, news, update,..." 
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Các thẻ ngăn cách bởi dấu phẩy
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nội dung</FormLabel>
                      <FormControl>
                        <CKEditorField
                          value={field.value} 
                          onChange={(data: string) => field.onChange(data)}
                          minHeight="500px"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </form>
          </Form>
        ) : (
          <div className="p-4 border rounded-lg">
            {renderPreview()}
          </div>
        )}
      </CardContent>
    </Card>
  );
} 