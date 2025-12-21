import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function PATCH(request: NextRequest) {
  try {
    const { orderId, status } = await request.json()

    const supabase = await createClient()

    const { data: order, error: fetchError } = await supabase
      .from("orders")
      .select("*, order_items(*)")
      .eq("id", orderId)
      .single()

    if (fetchError) throw fetchError

    // Update order status
    const { data, error } = await supabase
      .from("orders")
      .update({ status, updated_at: new Date().toISOString() })
      .eq("id", orderId)
      .select()
      .single()

    if (error) throw error

    try {
      await sendStatusUpdateToCustomer(order, status)
    } catch (telegramError) {
      console.error("[v0] Failed to send status notification:", telegramError)
      // Don't fail the request if telegram fails
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("[v0] Order update error:", error)
    return NextResponse.json({ error: "Failed to update order" }, { status: 500 })
  }
}

async function sendStatusUpdateToCustomer(order: any, newStatus: string) {
  const botToken = process.env.TELEGRAM_BOT_TOKEN
  const chatId = process.env.TELEGRAM_CHAT_ID

  if (!botToken || !chatId) {
    console.log("[v0] Telegram not configured, skipping notification")
    return
  }

  // Status emojis and messages
  const statusInfo: Record<string, { emoji: string; message: string }> = {
    requested: { emoji: "📋", message: "Your order has been received and is awaiting review" },
    approved: { emoji: "✅", message: "Your order has been approved and will be prepared soon" },
    preparing: { emoji: "📦", message: "Your order is being prepared" },
    delivery: { emoji: "🚚", message: "Your order is out for delivery" },
    completed: { emoji: "🎉", message: "Your order has been completed. Thank you for your purchase!" },
    cancelled: { emoji: "❌", message: "Your order has been cancelled" },
  }

  const info = statusInfo[newStatus] || { emoji: "ℹ️", message: `Status updated to: ${newStatus}` }

  const productsList = order.order_items
    .map((item: any, index: number) => {
      return `${index + 1}. ${item.product_name} x${item.quantity} – $${(item.price * item.quantity).toFixed(0)}`
    })
    .join("\n")

  const message = `${info.emoji} ORDER STATUS UPDATE

📋 Order: ${order.order_number}
👤 Name: ${order.customer_name}
📞 Contact: ${order.customer_telegram || order.customer_phone}

${info.message}

📦 Products:
${productsList}

💰 Total: $${order.total.toFixed(0)}

Current Status: ${newStatus.toUpperCase()}`

  const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      text: message,
    }),
  })

  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(`Telegram API error: ${JSON.stringify(errorData)}`)
  }

  return response.json()
}
