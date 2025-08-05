import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { completeCartWorkflow } from "@medusajs/medusa/core-flows";

type CompletePaymentBody = {
  cart_id: string;
};

// Complete payment
export async function POST(
  req: MedusaRequest,
  res: MedusaResponse
) {
  const { cart_id } = req.body as CompletePaymentBody;

  if (!cart_id) {
    return res.status(400).json({
      error: "cart_id is required"
    });
  }

  try {
    // Use completeCartWorkflow which handles payment completion
    const { result: order } = await completeCartWorkflow(req.scope).run({
      input: {
        id: cart_id
      }
    });

    res.json({
      order,
      message: "Payment completed successfully"
    });

  } catch (error: any) {
    console.error("Payment completion error:", error);
    res.status(500).json({
      error: "Failed to complete payment",
      details: error.message
    });
  }
}

// Check payment status
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
      relations: ["payment_sessions", "payment"]
    });

    const paymentStatus = {
      cart_id: cart.id,
      status: "ready", // Simplified status for v2
      payment_ready: true
    };

    res.json({
      payment_status: paymentStatus
    });

  } catch (error: any) {
    console.error("Payment status check error:", error);
    res.status(404).json({
      error: "Cart not found",
      details: error.message
    });
  }
}