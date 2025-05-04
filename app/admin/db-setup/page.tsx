'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, CheckCircle, XCircle, Database, RefreshCw, ShieldCheck, ChevronRight } from 'lucide-react';
import Link from 'next/link';

export default function DBSetupPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ success?: boolean; message?: string; details?: string } | null>(null);
  const [checkStatus, setCheckStatus] = useState<'unchecked' | 'exists' | 'missing'>('unchecked');
  const [checkingStatus, setCheckingStatus] = useState(false);
  
  const createArticlesTable = async () => {
    try {
      setLoading(true);
      setResult(null);
      
      const response = await fetch('/api/db-setup/direct-table-create', {
        method: 'POST',
      });
      
      const data = await response.json();
      
      if (response.ok && data.success) {
        setResult({
          success: true,
          message: 'Table created successfully!',
          details: `Method used: ${data.method}`
        });
      } else {
        setResult({
          success: false,
          message: data.error || 'Failed to create articles table',
          details: data.details || data.instructions || 'Unknown error'
        });
      }
    } catch (error) {
      setResult({
        success: false,
        message: 'An error occurred',
        details: error instanceof Error ? error.message : String(error)
      });
    } finally {
      setLoading(false);
    }
  };
  
  const checkTableExists = async () => {
    try {
      setCheckingStatus(true);
      
      const response = await fetch('/api/db-setup/check-articles-table', {
        method: 'GET',
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setCheckStatus(data.exists ? 'exists' : 'missing');
      } else {
        setCheckStatus('missing');
        setResult({
          success: false,
          message: 'Failed to check table existence',
          details: data.error || 'Unknown error'
        });
      }
    } catch (error) {
      setResult({
        success: false,
        message: 'An error occurred while checking table',
        details: error instanceof Error ? error.message : String(error)
      });
    } finally {
      setCheckingStatus(false);
    }
  };
  
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Database Setup</h1>
      
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Articles Table</CardTitle>
            <CardDescription>
              Manage the articles table in your Supabase database
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4 mb-6">
              <Button 
                variant="outline"
                onClick={checkTableExists}
                disabled={checkingStatus}
              >
                {checkingStatus ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Checking...
                  </>
                ) : (
                  <>
                    <Database className="mr-2 h-4 w-4" />
                    Check Table Status
                  </>
                )}
              </Button>
              
              {checkStatus === 'exists' && (
                <div className="bg-green-50 border border-green-500 text-green-700 px-4 py-3 rounded relative" role="alert">
                  <div className="flex items-center">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    <span className="font-medium">Table exists!</span>
                  </div>
                  <span className="block sm:inline mt-1">The articles table is properly set up in your database.</span>
                </div>
              )}
              
              {checkStatus === 'missing' && (
                <div className="bg-red-50 border border-red-500 text-red-700 px-4 py-3 rounded relative" role="alert">
                  <div className="flex items-center">
                    <XCircle className="h-4 w-4 mr-2" />
                    <span className="font-medium">Table missing!</span>
                  </div>
                  <span className="block sm:inline mt-1">The articles table doesn't exist. Use the button below to create it.</span>
                </div>
              )}
            </div>
            
            <div className="space-y-4">
              <p>
                This will attempt to create the articles table in your Supabase database
                using various methods until one succeeds. This is useful if you're
                encountering errors when posting articles.
              </p>
              
              <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded text-sm overflow-auto">
                <pre>
                  {`CREATE TABLE IF NOT EXISTS public.articles (
  id UUID PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  content TEXT,
  summary TEXT,
  cover_image TEXT,
  category TEXT,
  tags TEXT[] DEFAULT '{}',
  is_featured BOOLEAN DEFAULT false,
  publish_date TIMESTAMPTZ,
  status TEXT DEFAULT 'draft',
  author_id UUID,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);`}
                </pre>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <div className="flex flex-col sm:flex-row gap-2 w-full">
              <Button 
                className="flex-1" 
                onClick={createArticlesTable} 
                disabled={loading || checkStatus === 'exists'}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating Table...
                  </>
                ) : (
                  <>
                    <Database className="mr-2 h-4 w-4" />
                    Create Articles Table
                  </>
                )}
              </Button>
              
              <Button 
                className="flex-1" 
                variant="outline" 
                onClick={checkTableExists}
                disabled={loading}
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Check Status
              </Button>
              
              <Button 
                className="flex-1"
                variant="secondary"
                asChild
              >
                <Link href="/admin/db-setup/update-article-policies">
                  <ShieldCheck className="mr-2 h-4 w-4" />
                  Update RLS Policies
                </Link>
              </Button>
            </div>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Database Functions</CardTitle>
            <CardDescription>
              Manage special database functions needed for some operations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p>
                This will create an <code>exec_sql</code> function in your Supabase database
                which is needed for some advanced operations like updating policies.
              </p>
              
              <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded text-sm overflow-auto">
                <pre>
                  {`CREATE OR REPLACE FUNCTION exec_sql(sql text)
  RETURNS jsonb
  LANGUAGE plpgsql
  SECURITY DEFINER
  AS $$
  DECLARE
    result jsonb;
  BEGIN
    EXECUTE sql;
    result := json_build_object('success', true)::jsonb;
    RETURN result;
  EXCEPTION WHEN OTHERS THEN
    result := json_build_object(
      'success', false,
      'error', SQLERRM,
      'code', SQLSTATE
    )::jsonb;
    RETURN result;
  END;
  $$;`}
                </pre>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              className="w-full" 
              onClick={async () => {
                try {
                  const response = await fetch('/api/db-setup/create-exec-sql-function', {
                    method: 'POST',
                  });
                  
                  const data = await response.json();
                  
                  if (response.ok && data.success) {
                    setResult({
                      success: true,
                      message: 'Function created successfully!',
                    });
                  } else {
                    setResult({
                      success: false,
                      message: data.error || 'Failed to create SQL function',
                      details: data.details || 'Unknown error'
                    });
                  }
                } catch (error) {
                  setResult({
                    success: false,
                    message: 'An error occurred',
                    details: error instanceof Error ? error.message : String(error)
                  });
                }
              }}
            >
              <Database className="mr-2 h-4 w-4" />
              Create exec_sql Function
            </Button>
          </CardFooter>
        </Card>
        
        <Link href="/admin/db-setup/update-articles-schema">
          <Card className="hover:bg-muted/50 transition-colors">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5 text-primary" />
                Cập nhật bảng Articles
              </CardTitle>
              <CardDescription>
                Thêm các trường mới vào bảng articles để hỗ trợ chức năng theo dõi người tạo/chỉnh sửa
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Thêm các trường author_id, updated_by, created_at, updated_at, 
                is_featured, status, publish_date và các chỉ mục cần thiết.
              </p>
            </CardContent>
            <CardFooter className="border-t pt-4">
              <div className="flex justify-between items-center w-full">
                <span className="text-xs text-muted-foreground">Phiên bản 1.0</span>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </div>
            </CardFooter>
          </Card>
        </Link>
      </div>
    </div>
  );
} 