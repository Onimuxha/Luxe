import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { randomUUID } from "crypto";
import { createClient } from "@/lib/supabase/server";
import sharp from "sharp";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    // Accept either multipart/form-data (with images) or application/json (no images)
    const contentType = request.headers.get("content-type") || "";
    let imageName: string | null = null;
    const additionalImages: string[] = [];

    let name: any,
      slug: any,
      description: any,
      price: any,
      compare_at_price: any,
      category_id: any,
      stock: any,
      is_active: any;

    if (contentType.includes("application/json")) {
      const body = await request.json();
      name = body.name
      slug = body.slug
      description = body.description
      price = body.price
      compare_at_price = body.compare_at_price ?? null
      category_id = body.category_id ?? null
      stock = body.stock
      is_active = body.is_active

      // If client provided existingImages (editing), preserve them
      if (Array.isArray(body.existingImages) && body.existingImages.length > 0) {
        imageName = body.existingImages[0]
        if (body.existingImages.length > 1) {
          additionalImages.push(...body.existingImages.slice(1))
        }
      }
    } else {
      const formData = await request.formData();

      const images = formData.getAll("images") as File[];

      if (images.length > 0) {
        const uploadDir = path.join(process.cwd(), "public", "images");
        if (!fs.existsSync(uploadDir))
          fs.mkdirSync(uploadDir, { recursive: true });

        // Process all images
        for (let i = 0; i < images.length; i++) {
          const image = images[i];
          const bytes = await image.arrayBuffer();
          const buffer = Buffer.from(bytes);

          // Convert to WebP
          const webpBuffer = await sharp(buffer).webp({ quality: 80 }).toBuffer();

          const fileName = `${randomUUID()}.webp`;
          fs.writeFileSync(path.join(uploadDir, fileName), webpBuffer);

          // First image is main image
          if (i === 0) {
            imageName = fileName;
          } else {
            additionalImages.push(fileName);
          }
        }
      }

      name = formData.get("name")
      slug = formData.get("slug")
      description = formData.get("description")
      price = formData.get("price")
      compare_at_price = formData.get("compare_at_price")
      category_id = formData.get("category_id")
      stock = formData.get("stock")
      is_active = formData.get("is_active")
    }

    const product = {
      name,
      slug,
      description,
      price: Number(price),
      compare_at_price: compare_at_price ? Number(compare_at_price) : null,
      category_id: category_id || null,
      image_url: imageName,
      additional_images: additionalImages.length > 0 ? additionalImages : null,
      stock: Number(stock),
      is_active: is_active === true || is_active === "true",
    };

    const { data, error } = await supabase
      .from("products")
      .insert([product])
      .select()
      .single();

    if (error)
      return NextResponse.json({ error: error.message }, { status: 400 });

    return NextResponse.json(data);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to create product" },
      { status: 500 }
    );
  }
}

// GET - fetch related products
export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const { searchParams } = new URL(request.url);

    const category = searchParams.get("category");
    const exclude = searchParams.get("exclude");
    const limit = Number(searchParams.get("limit") || 10);

    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("category_id", category)
      .neq("id", exclude)
      .eq("is_active", true)
      .limit(limit);

    if (error) throw error;
    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Error fetching related products:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
