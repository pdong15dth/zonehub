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
import { toast } from 'sonner';
import { ShieldCheck, LoaderCircle, ChevronLeft } from 'lucide-react';
import Link from 'next/link';

export default function UpdateArticlePoliciesPage() {
  const [loading, setLoading] = useState(false);

  const handleUpdatePolicies = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/db-setup/update-article-policies', {
        method: 'POST',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update article policies');
      }

      toast.success('Article policies updated successfully for development');
    } catch (error) {
      console.error('Error updating article policies:', error);
      toast.error('Failed to update article policies. See console for details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-10">
      <div className="mb-6">
        <Button 
          variant="ghost" 
          size="sm" 
          asChild
          className="mb-4"
        >
          <Link href="/admin/db-setup">
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back to Database Setup
          </Link>
        </Button>
        
        <h1 className="text-3xl font-bold tracking-tight">Update Article Policies</h1>
        <p className="text-muted-foreground mt-2">
          Update database policies for article operations during development
        </p>
      </div>

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Development Policy Configuration</CardTitle>
          <CardDescription>
            Enable full access to articles table without authentication (for development only)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300 px-4 py-3 rounded-md">
              <div className="flex items-center mb-2">
                <ShieldCheck className="h-5 w-5 mr-2" />
                <span className="font-medium">Warning: Development Use Only</span>
              </div>
              <p className="text-sm">
                This will update the Row Level Security policies to allow full public access to the articles table 
                without authentication. This should only be used in development environments.
              </p>
            </div>
            
            <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded text-sm overflow-auto">
              <pre className="whitespace-pre-wrap">
                {`-- New policy that will be created:
CREATE POLICY "Development access" ON public.articles
  USING (true)
  WITH CHECK (true);

-- This replaces the normal authentication policies`}
              </pre>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button 
            onClick={handleUpdatePolicies} 
            disabled={loading}
            className="w-full"
          >
            {loading && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
            {loading ? 'Updating Policies...' : 'Update Article Policies for Development'}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
} 