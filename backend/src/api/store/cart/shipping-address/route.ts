import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { updateCartWorkflow } from "@medusajs/medusa/core-flows";

type UpdateShippingAddressBody = {
  cart_id: string;
  address: {
    first_name: string;
    last_name: string;
    address_1: string;
    address_2?: string;
    city: string;
    postal_code: string;
    country_code: string;
    province?: string;
    phone?: string;
  };
};

// Update cart shipping address
export async function PUT(
  req: MedusaRequest,
  res: MedusaResponse
) {
  const { cart_id, address } = req.body as UpdateShippingAddressBody;

  if (!cart_id || !address) {
    return res.status(400).json({
      error: "cart_id and address are required"
    });
  }

  // Validate required address fields
  const requiredFields: (keyof typeof address)[] = ['first_name', 'last_name', 'address_1', 'city', 'postal_code', 'country_code'];
  const missingFields = requiredFields.filter(field => !address[field]);

  if (missingFields.length > 0) {
    return res.status(400).json({
      error: `Missing required address fields: ${missingFields.join(', ')}`
    });
  }

  try {
    // Use updateCartWorkflow to update shipping address
    const { result: cart } = await updateCartWorkflow(req.scope).run({
      input: {
        id: cart_id,
        shipping_address: address
      }
    });

    res.json({
      cart
    });

  } catch (error: any) {
    console.error("Update shipping address error:", error);
    res.status(500).json({
      error: "Failed to update shipping address",
      details: error.message
    });
  }
}

// Get cart shipping address
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
    // Use cart module service with v2 pattern
    const cartModuleService = req.scope.resolve("cart");
    
    const cart = await cartModuleService.retrieveCart(cart_id as string, {
      relations: ["shipping_address"]
    });

    res.json({
      shipping_address: cart.shipping_address
    });

  } catch (error: any) {
    console.error("Get shipping address error:", error);
    res.status(404).json({
      error: "Cart or shipping address not found",
      details: error.message
    });
  }
}