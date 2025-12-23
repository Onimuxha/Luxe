"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { cn } from "@/lib/utils"

const SORT_OPTIONS = [
  { value: "newest", label: "Newest" },
  { value: "price-asc", label: "Price: Low → High" },
  { value: "price-desc", label: "Price: High → Low" },
  { value: "name", label: "Name" },
]

export function ProductFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const currentSort = searchParams.get("sort") || "newest"

  const handleSortChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set("sort", value)
    router.push(`/shop?${params.toString()}`)
  }

  return (
    <Card className="border border-border/60 bg-background/80 backdrop-blur-sm shadow-sm py-5">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold tracking-tight">
          Sort Products
        </CardTitle>
      </CardHeader>

      <CardContent>
        <RadioGroup
          value={currentSort}
          onValueChange={handleSortChange}
          className="space-y-2"
        >
          {SORT_OPTIONS.map(option => {
            const checked = currentSort === option.value

            return (
              <Label
                key={option.value}
                htmlFor={option.value}
                className={cn(
                  "flex items-center gap-3 rounded-xl border px-4 py-3 cursor-pointer transition-all",
                  "hover:bg-muted/60",
                  checked
                    ? "border-primary bg-primary/5 shadow-sm"
                    : "border-border"
                )}
              >
                <RadioGroupItem
                  id={option.value}
                  value={option.value}
                  className="mt-0.5"
                />
                <span className="text-sm font-medium">
                  {option.label}
                </span>
              </Label>
            )
          })}
        </RadioGroup>
      </CardContent>
    </Card>
  )
}
