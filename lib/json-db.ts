import { promises as fs } from 'fs'
import path from 'path'

// Types for our JSON database
export interface Article {
  id: string
  title: string
  slug: string
  summary?: string | null
  content?: string | null
  cover_image?: string | null
  category?: string | null
  tags?: string[] | null
  is_featured?: boolean
  publish_date?: string | null
  status: 'draft' | 'published'
  created_at: string
  updated_at: string
  views?: number
  comments_count?: number
  likes?: number
}

export interface Game {
  id: string
  title: string
  developer: string
  publisher: string
  release_date: string
  description?: string | null
  content?: string | null
  system_requirements?: string | null
  trailer_url?: string | null
  official_website?: string | null
  platform: string[]
  genre: string[]
  rating: number
  downloads: number
  status: 'draft' | 'published'
  featured: boolean
  image?: string | null
  gameImages?: {
    id: string
    url: string
    caption?: string | null
    is_primary: boolean
    display_order: number
  }[]
  created_at: string
  updated_at: string
}

export interface Review {
  id: string
  game_id: string
  rating: number
  content: string
  likes: number
  status: 'draft' | 'published' | 'hidden'
  created_at: string
  updated_at: string
}

// Generic JSON database operations
class JsonDatabase {
  private dataDir = path.join(process.cwd(), 'data')

  private async readFile<T>(filename: string): Promise<T[]> {
    try {
      const filePath = path.join(this.dataDir, filename)
      const fileContent = await fs.readFile(filePath, 'utf-8')
      return JSON.parse(fileContent)
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
        return []
      }
      throw error
    }
  }

  private async writeFile<T>(filename: string, data: T[]): Promise<void> {
    try {
      await fs.mkdir(this.dataDir, { recursive: true })
      const filePath = path.join(this.dataDir, filename)
      await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8')
    } catch (error) {
      throw error
    }
  }

  // Generic CRUD operations
  async select<T>(filename: string, options?: {
    eq?: { field: keyof T; value: any }
    filter?: (item: T) => boolean
    order?: { field: keyof T; ascending?: boolean }
    limit?: number
    single?: boolean
  }): Promise<{ data: T | T[] | null; error: Error | null }> {
    try {
      let data = await this.readFile<T>(filename)

      // Apply equality filter
      if (options?.eq) {
        data = data.filter(item => item[options.eq!.field] === options.eq!.value)
      }

      // Apply custom filter
      if (options?.filter) {
        data = data.filter(options.filter)
      }

      // Apply ordering
      if (options?.order) {
        data.sort((a, b) => {
          const aValue = a[options.order!.field]
          const bValue = b[options.order!.field]
          const ascending = options.order!.ascending !== false
          
          if (aValue < bValue) return ascending ? -1 : 1
          if (aValue > bValue) return ascending ? 1 : -1
          return 0
        })
      }

      // Apply limit
      if (options?.limit) {
        data = data.slice(0, options.limit)
      }

      // Return single item or array
      if (options?.single) {
        return { data: data[0] || null, error: null }
      }

      return { data, error: null }
    } catch (error) {
      return { data: null, error: error as Error }
    }
  }

  async insert<T extends { id: string; created_at?: string; updated_at?: string }>(
    filename: string, 
    newItem: Omit<T, 'created_at' | 'updated_at'> & { created_at?: string; updated_at?: string }
  ): Promise<{ data: T | null; error: Error | null }> {
    try {
      const data = await this.readFile<T>(filename)
      const now = new Date().toISOString()
      
      const item: T = {
        ...newItem,
        created_at: newItem.created_at || now,
        updated_at: newItem.updated_at || now
      } as T

      data.push(item)
      await this.writeFile(filename, data)
      
      return { data: item, error: null }
    } catch (error) {
      return { data: null, error: error as Error }
    }
  }

  async update<T extends { id: string; updated_at?: string }>(
    filename: string,
    id: string,
    updates: Partial<Omit<T, 'id' | 'created_at'>>
  ): Promise<{ data: T | null; error: Error | null }> {
    try {
      const data = await this.readFile<T>(filename)
      const index = data.findIndex(item => item.id === id)
      
      if (index === -1) {
        throw new Error('Item not found')
      }

      const updatedItem: T = {
        ...data[index],
        ...updates,
        updated_at: new Date().toISOString()
      } as T

      data[index] = updatedItem
      await this.writeFile(filename, data)
      
      return { data: updatedItem, error: null }
    } catch (error) {
      return { data: null, error: error as Error }
    }
  }

  async delete<T extends { id: string }>(
    filename: string,
    id: string
  ): Promise<{ error: Error | null }> {
    try {
      const data = await this.readFile<T>(filename)
      const index = data.findIndex(item => item.id === id)
      
      if (index === -1) {
        throw new Error('Item not found')
      }

      data.splice(index, 1)
      await this.writeFile(filename, data)
      
      return { error: null }
    } catch (error) {
      return { error: error as Error }
    }
  }

  // Increment a numeric field (for views, likes, etc.)
  async increment<T extends { id: string }>(
    filename: string,
    id: string,
    field: keyof T,
    value: number = 1
  ): Promise<{ data: T | null; error: Error | null }> {
    try {
      const data = await this.readFile<T>(filename)
      const index = data.findIndex(item => item.id === id)
      
      if (index === -1) {
        throw new Error('Item not found')
      }

      const currentValue = (data[index][field] as number) || 0
      ;(data[index] as any)[field] = currentValue + value
      ;(data[index] as any).updated_at = new Date().toISOString()

      await this.writeFile(filename, data)
      
      return { data: data[index], error: null }
    } catch (error) {
      return { data: null, error: error as Error }
    }
  }
}

// Create singleton instance
export const jsonDb = new JsonDatabase()

// Convenience functions for specific tables
export const articlesDb = {
  select: (options?: Parameters<typeof jsonDb.select<Article>>[1]) => 
    jsonDb.select<Article>('articles.json', options),
  insert: (article: Omit<Article, 'created_at' | 'updated_at'>) => 
    jsonDb.insert<Article>('articles.json', article),
  update: (id: string, updates: Partial<Omit<Article, 'id' | 'created_at'>>) => 
    jsonDb.update<Article>('articles.json', id, updates),
  delete: (id: string) => 
    jsonDb.delete<Article>('articles.json', id),
  incrementViews: (id: string) => 
    jsonDb.increment<Article>('articles.json', id, 'views')
}

export const gamesDb = {
  select: (options?: Parameters<typeof jsonDb.select<Game>>[1]) => 
    jsonDb.select<Game>('games.json', options),
  insert: (game: Omit<Game, 'created_at' | 'updated_at'>) => 
    jsonDb.insert<Game>('games.json', game),
  update: (id: string, updates: Partial<Omit<Game, 'id' | 'created_at'>>) => 
    jsonDb.update<Game>('games.json', id, updates),
  delete: (id: string) => 
    jsonDb.delete<Game>('games.json', id)
}

export const reviewsDb = {
  select: (options?: Parameters<typeof jsonDb.select<Review>>[1]) => 
    jsonDb.select<Review>('reviews.json', options),
  insert: (review: Omit<Review, 'created_at' | 'updated_at'>) => 
    jsonDb.insert<Review>('reviews.json', review),
  update: (id: string, updates: Partial<Omit<Review, 'id' | 'created_at'>>) => 
    jsonDb.update<Review>('reviews.json', id, updates),
  delete: (id: string) => 
    jsonDb.delete<Review>('reviews.json', id)
} 