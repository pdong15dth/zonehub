import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { createServerSupabaseClient } from "@/lib/supabase-server"
import { getCurrentUserProfile, isCurrentUserAdmin } from "@/lib/auth-utils"

// Helper function to get user ID from request
async function getUserFromRequest(request: Request) {
  try {
    // Create a supabase client using the request's cookies
    const supabase = createServerSupabaseClient()

    // Check for authorization header
    const authHeader = request.headers.get('authorization')
    console.log("authHeader", authHeader)
    if (authHeader && authHeader.startsWith('Bearer ')) {
      // Extract token
      const token = authHeader.split(' ')[1]
      if (token) {
        const { data, error } = await supabase.auth.getUser(token)
        if (!error && data.user) {
          return data.user.id
        }
      }
    }

    // If no auth header or invalid, try cookies
    const { data: { session } } = await supabase.auth.getSession()
    return session?.user?.id || null
  } catch (error) {
    console.error('Error getting user from request:', error)
    return null
  }
}

// Game schema validation
const gameSchema = z.object({
  title: z.string().min(1, "Title is required"),
  developer: z.string().min(1, "Developer is required"),
  publisher: z.string().min(1, "Publisher is required"),
  release_date: z.string().min(1, "Release date is required"),
  description: z.string().optional(),
  content: z.string().optional(),
  system_requirements: z.string().optional(),
  trailer_url: z.string().optional(),
  official_website: z.string().optional(),
  platform: z.array(z.string()),
  genre: z.array(z.string()),
  rating: z.number().min(0).max(5).default(0),
  featured: z.boolean().default(false),
  image: z.string().default("/placeholder.svg"),
  images: z.array(z.string()).optional(),
  gameImages: z.array(
    z.object({
      id: z.string().optional(),
      url: z.string(),
      caption: z.string().optional().nullable(),
      is_primary: z.boolean().optional(),
      display_order: z.number().optional(),
    })
  ).optional(),
  author_id: z.string().optional(),
})

export async function POST(request: Request) {
  try {
    // Initialize Supabase
    const supabase = createServerSupabaseClient()

    // Get request body
    const dataRequest = await request.json();

    console.log("DONGPH 1 ", dataRequest)

    // Try to get user ID from different sources
    let userId = null;

    // 1. First check if user_id is directly provided in the request body
    if (dataRequest.user_id) {
      userId = dataRequest.user_id;
      console.log("Using user ID from request body:", userId);

      // Remove user_id from data so it doesn't interfere with the DB schema
      delete dataRequest.user_id;
    } else {
      // 2. Fall back to checking auth from headers/cookies
      userId = await getUserFromRequest(request);
      console.log("Using user ID from auth:", userId);
    }

    console.log("Final user ID:", userId);

    // Parse and validate request body
    const validationResult = gameSchema.safeParse(dataRequest)

    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: "Validation error",
          details: validationResult.error.format()
        },
        { status: 400 }
      )
    }

    const gameData = validationResult.data
    
    // Extract gameImages data
    const gameImagesData = gameData.gameImages || []
    
    // Find primary image for the main image field
    const primaryImage = gameImagesData.find(img => img.is_primary)?.url || gameData.image || "/placeholder.svg"

    // Prepare game data with creator info
    const gameRecord = {
      title: gameData.title,
      developer: gameData.developer,
      publisher: gameData.publisher,
      release_date: gameData.release_date,
      description: gameData.description || "",
      content: gameData.content || "",
      system_requirements: gameData.system_requirements || "",
      trailer_url: gameData.trailer_url || "",
      official_website: gameData.official_website || "",
      platform: gameData.platform,
      genre: gameData.genre,
      rating: gameData.rating,
      downloads: 0, // Initialize downloads count
      featured: gameData.featured,
      image: primaryImage,
      gameImages: gameImagesData,
      status: "published", // Default status
      created_by: userId,
      updated_by: userId,
      author_id: gameData.author_id || userId, // Use provided author_id or default to creator
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }

    // Insert game record into Supabase
    const { data, error } = await supabase
      .from('games')
      .insert(gameRecord)
      .select()
      .single()

    if (error) {
      console.error("Supabase error:", error)
      return NextResponse.json(
        { error: "Error creating game", details: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json(
      {
        message: "Game created successfully",
        game: data
      },
      { status: 201 }
    )

  } catch (error) {
    console.error("Error creating game:", error)
    return NextResponse.json(
      {
        error: "Error creating game",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    )
  }
}

// PUT handler to update games
export async function PUT(request: Request) {
  try {
    // Initialize Supabase
    const supabase = createServerSupabaseClient()
    
    // Get current user profile
    const user = await getCurrentUserProfile()
    console.log("Current user profile:", user)
    
    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized access" },
        { status: 401 }
      )
    }
    
    // Verify admin or editor role
    if (user.role !== "admin" && user.role !== "editor") {
      return NextResponse.json(
        { error: "Insufficient permissions" },
        { status: 403 }
      )
    }
    
    // Get request data
    const requestData = await request.json()
    
    // Get game ID from the request data
    const gameId = requestData.id
    
    if (!gameId) {
      return NextResponse.json(
        { error: "Game ID is required" },
        { status: 400 }
      )
    }
    
    // Parse and validate request body
    const validationResult = gameSchema.safeParse(requestData)
    
    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: "Validation error",
          details: validationResult.error.format()
        },
        { status: 400 }
      )
    }
    
    const gameData = validationResult.data
    
    // Extract gameImages data
    const gameImagesData = gameData.gameImages || []
    
    // Find primary image for the main image field
    const primaryImage = gameImagesData.find(img => img.is_primary)?.url || gameData.image || "/placeholder.svg"
    
    // Prepare update data
    const updateData = {
      title: gameData.title,
      developer: gameData.developer,
      publisher: gameData.publisher,
      release_date: gameData.release_date,
      description: gameData.description || "",
      content: gameData.content || "",
      system_requirements: gameData.system_requirements || "",
      trailer_url: gameData.trailer_url || "",
      official_website: gameData.official_website || "",
      platform: gameData.platform,
      genre: gameData.genre,
      rating: gameData.rating,
      featured: gameData.featured,
      image: primaryImage,
      gameImages: gameImagesData,
      updated_by: user.id,
      updated_at: new Date().toISOString()
    }
    
    // Update game record
    const { data, error } = await supabase
      .from('games')
      .update(updateData)
      .eq('id', gameId)
      .select()
      .single()
    
    if (error) {
      console.error("Supabase error:", error)
      return NextResponse.json(
        { error: "Error updating game", details: error.message },
        { status: 500 }
      )
    }
    
    return NextResponse.json({
      message: "Game updated successfully",
      game: data
    })
    
  } catch (error) {
    console.error("Error updating game:", error)
    return NextResponse.json(
      {
        error: "Error updating game",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    )
  }
}

