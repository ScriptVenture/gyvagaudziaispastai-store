import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { PayseraCallbackData } from "../../../modules/paysera/types";

export async function POST(
  req: MedusaRequest,
  res: MedusaResponse
) {
  try {
    const callbackData: PayseraCallbackData = req.body as PayseraCallbackData;
    
    console.log("Received Paysera callback:", callbackData);
    
    // Process the payment based on status
    if (callbackData.status === "1") {
      // Payment successful
      console.log(`Paysera payment successful for order ${callbackData.orderid}`);
      
      // Here you would typically:
      // 1. Update order status to paid
      // 2. Send confirmation emails
      // 3. Trigger fulfillment workflows
      
      // For now, we'll just log and return OK
      res.status(200).send("OK");
    } else {
      // Payment failed or canceled
      console.log(`Paysera payment failed/canceled for order ${callbackData.orderid}`);
      res.status(200).send("OK");
    }

  } catch (error: any) {
    console.error("Paysera callback processing error:", error);
    res.status(500).json({
      error: "Failed to process Paysera callback",
      details: error.message
    });
  }
}

// Also handle GET requests (some callbacks come as GET)
export async function GET(
  req: MedusaRequest,
  res: MedusaResponse
) {
  return POST(req, res);
}