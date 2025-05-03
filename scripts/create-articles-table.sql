-- Run this script in your Supabase SQL Editor to create the articles table
-- This is a manual fallback method if automatic table creation fails

-- Create the articles table
CREATE TABLE IF NOT EXISTS public.articles (
  id UUID PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  summary TEXT,
  content TEXT,
  cover_image TEXT,
  category TEXT,
  tags TEXT[] DEFAULT '{}',
  is_featured BOOLEAN DEFAULT false,
  publish_date TIMESTAMP WITH TIME ZONE,
  status TEXT DEFAULT 'draft',
  author_id UUID
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS articles_author_id_idx ON public.articles(author_id);
CREATE INDEX IF NOT EXISTS articles_slug_idx ON public.articles(slug);
CREATE INDEX IF NOT EXISTS articles_status_idx ON public.articles(status);

-- Enable Row Level Security
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;

-- Create access policies
-- Public can read published articles
CREATE POLICY "Anyone can read published articles" ON public.articles
  FOR SELECT USING (status = 'published');

-- Authors can see their own drafts
CREATE POLICY "Authors can read their own drafts" ON public.articles
  FOR SELECT USING (auth.uid() = author_id);

-- Authors can update their own articles
CREATE POLICY "Authors can update their own articles" ON public.articles
  FOR UPDATE USING (auth.uid() = author_id);

-- Authors can delete their own articles
CREATE POLICY "Authors can delete their own articles" ON public.articles
  FOR DELETE USING (auth.uid() = author_id);

-- Authors can insert articles
CREATE POLICY "Authors can insert articles" ON public.articles
  FOR INSERT WITH CHECK (auth.uid() = author_id);

-- Insert a test record
INSERT INTO public.articles (
  id, 
  title, 
  slug, 
  content,
  summary,
  status,
  author_id,
  created_at,
  updated_at
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  'Test Article',
  'test-article',
  'This is a test article to verify the table creation worked.',
  'Test article summary',
  'draft',
  NULL,
  NOW(),
  NOW()
) ON CONFLICT (id) DO NOTHING; 