import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { PayseraCallbackData, PayseraRawCallback } from "../../../modules/paysera/types";
import PayseraPaymentService from "../../../modules/paysera/service";
import { PAYSERA_PAYMENT_MODULE } from "../../../modules/paysera";
import { parse } from "querystring";

async function handleCallback(
  req: MedusaRequest,
  res: MedusaResponse,
  // ... existing code ...
  rawCallback: PayseraRawCallback
) {
  const logger = req.scope.resolve("logger");

  try {
    logger.info(`Received Paysera callback: ${JSON.stringify(rawCallback)}`);

    const payseraService: PayseraPaymentService = req.scope.resolve(PAYSERA_PAYMENT_MODULE);

    // 1. Validate the callback signature
    if (!payseraService.validateCallback(rawCallback)) {
      logger.error("Invalid Paysera callback signature");
      return res.status(400).json({ error: "Invalid signature" });
    }

    // 2. Decode the 'data' parameter
    const decodedData = Buffer.from(
      rawCallback.data.replace(/-/g, '+').replace(/_/g, '/'),
      'base64'
    ).toString('utf-8');
    
    const callbackData = parse(decodedData) as unknown as PayseraCallbackData;
    logger.info(`Decoded callback data: ${JSON.stringify(callbackData)}`);

    // 3. Process the payment based on status
    if (callbackData.status === "1") {
      logger.info(`Paysera payment successful for order ${callbackData.orderid}`);
      // TODO: Implement order status update logic here
      // This is where you would use the Medusa manager to update the order
    } else {
      logger.warn(`Paysera payment failed/canceled for order ${callbackData.orderid}`);
      // TODO: Implement order cancellation logic here
    }

    // 4. Respond to Paysera
    res.status(200).send("OK");

  } catch (error: any) {
    logger.error(`Paysera callback processing error: ${error.message}`);
    res.status(500).json({
      error: "Failed to process Paysera callback",
      details: error.message
    });
  }
}

export async function POST(
  req: MedusaRequest,
  res: MedusaResponse
) {
  // Paysera sends callbacks with content-type 'application/x-www-form-urlencoded'
  const rawCallback = req.body as unknown as PayseraRawCallback;
  await handleCallback(req, res, rawCallback);
}

export async function GET(
  req: MedusaRequest,
  res: MedusaResponse
) {
  // For GET requests, data is in query parameters
  const rawCallback = req.query as unknown as PayseraRawCallback;
  await handleCallback(req, res, rawCallback);
}