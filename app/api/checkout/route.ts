import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { userId, customer, subtotal, shippingFee, total, items } = await request.json()

    const supabase = await createClient()

    // Generate order number
    const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`

    // Create order
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        order_number: orderNumber,
        customer_name: customer.name,
        customer_email: customer.email,
        customer_phone: customer.phone,
        customer_address: customer.address,
        subtotal,
        shipping_fee: shippingFee,
        total,
        status: "pending",
        notes: customer.notes || null,
      })
      .select()
      .single()

    if (orderError) throw orderError

    // Create order items
    const orderItems = items.map((item: any) => ({
      order_id: order.id,
      product_id: item.product_id,
      product_name: item.product_name,
      product_image: item.product_image,
      quantity: item.quantity,
      price: item.price,
    }))

    const { error: itemsError } = await supabase.from("order_items").insert(orderItems)

    if (itemsError) throw itemsError

    // Clear cart
    await supabase.from("cart_items").delete().eq("user_id", userId)

    // Send Telegram notification
    try {
      await sendTelegramNotification(order, orderItems)
      await supabase.from("orders").update({ telegram_sent: true }).eq("id", order.id)
    } catch (telegramError) {
      console.error("[v0] Telegram notification failed:", telegramError)
      // Don't fail the order if Telegram fails
    }

    return NextResponse.json({ success: true, orderId: order.id, orderNumber })
  } catch (error) {
    console.error("[v0] Checkout error:", error)
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 })
  }
}

async function sendTelegramNotification(order: any, items: any[]) {
  const botToken = process.env.TELEGRAM_BOT_TOKEN
  const chatId = process.env.TELEGRAM_CHAT_ID

  if (!botToken || !chatId) {
    console.log("[v0] Telegram credentials not configured")
    return
  }

  const itemsList = items.map((item) => `• ${item.product_name} x ${item.quantity} - $${item.price}`).join("\n")

  const message = `
🛍️ *New Order Received!*

📋 *Order #:* ${order.order_number}

👤 *Customer:*
Name: ${order.customer_name}
Email: ${order.customer_email}
Phone: ${order.customer_phone}

📦 *Items:*
${itemsList}

💰 *Total:* $${order.total}

📍 *Shipping Address:*
${order.customer_address}

${order.notes ? `📝 *Notes:* ${order.notes}` : ""}

🔗 View in admin dashboard
  `

  const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      text: message,
      parse_mode: "Markdown",
    }),
  })

  if (!response.ok) {
    throw new Error("Failed to send Telegram message")
  }
}
