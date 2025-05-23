import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase'

export async function GET(req: NextRequest) {
  try {
    const supabase = createServerSupabaseClient()
    
    // Lấy thông tin session hiện tại
    const { data: { session }, error } = await supabase.auth.getSession()
    
    if (error) {
      return NextResponse.json(
        { 
          error: 'Lỗi khi lấy thông tin session', 
          details: error.message,
          time: new Date().toISOString()
        },
        { status: 500 }
      )
    }
    
    if (!session) {
      return NextResponse.json(
        { 
          message: 'Không có phiên đăng nhập nào', 
          time: new Date().toISOString()
        }
      )
    }
    
    // Kiểm tra thông tin users
    const { data: userRecord, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('id', session.user.id)
      .single()
      
    return NextResponse.json({
      authenticated: true,
      user: {
        id: session.user.id,
        email: session.user.email,
        created_at: session.user.created_at,
        last_sign_in_at: session.user.last_sign_in_at,
      },
      userRecord: userError ? null : userRecord,
      userRecordError: userError ? userError.message : null,
      time: new Date().toISOString()
    })
    
  } catch (error) {
    console.error('Debug endpoint error:', error)
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