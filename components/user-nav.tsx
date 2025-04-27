"use client"

import { useEffect, useState, useCallback } from "react"
import Link from "next/link"
import { useSupabase } from "@/components/providers/supabase-provider"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { User, LogOut, Settings, UserCircle, LayoutDashboard } from "lucide-react"
import { getCurrentUserProfile } from "@/lib/auth-utils"
import { UserProfile } from "@/types/auth"

export function UserNav() {
  const { supabase, user } = useSupabase()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Sử dụng useCallback để tránh tạo hàm mới mỗi khi component re-render
  const loadUserProfile = useCallback(async (forceRefresh = false) => {
    if (!user) {
      setIsLoading(false)
      setProfile(null)
      return
    }

    try {
      const userProfile = await getCurrentUserProfile(forceRefresh)
      if (userProfile) {
        setProfile(userProfile)
      }
    } catch (error) {
      console.error("Lỗi khi tải thông tin người dùng:", error)
    } finally {
      setIsLoading(false)
    }
  }, [user])

  useEffect(() => {
    loadUserProfile()
    
    // Theo dõi sự kiện auth state change để reload profile khi cần
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event) => {
        // Chỉ reload profile khi có sự kiện quan trọng
        if (event === 'SIGNED_IN' || event === 'USER_UPDATED') {
          loadUserProfile(true) // Force refresh khi đăng nhập hoặc cập nhật user
        } else if (event === 'SIGNED_OUT') {
          setProfile(null)
        }
      }
    )

    return () => {
      subscription.unsubscribe()
    }
  }, [supabase, loadUserProfile])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    window.location.href = "/"
  }

  // Nếu chưa đăng nhập, hiển thị nút đăng nhập/đăng ký
  if (!user) {
    return (
      <div className="flex items-center gap-4">
        <Link href="/auth/signin">
          <Button variant="ghost" size="sm">
            Đăng nhập
          </Button>
        </Link>
        <Link href="/auth/signup">
          <Button size="sm">Đăng ký</Button>
        </Link>
      </div>
    )
  }

  // Tạo chữ cái đầu cho avatar
  const getInitials = () => {
    if (profile?.full_name) {
      return profile.full_name
        .split(' ')
        .map(name => name[0])
        .join('')
        .toUpperCase()
    }
    
    if (user.email) {
      return user.email[0].toUpperCase()
    }
    
    return "U"
  }

  return (
    <div className="flex items-center gap-4">
      {/* Hiển thị nút Dashboard nếu là admin */}
      {profile?.role === "admin" && (
        <Link href="/admin/dashboard">
          <Button variant="outline" size="sm" className="flex items-center gap-2">
            <LayoutDashboard className="h-4 w-4" />
            <span className="hidden md:inline">Dashboard</span>
          </Button>
        </Link>
      )}
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-10 w-10 rounded-full">
            <Avatar>
              <AvatarImage src={profile?.avatar_url || ""} alt={profile?.full_name || "User"} />
              <AvatarFallback>{getInitials()}</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">{profile?.full_name || user.email}</p>
              <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem asChild>
              <Link href="/profile" className="flex w-full cursor-pointer items-center">
                <UserCircle className="mr-2 h-4 w-4" />
                <span>Hồ sơ</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/settings" className="flex w-full cursor-pointer items-center">
                <Settings className="mr-2 h-4 w-4" />
                <span>Cài đặt</span>
              </Link>
            </DropdownMenuItem>
            {profile?.role === "admin" && (
              <DropdownMenuItem asChild>
                <Link href="/admin/dashboard" className="flex w-full cursor-pointer items-center">
                  <LayoutDashboard className="mr-2 h-4 w-4" />
                  <span>Quản trị</span>
                </Link>
              </DropdownMenuItem>
            )}
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer">
            <LogOut className="mr-2 h-4 w-4" />
            <span>Đăng xuất</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
