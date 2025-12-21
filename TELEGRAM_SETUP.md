# Telegram Order Notifications Setup Guide

This guide will help you set up Telegram notifications for new orders.

## Why Telegram?

- ✅ Instant notifications on your phone
- ✅ Free and reliable
- ✅ No email configuration needed
- ✅ Works worldwide
- ✅ Easy to set up

## Step-by-Step Setup

### 1. Create a Telegram Bot

1. Open Telegram and search for `@BotFather`
2. Start a chat and send `/newbot`
3. Follow the prompts:
   - Choose a name for your bot (e.g., "LuxeAccessories Orders")
   - Choose a username (must end in 'bot', e.g., "luxeaccessories_bot")
4. BotFather will send you a token that looks like:
   ```
   123456789:ABCdefGHIjklMNOpqrsTUVwxyz123456789
   ```
5. **Save this token** - you'll need it for the environment variables

### 2. Get Your Chat ID

#### Method 1: Using a Telegram Bot

1. Search for `@userinfobot` on Telegram
2. Start a chat with it
3. It will immediately send you your chat ID
4. **Save this number**

#### Method 2: Manual Method

1. Send a message to your bot (the one you created)
2. Open this URL in your browser (replace `YOUR_BOT_TOKEN`):
   ```
   https://api.telegram.org/botYOUR_BOT_TOKEN/getUpdates
   ```
3. Look for `"chat":{"id":123456789}` in the response
4. The number is your chat ID

### 3. Add Environment Variables

Add these to your `.env.local` file or Vercel environment variables:

```env
TELEGRAM_BOT_TOKEN=123456789:ABCdefGHIjklMNOpqrsTUVwxyz123456789
TELEGRAM_CHAT_ID=123456789
```

### 4. Test the Integration

1. Place a test order on your website
2. You should receive a Telegram message with order details

## Notification Format

When an order is placed, you'll receive a message like:

```
🛍️ New Order Received!

📋 Order #: ORD-1234567890-ABC123

👤 Customer:
Name: John Doe
Email: john@example.com
Phone: +1 234 567 8900

📦 Items:
• Classic Gold Watch x 1 - $299.99
• Diamond Necklace x 1 - $899.99

💰 Total: $1209.99

📍 Shipping Address:
123 Main St, Apt 4, New York, NY 10001

🔗 View in admin dashboard
```

## Troubleshooting

### Not Receiving Messages?

1. **Check bot token**: Make sure it's correct in environment variables
2. **Check chat ID**: Verify you copied the correct number
3. **Start the bot**: Send `/start` to your bot on Telegram
4. **Restart your app**: Restart the Next.js development server
5. **Check logs**: Look for error messages in the console

### Message Format Issues?

The bot uses Markdown formatting. If messages aren't displaying correctly:
- Check the `sendTelegramNotification` function in `app/api/checkout/route.ts`
- Ensure special characters are escaped properly

### Want to Send to a Group?

1. Add your bot to a Telegram group
2. Make the bot an admin
3. Get the group chat ID (use the getUpdates method)
4. Use the group chat ID instead of your personal chat ID

## Customizing Notifications

Edit the message template in `app/api/checkout/route.ts`:

```typescript
const message = `
🛍️ *New Order Received!*

📋 *Order #:* ${order.order_number}
// ... customize as needed
`
```

### Formatting Options

- `*bold*` - Bold text
- `_italic_` - Italic text
- `[text](url)` - Links
- ` ``` code ``` ` - Code blocks

## Advanced: Multiple Recipients

To send notifications to multiple people:

1. Create a Telegram group
2. Add all recipients to the group
3. Add your bot to the group
4. Use the group chat ID in environment variables

OR

Modify the `sendTelegramNotification` function to loop through multiple chat IDs.

## Security Notes

- ✅ Bot tokens are sensitive - never commit them to Git
- ✅ Keep chat IDs private
- ✅ Use environment variables for all credentials
- ✅ Consider using a dedicated group for order notifications
- ⚠️ Anyone with your bot token can send messages as your bot

## Additional Features

### Rich Formatting

Add buttons to your messages:

```typescript
const keyboard = {
  inline_keyboard: [
    [
      { text: "View Order", url: `https://yoursite.com/admin/orders/${order.id}` },
      { text: "Mark as Shipped", callback_data: `ship_${order.id}` }
    ]
  ]
}
```

### Order Status Updates

Extend the notification system to send updates when:
- Order status changes
- Payment is confirmed
- Item ships
- Delivery is completed

## Resources

- [Telegram Bot API Documentation](https://core.telegram.org/bots/api)
- [BotFather Commands](https://core.telegram.org/bots#6-botfather)
- [Telegram Bot Features](https://core.telegram.org/bots/features)

## Need Help?

If you're still having issues:
1. Check the Telegram Bot API documentation
2. Verify your bot token and chat ID
3. Test with a simple message first
4. Check server logs for errors
