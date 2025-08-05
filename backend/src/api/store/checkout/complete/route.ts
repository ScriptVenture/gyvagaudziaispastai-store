import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { completeCartWorkflow } from "@medusajs/medusa/core-flows";

type CompleteCartBody = {
  cart_id: string;
};

export async function POST(
  req: MedusaRequest,
  res: MedusaResponse
) {
  const { cart_id } = req.body as CompleteCartBody;

  if (!cart_id) {
    return res.status(400).json({
      error: "cart_id is required"
    });
  }

  try {
    // Use the completeCartWorkflow to complete the cart and create an order
    const { result: order } = await completeCartWorkflow(req.scope).run({
      input: {
        id: cart_id
      }
    });

    res.json({
      order,
      message: "Order created successfully"
    });

  } catch (error: any) {
    console.error("Checkout completion error:", error);
    res.status(500).json({
      error: "Failed to complete checkout",
      details: error.message
    });
  }
}