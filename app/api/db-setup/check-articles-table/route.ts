import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    // Validate required environment variables
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      console.error("Missing required environment variables for Supabase connection");
      return NextResponse.json(
        { error: "Server configuration error", exists: false },
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
    
    // Check if the articles table exists
    try {
      const { data, error } = await supabaseAdmin
        .from('articles')
        .select('count(*)', { count: 'exact', head: true });
      
      // If no error, the table exists
      if (!error) {
        return NextResponse.json({ exists: true });
      }
      
      // If the error is about the table not existing, return that info
      if (error.code === '42P01') { // PostgreSQL error code for "relation does not exist"
        return NextResponse.json({ exists: false });
      }
      
      // If it's some other error, return that
      console.error("Error checking articles table:", error);
      return NextResponse.json(
        { error: "Error checking table existence", details: error.message, exists: false },
        { status: 500 }
      );
    } catch (queryError) {
      console.error("Error executing query:", queryError);
      return NextResponse.json(
        { error: "Error executing query", details: queryError instanceof Error ? queryError.message : String(queryError), exists: false },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Unexpected error checking articles table:", error);
    return NextResponse.json(
      { error: "Unexpected error", details: error instanceof Error ? error.message : String(error), exists: false },
      { status: 500 }
    );
  }
} 