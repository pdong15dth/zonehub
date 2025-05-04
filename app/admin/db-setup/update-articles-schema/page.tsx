'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  AlertCircle, 
  ArrowLeft, 
  CheckCircle2, 
  Database, 
  Loader2 
} from 'lucide-react';
import Link from 'next/link';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useSupabase } from '@/components/providers/supabase-provider';

export default function UpdateArticlesSchemaPage() {
  const { supabase } = useSupabase();
  const [isUpdating, setIsUpdating] = useState(false);
  const [result, setResult] = useState<{
    success: boolean;
    message: string;
    details?: string;
  } | null>(null);

  const updateSchema = async () => {
    setIsUpdating(true);
    setResult(null);
    
    try {
      // SQL script to update articles table
      const sql = `
      -- Update articles table with new fields
      ALTER TABLE articles 
        -- Add author tracking fields if they don't exist
        ADD COLUMN IF NOT EXISTS author_id UUID REFERENCES auth.users(id) NULL,
        ADD COLUMN IF NOT EXISTS updated_by UUID REFERENCES auth.users(id) NULL,
        
        -- Add timestamps if they don't exist
        ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
        ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
        
        -- Add other metadata fields
        ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT FALSE NOT NULL,
        ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'draft' NOT NULL,
        
        -- Handle possible naming conflicts by checking for both names
        ADD COLUMN IF NOT EXISTS publish_date TIMESTAMPTZ NULL;

      -- Create a function to update the updated_at timestamp automatically
      CREATE OR REPLACE FUNCTION update_modified_column()
      RETURNS TRIGGER AS $$
      BEGIN
          NEW.updated_at = NOW();
          RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;

      -- Create a trigger to call the function on update
      DROP TRIGGER IF EXISTS set_timestamp ON articles;
      CREATE TRIGGER set_timestamp
      BEFORE UPDATE ON articles
      FOR EACH ROW
      EXECUTE FUNCTION update_modified_column();

      -- Add appropriate indexes for performance
      CREATE INDEX IF NOT EXISTS idx_articles_status ON articles(status);
      CREATE INDEX IF NOT EXISTS idx_articles_author_id ON articles(author_id);
      CREATE INDEX IF NOT EXISTS idx_articles_is_featured ON articles(is_featured);
      `;

      const { error } = await supabase.rpc('exec_sql', { sql });
      
      if (error) {
        throw new Error(error.message);
      }
      
      setResult({
        success: true,
        message: 'Cập nhật cấu trúc bảng articles thành công',
        details: 'Đã thêm các trường mới vào bảng articles: author_id, updated_by, created_at, updated_at, is_featured, status, publish_date và các chỉ mục cần thiết.'
      });
    } catch (error) {
      console.error('Lỗi khi cập nhật schema:', error);
      
      // Try alternative approach if exec_sql doesn't exist
      try {
        // Use direct SQL commands to add columns
        const simpleSQL = `
        -- Add basic columns 
        ALTER TABLE articles ADD COLUMN IF NOT EXISTS author_id UUID NULL;
        ALTER TABLE articles ADD COLUMN IF NOT EXISTS updated_by UUID NULL;
        ALTER TABLE articles ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL;
        ALTER TABLE articles ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL;
        ALTER TABLE articles ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT FALSE NOT NULL;
        ALTER TABLE articles ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'draft' NOT NULL;
        ALTER TABLE articles ADD COLUMN IF NOT EXISTS publish_date TIMESTAMPTZ NULL;
        `;
        
        // Execute the SQL directly through a query
        const { error: simpleError } = await supabase.rpc('exec_sql', { sql: simpleSQL });
        
        if (simpleError) {
          console.error('Alternative method failed:', simpleError);
          throw simpleError;
        }
        
        setResult({
          success: true,
          message: 'Cập nhật cấu trúc bảng articles thành công (phương pháp thay thế)',
          details: 'Đã thêm các trường mới vào bảng articles, nhưng không thể tạo trigger và index.'
        });
      } catch (fallbackError) {
        console.error('Lỗi khi sử dụng phương pháp thay thế:', fallbackError);
        setResult({
          success: false,
          message: 'Không thể cập nhật cấu trúc bảng articles',
          details: error instanceof Error ? error.message : String(error)
        });
      }
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="container max-w-5xl py-8 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/admin/db-setup">
            <Button variant="outline" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">Cập nhật cấu trúc bảng Articles</h1>
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Thông tin cập nhật</CardTitle>
          <CardDescription>
            Cập nhật bảng Articles với các trường mới để hỗ trợ tính năng theo dõi người tạo/sửa và các metadata
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4">
            <div className="p-4 border rounded-lg bg-muted/50">
              <h3 className="font-medium mb-2 flex items-center gap-2">
                <Database className="h-4 w-4" /> Các trường sẽ được thêm vào
              </h3>
              <ul className="text-sm space-y-1 ml-6 list-disc">
                <li><code>author_id</code> - Người tạo bài viết</li>
                <li><code>updated_by</code> - Người cập nhật bài viết gần nhất</li>
                <li><code>created_at</code> - Thời điểm tạo bài viết</li>
                <li><code>updated_at</code> - Thời điểm cập nhật gần nhất</li>
                <li><code>is_featured</code> - Đánh dấu bài viết nổi bật</li>
                <li><code>status</code> - Trạng thái bài viết (draft, published, ...)</li>
                <li><code>publish_date</code> - Thời điểm xuất bản</li>
              </ul>
            </div>
            
            <div className="p-4 border rounded-lg bg-muted/50">
              <h3 className="font-medium mb-2">Các thay đổi khác</h3>
              <ul className="text-sm space-y-1 ml-6 list-disc">
                <li>Tự động cập nhật trường <code>updated_at</code> khi bài viết được sửa</li>
                <li>Thêm các chỉ mục (index) để cải thiện hiệu suất truy vấn</li>
              </ul>
            </div>
          </div>
          
          {result && (
            <Alert variant={result.success ? "default" : "destructive"}>
              <div className="flex items-center gap-2">
                {result.success ? (
                  <CheckCircle2 className="h-4 w-4" />
                ) : (
                  <AlertCircle className="h-4 w-4" />
                )}
                <AlertTitle>{result.message}</AlertTitle>
              </div>
              {result.details && (
                <AlertDescription className="mt-2">
                  {result.details}
                </AlertDescription>
              )}
            </Alert>
          )}
        </CardContent>
        <CardFooter className="flex justify-end gap-4">
          <Button variant="outline" asChild>
            <Link href="/admin/db-setup">Hủy</Link>
          </Button>
          <Button 
            onClick={updateSchema} 
            disabled={isUpdating}
          >
            {isUpdating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isUpdating ? 'Đang cập nhật...' : 'Cập nhật cấu trúc bảng'}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
} 