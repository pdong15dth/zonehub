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
    
    // Get the SQL statement from the request body
    const { sql } = await request.json();
    
    if (!sql) {
      return NextResponse.json(
        { error: "SQL statement is required" },
        { status: 400 }
      );
    }
    
    // Execute the SQL statement directly using PostgreSQL
    // This uses the PostgreSQL specific module available in Supabase
    const { data, error } = await supabaseAdmin.rpc('exec_sql', { sql });
    
    if (error) {
      console.error("Error executing SQL:", error);
      return NextResponse.json(
        { error: "Error executing SQL", details: error.message, code: error.code },
        { status: 500 }
      );
    }
    
    // Return the result
    return NextResponse.json({
      success: true,
      data
    });
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { error: "Unexpected error", details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
} 