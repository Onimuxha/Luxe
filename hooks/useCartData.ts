import { useState, useEffect } from "react"
import type { CartItem } from "@/lib/types"

export function useCartData() {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(true)

  const fetchCart = async () => {
    try {
      const userId = localStorage.getItem("cart_user_id")
      if (!userId) {
        setLoading(false)
        return
      }

      const response = await fetch(`/api/cart?user_id=${userId}`)
      if (!response.ok) throw new Error("Failed to fetch cart")

      const data = await response.json()
      setCartItems(data)
    } catch (error) {
      console.error("Failed to fetch cart:", error)
    } finally {
      setLoading(false)
    }
  }

  const loadCartItems = async () => {
    setLoading(true)
    await fetchCart()
    setLoading(false)
  }

  const clearCart = () => {
    setCartItems([])
  }

  useEffect(() => {
    fetchCart()
  }, [])

  return {
    cartItems,
    loading,
    loadCartItems,
    clearCart,
  }
}