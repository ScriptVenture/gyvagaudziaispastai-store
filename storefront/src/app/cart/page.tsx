"use client"

import { useCart } from "@/contexts/cart-context"
import { useCartActions } from "@/hooks/useCartActions"
import { Container, Heading, Text, Button, Flex, Box } from "@radix-ui/themes"
import { Trash2, Plus, Minus } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function CartPage() {
  const { cart, isLoading } = useCart()
  const { updateItem, deleteItem, isUpdating, isDeleting } = useCartActions()

  if (isLoading) {
    return (
      <Container size="3" className="py-16">
        <Flex direction="column" align="center" gap="4">
          <Text>Loading cart...</Text>
        </Flex>
      </Container>
    )
  }

  if (!cart || !cart.items || cart.items.length === 0) {
    return (
      <Container size="3" className="py-16">
        <Flex direction="column" align="center" gap="4">
          <Heading size="8">Your cart is empty</Heading>
          <Text size="5" color="gray">Add some items to get started</Text>
          <Link href="/">
            <Button size="3">Continue Shopping</Button>
          </Link>
        </Flex>
      </Container>
    )
  }

  const subtotal = cart.items.reduce((acc, item) => {
    return acc + (item.unit_price || 0) * item.quantity
  }, 0)

  return (
    <Container size="4" className="py-8">
      <Heading size="8" className="mb-8">Shopping Cart</Heading>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="space-y-4">
            {cart.items.map((item) => (
              <div key={item.id} className="border rounded-lg p-4">
                <Flex gap="4">
                  {item.thumbnail && (
                    <Box className="w-24 h-24 relative flex-shrink-0">
                      <img
                        src={item.thumbnail}
                        alt={item.product?.title || "Product"}
                        className="w-full h-full object-cover rounded"
                      />
                    </Box>
                  )}
                  
                  <Box className="flex-1">
                    <Heading size="4" className="mb-1">
                      {item.product?.title || "Product"}
                    </Heading>
                    <Text size="2" color="gray" className="mb-2">
                      {item.variant?.title || "Default"}
                    </Text>
                    
                    <Flex justify="between" align="center">
                      <Flex align="center" gap="2">
                        <Button
                          size="1"
                          variant="outline"
                          onClick={() => updateItem(item.id, Math.max(1, item.quantity - 1))}
                          disabled={isUpdating || item.quantity <= 1}
                        >
                          <Minus size={16} />
                        </Button>
                        <Text size="3" weight="medium" className="w-12 text-center">
                          {item.quantity}
                        </Text>
                        <Button
                          size="1"
                          variant="outline"
                          onClick={() => updateItem(item.id, item.quantity + 1)}
                          disabled={isUpdating}
                        >
                          <Plus size={16} />
                        </Button>
                      </Flex>
                      
                      <Flex align="center" gap="4">
                        <Text size="4" weight="medium">
                          €{((item.unit_price || 0) * item.quantity).toFixed(2)}
                        </Text>
                        <Button
                          size="2"
                          variant="ghost"
                          color="red"
                          onClick={() => deleteItem(item.id)}
                          disabled={isDeleting}
                        >
                          <Trash2 size={18} />
                        </Button>
                      </Flex>
                    </Flex>
                  </Box>
                </Flex>
              </div>
            ))}
          </div>
        </div>
        
        <div>
          <Box className="border rounded-lg p-6 sticky top-4">
            <Heading size="5" className="mb-4">Order Summary</Heading>
            
            <Flex direction="column" gap="3">
              <Flex justify="between">
                <Text>Subtotal</Text>
                <Text weight="medium">€{subtotal.toFixed(2)}</Text>
              </Flex>
              
              <Flex justify="between">
                <Text>Shipping</Text>
                <Text color="gray">Calculated at checkout</Text>
              </Flex>
              
              <Flex justify="between">
                <Text>Tax</Text>
                <Text color="gray">Calculated at checkout</Text>
              </Flex>
              
              <Box className="border-t pt-3">
                <Flex justify="between">
                  <Text size="4" weight="bold">Total</Text>
                  <Text size="4" weight="bold">
                    €{subtotal.toFixed(2)}
                  </Text>
                </Flex>
              </Box>
              
              <Link href="/checkout" className="w-full">
                <Button size="3" className="w-full">
                  Proceed to Checkout
                </Button>
              </Link>
              
              <Link href="/" className="w-full">
                <Button size="3" variant="outline" className="w-full">
                  Continue Shopping
                </Button>
              </Link>
            </Flex>
          </Box>
        </div>
      </div>
    </Container>
  )
}