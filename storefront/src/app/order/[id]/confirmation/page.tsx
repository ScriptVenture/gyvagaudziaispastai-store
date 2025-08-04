"use client"

import { useParams } from "next/navigation"
import { Container, Heading, Text, Button, Flex, Box, Separator } from "@radix-ui/themes"
import { CheckCircle, Package, Mail, Home } from "lucide-react"
import Link from "next/link"

export default function OrderConfirmationPage() {
  const params = useParams()
  const orderId = params.id as string

  return (
    <Container size="3" className="py-16">
      <Flex direction="column" align="center" className="text-center mb-8">
        <Box className="mb-6">
          <CheckCircle size={64} className="text-green-600 mx-auto" />
        </Box>
        
        <Heading size="8" className="mb-4">
          Thank You for Your Order!
        </Heading>
        
        <Text size="5" color="gray" className="mb-8">
          Your order has been successfully placed
        </Text>

        <Box className="bg-gray-50 rounded-lg p-6 w-full max-w-md mb-8">
          <Text size="3" weight="medium" className="block mb-2">
            Order Number
          </Text>
          <Text size="6" weight="bold" className="font-mono">
            #{orderId}
          </Text>
        </Box>

        <Flex direction="column" gap="4" className="w-full max-w-md mb-8">
          <Flex align="center" gap="3" className="text-left">
            <Mail className="text-gray-600 flex-shrink-0" size={20} />
            <Box>
              <Text size="2" weight="medium" className="block">
                Confirmation Email Sent
              </Text>
              <Text size="2" color="gray">
                Check your email for order details and tracking information
              </Text>
            </Box>
          </Flex>

          <Separator size="4" />

          <Flex align="center" gap="3" className="text-left">
            <Package className="text-gray-600 flex-shrink-0" size={20} />
            <Box>
              <Text size="2" weight="medium" className="block">
                Preparing Your Order
              </Text>
              <Text size="2" color="gray">
                We'll notify you when your order ships
              </Text>
            </Box>
          </Flex>
        </Flex>

        <Flex gap="4" justify="center">
          <Link href="/">
            <Button size="3" variant="outline">
              <Home size={16} className="mr-2" />
              Continue Shopping
            </Button>
          </Link>
          
          <Button size="3">
            View Order Details
          </Button>
        </Flex>
      </Flex>
    </Container>
  )
}