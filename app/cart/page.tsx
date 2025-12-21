import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { CartContent } from "@/components/cart-content"

export const metadata = {
  title: "Shopping Cart | LuxeAccessories",
  description: "View your shopping cart",
}

export default function CartPage() {
  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-8">Shopping Cart</h1>
          <CartContent />
        </div>
      </main>
      <SiteFooter />
    </>
  )
}
