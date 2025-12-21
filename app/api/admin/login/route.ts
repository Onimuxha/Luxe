import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import bcrypt from "bcryptjs"

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    const supabase = await createClient()

    // Fetch admin user
    const { data: admin, error } = await supabase.from("admin_users").select("*").eq("email", email).maybeSingle()

    if (error || !admin) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    // Verify password
    const validPassword = await bcrypt.compare(password, admin.password_hash)

    if (!validPassword) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    // Set auth cookie
    const cookieStore = await cookies()
    cookieStore.set("admin_auth", admin.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    })

    return NextResponse.json({ success: true, admin: { id: admin.id, email: admin.email, name: admin.name } })
  } catch (error) {
    console.error("[v0] Admin login error:", error)
    return NextResponse.json({ error: "Login failed" }, { status: 500 })
  }
}
