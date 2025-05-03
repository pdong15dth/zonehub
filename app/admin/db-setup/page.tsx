'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, CheckCircle, XCircle, Database } from 'lucide-react';

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
          <CardFooter className="flex-col items-start gap-4">
            <Button 
              onClick={createArticlesTable}
              disabled={loading || checkStatus === 'exists'}
              className="w-full sm:w-auto"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating Table...
                </>
              ) : (
                'Create Articles Table'
              )}
            </Button>
            
            {result && (
              <div className={`border px-4 py-3 rounded relative ${result.success ? "bg-green-50 border-green-500 text-green-700" : "bg-red-50 border-red-500 text-red-700"}`} role="alert">
                <div className="flex items-center">
                  {result.success ? (
                    <CheckCircle className="h-4 w-4 mr-2" />
                  ) : (
                    <XCircle className="h-4 w-4 mr-2" />
                  )}
                  <span className="font-medium">{result.message}</span>
                </div>
                {result.details && (
                  <span className="block sm:inline mt-1">{result.details}</span>
                )}
              </div>
            )}
            
            {!result?.success && checkStatus === 'missing' && (
              <div className="mt-4">
                <h3 className="font-medium text-lg mb-2">Manual Setup Instructions</h3>
                <p className="mb-2">
                  If automatic creation fails, you can create the table manually:
                </p>
                <ol className="list-decimal list-inside space-y-2">
                  <li>Go to your Supabase dashboard</li>
                  <li>Navigate to the SQL Editor</li>
                  <li>Copy the SQL from the scripts/create-articles-table.sql file</li>
                  <li>Paste it into the SQL Editor and run it</li>
                </ol>
              </div>
            )}
          </CardFooter>
        </Card>
      </div>
    </div>
  );
} 