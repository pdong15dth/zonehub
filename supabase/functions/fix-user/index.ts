// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts"

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.23.0';

console.log("Hello from Functions!")

// Định nghĩa các kiểu dữ liệu
interface UserData {
  id: string;
  email: string;
  full_name?: string | null;
  avatar_url?: string | null;
  role?: string;
}

// Tạo Supabase client
const createSupabaseClient = (req: Request) => {
  // Lấy authorization header từ request
  const authHeader = req.headers.get('Authorization');
  
  if (!authHeader) {
    throw new Error('Authorization header is required');
  }
  
  // Tạo client với service role key từ authorization header
  const supabaseUrl = Deno.env.get('SUPABASE_URL') as string;
  const supabaseKey = authHeader.replace('Bearer ', '');
  
  return createClient(supabaseUrl, supabaseKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
};

// Hàm xử lý sửa chữa tài khoản người dùng
const fixUserAccount = async (req: Request) => {
  try {
    // Lấy thông tin về email từ query params
    const url = new URL(req.url);
    const userId = url.searchParams.get('userId');
    const email = url.searchParams.get('email');
    
    if (!userId && !email) {
      return new Response(
        JSON.stringify({ error: 'Thiếu userId hoặc email để tìm người dùng' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    // Tạo supabase client với service role key
    const supabase = createSupabaseClient(req);
    
    // Tìm người dùng trong auth.users
    let authUser;
    if (userId) {
      const { data: userData, error: userError } = await supabase.auth.admin.getUserById(userId);
      if (userError) {
        throw new Error(`Không thể tìm thấy người dùng auth với ID ${userId}: ${userError.message}`);
      }
      authUser = userData.user;
    } else if (email) {
      // Tìm user bằng cách truy vấn trực tiếp
      const { data: authUsers, error: authError } = await supabase
        .from('auth.users')
        .select('*')
        .eq('email', email)
        .single();
        
      if (authError) {
        throw new Error(`Không thể tìm thấy người dùng auth với email ${email}: ${authError.message}`);
      }
      authUser = authUsers;
    }
    
    if (!authUser) {
      return new Response(
        JSON.stringify({ error: 'Không tìm thấy người dùng trong auth.users' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    // Kiểm tra xem người dùng đã tồn tại trong bảng public.users chưa
    const { data: existingUser, error: existingUserError } = await supabase
      .from('users')
      .select('*')
      .eq('id', authUser.id)
      .maybeSingle();
      
    // Nếu đã tồn tại, xóa và tạo lại
    if (existingUser) {
      // Xóa người dùng hiện tại khỏi bảng public.users
      const { error: deleteError } = await supabase
        .from('users')
        .delete()
        .eq('id', authUser.id);
        
      if (deleteError) {
        throw new Error(`Không thể xóa người dùng hiện tại: ${deleteError.message}`);
      }
    }
    
    // Tạo mới người dùng trong bảng public.users
    const userData: UserData = {
      id: authUser.id,
      email: authUser.email,
      full_name: authUser.user_metadata?.full_name || 
                authUser.user_metadata?.name || 
                authUser.email.split('@')[0],
      avatar_url: authUser.user_metadata?.avatar_url || 
                authUser.user_metadata?.picture || 
                null,
      role: 'member', // Hoặc một role mặc định khác
    };
    
    const { data: newUser, error: insertError } = await supabase
      .from('users')
      .insert(userData)
      .select()
      .single();
      
    if (insertError) {
      throw new Error(`Không thể tạo người dùng mới: ${insertError.message}`);
    }
    
    return new Response(
      JSON.stringify({
        success: true,
        message: 'Đã sửa chữa tài khoản người dùng thành công',
        user: newUser
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Lỗi khi sửa chữa tài khoản:', error);
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error instanceof Error ? error.message : 'Lỗi không xác định'
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};

// Entry point cho Edge Function
serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    });
  }
  
  if (req.method === 'GET') {
    return await fixUserAccount(req);
  }
  
  if (req.method === 'POST') {
    return await fixUserAccount(req);
  }
  
  return new Response(
    JSON.stringify({ error: 'Method not allowed' }),
    { status: 405, headers: { 'Content-Type': 'application/json' } }
  );
});

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/fix-user' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/
