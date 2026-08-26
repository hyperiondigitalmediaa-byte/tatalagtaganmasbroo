import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { v2 as cloudinary } from "cloudinary"
import { validateFile, validateFileContent } from "@/lib/file-validator"

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export async function POST(request: NextRequest) {
  try {
    console.log("=== Upload Request Started ===")
    
    const session = await auth()
    console.log("Session:", session?.user)

    if (!session || (session.user as any).role !== "ADMIN") {
      console.log("Unauthorized access attempt")
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get("file") as File
    const type = formData.get("type") as string || "image"

    console.log("File:", file?.name, file?.type, file?.size)
    console.log("Type:", type)

    if (!file) {
      console.log("No file in request")
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 })
    }

    // Validate file type and size
    const basicValidation = validateFile(file, type as 'image' | 'content')
    if (!basicValidation.valid) {
      console.log("File validation failed:", basicValidation.error)
      return NextResponse.json({ error: basicValidation.error }, { status: 400 })
    }

    // Validate file content (magic bytes check)
    const contentValidation = await validateFileContent(file)
    if (!contentValidation.valid) {
      console.log("File content validation failed:", contentValidation.error)
      return NextResponse.json({ error: contentValidation.error }, { status: 400 })
    }

    console.log("File validation passed ✓")

    // Check Cloudinary config
    console.log("Cloudinary Config:", {
      cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY ? "✓" : "✗",
      api_secret: process.env.CLOUDINARY_API_SECRET ? "✓" : "✗"
    })

    // Convert file to base64
    console.log("Converting file to base64...")
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const base64 = buffer.toString('base64')
    const dataURI = `data:${file.type};base64,${base64}`
    console.log("Base64 length:", base64.length)

    // Upload to Cloudinary
    console.log("Uploading to Cloudinary...")
    const result = await cloudinary.uploader.upload(dataURI, {
      folder: `news/${type}`,
      resource_type: "auto",
      transformation: [
        { width: 1200, height: 630, crop: "limit" },
        { quality: "auto:good" },
        { fetch_format: "auto" }
      ]
    })

    console.log("Upload successful:", result.secure_url)
    console.log("=== Upload Request Completed ===")

    return NextResponse.json({ 
      success: true, 
      url: result.secure_url,
      publicId: result.public_id,
      message: "File uploaded successfully to Cloudinary" 
    })
  } catch (error: any) {
    console.error("=== Upload Error ===")
    console.error("Error message:", error.message)
    console.error("Error details:", error)
    console.error("Stack:", error.stack)
    
    return NextResponse.json(
      { 
        error: "Failed to upload file",
        details: error.message,
        hint: "Check server console for details"
      },
      { status: 500 }
    )
  }
}
