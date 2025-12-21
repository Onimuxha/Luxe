import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { user_id, product_id, quantity } = await request.json()

    const supabase = await createClient()

    // Check if item already exists in cart
    const { data: existing } = await supabase
      .from("cart_items")
      .select("*")
      .eq("user_id", user_id)
      .eq("product_id", product_id)
      .single()

    if (existing) {
      // Update quantity
      const { data, error } = await supabase
        .from("cart_items")
        .update({ quantity: existing.quantity + quantity, updated_at: new Date().toISOString() })
        .eq("id", existing.id)
        .select()
        .single()

      if (error) throw error
      return NextResponse.json(data)
    } else {
      // Insert new item
      const { data, error } = await supabase
        .from("cart_items")
        .insert({ user_id, product_id, quantity })
        .select()
        .single()

      if (error) throw error
      return NextResponse.json(data)
    }
  } catch (error) {
    console.error("[v0] Cart API error:", error)
    return NextResponse.json({ error: "Failed to add to cart" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get("user_id")
    if (!userId) {
      return NextResponse.json({ error: "User ID required" }, { status: 400 })
    }

    const supabase = await createClient()
    const { data, error } = await supabase.from("cart_items").select("*, product:products(*)").eq("user_id", userId)

    if (error) throw error
    return NextResponse.json(data)
  } catch (error) {
    console.error("[v0] Cart GET error:", error)
    return NextResponse.json({ error: "Failed to fetch cart" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const itemId = request.nextUrl.searchParams.get("id")
    if (!itemId) {
      return NextResponse.json({ error: "Item ID required" }, { status: 400 })
    }

    const supabase = await createClient()
    const { error } = await supabase.from("cart_items").delete().eq("id", itemId)

    if (error) throw error
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Cart DELETE error:", error)
    return NextResponse.json({ error: "Failed to delete item" }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const { id, quantity } = await request.json()

    const supabase = await createClient()
    const { data, error } = await supabase
      .from("cart_items")
      .update({ quantity, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single()

    if (error) throw error
    return NextResponse.json(data)
  } catch (error) {
    console.error("[v0] Cart PATCH error:", error)
    return NextResponse.json({ error: "Failed to update cart" }, { status: 500 })
  }
}
