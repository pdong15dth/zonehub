import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/auth"
import { createServerSupabaseClient } from "@/lib/supabase-server"

export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)
    
    if (!session || !session.user) {
      return NextResponse.json(
        { error: "Unauthorized access" },
        { status: 401 }
      )
    }
    
    // Initialize Supabase client
    const supabase = createServerSupabaseClient()
    
    // Parse query params
    const { searchParams } = new URL(request.url)
    const role = searchParams.get("role")
    
    // Build query
    let query = supabase
      .from('users')
      .select('id, full_name, email, avatar_url, role')
    
    // Apply role filter if provided
    if (role) {
      query = query.eq('role', role)
    }
    
    // Execute query
    const { data, error } = await query
    
    if (error) {
      return NextResponse.json(
        { error: "Error fetching users", details: error.message },
        { status: 500 }
      )
    }
    
    // Format response
    const users = data.map(user => ({
      id: user.id,
      name: user.full_name || user.email || 'Unknown User',
      email: user.email,
      avatar: user.avatar_url,
      role: user.role
    }))
    
    return NextResponse.json({ users })
    
  } catch (error) {
    console.error("Error fetching users:", error)
    return NextResponse.json(
      { 
        error: "Error fetching users", 
        details: error instanceof Error ? error.message : "Unknown error" 
      },
      { status: 500 }
    )
  }
} 