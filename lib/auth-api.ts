import { createServerSupabaseClient } from './supabase'
import { NextRequest, NextResponse } from 'next/server'

/**
 * Kiểm tra và lấy thông tin người dùng hiện tại từ request API
 * @returns Thông tin người dùng đã đăng nhập hoặc null nếu chưa đăng nhập
 */
export async function getCurrentUser(req: NextRequest) {
  try {
    const supabase = createServerSupabaseClient()
    const { data: { user }, error } = await supabase.auth.getUser()
    
    if (error || !user) {
      console.error("Auth error in getCurrentUser:", error)
      return null
    }
    
    return user
  } catch (error) {
    console.error("Error in getCurrentUser:", error)
    return null
  }
}

/**
 * Middleware bảo vệ API route, yêu cầu người dùng phải đăng nhập
 * Sử dụng: `const user = await requireAuth(req, res)`
 */
export async function requireAuth(req: NextRequest) {
  const user = await getCurrentUser(req)
  
  if (!user) {
    return {
      user: null,
      response: NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }
  }
  
  return { user, response: null }
}

/**
 * Middleware để lấy thông tin người dùng nhưng không bắt buộc đăng nhập
 * Sử dụng: `const { user } = await optionalAuth(req)`
 */
export async function optionalAuth(req: NextRequest) {
  const user = await getCurrentUser(req)
  return { user }
}

/**
 * Lấy dữ liệu người dùng đầy đủ từ bảng users (bao gồm role, etc.)
 */
export async function getUserProfile(userId: string) {
  try {
    const supabase = createServerSupabaseClient()
    
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single()
    
    if (error) {
      console.error("Error fetching user profile:", error)
      return null
    }
    
    return data
  } catch (error) {
    console.error("Error in getUserProfile:", error)
    return null
  }
} 