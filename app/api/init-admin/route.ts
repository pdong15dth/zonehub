import { createServerSupabaseClient } from "@/lib/supabase"
import { NextResponse } from "next/server"
import { createDatabaseStructure } from "./create-db-structure"
import type { SupabaseClient } from "@supabase/supabase-js"

export async function GET(request: Request) {
  try {
    const supabase = createServerSupabaseClient()
    
    // Trước tiên, thử tạo cấu trúc database nếu chưa có
    try {
      await createDatabaseStructure()
    } catch (dbStructureError) {
      console.error("Error setting up database structure:", dbStructureError)
      // Tiếp tục thực hiện vì có thể cấu trúc đã tồn tại
    }
    
    // Kiểm tra xem có tài khoản admin trong bảng users không
    const { data: existingAdmins, error: checkError } = await supabase
      .from("users")
      .select("id")
      .eq("role", "admin")
      .limit(1)
    
    // Log kết quả kiểm tra
    console.log("Existing admins check result:", { existingAdmins, checkError })
    
    // Nếu không thể kiểm tra vì có lỗi, thực hiện tạo bảng
    if (checkError) {
      console.error("Error checking for existing admins:", checkError)
      
      // Tạo bảng users trực tiếp
      try {
        const createTableSQL = `
          CREATE TABLE IF NOT EXISTS public.users (
            id UUID PRIMARY KEY,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            email TEXT UNIQUE NOT NULL,
            full_name TEXT,
            avatar_url TEXT,
            role TEXT DEFAULT 'member' CHECK (role IN ('admin', 'member', 'editor'))
          );
          ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
        `
        
        try {
          await supabase.rpc('exec_sql', { sql: createTableSQL })
        } catch (rpcError) {
          console.log("Could not execute exec_sql, trying direct query", rpcError)
        }
      } catch (tableError) {
        console.error("Error creating users table:", tableError)
      }
    }
    
    // Thông tin tài khoản admin
    const adminEmail = "pdong15dth06@gmail.com"
    const adminPassword = "Admin@123"
    
    // Tạo mới admin user trong auth
    console.log("Creating admin user...")
    
    const { data: { user: adminUser }, error: createUserError } = await supabase.auth.admin.createUser({
      email: adminEmail,
      password: adminPassword,
      email_confirm: true,
      user_metadata: {
        full_name: "Admin User",
      },
    })
    
    if (createUserError) {
      console.error("Error creating admin auth user:", createUserError)
      
      // Thử đăng nhập nếu người dùng đã tồn tại
      if (createUserError.message.includes("already exists")) {
        const { data: { user: existingUser }, error: signInError } = await supabase.auth.signInWithPassword({
          email: adminEmail,
          password: adminPassword,
        })
        
        if (signInError) {
          console.error("Error signing in as existing admin:", signInError)
          return NextResponse.json({ error: "Failed to create or sign in as admin", details: signInError.message }, { status: 500 })
        }
        
        if (!existingUser) {
          return NextResponse.json({ error: "Failed to get existing admin user" }, { status: 500 })
        }
        
        // Sử dụng thông tin người dùng đăng nhập
        console.log("Using existing admin user:", existingUser.id)
        const adminUserId = existingUser.id
        
        // Kiểm tra và cập nhật bản ghi users
        await ensureAdminInUsersTable(supabase, adminUserId, adminEmail)
        
        return NextResponse.json({ 
          message: "Admin user already exists and is ready", 
          adminEmail,
          adminPassword
        }, { status: 200 })
      }
      
      return NextResponse.json({ error: "Failed to create admin auth user", details: createUserError.message }, { status: 500 })
    }
    
    if (!adminUser) {
      return NextResponse.json({ error: "Failed to create admin user" }, { status: 500 })
    }
    
    // Đảm bảo user admin đã được thêm vào bảng users
    await ensureAdminInUsersTable(supabase, adminUser.id, adminEmail)
    
    // Trả về thông tin đăng nhập
    return NextResponse.json({ 
      message: "Admin user created successfully", 
      adminEmail,
      adminPassword
    }, { status: 201 })
    
  } catch (error) {
    console.error("Unexpected error:", error)
    return NextResponse.json({ 
      error: "An unexpected error occurred",
      details: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 })
  }
}

async function ensureAdminInUsersTable(supabase: SupabaseClient, userId: string, email: string) {
  // Kiểm tra xem admin đã có trong bảng users chưa
  const { data: existingUserProfile, error: profileCheckError } = await supabase
    .from("users")
    .select("*")
    .eq("id", userId)
    .single()
  
  console.log("Profile check result:", { existingUserProfile, profileCheckError })
  
  // Nếu chưa có, tạo bản ghi trong bảng users
  if (!existingUserProfile || profileCheckError) {
    console.log("Creating admin profile in users table...")
    
    try {
      // Insert admin user vào bảng users
      const { data: insertData, error: insertError } = await supabase
        .from("users")
        .upsert({
          id: userId,
          email: email,
          full_name: "Admin User",
          avatar_url: "/placeholder.svg",
          role: "admin",
          created_at: new Date().toISOString(),
        })
        .select()
      
      console.log("Insert result:", { insertData, insertError })
      
      if (insertError) {
        console.error("Error creating admin user profile:", insertError)
        throw new Error("Failed to create admin user profile: " + insertError.message)
      }
    } catch (dbError) {
      console.error("Database operation error:", dbError)
      throw new Error("Database operation failed: " + (dbError instanceof Error ? dbError.message : "Unknown error"))
    }
  } else {
    console.log("Admin profile already exists in users table")
    
    // Đảm bảo admin có role admin
    if (existingUserProfile.role !== 'admin') {
      console.log("Updating user role to admin")
      
      const { error: updateError } = await supabase
        .from("users")
        .update({ role: "admin" })
        .eq("id", userId)
      
      if (updateError) {
        console.error("Error updating admin role:", updateError)
      }
    }
  }
} 