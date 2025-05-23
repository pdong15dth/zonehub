"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Database, Check, AlertTriangle, Loader2 } from "lucide-react"
import Link from "next/link"
import { Textarea } from "@/components/ui/textarea"
import { useSupabase } from "@/components/providers/supabase-provider"

export default function SetupDatabasePage() {
  const { supabase } = useSupabase()
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null)
  const [sqlQuery, setSqlQuery] = useState<string>(`
-- Tạo bảng users nếu chưa tồn tại
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email VARCHAR(255) NOT NULL UNIQUE,
  full_name VARCHAR(255),
  avatar_url VARCHAR(255),
  role VARCHAR(50) NOT NULL DEFAULT 'member',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tạo RLS policy
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Cho phép truy cập với service_role
CREATE POLICY IF NOT EXISTS "Admin users can do all operations" ON public.users
  USING (true)
  WITH CHECK (true);
  
-- Cho phép người dùng đọc thông tin của mình
CREATE POLICY IF NOT EXISTS "Users can read their own record" ON public.users
  FOR SELECT
  USING (auth.uid() = id);
  
-- Cho phép người dùng cập nhật thông tin của mình
CREATE POLICY IF NOT EXISTS "Users can update their own record" ON public.users
  FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id AND (role IS NULL OR role = 'member'));
  `)

  const executeSQL = async () => {
    if (!sqlQuery.trim()) {
      setResult({
        success: false,
        message: "SQL query cannot be empty"
      })
      return
    }

    setIsLoading(true)
    setResult(null)

    try {
      // Thử thực thi trực tiếp nếu có quyền
      const { error } = await supabase.rpc('direct_execute_sql', { sql_query: sqlQuery })
      
      if (error) {
        // Nếu không thể thực thi trực tiếp, gọi API
        const response = await fetch("/api/db-setup", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ sql: sqlQuery }),
        })

        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error || "Failed to execute SQL")
        }

        setResult({
          success: true,
          message: "Database setup completed successfully"
        })
      } else {
        setResult({
          success: true,
          message: "Database setup completed successfully via RPC"
        })
      }
    } catch (error) {
      console.error("Error setting up database:", error)
      setResult({
        success: false,
        message: error instanceof Error ? error.message : "An unexpected error occurred"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const initializeAdmin = async () => {
    setIsLoading(true)
    setResult(null)

    try {
      const response = await fetch("/api/init-admin", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to initialize admin account")
      }

      setResult({
        success: true,
        message: response.status === 201 
          ? `Admin account created successfully: ${data.adminEmail} / ${data.adminPassword}` 
          : "Admin account already exists"
      })
    } catch (error) {
      console.error("Error initializing admin:", error)
      setResult({
        success: false,
        message: error instanceof Error ? error.message : "An unexpected error occurred"
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container flex min-h-screen flex-col items-center justify-center py-10">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[800px]">
        <Card>
          <CardHeader className="space-y-1">
            <div className="flex items-center justify-center space-x-2">
              <Database className="h-6 w-6 text-primary" />
              <CardTitle className="text-2xl">Database Setup</CardTitle>
            </div>
            <CardDescription className="text-center">
              Set up your database structure and initialize admin account
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">SQL Query</h3>
              <Textarea
                value={sqlQuery}
                onChange={(e) => setSqlQuery(e.target.value)}
                placeholder="Enter SQL query to setup database..."
                className="font-mono h-[300px]"
              />
            </div>

            {result && (
              <div className={`w-full rounded-lg ${result.success ? 'bg-green-500/15 text-green-500' : 'bg-destructive/15 text-destructive'} p-4`}>
                {result.success ? (
                  <div className="flex items-center space-x-2">
                    <Check className="h-5 w-5" />
                    <p>{result.message}</p>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <AlertTriangle className="h-5 w-5" />
                    <p>{result.message}</p>
                  </div>
                )}
              </div>
            )}
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <div className="flex space-x-4 w-full">
              <Button onClick={executeSQL} disabled={isLoading} className="flex-1">
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Setting up...
                  </>
                ) : (
                  "Setup Database"
                )}
              </Button>
              <Button onClick={initializeAdmin} disabled={isLoading} className="flex-1">
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create Admin Account"
                )}
              </Button>
            </div>
            <div className="flex flex-col space-y-2 w-full">
              <Button asChild variant="outline">
                <Link href="/auth/signin">Go to Sign In</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/">Return to Home</Link>
              </Button>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
} 