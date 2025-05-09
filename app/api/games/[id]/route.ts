import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id
    
    if (!id) {
      return NextResponse.json(
        { error: "Game ID is required" },
        { status: 400 }
      )
    }
    
    // Initialize Supabase client
    const supabase = createServerSupabaseClient()
    
    // Fetch game data
    const { data: game, error: gameError } = await supabase
      .from('games')
      .select('*')
      .eq('id', id)
      .single()
    
    if (gameError) {
      console.error("Error fetching game:", gameError)
      return NextResponse.json(
        { error: "Error fetching game", details: gameError.message },
        { status: 500 }
      )
    }
    
    if (!game) {
      return NextResponse.json(
        { error: "Game not found" },
        { status: 404 }
      )
    }
    
    // Add fallback for gameImages if not present
    if (!game.gameImages || !Array.isArray(game.gameImages) || game.gameImages.length === 0) {
      // Create gameImages from image field if it exists
      if (game.image) {
        game.gameImages = [{
          id: 'img_0',
          url: game.image,
          caption: null,
          is_primary: true,
          display_order: 0
        }];
      } else {
        game.gameImages = [];
      }
    }
    
    return NextResponse.json(game)
    
  } catch (error) {
    console.error("Error in GET game by ID:", error)
    return NextResponse.json(
      { 
        error: "Error fetching game data", 
        details: error instanceof Error ? error.message : "Unknown error" 
      },
      { status: 500 }
    )
  }
} 