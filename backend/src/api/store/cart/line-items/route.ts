import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { addToCartWorkflow } from "@medusajs/medusa/core-flows";

type AddLineItemBody = {
  cart_id: string;
  variant_id: string;
  quantity?: number;
};

// Add item to cart
export async function POST(
  req: MedusaRequest,
  res: MedusaResponse
) {
  const { cart_id, variant_id, quantity = 1 } = req.body as AddLineItemBody;

  if (!cart_id || !variant_id) {
    return res.status(400).json({
      error: "cart_id and variant_id are required"
    });
  }

  try {
    // Use the addToCartWorkflow
    const { result: cart } = await addToCartWorkflow(req.scope).run({
      input: {
        cart_id,
        items: [{
          variant_id,
          quantity: parseInt(quantity.toString())
        }]
      }
    });

    res.json({
      cart
    });

  } catch (error: any) {
    console.error("Add to cart error:", error);
    res.status(500).json({
      error: "Failed to add item to cart",
      details: error.message
    });
  }
}

import { updateLineItemInCartWorkflow } from "@medusajs/medusa/core-flows";

type UpdateLineItemBody = {
  cart_id: string;
  line_item_id: string;
  quantity: number;
};

// Update line item quantity
export async function PUT(
  req: MedusaRequest,
  res: MedusaResponse
) {
  const { cart_id, line_item_id, quantity } = req.body as UpdateLineItemBody;

  if (!cart_id || !line_item_id || quantity === undefined) {
    return res.status(400).json({
      error: "cart_id, line_item_id, and quantity are required"
    });
  }

  try {
    // Use the updateLineItemInCartWorkflow
    const { result: cart } = await updateLineItemInCartWorkflow(req.scope).run({
      input: {
        cart_id,
        item_id: line_item_id,
        update: {
          quantity: parseInt(quantity.toString())
        }
      }
    });

    res.json({
      cart
    });

  } catch (error: any) {
    console.error("Update cart item error:", error);
    res.status(500).json({
      error: "Failed to update cart item"
    });
  }
}

import { deleteLineItemsWorkflow } from "@medusajs/medusa/core-flows";

type RemoveLineItemBody = {
  cart_id: string;
  line_item_id: string;
};

// Remove line item from cart
export async function DELETE(
  req: MedusaRequest,
  res: MedusaResponse
) {
  const { cart_id, line_item_id } = req.body as RemoveLineItemBody;

  if (!cart_id || !line_item_id) {
    return res.status(400).json({
      error: "cart_id and line_item_id are required"
    });
  }

  try {
    // Use the deleteLineItemsWorkflow
    await deleteLineItemsWorkflow(req.scope).run({
      input: {
        cart_id,
        ids: [line_item_id]
      }
    });

    // Retrieve updated cart
    const cartModuleService = req.scope.resolve("cart");
    const cart = await cartModuleService.retrieveCart(cart_id);

    res.json({
      cart
    });

  } catch (error: any) {
    console.error("Remove cart item error:", error);
    res.status(500).json({
      error: "Failed to remove cart item"
    });
  }
}