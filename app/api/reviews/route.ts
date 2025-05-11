import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase'
import { requireAuth, optionalAuth } from '@/lib/auth-api'

interface User {
  id: string
  email?: string | null
  full_name?: string | null
  avatar_url?: string | null
}

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url)
    const gameId = url.searchParams.get('gameId')
    
    if (!gameId) {
      return NextResponse.json(
        { error: 'Game ID is required' },
        { status: 400 }
      )
    }
    
    const supabase = createServerSupabaseClient()
    
    // First fetch the reviews
    const { data: reviews, error } = await supabase
      .from('game_reviews')
      .select(`
        id, 
        rating, 
        content, 
        likes, 
        created_at,
        user_id
      `)
      .eq('game_id', gameId)
      .eq('status', 'published')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching reviews:', error)
      return NextResponse.json(
        { error: 'Failed to fetch reviews' },
        { status: 500 }
      )
    }

    // Then get user details separately
    const userIds = reviews.map(review => review.user_id)
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('id, email, full_name, avatar_url')
      .in('id', userIds)

    if (usersError) {
      console.error('Error fetching users:', usersError)
    }

    // Create a user map for easier lookup
    const userMap: Record<string, User> = {}
    if (users) {
      users.forEach((user: any) => {
        userMap[user.id] = {
          id: user.id,
          email: user.email || null,
          full_name: user.full_name || null,
          avatar_url: user.avatar_url || null
        }
      })
    }

    // Transform data for frontend consumption
    const formattedReviews = reviews.map(review => {
      const user = userMap[review.user_id] || {
        id: review.user_id,
        email: null,
        full_name: null,
        avatar_url: null
      }
      
      return {
        id: review.id,
        rating: review.rating,
        content: review.content,
        likes: review.likes,
        date: new Date(review.created_at).toLocaleDateString('vi-VN', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric'
        }),
        author: user.full_name || 
                (user.email ? user.email.split('@')[0] : null) || 
                'Anonymous User',
        avatar: user.avatar_url || null,
        userId: review.user_id
      }
    })

    return NextResponse.json(formattedReviews)
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    )
  }
}

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
    const { gameId, rating, content } = body
    
    if (!gameId || !rating || !content) {
      return NextResponse.json(
        { error: 'Game ID, rating, and content are required' },
        { status: 400 }
      )
    }
    
    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: 'Rating must be between 1 and 5' },
        { status: 400 }
      )
    }
    
    // Check if user already reviewed this game
    const { data: existingReview } = await supabase
      .from('game_reviews')
      .select('id')
      .eq('game_id', gameId)
      .eq('user_id', user.id)
      .single()
    
    if (existingReview) {
      return NextResponse.json(
        { error: 'You have already reviewed this game' },
        { status: 409 }
      )
    }
    
    // Insert new review
    const { data, error } = await supabase
      .from('game_reviews')
      .insert({
        game_id: gameId,
        user_id: user.id,
        rating,
        content,
        status: 'published'
      })
      .select('id')
    
    if (error) {
      console.error('Error creating review:', error)
      return NextResponse.json(
        { error: 'Failed to create review' },
        { status: 500 }
      )
    }
    
    return NextResponse.json({ 
      success: true, 
      message: 'Review submitted successfully',
      reviewId: data?.[0]?.id
    }, { status: 201 })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    )
  }
} 