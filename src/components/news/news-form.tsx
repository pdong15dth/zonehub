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

const formSchema = z.object({
  title: z.string().min(5, {
    message: 'Title must be at least 5 characters.',
  }).max(100, {
    message: 'Title must not exceed 100 characters.',
  }),
  excerpt: z.string().min(10, {
    message: 'Excerpt must be at least 10 characters.',
  }).max(200, {
    message: 'Excerpt must not exceed 200 characters.',
  }),
  coverImage: z.string().url({
    message: 'Please enter a valid URL for the cover image.',
  }),
  content: z.string().min(50, {
    message: 'Content must be at least 50 characters.',
  }),
  tags: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export function NewsForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      excerpt: '',
      coverImage: '',
      content: '',
      tags: '',
    },
  });

  const onSubmit = async (values: FormValues) => {
    try {
      setIsSubmitting(true);
      
      // Process tags into an array
      const tagsArray = values.tags 
        ? values.tags.split(',').map(tag => tag.trim()).filter(Boolean) 
        : [];
      
      // Here you would normally send this data to your API
      // For now, we'll just simulate a successful submission
      console.log({
        ...values,
        tags: tagsArray,
      });
      
      // Simulate API call with delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success('News article created successfully!');
      router.push('/news'); // Redirect to news listing
    } catch (error) {
      console.error('Error creating news article:', error);
      toast.error('Failed to create news article. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input 
                  placeholder="Enter news title" 
                  {...field} 
                  className="text-lg font-medium"
                />
              </FormControl>
              <FormDescription>
                A compelling title for your news article.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="excerpt"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Excerpt</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Brief summary of the article" 
                  {...field} 
                  rows={3}
                />
              </FormControl>
              <FormDescription>
                A short summary that appears in previews.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="coverImage"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cover Image URL</FormLabel>
              <FormControl>
                <Input 
                  placeholder="https://example.com/image.jpg" 
                  {...field} 
                />
              </FormControl>
              <FormDescription>
                URL to the main image for this article.
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
              <FormLabel>Content</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="The main content of your news article"
                  {...field}
                  rows={12}
                  className="min-h-[300px] font-mono"
                />
              </FormControl>
              <FormDescription>
                The main content of your news article. You can use Markdown for formatting.
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
              <FormLabel>Tags</FormLabel>
              <FormControl>
                <Input 
                  placeholder="news, tech, event (comma separated)" 
                  {...field} 
                />
              </FormControl>
              <FormDescription>
                Add relevant tags, separated by commas.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Creating...' : 'Create News Article'}
        </Button>
      </form>
    </Form>
  );
} 