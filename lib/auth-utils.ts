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
    console.log(`Đảm bảo người dùng ${user.id} (${user.email}) tồn tại trong cơ sở dữ liệu`)
    
    // Kiểm tra xem người dùng đã có trong bảng users chưa
    const { data: existingUser, error: checkError } = await supabase
      .from("users")
      .select("*")
      .eq("id", user.id)
      .single()
    
    if (checkError) {
      if (checkError.message.includes("No rows found")) {
        console.log(`Không tìm thấy người dùng ${user.id}, sẽ tạo mới`)
      } else {
        console.error("Lỗi khi kiểm tra người dùng:", checkError)
        // Vẫn tiếp tục để thử tạo người dùng
      }
    }
    
    // Nếu đã có, trả về thông tin người dùng
    if (existingUser) {
      console.log(`Người dùng ${user.id} đã tồn tại, role: ${existingUser.role}`)
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
      email: user.email || '', // Ensure email is never null
      full_name: userMetadata.full_name || userMetadata.name || user.email?.split('@')[0] || 'User',
      avatar_url: userMetadata.avatar_url || userMetadata.picture || "/placeholder.svg",
      role: "member" as const
      // Removed created_at since it has a DEFAULT NOW() constraint in the table
    }
    
    console.log(`Chuẩn bị thêm người dùng mới với dữ liệu:`, newUserData)
    
    // Thử tạo người dùng với cơ chế thử lại
    const MAX_RETRIES = 3
    let currentRetry = 0
    let lastError = null
    
    while (currentRetry < MAX_RETRIES) {
      try {
        console.log(`Đang thử tạo người dùng (lần thử ${currentRetry + 1}/${MAX_RETRIES})`)
        
        const { error } = await supabase
          .from("users")
          .insert(newUserData)
        
        if (!error) {
          console.log(`Đã tạo người dùng ${user.id} thành công!`)
          break
        }
        
        // Lưu lại lỗi để thử lại
        lastError = error
        console.error(`Lỗi khi tạo người dùng (lần thử ${currentRetry + 1}/${MAX_RETRIES}):`, error)
        
        // Nếu lỗi là do người dùng đã tồn tại, thử lấy lại thông tin
        if (error.code === '23505' || error.message.includes('duplicate') || error.message.includes('already exists')) {
          console.log("Có vẻ người dùng đã tồn tại, thử lấy lại thông tin...")
          const { data: retryUser, error: retryError } = await supabase
            .from("users")
            .select("*")
            .eq("id", user.id)
            .single()
          
          if (!retryError && retryUser) {
            console.log(`Đã tìm thấy người dùng ${user.id} đã tồn tại, role: ${retryUser.role}`)
            return {
              id: retryUser.id,
              created_at: retryUser.created_at,
              updated_at: retryUser.created_at,
              username: retryUser.email?.split('@')[0] || null,
              email: retryUser.email,
              full_name: retryUser.full_name,
              avatar_url: retryUser.avatar_url,
              role: retryUser.role
            } as UserProfile
          }
        }
        
        // Đợi một khoảng thời gian trước khi thử lại
        await new Promise(resolve => setTimeout(resolve, 500 * (currentRetry + 1)))
      } catch (err) {
        console.error(`Lỗi không mong đợi khi tạo người dùng (lần thử ${currentRetry + 1}/${MAX_RETRIES}):`, err)
        lastError = err
      }
      
      currentRetry++
    }
    
    // Nếu sau khi thử lại vẫn thất bại, kiểm tra lần cuối xem người dùng có tồn tại không
    if (lastError) {
      console.log("Thử lại lần cuối kiểm tra xem người dùng đã được tạo chưa...")
      const { data: finalCheck, error: finalCheckError } = await supabase
        .from("users")
        .select("*")
        .eq("id", user.id)
        .single()
      
      if (!finalCheckError && finalCheck) {
        console.log(`Cuối cùng cũng tìm thấy người dùng ${user.id}, role: ${finalCheck.role}`)
        return {
          id: finalCheck.id,
          created_at: finalCheck.created_at,
          updated_at: finalCheck.created_at,
          username: finalCheck.email?.split('@')[0] || null,
          email: finalCheck.email,
          full_name: finalCheck.full_name,
          avatar_url: finalCheck.avatar_url,
          role: finalCheck.role
        } as UserProfile
      }
      
      console.error("Tất cả các lần thử đều thất bại, không thể tạo hoặc tìm người dùng")
      return null
    }
    
    // Lấy thông tin người dùng sau khi tạo
    const { data: createdUser, error: fetchError } = await supabase
      .from("users")
      .select("*")
      .eq("id", user.id)
      .single()
    
    if (fetchError || !createdUser) {
      console.error("Không thể lấy thông tin người dùng sau khi tạo:", fetchError)
      // Trả về profile dựa trên dữ liệu đã biết
      return {
        id: newUserData.id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        username: newUserData.email?.split('@')[0] || null,
        email: newUserData.email,
        full_name: newUserData.full_name,
        avatar_url: newUserData.avatar_url,
        role: newUserData.role
      }
    }
    
    // Trả về profile từ dữ liệu đã lấy được
    return {
      id: createdUser.id,
      created_at: createdUser.created_at,
      updated_at: createdUser.created_at,
      username: createdUser.email?.split('@')[0] || null,
      email: createdUser.email,
      full_name: createdUser.full_name,
      avatar_url: createdUser.avatar_url,
      role: createdUser.role
    } as UserProfile
  } catch (error) {
    console.error("Lỗi không mong đợi trong ensureUserInDatabase:", error)
    return null
  }
}

