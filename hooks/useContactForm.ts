import { useState } from "react"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import type { CartItem } from "@/lib/types"

export function useContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    contact: "",
    email: "",
    message: "",
  })
  const [submitting, setSubmitting] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const handleSubmit = async (
    e: React.FormEvent,
    orderMode: boolean,
    cartItems: CartItem[],
    onSuccess: () => void
  ) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      if (orderMode && cartItems.length > 0) {
        const total = cartItems.reduce((sum, item) => sum + (item.product?.price || 0) * item.quantity, 0)

        const response = await fetch("/api/contact-order", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            customer: formData,
            total,
            items: cartItems.map((item) => ({
              id: item.product?.id,
              product_name: item.product?.name || "",
              quantity: item.quantity,
              price: item.product?.price || 0,
              image_url: item.product?.image_url || "",
            })),
            isOrder: true,
          }),
        })

        if (!response.ok) throw new Error("Failed to send order")

        toast({
          title: "Order sent successfully!",
          description: "We'll contact you shortly to confirm your order.",
        })

        localStorage.removeItem("cart_user_id")
        setFormData({ name: "", contact: "", email: "", message: "" })
        onSuccess()
        router.push("/")
      } else {
        const response = await fetch("/api/contact-order", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            customer: formData,
            isOrder: false,
          }),
        })

        if (!response.ok) throw new Error("Failed to send message")

        toast({
          title: "Message sent successfully!",
          description: "We'll get back to you as soon as possible.",
        })

        setFormData({ name: "", contact: "", email: "", message: "" })
      }
    } catch (error) {
      console.error("Submission error:", error)
      toast({
        title: "Error",
        description: orderMode
          ? "Failed to send order. Please try again."
          : "Failed to send message. Please try again.",
        variant: "destructive",
      })
    } finally {
      setSubmitting(false)
    }
  }

  return {
    formData,
    submitting,
    handleChange,
    handleSubmit,
  }
}