import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { randomUUID } from "crypto";
import { createClient } from "@/lib/supabase/server";
import sharp from "sharp";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const formData = await request.formData();

    const images = formData.getAll("images") as File[];
    let imageName: string | null = null;
    const additionalImages: string[] = [];

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

    const product = {
      name: formData.get("name"),
      slug: formData.get("slug"),
      description: formData.get("description"),
      price: Number(formData.get("price")),
      compare_at_price: formData.get("compare_at_price")
        ? Number(formData.get("compare_at_price"))
        : null,
      category_id: formData.get("category_id") || null,
      image_url: imageName,
      additional_images: additionalImages.length > 0 ? additionalImages : null,
      stock: Number(formData.get("stock")),
      is_active: formData.get("is_active") === "true",
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
