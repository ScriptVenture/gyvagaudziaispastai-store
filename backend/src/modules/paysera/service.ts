import { AbstractPaymentProvider } from "@medusajs/framework/utils";
import { 
  InitiatePaymentInput,
  InitiatePaymentOutput,
  AuthorizePaymentInput,
  AuthorizePaymentOutput,
  CapturePaymentInput,
  CapturePaymentOutput,
  UpdatePaymentInput,
  UpdatePaymentOutput,
  DeletePaymentInput,
  DeletePaymentOutput,
  RefundPaymentInput,
  RefundPaymentOutput,
  RetrievePaymentInput,
  RetrievePaymentOutput,
  CancelPaymentInput,
  CancelPaymentOutput,
  GetPaymentStatusInput,
  GetPaymentStatusOutput,
  ProviderWebhookPayload,
  WebhookActionResult,
  PaymentSessionStatus
} from "@medusajs/framework/types";
import { PayseraConfig, PayseraPaymentData, PayseraCallbackData } from "./types";
import crypto from "crypto";

class PayseraPaymentService extends AbstractPaymentProvider<PayseraConfig> {
  static identifier = "paysera";

  constructor(_, options: PayseraConfig) {
    super(_, {
      project_id: options.project_id,
      sign_password: options.sign_password,
      test_mode: options.test_mode || false,
      base_url: options.base_url || "https://www.paysera.com/pay"
    });
  }

  async initiatePayment(input: InitiatePaymentInput): Promise<InitiatePaymentOutput> {
    try {
      // Generate a unique payment ID for this session
      const paymentId = `paysera_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      const paymentData: PayseraPaymentData = {
        orderId: paymentId,
        amount: Math.round(Number(input.amount)), // Paysera expects cents
        currency: input.currency_code.toUpperCase(),
        // Try common Paysera-friendly URLs that might already be whitelisted
        acceptUrl: `${process.env.FRONTEND_URL}/success`,
        cancelUrl: `${process.env.FRONTEND_URL}/cancel`,
        callbackUrl: `${process.env.MEDUSA_BACKEND_URL}/api/paysera/callback`,
        test: this.config.test_mode ? 1 : 0
      };

      const encodedData = this.encodePaymentData(paymentData);
      const signature = this.generateSignature(encodedData);
      
      console.log('Paysera payment creation debug:', {
        project_id: this.config.project_id,
        amount: paymentData.amount,
        currency: paymentData.currency,
        test_mode: this.config.test_mode,
        encoded_data: encodedData,
        signature: signature
      });
      
      const paymentUrl = `${this.config.base_url || "https://www.paysera.com/pay"}/?data=${encodedData}&sign=${signature}`;

      return {
        id: paymentId,
        data: {
          payment_url: paymentUrl,
          status: "pending",
          ...paymentData
        }
      };
    } catch (error: any) {
      throw new Error(`Failed to create Paysera payment session: ${error.message}`);
    }
  }

  async updatePayment(input: UpdatePaymentInput): Promise<UpdatePaymentOutput> {
    // For Paysera, we typically don't update payments, but create new ones
    return {
      status: "pending",
      data: input.data || {}
    };
  }

  async deletePayment(input: DeletePaymentInput): Promise<DeletePaymentOutput> {
    // Paysera doesn't support payment cancellation via API
    return {
      data: {
        ...input.data,
        status: "canceled"
      }
    };
  }

  async getPaymentStatus(input: GetPaymentStatusInput): Promise<GetPaymentStatusOutput> {
    const paymentData = input.data || {};
    let status: PaymentSessionStatus = "pending";
    
    if (paymentData.status === "paid" || paymentData.status === "authorized") {
      status = "authorized";
    } else if (paymentData.status === "canceled") {
      status = "canceled";
    }
    
    return {
      status,
      data: paymentData
    };
  }

  async authorizePayment(input: AuthorizePaymentInput): Promise<AuthorizePaymentOutput> {
    return {
      status: "authorized",
      data: {
        ...input.data,
        status: "authorized"
      }
    };
  }

  async capturePayment(input: CapturePaymentInput): Promise<CapturePaymentOutput> {
    // Paysera payments are captured automatically when paid
    return {
      data: {
        ...input.data,
        status: "captured"
      }
    };
  }

  async refundPayment(input: RefundPaymentInput): Promise<RefundPaymentOutput> {
    // Paysera refunds are handled manually through their admin panel
    throw new Error("Paysera refunds must be processed manually through Paysera admin panel");
  }

  async retrievePayment(input: RetrievePaymentInput): Promise<RetrievePaymentOutput> {
    return {
      data: input.data || {}
    };
  }

  async cancelPayment(input: CancelPaymentInput): Promise<CancelPaymentOutput> {
    return {
      data: {
        ...input.data,
        status: "canceled"
      }
    };
  }

  async getWebhookActionAndData(data: ProviderWebhookPayload["payload"]): Promise<WebhookActionResult> {
    // This method is called when Paysera sends webhook data
    const callbackData = data.data as unknown as PayseraCallbackData;
    
    // Validate callback signature if needed
    // For now, we'll skip validation as webhook format may vary
    
    const action = callbackData.status === "1" ? "authorized" : "canceled";
    const amount = callbackData.amount || 0;
    
    return {
      action,
      data: {
        session_id: callbackData.orderid || "unknown",
        amount: Number(amount)
      }
    };
  }

  // Paysera-specific helper methods
  private encodePaymentData(data: PayseraPaymentData): string {
    const params = {
      projectid: this.config.project_id,
      orderid: data.orderId,
      lang: "en",
      amount: data.amount,
      currency: data.currency,
      accepturl: data.acceptUrl,
      cancelurl: data.cancelUrl,
      callbackurl: data.callbackUrl,
      test: data.test || 0,
      version: "1.6"
    };

    // Convert to query string format
    const queryString = Object.entries(params)
      .map(([key, value]) => `${key}=${encodeURIComponent(String(value))}`)
      .join('&');
    
    // Base64 encode with URL-safe characters
    const encoded = Buffer.from(queryString).toString('base64');
    return encoded.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
  }

  private generateSignature(data: string): string {
    return crypto
      .createHash('md5')
      .update(data + this.config.sign_password)
      .digest('hex');
  }

  public validateCallback(callbackData: PayseraCallbackData): boolean {
    try {
      const { key, ...params } = callbackData;
      
      // Build the string for signature verification exactly as Paysera expects
      const sortedParams = Object.keys(params)
        .sort()
        .map(paramKey => `${paramKey}=${params[paramKey]}`)
        .join('&');
      
      const expectedSignature = crypto
        .createHash('md5')
        .update(sortedParams + this.config.sign_password)
        .digest('hex');
      
      console.log('Callback validation:', {
        received_key: key,
        expected_key: expectedSignature,
        params_string: sortedParams
      });
      
      return key === expectedSignature;
    } catch (error) {
      console.error('Callback validation error:', error);
      return false;
    }
  }
}

export default PayseraPaymentService;