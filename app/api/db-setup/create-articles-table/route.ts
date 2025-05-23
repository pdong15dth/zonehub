import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    // Validate required environment variables
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      console.error("Missing required environment variables for Supabase connection");
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 }
      );
    }
    
    // Create direct Supabase client with server-side credentials
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    );
    
    // Check if the articles table exists first
    const { error: checkError } = await supabaseAdmin
      .from('articles')
      .select('count(*)', { count: 'exact', head: true });
      
    // If the table already exists, return success
    if (!checkError) {
      return NextResponse.json({
        success: true,
        message: "Articles table already exists"
      });
    }
    
    // If the error is not because the table doesn't exist, it's another error
    if (checkError.code !== '42P01') {
      console.error("Error checking for articles table:", checkError);
      return NextResponse.json(
        { error: "Error checking for articles table", details: checkError.message },
        { status: 500 }
      );
    }
    
    try {
      // Use a more direct approach to create the table using the management API
      // This is a more direct route to creating tables than the normal API
      
      // First create a migration file to store the SQL
      const migrationSQL = `
-- Create the articles table
CREATE TABLE IF NOT EXISTS public.articles (
  id UUID PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  summary TEXT,
  content TEXT NOT NULL,
  cover_image TEXT,
  category TEXT,
  tags TEXT[] DEFAULT '{}',
  is_featured BOOLEAN DEFAULT false,
  publish_date TIMESTAMP WITH TIME ZONE,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  author_id UUID REFERENCES auth.users(id) ON DELETE CASCADE
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

-- Allow service role and admin users full access
CREATE POLICY "Service role bypass" ON public.articles
  USING (true) WITH CHECK (true);
`;
      
      // Make a direct call to the SQL HTTP API
      // This is more reliable than using RPC functions since those need to be created first
      const response = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/`, {
        method: 'POST', 
        headers: {
          'Content-Type': 'application/json',
          'apikey': process.env.SUPABASE_SERVICE_ROLE_KEY,
          'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`
        },
        body: JSON.stringify({
          query: migrationSQL
        })
      });
      
      if (!response.ok) {
        // This approach won't work either, so let's try a simpler approach
        // Let's try to create just the table without all the extras
        const simpleCreateTable = `
          CREATE TABLE IF NOT EXISTS public.articles (
            id UUID PRIMARY KEY,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            title TEXT NOT NULL,
            slug TEXT UNIQUE NOT NULL,
            summary TEXT,
            content TEXT NOT NULL,
            cover_image TEXT,
            category TEXT,
            tags TEXT[] DEFAULT '{}',
            is_featured BOOLEAN DEFAULT false,
            publish_date TIMESTAMP WITH TIME ZONE,
            status TEXT DEFAULT 'draft',
            author_id UUID
          );
        `;
        
        // Call the admin API directly
        const adminResponse = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'apikey': process.env.SUPABASE_SERVICE_ROLE_KEY,
            'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
            'Prefer': 'params=single-object'
          },
          body: JSON.stringify({
            query: simpleCreateTable
          })
        });
        
        if (!adminResponse.ok) {
          // Both attempts failed - let's try one last approach
          // We'll create a temporary table in storage with instructions
          
          // Use Storage API to store the migration SQL as a file
          const { error: storageError } = await supabaseAdmin
            .storage
            .from('migrations')
            .upload('create_articles_table.sql', migrationSQL, {
              contentType: 'text/plain',
              upsert: true
            });
            
          if (storageError) {
            console.error("Could not store migration SQL:", storageError);
            return NextResponse.json({
              success: false,
              message: "Could not create articles table",
              details: "All attempts to create the table failed. Please run the migration SQL manually.",
              sql: migrationSQL
            }, { status: 500 });
          }
          
          // Return the migration SQL for the user to run manually
          return NextResponse.json({
            success: false,
            message: "Automatic table creation failed",
            details: "Please run the SQL manually in the SQL editor in Supabase dashboard",
            sql: migrationSQL
          }, { status: 500 });
        }
      }
      
      // Check if the articles table exists now
      const { error: finalCheckError } = await supabaseAdmin
        .from('articles')
        .select('count(*)', { count: 'exact', head: true });
        
      if (finalCheckError) {
        console.error("Table creation may have failed:", finalCheckError);
        return NextResponse.json({
          success: false,
          message: "Table creation may have failed",
          details: finalCheckError.message,
          sql: migrationSQL
        }, { status: 500 });
      }
      
      return NextResponse.json({
        success: true,
        message: "Articles table created successfully"
      });
    } catch (error) {
      console.error("Error creating articles table:", error);
      return NextResponse.json(
        { error: "Error creating articles table", details: error instanceof Error ? error.message : String(error) },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { error: "Unexpected error", details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}