import { ReactNode } from 'react';

interface NewsArticleLayoutProps {
  children: ReactNode;
}

export default function NewsArticleLayout({ children }: NewsArticleLayoutProps) {
  return (
    <main className="min-h-screen bg-background">
      {children}
    </main>
  );
} 