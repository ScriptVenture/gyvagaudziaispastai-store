import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { createCartWorkflow } from "@medusajs/medusa/core-flows";

type CreateCartBody = {
  region_id?: string;
  currency_code?: string;
  customer_id?: string;
  email?: string;
};

// Create a new cart
export async function POST(
  req: MedusaRequest,
  res: MedusaResponse
) {
  try {
    const body = req.body as CreateCartBody;
    
    // Use the createCartWorkflow
    const { result: cart } = await createCartWorkflow(req.scope).run({
      input: {
        region_id: body.region_id,
        currency_code: body.currency_code || "USD",
        customer_id: body.customer_id,
        email: body.email,
      }
    });

    res.json({
      cart
    });

  } catch (error: any) {
    console.error("Cart creation error:", error);
    res.status(500).json({
      error: "Failed to create cart",
      details: error.message
    });
  }
}

// Get cart
export async function GET(
  req: MedusaRequest,
  res: MedusaResponse
) {
  const { cart_id } = req.query;

  if (!cart_id) {
    return res.status(400).json({
      error: "cart_id is required"
    });
  }

  try {
    const cartModuleService = req.scope.resolve("cart");
    
    const cart = await cartModuleService.retrieveCart(cart_id as string, {
      relations: [
        "items", 
        "items.variant", 
        "items.variant.product",
        "shipping_address", 
        "billing_address",
        "region"
      ]
    });

    res.json({
      cart
    });

  } catch (error: any) {
    console.error("Cart retrieval error:", error);
    res.status(404).json({
      error: "Cart not found"
    });
  }
}