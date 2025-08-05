import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";

type ValidateCheckoutBody = {
  cart_id: string;
};

export async function POST(
  req: MedusaRequest,
  res: MedusaResponse
) {
  const { cart_id } = req.body as ValidateCheckoutBody;

  if (!cart_id) {
    return res.status(400).json({
      error: "cart_id is required"
    });
  }

  try {
    // Get cart module service using Medusa v2 pattern
    const cartModuleService = req.scope.resolve("cart");
    
    // Retrieve cart using v2 method
    const cart = await cartModuleService.retrieveCart(cart_id, {
      relations: ["items", "items.variant", "shipping_address", "billing_address", "payment_sessions"]
    });

    if (!cart) {
      return res.status(404).json({
        error: "Cart not found"
      });
    }

    // Validate cart has items
    if (!cart.items || cart.items.length === 0) {
      return res.status(400).json({
        error: "Cart is empty"
      });
    }

    // Validate shipping address
    if (!cart.shipping_address) {
      return res.status(400).json({
        error: "Shipping address is required"
      });
    }

    // Return cart ready for checkout
    res.json({
      cart,
      message: "Cart ready for checkout"
    });

  } catch (error: any) {
    console.error("Checkout validation error:", error);
    res.status(500).json({
      error: "Internal server error during checkout validation",
      details: error.message
    });
  }
}