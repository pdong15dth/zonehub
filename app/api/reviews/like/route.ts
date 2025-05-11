import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase'
import { requireAuth } from '@/lib/auth-api'

export async function POST(req: NextRequest) {
  // Sử dụng middleware xác thực
  const { user, response } = await requireAuth(req)
  
  // Nếu không có user, trả về lỗi 401 từ middleware
  if (!user) {
    return response
  }
  
  try {
    const supabase = createServerSupabaseClient()
    const body = await req.json()
    const { reviewId } = body
    
    if (!reviewId) {
      return NextResponse.json(
        { error: 'Review ID is required' },
        { status: 400 }
      )
    }
    
    // First, get the current review
    const { data: review, error: fetchError } = await supabase
      .from('game_reviews')
      .select('likes')
      .eq('id', reviewId)
      .single()
    
    if (fetchError) {
      console.error('Error fetching review:', fetchError)
      return NextResponse.json(
        { error: 'Failed to find review' },
        { status: 404 }
      )
    }
    
    // Update the likes count
    const { data, error } = await supabase
      .from('game_reviews')
      .update({
        likes: (review.likes || 0) + 1,
        updated_at: new Date().toISOString()
      })
      .eq('id', reviewId)
      .select('likes')
    
    if (error) {
      console.error('Error updating review likes:', error)
      return NextResponse.json(
        { error: 'Failed to update likes' },
        { status: 500 }
      )
    }
    
    return NextResponse.json({ 
      success: true, 
      likes: data?.[0]?.likes || 0
    })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    )
  }
} 