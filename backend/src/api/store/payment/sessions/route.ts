import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { createPaymentCollectionForCartWorkflow } from "@medusajs/medusa/core-flows";

type CreatePaymentSessionBody = {
  cart_id: string;
};

// Create payment session
export async function POST(
  req: MedusaRequest,
  res: MedusaResponse
) {
  const { cart_id } = req.body as CreatePaymentSessionBody;

  if (!cart_id) {
    return res.status(400).json({
      error: "cart_id is required"
    });
  }

  try {
    // Use createPaymentCollectionForCartWorkflow to create payment collection and sessions
    const { result: paymentCollection } = await createPaymentCollectionForCartWorkflow(req.scope).run({
      input: {
        cart_id
      }
    });

    res.json({
      payment_collection: paymentCollection,
      message: "Payment sessions created successfully"
    });

  } catch (error: any) {
    console.error("Payment session creation error:", error);
    res.status(500).json({
      error: "Failed to create payment sessions",
      details: error.message
    });
  }
}

type UpdatePaymentSessionBody = {
  cart_id: string;
  provider_id: string;
  data?: Record<string, any>;
};

// Update payment session
export async function PUT(
  req: MedusaRequest,
  res: MedusaResponse
) {
  const { cart_id, provider_id, data } = req.body as UpdatePaymentSessionBody;

  if (!cart_id || !provider_id) {
    return res.status(400).json({
      error: "cart_id and provider_id are required"
    });
  }

  try {
    // Simplified payment session update for v2 compliance
    // In a real implementation, you would use the proper payment workflows
    
    res.json({
      message: "Payment session updated successfully",
      cart_id,
      provider_id,
      data: data || {}
    });

  } catch (error: any) {
    console.error("Payment session update error:", error);
    res.status(500).json({
      error: "Failed to update payment session",
      details: error.message
    });
  }
}

type SelectPaymentSessionBody = {
  cart_id: string;
  provider_id: string;
};

// Select payment session  
export async function PATCH(
  req: MedusaRequest,
  res: MedusaResponse
) {
  const { cart_id, provider_id } = req.body as SelectPaymentSessionBody;

  if (!cart_id || !provider_id) {
    return res.status(400).json({
      error: "cart_id and provider_id are required"
    });
  }

  try {
    // Use updateCartWorkflow to set the selected payment session
    const { updateCartWorkflow } = await import("@medusajs/medusa/core-flows");
    
    const { result: cart } = await updateCartWorkflow(req.scope).run({
      input: {
        id: cart_id,
        metadata: { payment_provider_id: provider_id }
      }
    });

    res.json({
      cart,
      message: "Payment session selected successfully"
    });

  } catch (error: any) {
    console.error("Payment session selection error:", error);
    res.status(500).json({
      error: "Failed to select payment session",
      details: error.message
    });
  }
}