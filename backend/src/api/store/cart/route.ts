import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { createCartWorkflow } from "@medusajs/medusa/core-flows";
import { Logger } from "@medusajs/types";

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
  const logger: Logger = req.scope.resolve("logger");
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
    logger.error(`Cart creation error: ${error.message}`);
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
  const logger: Logger = req.scope.resolve("logger");
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
    logger.error(`Cart retrieval error: ${error.message}`);
    res.status(404).json({
      error: "Cart not found"
    });
  }
}