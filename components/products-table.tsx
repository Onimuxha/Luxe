"use client"

import Image from "next/image"
import Link from "next/link"
import { ExternalLink } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { Product } from "@/lib/types"

interface ProductsTableProps {
  products: Product[]
}

export function ProductsTable({ products }: ProductsTableProps) {
  if (products.length === 0) {
    return <div className="text-center py-8 text-muted-foreground">No products yet</div>
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Product</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Stock</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product) => (
            <TableRow key={product.id}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <div className="relative h-10 w-10 rounded-md overflow-hidden">
                    <Image
                      src={product.image_url || "/placeholder.svg"}
                      alt={product.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <div className="font-medium">{product.name}</div>
                    <div className="text-sm text-muted-foreground">{product.slug}</div>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div>
                  <div className="font-medium">${product.price}</div>
                  {product.compare_at_price && (
                    <div className="text-sm text-muted-foreground line-through">${product.compare_at_price}</div>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <Badge variant={product.stock > 10 ? "outline" : product.stock > 0 ? "secondary" : "destructive"}>
                  {product.stock} units
                </Badge>
              </TableCell>
              <TableCell>
                <Badge variant={product.is_active ? "outline" : "secondary"}>
                  {product.is_active ? "Active" : "Inactive"}
                </Badge>
              </TableCell>
              <TableCell>
                <Button variant="ghost" size="sm" asChild>
                  <Link href={`/products/${product.slug}`} target="_blank">
                    <ExternalLink className="h-4 w-4" />
                  </Link>
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
