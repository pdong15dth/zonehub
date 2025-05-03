import { Metadata } from 'next';
import { NewsForm } from '@/components/news/news-form';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Create News Article',
  description: 'Create and publish a new news article to share with your community',
};

export default function CreateNewsPage() {
  return (
    <div className="container max-w-4xl py-10">
      <div className="mb-8">
        <Button 
          variant="ghost" 
          size="sm" 
          asChild
          className="mb-4"
        >
          <Link href="/news">
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back to News
          </Link>
        </Button>
        
        <h1 className="text-3xl font-bold tracking-tight">Create News Article</h1>
        <p className="text-muted-foreground mt-2">
          Fill in the form below to create and publish a new news article.
        </p>
      </div>
      
      <div className="bg-card border rounded-lg p-6 shadow-sm">
        <NewsForm />
      </div>
    </div>
  );
} 