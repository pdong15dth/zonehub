-- This script updates the Row Level Security policies for the articles table
-- Run this in Supabase SQL Editor to allow operations without authentication during development

-- First drop existing policies if they exist
DROP POLICY IF EXISTS "Anyone can read published articles" ON public.articles;
DROP POLICY IF EXISTS "Authors can read their own drafts" ON public.articles;
DROP POLICY IF EXISTS "Authors can update their own articles" ON public.articles;
DROP POLICY IF EXISTS "Authors can delete their own articles" ON public.articles;
DROP POLICY IF EXISTS "Authors can insert articles" ON public.articles;
DROP POLICY IF EXISTS "Development access" ON public.articles;

-- Create a development policy that allows all operations without authentication
CREATE POLICY "Development access" ON public.articles
  USING (true)
  WITH CHECK (true);

-- NOTE: In production, you should replace this with proper RLS policies:
/*
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
*/ 