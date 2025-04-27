import { createServerSupabaseClient, createBrowserSupabaseClient } from "./supabase"
import type { SupabaseClient, User } from "@supabase/supabase-js"
import { Database } from '../types/supabase'
import { UserProfile } from '../types/auth'

export type UserRole = "admin" | "member" | "editor"

/**
 * Kiểm tra và tạo bản ghi người dùng trong database nếu chưa tồn tại
 */
export async function ensureUserInDatabase(supabase: SupabaseClient<Database>, user: User): Promise<UserProfile | null> {
  try {
    // Kiểm tra xem người dùng đã có trong bảng users chưa
    const { data: existingUser, error: checkError } = await supabase
      .from("users")
      .select("*")
      .eq("id", user.id)
      .single()
    
    if (checkError && !checkError.message.includes("No rows found")) {
      console.error("Error checking user:", checkError)
      return null
    }
    
    // Nếu đã có, trả về thông tin người dùng
    if (existingUser) {
      // Chuyển đổi dữ liệu users sang định dạng UserProfile
      return {
        id: existingUser.id,
        created_at: existingUser.created_at,
        updated_at: existingUser.created_at, // Nếu không có trường updated_at
        username: existingUser.email?.split('@')[0] || null,
        email: existingUser.email,
        full_name: existingUser.full_name,
        avatar_url: existingUser.avatar_url,
        role: existingUser.role
      } as UserProfile
    }
    
    // Nếu chưa có, thêm mới
    const userMetadata = user.user_metadata || {}
    
    // Chuẩn bị dữ liệu cho bảng users
    const newUserData = {
      id: user.id,
      email: user.email,
      full_name: userMetadata.full_name || userMetadata.name || null,
      avatar_url: userMetadata.avatar_url || userMetadata.picture || "/placeholder.svg",
      role: "member" as const,
      created_at: new Date().toISOString(),
    }
    
    const { error: insertError } = await supabase
      .from("users")
      .insert(newUserData)
    
    if (insertError) {
      console.error("Error creating user profile:", insertError)
      return null
    }
    
    // Chuyển đổi dữ liệu sang định dạng UserProfile
    return {
      id: newUserData.id,
      created_at: newUserData.created_at,
      updated_at: newUserData.created_at,
      username: newUserData.email?.split('@')[0] || null,
      email: newUserData.email,
      full_name: newUserData.full_name,
      avatar_url: newUserData.avatar_url,
      role: newUserData.role
    }
  } catch (error) {
    console.error("Error in ensureUserInDatabase:", error)
    return null
  }
}

/**
 * Lấy thông tin profile của người dùng hiện tại
 */
// Biến lưu cache cho profile người dùng
let userProfileCache: UserProfile | null = null;
let lastFetchTime = 0;
const CACHE_DURATION = 60000; // 1 minute cache

export async function getCurrentUserProfile(): Promise<UserProfile | null> {
  // Check cache first
  const now = Date.now();
  if (userProfileCache && (now - lastFetchTime < CACHE_DURATION)) {
    return userProfileCache;
  }
  
  // Sử dụng createBrowserSupabaseClient - sẽ trả về instance duy nhất
  const supabase = createBrowserSupabaseClient()
  
  try {
    console.log("getCurrentUserProfile - getting user info")
    // Lấy thông tin người dùng hiện tại
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    if (userError || !user) {
      console.error("Error fetching user:", userError?.message)
      return null
    }
    
    console.log("getCurrentUserProfile - found user:", user.id)
    
    // Lấy profile từ bảng users dựa trên user ID
    const { data: userData, error: profileError } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single()
    
    if (profileError) {
      console.error("Error fetching profile:", profileError.message)
      return null
    }
    
    console.log("getCurrentUserProfile - found profile with role:", userData.role)
    
    // Chuyển đổi dữ liệu sang định dạng UserProfile
    // Ensure email is always a string
    const email: string = (userData?.email || user?.email || "") as string;
    
    const userProfile = {
      id: userData.id,
      created_at: userData.created_at,
      updated_at: userData.created_at,
      username: email ? email.split('@')[0] : null,
      email: email,
      full_name: userData.full_name,
      avatar_url: userData.avatar_url,
      role: userData.role
    } as UserProfile;
    
    // Update cache
    userProfileCache = userProfile;
    lastFetchTime = now;
    
    return userProfile
  } catch (error) {
    console.error("Unexpected error in getCurrentUserProfile:", error)
    return null
  }
}

/**
 * Kiểm tra người dùng hiện tại có phải admin không
 */
export async function isCurrentUserAdmin(): Promise<boolean> {
  const profile = await getCurrentUserProfile()
  return profile?.role === 'admin'
}

/**
 * Cập nhật thông tin người dùng
 */
export async function updateUserProfile(
  supabase: SupabaseClient<Database>, 
  userId: string, 
  data: Partial<UserProfile>
): Promise<UserProfile | null> {
  try {
    // Chuyển đổi dữ liệu từ UserProfile sang định dạng users
    const userData: any = { ...data }
    
    // Xóa các trường không có trong bảng users
    if (userData.username) delete userData.username;
    if (userData.updated_at) delete userData.updated_at;
    
    const { data: updatedUser, error } = await supabase
      .from("users")
      .update(userData)
      .eq("id", userId)
      .select("*")
      .single()
    
    if (error) {
      console.error("Error updating user profile:", error)
      return null
    }
    
    // Chuyển đổi dữ liệu users sang định dạng UserProfile
    return {
      id: updatedUser.id,
      created_at: updatedUser.created_at,
      updated_at: updatedUser.created_at, // Nếu không có trường updated_at
      username: updatedUser.email?.split('@')[0] || null,
      full_name: updatedUser.full_name,
      avatar_url: updatedUser.avatar_url,
      role: updatedUser.role
    } as UserProfile
  } catch (error) {
    console.error("Error in updateUserProfile:", error)
    return null
  }
} 