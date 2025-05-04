"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"

export default function CreateGamePage() {
  const router = useRouter()
  
  useEffect(() => {
    // Redirect to the create/edit page
    router.push('/admin/content/games/create/edit')
  }, [router])
  
  return (
    <div className="flex justify-center items-center h-64">
      <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      <span className="ml-2 text-muted-foreground">Đang chuyển hướng...</span>
    </div>
  )
}

export const dynamic = 'force-dynamic' 