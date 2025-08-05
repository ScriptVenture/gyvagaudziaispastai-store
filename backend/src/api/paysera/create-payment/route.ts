import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import PayseraPaymentService from "../../../modules/paysera/service";
import { PAYSERA_PAYMENT_MODULE } from "../../../modules/paysera";

type CreatePayseraPaymentBody = {
  orderId: string;
  amount: number;
  currency: string;
  acceptUrl: string;
  cancelUrl: string;
  callbackUrl: string;
};

export async function POST(
  req: MedusaRequest,
  res: MedusaResponse
) {
  const { orderId, amount, currency, acceptUrl, cancelUrl, callbackUrl } = req.body as CreatePayseraPaymentBody;

  if (!orderId || !amount || !currency) {
    return res.status(400).json({
      error: "Missing required parameters: orderId, amount, currency"
    });
  }

  try {
    // Get Paysera payment service
    const payseraService: PayseraPaymentService = req.scope.resolve(PAYSERA_PAYMENT_MODULE);
    
    // Create payment session
    const result = await payseraService.initiatePayment({
      amount: Math.round(amount * 100), // Convert to cents
      currency_code: currency,
      context: {},
      data: {}
    });

    res.json({
      paymentUrl: result.data?.payment_url,
      orderId: orderId,
      paymentId: result.id,
      sessionData: result.data
    });

  } catch (error: any) {
    console.error("Paysera payment creation error:", error);
    res.status(500).json({
      error: "Failed to create Paysera payment",
      details: error.message
    });
  }
}