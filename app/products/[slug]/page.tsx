import { notFound } from "next/navigation"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { ProductDetails } from "@/components/product-details"
import { createClient } from "@/lib/supabase/server"
import type { Metadata } from "next"
import fs from "fs"
import path from "path"

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const supabase = await createClient()
  const { data: product } = await supabase.from("products").select("*").eq("slug", slug).single()

  if (!product) {
    return {
      title: "Product Not Found",
    }
  }

  let productImageUrl = `${process.env.NEXT_PUBLIC_SITE_URL || "https://luxe-roan-three.vercel.app"}/icon.png`
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://luxe-roan-three.vercel.app"

  if (product.image_url && !product.image_url.includes("placeholder")) {
    // Images may be stored externally (full URL) or locally in /public/images
    if (product.image_url.startsWith("http") || product.image_url.startsWith("https")) {
      productImageUrl = product.image_url
    } else {
      // Prefer the _1080 variant when available, otherwise fall back to the original file
      const image1080 = product.image_url.replace(/(_1080|_400|_48)?\.webp$/, "_1080.webp")
      const publicPath1080 = path.join(process.cwd(), "public", "images", image1080)
      const publicPathOriginal = path.join(process.cwd(), "public", "images", product.image_url)

      if (fs.existsSync(publicPath1080)) {
        productImageUrl = `${siteUrl}/images/${image1080}`
      } else if (fs.existsSync(publicPathOriginal)) {
        productImageUrl = `${siteUrl}/images/${product.image_url}`
      } else {
        // last resort: use the original value (it may be served from external storage)
        productImageUrl = `${siteUrl}/images/${image1080}`
      }
    }
  }

  const fallbackImage = `${siteUrl}/icon.png`

  return {
    title: `${product.name} | LuxeAccessories`,
    description: product.description || `Shop ${product.name} at LuxeAccessories`,
    openGraph: {
      title: product.name,
      description: product.description || `Shop ${product.name} at LuxeAccessories`,
      url: `${process.env.NEXT_PUBLIC_SITE_URL || "https://luxe-roan-three.vercel.app"}/products/${slug}`,
      type: "website",
      images: [
        {
          url: productImageUrl,
          width: 1200,
          height: 1200,
          alt: product.name,
          type: "image/webp",
        },
        {
          url: fallbackImage,
          width: 1200,
          height: 630,
          alt: "LuxeAccessories Logo",
        },
      ],
    },
    twitter: {
      card: "summary",
      title: product.name,
      description: product.description || `Shop ${product.name} at LuxeAccessories`,
      images: [productImageUrl, fallbackImage],
    },
  }
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const supabase = await createClient()

  const { data: product } = await supabase
    .from("products")
    .select("*, category:categories(*)")
    .eq("slug", slug)
    .single()

  if (!product) {
    notFound()
  }

  return (
    <>
      <SiteHeader />
      <main className="flex-1  pt-16">
        <ProductDetails product={product} />
      </main>
      <SiteFooter />
    </>
  )
}
