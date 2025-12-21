import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { AdminDashboard } from "@/components/admin-dashboard"
import { cookies } from "next/headers"

export const metadata = {
  title: "Admin Dashboard | LuxeAccessories",
  description: "Manage your e-commerce store",
}

export default async function AdminPage() {
  const cookieStore = await cookies()
  const adminAuth = cookieStore.get("admin_auth")

  if (!adminAuth) {
    redirect("/admin/login")
  }

  const supabase = await createClient()

  // Fetch dashboard data
  const [{ data: orders }, { data: products }, { count: totalOrders }, { count: totalProducts }] = await Promise.all([
    supabase.from("orders").select("*").order("created_at", { ascending: false }).limit(10),
    supabase.from("products").select("*").limit(10),
    supabase.from("orders").select("*", { count: "exact", head: true }),
    supabase.from("products").select("*", { count: "exact", head: true }),
  ])

  return (
    <AdminDashboard
      orders={orders || []}
      products={products || []}
      totalOrders={totalOrders || 0}
      totalProducts={totalProducts || 0}
    />
  )
}
