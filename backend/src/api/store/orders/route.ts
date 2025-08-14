import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { Logger } from "@medusajs/types";

// Get order by ID
export async function GET(
  req: MedusaRequest,
  res: MedusaResponse
) {
  const logger: Logger = req.scope.resolve("logger");
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
        "fulfillments"
      ]
    });

    res.json({
      order
    });

  } catch (error: any) {
    logger.error(`Order retrieval error: ${error.message}`);
    res.status(404).json({
      error: "Order not found",
      details: error.message
    });
  }
}

type ListOrdersBody = {
  customer_email?: string;
  limit?: number;
  offset?: number;
};

// List customer orders
export async function POST(
  req: MedusaRequest,
  res: MedusaResponse
) {
  const logger: Logger = req.scope.resolve("logger");
  const { customer_email, limit = 10, offset = 0 } = req.body as ListOrdersBody;

  try {
    // Use order module service with v2 pattern
    const orderModuleService = req.scope.resolve("order");
    
    if (customer_email) {
      // Get orders for specific customer email
      // Note: In v2, we need to filter differently - using a basic list for now
      const allOrders = await orderModuleService.listOrders({}, {
        relations: [
          "items", 
          "items.variant", 
          "items.variant.product"
        ],
        take: limit,
        skip: offset
      });

      // Filter by email client-side for now (in production, use proper query filters)
      const filteredOrders = allOrders.filter(order => order.email === customer_email);

      res.json({
        orders: filteredOrders,
        count: filteredOrders.length
      });
    } else {
      return res.status(400).json({
        error: "customer_email is required"
      });
    }

  } catch (error: any) {
    logger.error(`Orders listing error: ${error.message}`);
    res.status(500).json({
      error: "Failed to retrieve orders",
      details: error.message
    });
  }
}