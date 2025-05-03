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
    
    // Test direct SQL execution through supabase-js
    try {
      // This is a workaround because supabase-js doesn't directly support executing arbitrary SQL
      const { data, error } = await supabaseAdmin.rpc('exec_sql', { sql: 'SELECT 1 AS test' });
      
      // If the function already exists and works, return success
      if (!error) {
        return NextResponse.json({
          success: true,
          message: "exec_sql function already exists and is working"
        });
      }
      
      // The function likely doesn't exist, so we need to create it
      // We'll try to use a different approach to create the function
      
      // Try to execute the function creation SQL through a REST call
      // This is a direct call to Supabase's PostgreSQL REST API
      const response = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/rpc/exec_sql`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': process.env.SUPABASE_SERVICE_ROLE_KEY,
          'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
          'Prefer': 'resolution=ignore-duplicates,return=minimal'
        },
        body: JSON.stringify({
          sql: createFunctionSQL
        })
      });
      
      // Check if we got an error that's likely because the function doesn't exist yet
      if (response.status === 404 || response.status === 500) {
        // We need to create the function another way
        // Here we'll try to use PostgreSQL's built-in SQL execution directly
        
        // Using pgSQL client to execute raw SQL (this is a bit of a hack)
        const pgResponse = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/?apikey=${process.env.SUPABASE_SERVICE_ROLE_KEY}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
            'X-Client-Info': 'supabase-js/2.0.0',
          },
          body: JSON.stringify({
            query: createFunctionSQL
          })
        });
        
        if (!pgResponse.ok) {
          const pgErrorText = await pgResponse.text();
          console.error("Error creating exec_sql function via PostgreSQL:", pgErrorText);
          return NextResponse.json({
            success: false,
            message: "Could not create exec_sql function",
            details: pgErrorText
          }, { status: 500 });
        }
        
        // Test if the function now exists
        const testResponse = await supabaseAdmin.rpc('exec_sql', { sql: 'SELECT 1 AS test' });
        
        if (testResponse.error) {
          console.error("Function creation seemed to work, but test failed:", testResponse.error);
          return NextResponse.json({
            success: false,
            message: "Function created but test failed",
            details: testResponse.error.message
          }, { status: 500 });
        }
        
        return NextResponse.json({
          success: true,
          message: "exec_sql function created successfully"
        });
      }
      
      // Check if we were successful
      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error creating exec_sql function:", errorText);
        return NextResponse.json({
          success: false,
          message: "Could not create exec_sql function",
          details: errorText
        }, { status: 500 });
      }
      
      return NextResponse.json({
        success: true,
        message: "exec_sql function created successfully"
      });
    } catch (error) {
      console.error("Error creating exec_sql function:", error);
      return NextResponse.json({
        success: false,
        message: "Error creating exec_sql function",
        details: error instanceof Error ? error.message : String(error)
      }, { status: 500 });
    }
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json({
      success: false,
      message: "Unexpected error",
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
} 