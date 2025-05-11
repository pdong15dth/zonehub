import { SupabaseClient, User } from "@supabase/supabase-js";
import { Database } from "@/types/supabase";

export interface DiagnosticResult {
  authUserExists: boolean;
  publicUserExists: boolean;
  authUser: any | null;
  publicUser: any | null;
  emailMismatch: boolean;
  conflictDetected: boolean;
  errors: string[];
}

/**
 * Executes a comprehensive account diagnostic on Supabase
 * Checks for auth.users and public.users data consistency
 */
export async function diagnoseSuapabaseAccount(
  supabase: SupabaseClient<Database>,
  userId?: string
): Promise<DiagnosticResult> {
  // Initialize result
  const result: DiagnosticResult = {
    authUserExists: false,
    publicUserExists: false,
    authUser: null,
    publicUser: null,
    emailMismatch: false,
    conflictDetected: false,
    errors: []
  };
  
  try {
    // If userId is not provided, get it from current session
    if (!userId) {
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError || !sessionData.session) {
        result.errors.push("No active session found");
        return result;
      }
      
      userId = sessionData.session.user.id;
    }
    
    // Check auth.users
    const { data: userData, error: userError } = await supabase.auth.getUser();
    
    if (userError || !userData.user) {
      result.errors.push(`Error fetching auth user: ${userError?.message || "Unknown error"}`);
    } else {
      result.authUserExists = true;
      result.authUser = userData.user;
    }
    
    // Check public.users
    const { data: publicUserData, error: publicUserError } = await supabase
      .from("users")
      .select("*")
      .eq("id", userId)
      .single();
    
    if (publicUserError) {
      if (publicUserError.message.includes("No rows found")) {
        // This is a conflict - auth user exists but public user doesn't
        result.conflictDetected = true;
      } else {
        result.errors.push(`Error fetching public user: ${publicUserError.message}`);
      }
    } else {
      result.publicUserExists = true;
      result.publicUser = publicUserData;
      
      // If both exist, check for email mismatches
      if (result.authUserExists && result.publicUserExists) {
        if (result.authUser.email !== result.publicUser.email) {
          result.emailMismatch = true;
          result.conflictDetected = true;
        }
      }
    }
    
    // Check for conflicts
    if (result.authUserExists && !result.publicUserExists) {
      result.conflictDetected = true;
    }
    
    return result;
    
  } catch (error) {
    result.errors.push(`Unexpected error: ${error instanceof Error ? error.message : String(error)}`);
    return result;
  }
}

/**
 * Repairs account issues by recreating the public user record
 */
export async function repairSupabaseAccount(
  supabase: SupabaseClient<Database>,
  authUser: User
): Promise<{ success: boolean; message: string; data?: any; error?: any }> {
  try {
    // First attempt to delete any existing user data (if it exists)
    try {
      await supabase
        .from("users")
        .delete()
        .eq("id", authUser.id);
    } catch (deleteError) {
      // Ignore delete errors - the record might not exist
      console.log("Delete error (ignorable):", deleteError);
    }
    
    // Create a new user record from auth data
    const userMetadata = authUser.user_metadata || {};
    
    const newUserData = {
      id: authUser.id,
      email: authUser.email || "",
      full_name: userMetadata.full_name || userMetadata.name || authUser.email?.split("@")[0] || "User",
      avatar_url: userMetadata.avatar_url || userMetadata.picture || "/placeholder.svg",
      role: "member" as const
    };
    
    const { data, error } = await supabase
      .from("users")
      .insert(newUserData)
      .select()
      .single();
    
    if (error) {
      console.error("Error creating user:", error);
      return { 
        success: false, 
        message: `Không thể tạo người dùng: ${error.message}`,
        error
      };
    }
    
    return {
      success: true,
      message: "Đã sửa chữa tài khoản thành công!",
      data
    };
    
  } catch (error) {
    console.error("Repair error:", error);
    return {
      success: false,
      message: `Lỗi khi sửa chữa: ${error instanceof Error ? error.message : String(error)}`,
      error
    };
  }
}

/**
 * Checks if a database query error is a duplicate key violation
 */
export function isDuplicateKeyError(error: any): boolean {
  if (!error) return false;
  
  // Check for Postgres unique constraint violation
  return (
    (error.code === "23505" || 
     (error.message && (
       error.message.includes("duplicate key") || 
       error.message.includes("already exists") ||
       error.message.includes("violates unique constraint")
     ))
    )
  );
}

/**
 * Generates a simple diagnostic report as text
 */
export function generateDiagnosticReport(result: DiagnosticResult): string {
  const lines: string[] = [
    "=== SUPABASE ACCOUNT DIAGNOSTIC REPORT ===",
    "",
    `Auth User: ${result.authUserExists ? "Found" : "Not Found"}`,
    `Public User: ${result.publicUserExists ? "Found" : "Not Found"}`,
    `Email Mismatch: ${result.emailMismatch ? "Yes" : "No"}`,
    `Conflict Detected: ${result.conflictDetected ? "Yes" : "No"}`,
    ""
  ];
  
  if (result.errors.length > 0) {
    lines.push("Errors:");
    result.errors.forEach(error => lines.push(`- ${error}`));
    lines.push("");
  }
  
  if (result.authUser) {
    lines.push("Auth User Details:");
    lines.push(`- ID: ${result.authUser.id}`);
    lines.push(`- Email: ${result.authUser.email}`);
    lines.push(`- Created: ${new Date(result.authUser.created_at).toLocaleString()}`);
    lines.push("");
  }
  
  if (result.publicUser) {
    lines.push("Public User Details:");
    lines.push(`- ID: ${result.publicUser.id}`);
    lines.push(`- Email: ${result.publicUser.email}`);
    lines.push(`- Role: ${result.publicUser.role}`);
    lines.push(`- Created: ${new Date(result.publicUser.created_at).toLocaleString()}`);
    lines.push("");
  }
  
  if (result.conflictDetected) {
    lines.push("RECOMMENDATION: Run account repair to recreate the public user record");
  } else if (result.errors.length > 0) {
    lines.push("RECOMMENDATION: Check error messages and try again");
  } else {
    lines.push("RECOMMENDATION: No issues detected, no action needed");
  }
  
  return lines.join("\n");
} 