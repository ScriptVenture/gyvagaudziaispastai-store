import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";

// Get order confirmation details
export async function GET(
  req: MedusaRequest,
  res: MedusaResponse
) {
  const { order_id } = req.query;

  if (!order_id) {
    return res.status(400).json({
      error: "order_id is required"
    });
  }

  try {
    // Use order module service with v2 pattern
    const orderModuleService = req.scope.resolve("order");
    
    const order = await orderModuleService.retrieveOrder(order_id as string, {
      relations: [
        "items", 
        "items.variant", 
        "items.variant.product",
        "shipping_address", 
        "billing_address",
        "payments",
        "region"
      ]
    });

    // Prepare confirmation data with proper v2 structure
    const confirmation = {
      order_number: order.display_id,
      order_id: order.id,
      status: order.status,
      email: order.email,
      total: order.total,
      currency: order.currency_code,
      created_at: order.created_at,
      items: (order.items || []).map(item => ({
        id: item.id,
        title: item.title,
        quantity: item.quantity,
        unit_price: item.unit_price,
        total: item.total
      })),
      shipping_address: order.shipping_address,
      billing_address: order.billing_address
    };

    res.json({
      confirmation
    });

  } catch (error: any) {
    console.error("Order confirmation error:", error);
    res.status(404).json({
      error: "Order confirmation not found",
      details: error.message
    });
  }
}

type SendConfirmationEmailBody = {
  order_id: string;
  email?: string;
};

// Send order confirmation email (placeholder)
export async function POST(
  req: MedusaRequest,
  res: MedusaResponse
) {
  const { order_id, email } = req.body as SendConfirmationEmailBody;

  if (!order_id) {
    return res.status(400).json({
      error: "order_id is required"
    });
  }

  try {
    // This would integrate with an email service
    // For now, we'll just return success
    console.log(`Order confirmation email would be sent for order ${order_id} to ${email}`);

    res.json({
      message: "Order confirmation email sent successfully"
    });

  } catch (error: any) {
    console.error("Order confirmation email error:", error);
    res.status(500).json({
      error: "Failed to send order confirmation email",
      details: error.message
    });
  }
}