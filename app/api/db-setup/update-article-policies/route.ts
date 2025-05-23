import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import fs from 'fs';
import path from 'path';

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
    
    // Create direct Supabase client with service role credentials
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
    
    // Read the SQL script
    let sql;
    try {
      const filePath = path.join(process.cwd(), 'scripts', 'update-article-policies.sql');
      sql = fs.readFileSync(filePath, 'utf8');
    } catch (err) {
      // Inline SQL as fallback if file can't be read
      console.log("Using inline SQL as fallback");
      sql = `
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
      `;
    }
    
    // Execute SQL directly
    const { error } = await supabaseAdmin.rpc('exec_sql', { sql });
    
    if (error) {
      console.error("Error executing SQL:", error);
      return NextResponse.json(
        { error: "Failed to update article policies", details: error.message },
        { status: 500 }
      );
    }
    
    return NextResponse.json({
      success: true,
      message: "Article policies updated successfully for development"
    });
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { error: "Unexpected error", details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
} 