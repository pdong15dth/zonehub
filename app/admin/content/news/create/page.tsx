import { Metadata } from 'next';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import { CreationForm } from './_components/creation-form';
import { SetupDatabaseButton } from './_components/setup-database-button';

export const metadata: Metadata = {
  title: 'Tạo bài viết mới | Admin',
  description: 'Tạo và xuất bản bài viết tin tức mới',
};

export default function CreateNewsPage() {
  return (
    <>
      <div className="mb-6">
        <Button 
          variant="ghost" 
          size="sm" 
          asChild
          className="mb-4"
        >
          <Link href="/admin/content/news">
            <ChevronLeft className="mr-2 h-4 w-4" />
            Quay lại danh sách bài viết
          </Link>
        </Button>
        
        <h1 className="text-3xl font-bold tracking-tight">Tạo bài viết mới</h1>
        <p className="text-muted-foreground mt-2">
          Điền đầy đủ thông tin để tạo bài viết tin tức mới.
        </p>
      </div>
      
      <div className="bg-card border rounded-lg p-6 shadow-sm">
        <div className="mb-6">
          <SetupDatabaseButton />
        </div>
        <CreationForm />
      </div>
    </>
  );
} 