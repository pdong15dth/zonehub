"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { User, Shield, Check, AlertTriangle } from "lucide-react"
import Link from "next/link"

export default function CreateAdminPage() {
  const [isInitializing, setIsInitializing] = useState(false)
  const [isInitialized, setIsInitialized] = useState(false)
  const [adminCredentials, setAdminCredentials] = useState<{ adminEmail: string; adminPassword: string } | null>(null)
  const [error, setError] = useState<string | null>(null)

  const initializeAdmin = async () => {
    setIsInitializing(true)
    setError(null)

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

      if (response.status === 201) {
        setIsInitialized(true)
        setAdminCredentials({
          adminEmail: data.adminEmail,
          adminPassword: data.adminPassword,
        })
      } else if (response.status === 200) {
        setIsInitialized(true)
        setError("Admin account already exists")
      }
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message)
      } else {
        setError("An unexpected error occurred")
      }
    } finally {
      setIsInitializing(false)
    }
  }

  return (
    <div className="container flex min-h-screen flex-col items-center justify-center">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[550px]">
        <Card>
          <CardHeader className="space-y-1">
            <div className="flex items-center justify-center space-x-2">
              <Shield className="h-6 w-6 text-primary" />
              <CardTitle className="text-2xl">Admin Account Setup</CardTitle>
            </div>
            <CardDescription className="text-center">
              Initialize an admin account for your ZoneHub platform
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center space-y-6">
            {!isInitialized && !error && (
              <div className="text-center">
                <p className="mb-4">
                  This will create an admin account if one doesn't already exist in your Supabase database.
                </p>
                <User className="mx-auto h-16 w-16 text-muted-foreground" />
                <p className="mt-4 text-sm text-muted-foreground">
                  The admin account will have full privileges to manage the platform.
                </p>
              </div>
            )}

            {isInitialized && adminCredentials && (
              <div className="w-full space-y-4">
                <div className="flex items-center justify-center space-x-2 text-green-500">
                  <Check className="h-6 w-6" />
                  <h3 className="text-lg font-medium">Admin Account Created Successfully</h3>
                </div>
                <div className="rounded-lg bg-muted p-4">
                  <p className="mb-2 font-medium">Use these credentials to sign in:</p>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Email:</span>
                      <code className="rounded bg-background px-2 py-1">{adminCredentials.adminEmail}</code>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Password:</span>
                      <code className="rounded bg-background px-2 py-1">{adminCredentials.adminPassword}</code>
                    </div>
                  </div>
                  <p className="mt-4 text-sm text-amber-500">
                    <AlertTriangle className="mr-1 inline-block h-4 w-4" />
                    Make sure to save these credentials. This is the only time you'll see the password.
                  </p>
                </div>
              </div>
            )}

            {error && (
              <div className="w-full rounded-lg bg-destructive/15 p-4 text-center text-destructive">
                <AlertTriangle className="mx-auto mb-2 h-6 w-6" />
                <p>{error}</p>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            {!isInitialized && !error && (
              <Button onClick={initializeAdmin} disabled={isInitializing} className="w-full">
                {isInitializing ? "Creating Admin Account..." : "Create Admin Account"}
              </Button>
            )}

            {(isInitialized || error) && (
              <div className="flex flex-col space-y-2 w-full">
                <Button asChild variant="outline">
                  <Link href="/auth/signin">Go to Sign In</Link>
                </Button>
                <Button asChild variant="default">
                  <Link href="/">Return to Home</Link>
                </Button>
              </div>
            )}
          </CardFooter>
        </Card>
      </div>
    </div>
  )
} 