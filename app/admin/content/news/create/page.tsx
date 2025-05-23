import { Metadata } from 'next';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import { CreationForm } from './_components/creation-form';

export const metadata: Metadata = {
  title: 'Tạo bài viết mới | Admin',
  description: 'Tạo và xuất bản bài viết tin tức mới',
};

export default function CreateNewsPage() {
  return (
    <div className="">
      <div className="flex items-center space-x-2 mb-6">
        <Button 
          variant="ghost" 
          size="sm" 
          asChild
          className="h-8"
        >
          <Link href="/admin/content/news">
            <ChevronLeft className="mr-1 h-4 w-4" />
            <span>Quay lại</span>
          </Link>
        </Button>
      </div>
      
      <h1 className="text-2xl font-bold tracking-tight mb-3">Tạo bài viết mới</h1>
      <p className="text-muted-foreground mb-6">
        Điền đầy đủ thông tin để tạo bài viết tin tức mới.
      </p>
      
      <CreationForm />
    </div>
  );
} 