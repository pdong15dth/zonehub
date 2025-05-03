import { ReactNode } from 'react';

interface NewsLayoutProps {
  children: ReactNode;
}

export default function NewsLayout({ children }: NewsLayoutProps) {
  return (
    <main className="min-h-screen bg-background">
      {children}
    </main>
  );
} 