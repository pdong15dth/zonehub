import { createServerSupabaseClient } from "@/lib/supabase"

export async function createDatabaseStructure() {
  const supabase = createServerSupabaseClient()
  
  try {
    // Thử tạo bảng users trực tiếp
    const createUserTableSQL = `
      CREATE TABLE IF NOT EXISTS public.users (
        id UUID PRIMARY KEY,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        email TEXT UNIQUE NOT NULL,
        full_name TEXT,
        avatar_url TEXT,
        role TEXT DEFAULT 'member' CHECK (role IN ('admin', 'member', 'editor'))
      );
      
      -- Bảo đảm RLS được bật
      ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
      
      -- Tạo policies cơ bản nếu chưa có
      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT FROM pg_policies WHERE tablename = 'users' AND policyname = 'Users can view their own profile'
        ) THEN
          CREATE POLICY "Users can view their own profile" ON public.users 
            FOR SELECT USING (auth.uid() = id);
        END IF;
        
        IF NOT EXISTS (
          SELECT FROM pg_policies WHERE tablename = 'users' AND policyname = 'Users can update their own profile'
        ) THEN
          CREATE POLICY "Users can update their own profile" ON public.users 
            FOR UPDATE USING (auth.uid() = id);
        END IF;
        
        IF NOT EXISTS (
          SELECT FROM pg_policies WHERE tablename = 'users' AND policyname = 'Service role can do everything'
        ) THEN
          CREATE POLICY "Service role can do everything" ON public.users 
            USING (true) WITH CHECK (true);
        END IF;
      END
      $$;
    `
    
    try {
      console.log("Trying to create users table")
      await supabase.rpc('exec_sql', { sql: createUserTableSQL })
      console.log("Users table created or already exists")
    } catch (execError) {
      console.error("Error executing SQL to create users table:", execError)
      
      // Nếu không có RPC exec_sql, thử tạo RPC trước
      try {
        const createExecSqlFunction = `
          -- Tạo function để thực thi SQL động
          CREATE OR REPLACE FUNCTION exec_sql(sql TEXT)
          RETURNS void AS $$
          BEGIN
            EXECUTE sql;
          END;
          $$ LANGUAGE plpgsql SECURITY DEFINER;
        `
        
        console.log("Trying to create exec_sql function")
        // Cố gắng tạo function exec_sql trước tiên
        await supabase.rpc('exec_sql', { sql: createExecSqlFunction })
        
        // Thử lại tạo bảng
        console.log("Retrying to create users table")
        await supabase.rpc('exec_sql', { sql: createUserTableSQL })
      } catch (rpcError) {
        console.error("Could not create exec_sql function or users table:", rpcError)
      }
    }
    
    // Kiểm tra xem bảng users đã tồn tại chưa
    const { count, error: countError } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true })
    
    if (countError) {
      console.error("Error checking users table:", countError)
    } else {
      console.log("Users table check result:", { count })
    }
    
    return { success: true }
  } catch (error) {
    console.error("Error in createDatabaseStructure:", error)
    return { success: false, error }
  }
} 