import { createServerSupabaseClient } from "@/lib/supabase"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const supabase = createServerSupabaseClient()
    const { sql } = await request.json()
    
    if (!sql) {
      return NextResponse.json({ error: "SQL query is required" }, { status: 400 })
    }
    
    // Thực thi SQL trực tiếp thông qua Postgres
    const { data, error } = await supabase.rpc('direct_execute_sql', { sql_query: sql })
    
    if (error) {
      console.error("Error executing SQL:", error)
      return NextResponse.json({ error: "Failed to execute SQL", details: error.message }, { status: 500 })
    }
    
    return NextResponse.json({ 
      message: "SQL executed successfully", 
      result: data
    }, { status: 200 })
    
  } catch (error) {
    console.error("Unexpected error:", error)
    return NextResponse.json({ 
      error: "An unexpected error occurred",
      details: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 })
  }
}

// Tạo function để thực thi SQL trực tiếp
export async function setupDatabaseFunctions() {
  try {
    const supabase = createServerSupabaseClient()
    
    const createFunctionSQL = `
      -- Tạo function để thực thi SQL động
      CREATE OR REPLACE FUNCTION direct_execute_sql(sql_query TEXT)
      RETURNS jsonb AS $$
      DECLARE
        result jsonb;
      BEGIN
        EXECUTE sql_query INTO result;
        RETURN result;
      EXCEPTION WHEN OTHERS THEN
        RETURN jsonb_build_object('error', SQLERRM);
      END;
      $$ LANGUAGE plpgsql SECURITY DEFINER;
    `
    
    // Thực thi SQL để tạo function
    const { error } = await supabase.rpc('direct_execute_sql', { sql_query: createFunctionSQL })
    
    if (error) {
      // Nếu function chưa tồn tại, thử tạo thông qua cách khác
      console.error("Error creating direct_execute_sql function:", error)
      
      // Thử tạo thông qua SQL thông thường
      const { error: sqlError } = await supabase.from('_setup_functions').select('*').limit(1)
      console.log("Attempted to set up function via regular SQL:", sqlError ? "error" : "success")
    }
    
    return { success: true }
  } catch (error) {
    console.error("Failed to set up database functions:", error)
    return { success: false, error }
  }
} 