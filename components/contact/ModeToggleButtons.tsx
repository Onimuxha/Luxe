import { Button } from "@/components/ui/button"
import { IconSend, IconShoppingBag } from "@tabler/icons-react"

interface ModeToggleButtonsProps {
  cartItemsLength: number
  orderMode: boolean
  loading: boolean
  onSetOrderMode: (mode: boolean) => void
  onLoadCartItems: () => void
}

export function ModeToggleButtons({
  cartItemsLength,
  orderMode,
  loading,
  onSetOrderMode,
  onLoadCartItems,
}: ModeToggleButtonsProps) {
  return (
    <div className="flex gap-4 mb-8 justify-center flex-wrap">
      {cartItemsLength > 0 ? (
        <>
          <Button variant={orderMode ? "default" : "outline"} onClick={() => onSetOrderMode(true)}>
            <IconShoppingBag className="w-4 h-4 mr-2" />
            Place Order ({cartItemsLength} items)
          </Button>
          <Button variant={!orderMode ? "default" : "outline"} onClick={() => onSetOrderMode(false)}>
            <IconSend className="w-4 h-4 mr-2" />
            Send Message
          </Button>
        </>
      ) : (
        <>
          <Button variant="outline" onClick={onLoadCartItems} disabled={loading}>
            <IconShoppingBag className="w-4 h-4 mr-2" />
            {loading ? "Loading Cart..." : "Load Cart to Order"}
          </Button>
          <Button variant="default" onClick={() => onSetOrderMode(false)}>
            <IconSend className="w-4 h-4 mr-2" />
            Send Message
          </Button>
        </>
      )}
    </div>
  )
}