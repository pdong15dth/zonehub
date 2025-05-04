export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          created_at: string
          email: string
          full_name: string | null
          avatar_url: string | null
          role: 'admin' | 'member' | 'editor'
        }
        Insert: {
          id: string
          created_at?: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          role?: 'admin' | 'member' | 'editor'
        }
        Update: {
          id?: string
          created_at?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          role?: 'admin' | 'member' | 'editor'
        }
      }
      zones: {
        Row: {
          id: string
          created_at: string
          title: string
          description: string | null
          image_url: string | null
          owner_id: string
        }
        Insert: {
          id?: string
          created_at?: string
          title: string
          description?: string | null
          image_url?: string | null
          owner_id: string
        }
        Update: {
          id?: string
          created_at?: string
          title?: string
          description?: string | null
          image_url?: string | null
          owner_id?: string
        }
      }
      articles: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          title: string
          slug: string
          summary: string | null
          content: string | null
          cover_image: string | null
          category: string | null
          tags: string[] | null
          is_featured: boolean
          publish_date: string | null
          status: 'draft' | 'published'
          author_id: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          title: string
          slug: string
          summary?: string | null
          content?: string | null
          cover_image?: string | null
          category?: string | null
          tags?: string[] | null
          is_featured?: boolean
          publish_date?: string | null
          status?: 'draft' | 'published'
          author_id?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          title?: string
          slug?: string
          summary?: string | null
          content?: string | null
          cover_image?: string | null
          category?: string | null
          tags?: string[] | null
          is_featured?: boolean
          publish_date?: string | null
          status?: 'draft' | 'published'
          author_id?: string | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
} 