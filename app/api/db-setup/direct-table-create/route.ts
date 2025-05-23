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
    
    // Basic SQL to create the articles table
    const createTableSQL = `
      CREATE TABLE IF NOT EXISTS articles (
        id UUID PRIMARY KEY,
        title TEXT NOT NULL,
        slug TEXT NOT NULL UNIQUE,
        content TEXT,
        summary TEXT,
        cover_image TEXT,
        category TEXT,
        tags TEXT[],
        is_featured BOOLEAN DEFAULT false,
        publish_date TIMESTAMPTZ,
        status TEXT DEFAULT 'draft',
        author_id UUID,
        created_at TIMESTAMPTZ DEFAULT now(),
        updated_at TIMESTAMPTZ DEFAULT now()
      );
    `;
    
    // Try all the possible methods to execute SQL
    
    // Method 1: Try to use RPC if available
    try {
      console.log("Trying RPC method...");
      const { error: rpcError } = await supabaseAdmin.rpc("execute_sql", {
        sql_query: createTableSQL
      });
      
      if (!rpcError) {
        console.log("Table created successfully using RPC!");
        return NextResponse.json({ success: true, method: "rpc" });
      }
    } catch (err) {
      console.error("RPC method failed:", err);
    }
    
    // Method 2: Try REST API SQL endpoint
    try {
      console.log("Trying SQL REST endpoint...");
      const response = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/sql`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "apikey": process.env.SUPABASE_SERVICE_ROLE_KEY,
          "Authorization": `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`
        },
        body: JSON.stringify({ query: createTableSQL })
      });
      
      if (response.ok) {
        console.log("Table created successfully using SQL REST endpoint!");
        return NextResponse.json({ success: true, method: "sql-rest" });
      }
    } catch (err) {
      console.error("SQL REST endpoint failed:", err);
    }
    
    // Method 3: Try direct fetch with query parameter
    try {
      console.log("Trying direct SQL query parameter...");
      // This assumes there's a special endpoint in Supabase that accepts SQL
      const response = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/?sql=${encodeURIComponent(createTableSQL)}`, {
        method: "GET",
        headers: {
          "apikey": process.env.SUPABASE_SERVICE_ROLE_KEY,
          "Authorization": `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`
        }
      });
      
      if (response.ok) {
        console.log("Table created successfully using direct SQL query!");
        return NextResponse.json({ success: true, method: "direct-sql" });
      }
    } catch (err) {
      console.error("Direct SQL query failed:", err);
    }
    
    // Method 4: Try direct insert to create the table implicitly
    try {
      console.log("Trying direct insert to create table implicitly...");
      // This will fail if the table doesn't exist, but that's expected
      const { error: insertError } = await supabaseAdmin
        .from("articles")
        .insert({
          id: "00000000-0000-0000-0000-000000000000",
          title: "Test Article",
          slug: "test-article",
          content: "Test content",
          author_id: "00000000-0000-0000-0000-000000000000",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });
        
      // If there's no error, that's unusual but good!
      if (!insertError) {
        console.log("Table apparently exists and insert succeeded!");
        return NextResponse.json({ success: true, method: "direct-insert" });
      }
      
      // If we get here, the expected error occurred - now try a more direct approach
      console.error("Insert failed as expected:", insertError);
    } catch (err) {
      console.error("Direct insert failed:", err);
    }
    
    // Method 5: Try to work with psql proxy if available
    try {
      console.log("Trying psql proxy...");
      const response = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/pg/psql`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "apikey": process.env.SUPABASE_SERVICE_ROLE_KEY,
          "Authorization": `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`
        },
        body: JSON.stringify({ query: createTableSQL })
      });
      
      if (response.ok) {
        console.log("Table created successfully using psql proxy!");
        return NextResponse.json({ success: true, method: "psql-proxy" });
      }
    } catch (err) {
      console.error("psql proxy failed:", err);
    }
    
    // Final method: Report all methods failed
    return NextResponse.json({ 
      success: false, 
      error: "All methods to create table failed",
      instructions: "You need to manually create the articles table in Supabase"
    }, { status: 500 });
    
  } catch (error) {
    console.error("Unexpected error in table creation:", error);
    return NextResponse.json({
      success: false,
      error: "Unexpected error occurred",
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
} 