'use client';

import { useState, useEffect } from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';

interface NewsArticle {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  coverImage: string;
  author: {
    name: string;
    avatar: string;
  };
  publishedAt: string;
  tags: string[];
}

export default function NewsArticlePage({ params }: { params: { id: string } }) {
  const [article, setArticle] = useState<NewsArticle | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // In a real application, this would fetch from an API
    // For now, we'll simulate an API call with a timeout
    const fetchArticle = async () => {
      try {
        setIsLoading(true);
        
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // This is example data - in a real app this would come from an API
        const mockArticle: NewsArticle = {
          id: params.id,
          title: 'Example News Article',
          excerpt: 'This is an example news article to demonstrate the detail page.',
          content: `
            <h2>Introduction</h2>
            <p>This is a detailed news article that would normally be fetched from a database or API.</p>
            <p>It includes rich content that can be styled with HTML or Markdown.</p>
            <h2>Main Content</h2>
            <p>The main content section would include the full article text, with proper formatting and possibly embedded media.</p>
            <p>Images, videos, and other interactive elements could be included here.</p>
            <h2>Conclusion</h2>
            <p>This is where the article would wrap up with final thoughts or a call to action.</p>
          `,
          coverImage: 'https://placekitten.com/800/400',
          author: {
            name: 'John Doe',
            avatar: 'https://placekitten.com/100/100',
          },
          publishedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
          tags: ['News', 'Example', 'Technology'],
        };
        
        setArticle(mockArticle);
      } catch (err) {
        console.error('Error fetching article:', err);
        setError('Failed to load the article. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchArticle();
  }, [params.id]);

  if (isLoading) {
    return (
      <div className="container py-10">
        <div className="animate-pulse space-y-6">
          <div className="h-6 w-1/4 bg-muted rounded"></div>
          <div className="h-10 w-3/4 bg-muted rounded"></div>
          <div className="h-6 w-1/3 bg-muted rounded"></div>
          <div className="h-[400px] w-full bg-muted rounded"></div>
          <div className="space-y-4">
            <div className="h-4 w-full bg-muted rounded"></div>
            <div className="h-4 w-full bg-muted rounded"></div>
            <div className="h-4 w-2/3 bg-muted rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="container py-10">
        <div className="text-center py-10">
          <h2 className="text-xl font-semibold mb-2">
            {error || "The article you're looking for doesn't exist."}
          </h2>
          <Button asChild className="mt-4">
            <Link href="/news">
              <ChevronLeft className="mr-2 h-4 w-4" />
              Back to News
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-10">
      <Button 
        variant="ghost" 
        size="sm" 
        asChild
        className="mb-6"
      >
        <Link href="/news">
          <ChevronLeft className="mr-2 h-4 w-4" />
          Back to News
        </Link>
      </Button>
      
      <article className="max-w-4xl mx-auto">
        <div className="mb-6">
          <div className="flex items-center space-x-4 mb-4">
            <Avatar>
              <AvatarImage src={article.author.avatar} alt={article.author.name} />
              <AvatarFallback>{article.author.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <div className="font-medium">{article.author.name}</div>
              <div className="text-sm text-muted-foreground">
                {formatDistanceToNow(new Date(article.publishedAt), { addSuffix: true })}
              </div>
            </div>
          </div>
          
          <h1 className="text-3xl font-bold tracking-tight mb-4">{article.title}</h1>
          <p className="text-xl text-muted-foreground mb-6">{article.excerpt}</p>
        </div>
        
        <div className="mb-8">
          <img 
            src={article.coverImage} 
            alt={article.title}
            className="w-full h-auto rounded-lg object-cover"
          />
        </div>
        
        <div 
          className="prose max-w-none mb-8"
          dangerouslySetInnerHTML={{ __html: article.content }}
        />
        
        <div className="border-t pt-6">
          <h3 className="font-medium mb-4">Tags</h3>
          <div className="flex flex-wrap gap-2">
            {article.tags.map(tag => (
              <Badge key={tag} variant="secondary">{tag}</Badge>
            ))}
          </div>
        </div>
      </article>
    </div>
  );
} 