import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase'
import { ensureUserInDatabase } from '@/lib/auth-utils'

export async function POST(req: NextRequest) {
  try {
    const supabase = createServerSupabaseClient()
    const body = await req.json()
    const { email, password } = body
    
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email và mật khẩu là bắt buộc' },
        { status: 400 }
      )
    }
    
    console.log('Đang thử đăng nhập với email:', email)
    
    // Thử đăng nhập
    const { data, error } = await supabase.auth.signInWithPassword({
      email, 
      password
    })
    
    if (error) {
      console.error('Lỗi đăng nhập:', error)
      
      return NextResponse.json({
        success: false,
        error: error.message,
        errorCode: error.code,
        status: error.status,
        time: new Date().toISOString()
      }, { status: 400 })
    }
    
    // Đăng nhập thành công, thử đảm bảo user tồn tại trong DB
    if (data.user) {
      let profile = null
      try {
        profile = await ensureUserInDatabase(supabase, data.user)
      } catch (err) {
        console.error('Lỗi khi đảm bảo user tồn tại trong DB:', err)
      }
      
      return NextResponse.json({
        success: true,
        user: {
          id: data.user.id,
          email: data.user.email,
          created_at: data.user.created_at,
        },
        profile: profile ? {
          id: profile.id,
          email: profile.email,
          full_name: profile.full_name,
          role: profile.role
        } : null,
        hasSession: !!data.session,
        time: new Date().toISOString()
      })
    }
    
    return NextResponse.json({
      success: false,
      error: 'Đăng nhập thành công nhưng không có thông tin người dùng',
      time: new Date().toISOString()
    }, { status: 500 })
    
  } catch (error) {
    console.error('Test login error:', error)
    return NextResponse.json(
      { 
        error: 'Unexpected error', 
        details: error instanceof Error ? error.message : String(error),
        time: new Date().toISOString()
      },
      { status: 500 }
    )
  }
} 