// GET handler to retrieve games
export async function GET(request: Request) {
  try {
    // Initialize Supabase
    const supabase = createServerSupabaseClient()
    
    const { searchParams } = new URL(request.url)
    
    // Parse query parameters
    const query = searchParams.get("query") || ""
    const genre = searchParams.get("genre") || null
    const platform = searchParams.get("platform") || null
    const featured = searchParams.get("featured") === "true" ? true : null
    const limit = parseInt(searchParams.get("limit") || "50")
    const page = parseInt(searchParams.get("page") || "1")
    const offset = (page - 1) * limit
    
    // Build Supabase query - Remove the author relation that doesn't exist
    let supabaseQuery = supabase
      .from('games')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit)
      .range(offset, offset + limit - 1)
    
    // Add filters
    if (query) {
      supabaseQuery = supabaseQuery.or(`title.ilike.%${query}%,developer.ilike.%${query}%,publisher.ilike.%${query}%`)
    }
    
    if (genre) {
      supabaseQuery = supabaseQuery.contains('genre', [genre])
    }
    
    if (platform) {
      supabaseQuery = supabaseQuery.contains('platform', [platform])
    }
    
    if (featured !== null) {
      supabaseQuery = supabaseQuery.eq('featured', featured)
    }
    
    // Execute query
    const { data: games, error } = await supabaseQuery
    
    if (error) {
      console.error("Supabase error:", error)
      return NextResponse.json(
        { error: "Error fetching games", details: error.message },
        { status: 500 }
      )
    }
    
    // Format the games data to match the expected structure
    const formattedGames = games.map(game => ({
      id: game.id,
      title: game.title,
      developer: game.developer,
      publisher: game.publisher,
      platform: game.platform || [],
      releaseDate: game.release_date,
      genre: game.genre || [],
      rating: game.rating || 0,
      downloads: game.downloads || 0,
      status: game.status || "published",
      featured: game.featured || false,
      image: game.image || "/placeholder.svg",
      description: game.description,
      content: game.content,
      system_requirements: game.system_requirements,
      trailer_url: game.trailer_url,
      official_website: game.official_website,
      created_at: game.created_at,
      updated_at: game.updated_at,
      author_id: game.author_id || null
    }))
    
    // Get total count
    const { count, error: countError } = await supabase
      .from('games')
      .select('*', { count: 'exact', head: true })
    
    if (countError) {
      console.error("Count error:", countError)
    }
    
    // Return paginated results
    return NextResponse.json({
      success: true,
      games: formattedGames,
      pagination: {
        total: count || 0,
        page,
        limit,
        totalPages: Math.ceil((count || 0) / limit),
      },
    })
    
  } catch (error) {
    console.error("Error fetching games:", error)
    return NextResponse.json(
      { 
        success: false,
        error: "Error fetching games", 
        details: error instanceof Error ? error.message : "Unknown error" 
      },
      { status: 500 }
    )
  }
}

// DELETE handler to remove games
export async function DELETE(request: Request) {
  try {
    // Initialize Supabase
    const supabase = createServerSupabaseClient()

    // Get current user profile
    const user = await getCurrentUserProfile()
    console.log("Current user profile:", user)

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized access" },
        { status: 401 }
      )
    }

    // Verify admin role
    if (user.role !== "admin") {
      return NextResponse.json(
        { error: "Insufficient permissions" },
        { status: 403 }
      )
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json(
        { error: "Game ID is required for deletion" },
        { status: 400 }
      )
    }

    // Delete the game record
    const { error } = await supabase
      .from('games')
      .delete()
      .eq('id', id)

    if (error) {
      console.error("Supabase error:", error)
      return NextResponse.json(
        { error: "Error deleting game", details: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json(
      {
        message: "Game deleted successfully"
      },
      { status: 200 }
    )

  } catch (error) {
    console.error("Error deleting game:", error)
    return NextResponse.json(
      {
        error: "Error deleting game",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    )
  }
} 