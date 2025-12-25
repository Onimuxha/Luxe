import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import fs from "fs"
import path from "path"
import { randomUUID } from "crypto"
import sharp from "sharp"

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    // Check for valid product ID
    if (!id) {
      return NextResponse.json({ error: "Product ID is required" }, { status: 400 })
    }

    const supabase = await createClient()

    // Parse incoming form data
    const formData = await req.formData()

    // Build update object
    const updateData: any = {
      name: formData.get("name"),
      slug: formData.get("slug"),
      description: formData.get("description"),
      price: Number(formData.get("price")),
      compare_at_price: formData.get("compare_at_price")
        ? Number(formData.get("compare_at_price"))
        : null,
      category_id: formData.get("category_id") || null,
      stock: Number(formData.get("stock")),
      is_active: formData.get("is_active") === "true",
    }

    // Handle multiple image uploads or preserve existing images
    const images = formData.getAll("images") as File[]
    const existingImagesJson = formData.get("existingImages") as string | null
    const additionalImages: string[] = []
    
    if (images.length > 0) {
      // User uploaded new images, replace all
      const uploadDir = path.join(process.cwd(), "public", "images")
      if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true })

      // Process all images
      for (let i = 0; i < images.length; i++) {
        const image = images[i];
        const buffer = Buffer.from(await image.arrayBuffer())
        // Convert to WebP
        const webpBuffer = await sharp(buffer).webp({ quality: 80 }).toBuffer()

        const fileName = `${randomUUID()}.webp`
        fs.writeFileSync(path.join(uploadDir, fileName), webpBuffer)

        // First image is main image
        if (i === 0) {
          updateData.image_url = fileName
        } else {
          additionalImages.push(fileName)
        }
      }

      // Only update additional_images if we have them
      if (additionalImages.length > 0) {
        updateData.additional_images = additionalImages
      }
    } else if (existingImagesJson) {
      // No new images, preserve existing ones
      const existingImages = JSON.parse(existingImagesJson) as string[]
      if (existingImages.length > 0) {
        updateData.image_url = existingImages[0]
        if (existingImages.length > 1) {
          updateData.additional_images = existingImages.slice(1)
        }
      }
    }

    // Update product in Supabase
    const { error } = await supabase
      .from("products")
      .update(updateData)
      .eq("id", id) // Use awaited id

    if (error) {
      console.error("Error updating product:", error)
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error("Failed to update product:", err)
    return NextResponse.json({ error: "Failed to update product" }, { status: 500 })
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    if (!id) {
      return NextResponse.json({ error: "Product ID is required" }, { status: 400 })
    }

    const supabase = await createClient()

    const { error } = await supabase
      .from("products")
      .delete()
      .eq("id", id)

    if (error) {
      console.error("Error deleting product:", error)
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error("Failed to delete product:", err)
    return NextResponse.json({ error: "Failed to delete product" }, { status: 500 })
  }
}
