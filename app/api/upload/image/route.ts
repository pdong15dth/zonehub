import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/auth"
import { writeFile } from "fs/promises"
import { join } from "path"
import { randomUUID } from "crypto"

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)
    
    if (!session || !session.user) {
      return NextResponse.json(
        { error: "Unauthorized access" },
        { status: 401 }
      )
    }
    
    // Verify admin role (assuming role is stored in session)
    if (session.user.role !== "admin") {
      return NextResponse.json(
        { error: "Insufficient permissions" },
        { status: 403 }
      )
    }
    
    const formData = await request.formData()
    const file = formData.get("file") as File
    
    if (!file) {
      return NextResponse.json(
        { error: "No file uploaded" },
        { status: 400 }
      )
    }
    
    // Validate file type
    const validTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"]
    if (!validTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Invalid file type. Only JPEG, PNG, WebP, and GIF are allowed." },
        { status: 400 }
      )
    }
    
    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024 // 5MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: "File size exceeds the 5MB limit" },
        { status: 400 }
      )
    }
    
    // Get file extension
    const fileExtension = file.name.split(".").pop()?.toLowerCase() || "jpg"
    
    // Generate a unique filename
    const fileName = `${randomUUID()}.${fileExtension}`
    
    // Define upload directory path
    const uploadDir = join(process.cwd(), "public", "uploads", "games")
    
    // Get the buffer from the file
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    
    // Save the file to disk
    const filePath = join(uploadDir, fileName)
    await writeFile(filePath, buffer)
    
    // Return the file URL
    const fileUrl = `/uploads/games/${fileName}`
    
    return NextResponse.json({
      url: fileUrl,
      fileName: fileName,
      size: file.size,
      type: file.type
    })
    
  } catch (error) {
    console.error("Error uploading image:", error)
    return NextResponse.json(
      { 
        error: "Error uploading image", 
        details: error instanceof Error ? error.message : "Unknown error" 
      },
      { status: 500 }
    )
  }
}

// Configure body parser size limit
export const config = {
  api: {
    bodyParser: {
      sizeLimit: "8mb", // Slightly larger than our validation to handle overhead
    },
  },
} 