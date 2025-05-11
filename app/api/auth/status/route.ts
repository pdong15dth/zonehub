import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase'

export async function GET(req: NextRequest) {
  try {
    const supabase = createServerSupabaseClient()
    
    // Kiểm tra kết nối đến Supabase
    const startTime = Date.now()
    const { data: pingResult, error: pingError } = await supabase
      .from('_supabase_status') // Bảng ảo để kiểm tra kết nối
      .select('status')
      .maybeSingle()
      
    const pingDuration = Date.now() - startTime
    
    // Kiểm tra trạng thái Auth service
    const authStartTime = Date.now()
    const { data: authData, error: authError } = await supabase.auth.getUser()
    const authDuration = Date.now() - authStartTime
    
    // Kiểm tra trạng thái Database
    const dbStartTime = Date.now()
    const { count, error: dbError } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true })
    const dbDuration = Date.now() - dbStartTime
    
    return NextResponse.json({
      status: 'online',
      supabase_connection: {
        status: pingError ? 'error' : 'ok',
        duration_ms: pingDuration,
        error: pingError ? pingError.message : null
      },
      auth_service: {
        status: authError ? 'error' : 'ok',
        duration_ms: authDuration,
        error: authError ? authError.message : null
      },
      database: {
        status: dbError ? 'error' : 'ok',
        duration_ms: dbDuration,
        error: dbError ? dbError.message : null,
        count: count || 0
      },
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Status check error:', error)
    return NextResponse.json(
      { 
        status: 'error',
        error: error instanceof Error ? error.message : String(error),
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  }
} 