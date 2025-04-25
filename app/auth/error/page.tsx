"use client"

import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

export default function AuthError() {
  const searchParams = useSearchParams()
  const error = searchParams.get("error")

  let errorMessage = "An error occurred during authentication."

  if (error === "Configuration") {
    errorMessage = "There is a problem with the server configuration."
  } else if (error === "AccessDenied") {
    errorMessage = "You do not have permission to sign in."
  } else if (error === "Verification") {
    errorMessage = "The verification link is invalid or has expired."
  } else if (error === "OAuthSignin" || error === "OAuthCallback" || error === "OAuthCreateAccount") {
    errorMessage = "There was a problem with the OAuth authentication."
  } else if (error === "EmailCreateAccount") {
    errorMessage = "There was a problem creating your account."
  } else if (error === "Callback") {
    errorMessage = "There was a problem with the authentication callback."
  } else if (error === "OAuthAccountNotLinked") {
    errorMessage = "This email is already associated with another account."
  } else if (error === "EmailSignin") {
    errorMessage = "There was a problem sending the email."
  } else if (error === "CredentialsSignin") {
    errorMessage = "The email or password you entered is incorrect."
  } else if (error === "SessionRequired") {
    errorMessage = "You must be signed in to access this page."
  }

  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Authentication Error</CardTitle>
          <CardDescription>There was a problem signing you in.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-destructive">{errorMessage}</p>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" asChild>
            <Link href="/">Go Home</Link>
          </Button>
          <Button asChild>
            <Link href="/auth/signin">Try Again</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
