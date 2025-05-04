import { createClient } from '@supabase/supabase-js'
import { Database } from '@/types/supabase'

export const createServerSupabaseClient = () => {
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

export type Article = {
  id: string
  title: string
  slug: string
  summary?: string | null
  excerpt?: string | null
  content?: string | null
  cover_image?: string | null
  category?: string | null
  author_name?: string | null
  author_id?: string | null
  created_at: string
  published_at?: string | null
  publish_date?: string | null
  tags?: string[] | null
  is_featured?: boolean
  status: 'draft' | 'published'
  views?: number
  comments_count?: number
  likes?: number
  author?: {
    id?: string
    full_name?: string | null
    email?: string | null
    avatar_url?: string | null
  } | null
} 