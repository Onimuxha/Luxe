"use client"

import { useState, useEffect } from "react"
import { SiteHeader } from "@/components/site-header"
import { OrderSummaryCard } from "@/components/contact/OrderSummaryCard"
import { ContactInfoForm } from "@/components/contact/ContactInfoForm"
import { ContactInfoCards } from "@/components/contact/ContactInfoCards"
import { ModeToggleButtons } from "@/components/contact/ModeToggleButtons"
import { useCartData } from "@/hooks/useCartData"
import { useContactForm } from "@/hooks/useContactForm"

export default function ContactPage() {
  const { cartItems, loading, loadCartItems, clearCart } = useCartData()
  const { formData, submitting, handleChange, handleSubmit } = useContactForm()
  const [orderMode, setOrderMode] = useState(false)
  const [showCartOption] = useState(true)

  useEffect(() => {
    if (cartItems.length > 0) {
      setOrderMode(true)
    }
  }, [cartItems.length])

  const total = cartItems.reduce((sum, item) => sum + (item.product?.price || 0) * item.quantity, 0)

  const onSubmit = (e: React.FormEvent) => {
    handleSubmit(e, orderMode, cartItems, () => {
      clearCart()
      setOrderMode(false)
    })
  }

  if (loading) {
    return (
      <main className="min-h-screen py-20">
        <div className="container mx-auto px-4 text-center">Loading...</div>
      </main>
    )
  }

  return (
    <main className="min-h-screen">
      <SiteHeader cartCount={cartItems.length} />
      {/* Hero Section */}
      <section className="relative bg-linear-to-br from-primary/10 via-background to-accent/10 py-28">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-balance">
              {orderMode ? "Complete Your Order" : "Contact Us"}
            </h1>
            <p className="text-lg text-muted-foreground text-pretty">
              {orderMode
                ? "Review your cart and provide your contact information to place your order"
                : "Have a question or need assistance? We're here to help!"}
            </p>
          </div>
        </div>
      </section>

      {/* Contact/Order Form */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            {showCartOption && (
              <ModeToggleButtons
                cartItemsLength={cartItems.length}
                orderMode={orderMode}
                loading={loading}
                onSetOrderMode={setOrderMode}
                onLoadCartItems={loadCartItems}
              />
            )}

            {orderMode && cartItems.length > 0 ? (
              <div className="grid lg:grid-cols-5 gap-8">
                <div className="lg:col-span-3 space-y-6">
                  <OrderSummaryCard cartItems={cartItems} total={total} />
                </div>
                <div className="lg:col-span-2">
                  <ContactInfoForm
                    formData={formData}
                    isOrderMode={true}
                    submitting={submitting}
                    onSubmit={onSubmit}
                    onChange={handleChange}
                  />
                </div>
              </div>
            ) : (
              <div className="max-w-3xl mx-auto">
                <ContactInfoForm
                  formData={formData}
                  isOrderMode={false}
                  submitting={submitting}
                  onSubmit={onSubmit}
                  onChange={handleChange}
                />
                <ContactInfoCards />
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  )
}