'use client';

import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import { EditForm } from '@/app/admin/content/news/edit/_components/edit-form';
import { useParams } from 'next/navigation';

export default function EditNewsPage() {
  const params = useParams();
  const articleId = Array.isArray(params.id) ? params.id[0] : params.id as string;
  
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
      
      <h1 className="text-2xl font-bold tracking-tight mb-3">Chỉnh sửa bài viết</h1>
      <p className="text-muted-foreground mb-6">
        Chỉnh sửa thông tin bài viết tin tức.
      </p>
      
      <EditForm articleId={articleId} />
    </div>
  );
} 