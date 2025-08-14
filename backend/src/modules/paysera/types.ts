export interface PayseraConfig {
  project_id: string;
  sign_password: string;
  test_mode?: boolean;
  base_url?: string;
}

export interface PayseraPaymentData {
  orderId: string;
  amount: number;
  currency: string;
  acceptUrl: string;
  cancelUrl: string;
  callbackUrl: string;
  test?: number;
}

export interface PayseraPaymentResponse {
  paymentUrl: string;
  orderid: string;
}

/**
 * Represents the raw, encoded data received from the Paysera callback.
 * The `data` property is a URL-safe base64 encoded string.
 */
export interface PayseraRawCallback {
  data: string;
  ss1: string;
  ss2?: string;
}

/**
 * Represents the decoded data from the `data` parameter of the callback.
 */
export interface PayseraCallbackData {
  projectid: string;
  orderid: string;
  lang: string;
  paytime: string;
  paystatus: string;
  paytype: string;
  paycurrency: string;
  version: string;
  status: string;
  // These fields are not part of the decoded data, but the raw callback
  // name: string;
  // surename: string;
  // paymentmethod: string;
  // personcode: string;
  // userid: string;
}