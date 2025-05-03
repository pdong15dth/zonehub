import { Metadata } from 'next';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Plus } from 'lucide-react';

export const metadata: Metadata = {
  title: 'News',
  description: 'Latest news and updates from our community',
};

export default function NewsPage() {
  // This would normally fetch news articles from an API
  const hasNews = true; // Set to true to display example news data
  
  // Example news articles
  const newsArticles = [
    {
      id: 'example-news-1',
      title: 'New Community Feature Released',
      excerpt: 'We have just released a new feature that allows members to connect more easily.',
      publishedAt: '2023-04-29T12:00:00Z',
      coverImage: 'https://placekitten.com/600/300'
    },
    {
      id: 'example-news-2',
      title: 'Upcoming Events in May',
      excerpt: 'Check out the exciting community events scheduled for the coming month.',
      publishedAt: '2023-04-25T09:30:00Z',
      coverImage: 'https://placekitten.com/601/300'
    },
    {
      id: 'example-news-3',
      title: 'Member Spotlight: Jane Doe',
      excerpt: 'Learn about one of our most active community members and her contributions.',
      publishedAt: '2023-04-20T15:45:00Z',
      coverImage: 'https://placekitten.com/602/300'
    }
  ];

  return (
    <div className="container py-10">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">News</h1>
          <p className="text-muted-foreground mt-2">
            The latest updates and announcements from our community.
          </p>
        </div>
        
        <Button asChild>
          <Link href="/news/create">
            <Plus className="mr-2 h-4 w-4" />
            Create News
          </Link>
        </Button>
      </div>
      
      {hasNews ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {newsArticles.map((article) => (
            <div key={article.id} className="border rounded-lg overflow-hidden shadow-sm">
              <div className="h-48 overflow-hidden">
                <img 
                  src={article.coverImage} 
                  alt={article.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4">
                <h2 className="text-xl font-semibold mb-2">{article.title}</h2>
                <p className="text-muted-foreground text-sm mb-4">
                  {article.excerpt}
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-muted-foreground">
                    {new Date(article.publishedAt).toLocaleDateString()}
                  </span>
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/news/${article.id}`}>Read More</Link>
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-muted/50 border border-dashed rounded-lg p-10 text-center">
          <h3 className="text-xl font-medium mb-2">No news articles yet</h3>
          <p className="text-muted-foreground mb-6">
            Create your first news article to share with your community.
          </p>
          <Button asChild>
            <Link href="/news/create">
              <Plus className="mr-2 h-4 w-4" />
              Create News Article
            </Link>
          </Button>
        </div>
      )}
    </div>
  );
} 