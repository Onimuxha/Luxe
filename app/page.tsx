import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { HeroSlideshow } from "@/components/hero-slideshow"
import { ProductRow } from "@/components/ProductRow"
import { createClient } from "@/lib/supabase/server"

export default async function HomePage() {
  const supabase = await createClient()

  const { data: slideshowProducts } = await supabase
    .from("products")
    .select("*")
    .eq("is_active", true)
    .limit(5)

  const { data: featured } = await supabase
    .from("products")
    .select("*")
    .eq("is_featured", true)
    .eq("is_active", true)

  const { data: trending } = await supabase
    .from("products")
    .select("*")
    .eq("is_trending", true)
    .eq("is_active", true)

  const { data: newArrivals } = await supabase
    .from("products")
    .select("*")
    .eq("is_active", true)
    .order("created_at", { ascending: false })

  const { data: forYou } = await supabase
    .from("products")
    .select("*")
    .eq("is_active", true)
    .limit(10)


  return (
    <>
      <SiteHeader />
      <main>
        <HeroSlideshow products={slideshowProducts || []} />

        <ProductRow title="For You" products={forYou} />
        <ProductRow title="Featured Products" products={featured} />
        <ProductRow title="Trending Now" products={trending} />
        <ProductRow title="New Arrivals" products={newArrivals} />
      </main>
      <SiteFooter />
    </>
  )
}
