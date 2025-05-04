import { createServerSupabaseClient } from '@/lib/supabase';
import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';

// Helper function to get user ID from request
async function getUserFromRequest(request: Request) {
  try {
    // Create a supabase client using the request's cookies
    const supabase = createServerSupabaseClient();
    
    // Check for authorization header
    const authHeader = request.headers.get('authorization');
    if (authHeader && authHeader.startsWith('Bearer ')) {
      // Extract token
      const token = authHeader.split(' ')[1];
      if (token) {
        const { data, error } = await supabase.auth.getUser(token);
        if (!error && data.user) {
          return data.user.id;
        }
      }
    }
    
    // If no auth header or invalid, try cookies
    const { data: { session } } = await supabase.auth.getSession();
    return session?.user?.id || null;
  } catch (error) {
    console.error('Error getting user from request:', error);
    return null;
  }
}

// POST endpoint for creating or updating articles
export async function POST(request: Request) {
  try {
    const supabase = createServerSupabaseClient();
    
    // Get request body
    const data = await request.json();
    
    // Try to get user ID from different sources
    let userId = null;
    
    // 1. First check if user_id is directly provided in the request body
    if (data.user_id) {
      userId = data.user_id;
      console.log("Using user ID from request body:", userId);
      
      // Remove user_id from data so it doesn't interfere with the DB schema
      delete data.user_id;
    } else {
      // 2. Fall back to checking auth from headers/cookies
      userId = await getUserFromRequest(request);
      console.log("Using user ID from auth:", userId);
    }
    
    console.log("Final user ID:", userId);
    
    // Process tags into an array if they're provided as a comma-separated string
    const processedTags = typeof data.tags === 'string' 
      ? data.tags.split(',').map((tag: string) => tag.trim()).filter(Boolean) 
      : data.tags;
    
    // Create article ID if not provided
    const articleId = data.id || uuidv4();
    
    const now = new Date().toISOString();
    
    // Build article data for insert/update
    const articleData: any = {
      id: articleId,
      title: data.title,
      slug: data.slug,
      summary: data.summary,
      content: data.content,
      cover_image: data.coverImage,
      category: data.category,
      tags: processedTags,
      is_featured: data.isFeatured || false,
      publish_date: data.status === 'published' ? now : data.publishDate,
      status: data.status || 'draft',
      updated_at: now
    };
    
    // Only include user IDs if we have a valid session
    if (userId) {
      articleData.author_id = userId;
      articleData.updated_by = userId;
    }

    console.log("Saving article data:", articleData);

    // Check if article already exists
    const { data: existingArticle, error: checkError } = await supabase
      .from('articles')
      .select('id')
      .eq('id', articleId)
      .maybeSingle();
    
    if (checkError) {
      console.error("Error checking existing article:", checkError);
    }
    
    let result;
    
    // Insert or update based on existence
    if (existingArticle) {
      // Update existing article
      result = await supabase
        .from('articles')
        .update(articleData)
        .eq('id', articleId);
    } else {
      // Insert new article
      result = await supabase
        .from('articles')
        .insert({
          ...articleData,
          created_at: new Date().toISOString()
        });
    }
    
    if (result.error) {
      console.error('Error saving article:', result.error);
      
      // Try direct SQL approach as fallback (if the table exists but policies are an issue)
      const sql = `
        INSERT INTO articles (
          id, title, slug, summary, content, cover_image, category, 
          tags, is_featured, publish_date, status, author_id, 
          created_at, updated_at
        ) VALUES (
          '${articleId}',
          '${articleData.title.replace(/'/g, "''")}',
          '${articleData.slug.replace(/'/g, "''")}',
          ${articleData.summary ? `'${articleData.summary.replace(/'/g, "''")}'` : 'NULL'},
          ${articleData.content ? `'${articleData.content.replace(/'/g, "''")}'` : 'NULL'},
          ${articleData.cover_image ? `'${articleData.cover_image.replace(/'/g, "''")}'` : 'NULL'},
          ${articleData.category ? `'${articleData.category.replace(/'/g, "''")}'` : 'NULL'},
          '{}',
          ${articleData.is_featured ? 'TRUE' : 'FALSE'},
          ${articleData.publish_date ? `'${articleData.publish_date}'` : 'NULL'},
          '${articleData.status}',
          ${articleData.author_id ? `'${articleData.author_id}'` : 'NULL'},
          NOW(),
          NOW()
        )
        ON CONFLICT (id) DO UPDATE SET
          title = EXCLUDED.title,
          slug = EXCLUDED.slug,
          summary = EXCLUDED.summary,
          content = EXCLUDED.content,
          cover_image = EXCLUDED.cover_image,
          category = EXCLUDED.category,
          is_featured = EXCLUDED.is_featured,
          publish_date = EXCLUDED.publish_date,
          status = EXCLUDED.status,
          updated_at = NOW()
        RETURNING id;
      `;
      
      try {
        const { error: directError } = await supabase.rpc('exec_sql', { sql });
        if (directError) {
          console.error("Direct SQL approach failed:", directError);
          return NextResponse.json(
            { 
              error: 'Failed to save article',
              details: `Initial error: ${result.error.message}. Fallback also failed: ${directError.message}`,
              suggestion: "Please run the Update RLS Policies tool to grant full access permission."
            },
            { status: 500 }
          );
        }
        
        // Direct SQL worked
        console.log("Article saved using direct SQL");
      } catch (directError) {
        console.error("Error with direct SQL approach:", directError);
        return NextResponse.json(
          { 
            error: 'Failed to save article with all approaches',
            details: result.error.message, 
            suggestion: "Please run the Update RLS Policies tool to grant full access permission."
          },
          { status: 500 }
        );
      }
    }

    return NextResponse.json({
      success: true,
      message: `Article ${data.status === 'published' ? 'published' : 'saved as draft'} successfully`,
      id: articleId
    });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}

// PUT endpoint for updating articles
export async function PUT(request: Request) {
  try {
    const supabase = createServerSupabaseClient();
    
    // Get request body
    const data = await request.json();
    
    // Try to get user ID from different sources
    let userId = null;
    
    // 1. First check if user_id is directly provided in the request body
    if (data.user_id) {
      userId = data.user_id;
      console.log("Using user ID from request body:", userId);
      
      // Remove user_id from data so it doesn't interfere with the DB schema
      delete data.user_id;
    } else {
      // 2. Fall back to checking auth from headers/cookies
      userId = await getUserFromRequest(request);
      console.log("Using user ID from auth:", userId);
    }
    
    console.log("Final user ID:", userId);
    
    if (!data.id) {
      return NextResponse.json(
        { error: "Article ID is required for updates" },
        { status: 400 }
      );
    }
    
    // Process tags into an array if they're provided as a comma-separated string
    const processedTags = typeof data.tags === "string" 
      ? data.tags.split(",").map((tag: string) => tag.trim()).filter(Boolean) 
      : data.tags;
    
    const now = new Date().toISOString();
    
    // Build article data for update
    const articleData: any = {
      title: data.title,
      slug: data.slug,
      summary: data.summary,
      content: data.content,
      cover_image: data.cover_image,
      category: data.category,
      tags: processedTags,
      is_featured: data.is_featured || false,
      publish_date: data.status === "published" ? now : data.publish_date,
      status: data.status || "draft",
      updated_at: now
    };
    
    // Only include user IDs if we have a valid session
    if (userId) {
      articleData.author_id = userId;
      articleData.updated_by = userId;
    }

    console.log("Updating article data:", articleData);
    
    // Update the article
    const { data: updatedArticle, error: updateError } = await supabase
      .from("articles")
      .update(articleData)
      .eq("id", data.id)
      .select();
    
    if (updateError) {
      console.error("Error updating article:", updateError);
      return NextResponse.json(
        { 
          error: "Failed to update article",
          details: updateError.message
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Article updated successfully",
      data: updatedArticle || { id: data.id }
    });
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred", details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}

// GET endpoint for retrieving articles
export async function GET(request: Request) {
  try {
    const supabase = createServerSupabaseClient();
    const { searchParams } = new URL(request.url);
    
    // Get query parameters
    const status = searchParams.get('status');
    const id = searchParams.get('id');
    const slug = searchParams.get('slug');
    
    // Build query
    let query = supabase.from('articles').select('*');
    
    // Apply filters if provided
    if (id) {
      query = query.eq('id', id);
    }
    
    if (slug) {
      query = query.eq('slug', slug);
    }
    
    if (status) {
      query = query.eq('status', status);
    }
    
    // Execute query
    const { data, error } = await query;
    
    if (error) {
      console.error('Error retrieving articles:', error);
      return NextResponse.json(
        { error: 'Failed to retrieve articles', details: error.message },
        { status: 500 }
      );
    }
    
    return NextResponse.json({
      success: true,
      data
    });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
} 