/**
 * Lấy thông tin profile của người dùng hiện tại
 */
// Biến lưu cache cho profile người dùng
let userProfileCache: UserProfile | null = null;
let lastFetchTime = 0;
const CACHE_DURATION = 300000; // Tăng lên 5 phút
let fetchPromise: Promise<UserProfile | null> | null = null;

export async function getCurrentUserProfile(forceRefresh = false): Promise<UserProfile | null> {
  // Check cache first unless force refresh is requested
  const now = Date.now();
  if (!forceRefresh && userProfileCache && (now - lastFetchTime < CACHE_DURATION)) {
    return userProfileCache;
  }
  
  // Nếu đã có một request đang chạy, return promise đó để tránh gọi API nhiều lần
  if (fetchPromise) {
    return fetchPromise;
  }
  
  // Sử dụng createBrowserSupabaseClient - sẽ trả về instance duy nhất
  const supabase = createBrowserSupabaseClient()
  
  try {
    // Tạo promise mới và lưu lại
    fetchPromise = (async () => {
      try {
        // Giảm log bằng cách chỉ log khi không có cache
        if (!userProfileCache) {
          console.log("getCurrentUserProfile - getting user info")
        }
        
        // Lấy thông tin người dùng hiện tại
        const { data: { user }, error: userError } = await supabase.auth.getUser()
        
        if (userError || !user) {
          if (!userProfileCache) { // Chỉ log khi không có cache
            console.error("Error fetching user:", userError?.message)
          }
          return null
        }
        
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
        
        // Chỉ log thông tin role nếu không có cache hoặc force refresh
        if (!userProfileCache || forceRefresh) {
          console.log("getCurrentUserProfile - found profile with role:", userData.role)
        }
        
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
      } finally {
        // Xóa promise đã hoàn thành
        fetchPromise = null
      }
    })();
    
    return await fetchPromise;
  } catch (error) {
    fetchPromise = null;
    console.error("Unexpected error outside getCurrentUserProfile:", error)
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
    
    // Cập nhật cache sau khi update
    const updatedProfile = {
      id: updatedUser.id,
      created_at: updatedUser.created_at,
      updated_at: updatedUser.created_at, // Nếu không có trường updated_at
      username: updatedUser.email?.split('@')[0] || null,
      email: updatedUser.email,
      full_name: updatedUser.full_name,
      avatar_url: updatedUser.avatar_url,
      role: updatedUser.role
    } as UserProfile;
    
    // Update cache
    userProfileCache = updatedProfile;
    lastFetchTime = Date.now();
    
    return updatedProfile;
  } catch (error) {
    console.error("Error in updateUserProfile:", error)
    return null
  }
} 