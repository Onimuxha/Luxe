import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, contact, email, message } = body

    // Validate required fields
    if (!name || !contact || !message) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Format message for Telegram
    const telegramMessage = `
💬 NEW CONTACT MESSAGE

👤 Name: ${name}
📞 Contact: ${contact}
${email ? `📧 Email: ${email}` : ""}

📝 Message:
${message}
    `.trim()

    // Send to Telegram bot
    const botToken = process.env.TELEGRAM_BOT_TOKEN
    const chatId = process.env.TELEGRAM_CHAT_ID

    if (botToken && chatId) {
      await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          text: telegramMessage,
          parse_mode: "HTML",
        }),
      })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Contact message error:", error)
    return NextResponse.json({ error: "Failed to send message" }, { status: 500 })
  }
}
