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
    
    // SQL to create the exec_sql function
    const createFunctionSQL = `
      CREATE OR REPLACE FUNCTION exec_sql(sql text)
      RETURNS jsonb
      LANGUAGE plpgsql
      SECURITY DEFINER
      AS $$
      DECLARE
        result jsonb;
      BEGIN
        EXECUTE sql;
        result := json_build_object('success', true)::jsonb;
        RETURN result;
      EXCEPTION WHEN OTHERS THEN
        result := json_build_object(
          'success', false,
          'error', SQLERRM,
          'code', SQLSTATE
        )::jsonb;
        RETURN result;
      END;
      $$;
    `;
    
    // Execute SQL directly using Supabase SQL API
    const response = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': process.env.SUPABASE_SERVICE_ROLE_KEY,
        'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
        'Prefer': 'params=single-object'
      },
      body: JSON.stringify({
        query: createFunctionSQL
      })
    });
    
    if (!response.ok) {
      console.error("Error creating function:", await response.text());
      return NextResponse.json(
        { error: "Failed to create exec_sql function" },
        { status: 500 }
      );
    }
    
    return NextResponse.json({
      success: true,
      message: "exec_sql function created successfully"
    });
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { error: "Unexpected error", details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
} 