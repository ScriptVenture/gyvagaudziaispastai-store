import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { PayseraCallbackData } from "../../../modules/paysera/types";
import PayseraPaymentService from "../../../modules/paysera/service";
import { PAYSERA_PAYMENT_MODULE } from "../../../modules/paysera";

export async function POST(
  req: MedusaRequest,
  res: MedusaResponse
) {
  try {
    const callbackData: PayseraCallbackData = req.body as PayseraCallbackData;
    
    console.log("Received Paysera callback:", callbackData);
    
    // Get Paysera payment service for validation
    const payseraService: PayseraPaymentService = req.scope.resolve(PAYSERA_PAYMENT_MODULE);
    
    // Validate callback signature
    if (!payseraService.validateCallback(callbackData)) {
      console.error("Invalid Paysera callback signature");
      return res.status(400).json({ error: "Invalid signature" });
    }
    
    // Process the payment based on status
    if (callbackData.status === "1") {
      // Payment successful
      console.log(`Paysera payment successful for order ${callbackData.orderid}`);
      
      // Here you would typically:
      // 1. Update order status to paid
      // 2. Send confirmation emails
      // 3. Trigger fulfillment workflows
      
      // TODO: Implement order status update when integrated with Medusa
      
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

// Also handle GET requests (some callbacks come as GET with query parameters)
export async function GET(
  req: MedusaRequest,
  res: MedusaResponse
) {
  try {
    // For GET requests, callback data comes in query parameters
    const callbackData = req.query as unknown as PayseraCallbackData;
    
    console.log("Received Paysera GET callback:", callbackData);
    
    // Get Paysera payment service for validation
    const payseraService: PayseraPaymentService = req.scope.resolve(PAYSERA_PAYMENT_MODULE);
    
    // Validate callback signature
    if (!payseraService.validateCallback(callbackData)) {
      console.error("Invalid Paysera callback signature (GET)");
      return res.status(400).json({ error: "Invalid signature" });
    }
    
    // Process the payment based on status
    if (callbackData.status === "1") {
      console.log(`Paysera payment successful (GET) for order ${callbackData.orderid}`);
      res.status(200).send("OK");
    } else {
      console.log(`Paysera payment failed/canceled (GET) for order ${callbackData.orderid}`);
      res.status(200).send("OK");
    }

  } catch (error: any) {
    console.error("Paysera GET callback processing error:", error);
    res.status(500).json({
      error: "Failed to process Paysera GET callback",
      details: error.message
    });
  }
}