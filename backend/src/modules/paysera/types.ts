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

export interface PayseraCallbackData {
  projectid: string;
  orderid: string;
  lang: string;
  amount: string;
  currency: string;
  payment: string;
  country: string;
  paytext: string;
  p_firstname?: string;
  p_lastname?: string;
  p_email?: string;
  p_street?: string;
  p_city?: string;
  p_state?: string;
  p_zip?: string;
  p_countrycode?: string;
  test: string;
  requestid: string;
  payamount: string;
  paycurrency: string;
  version: string;
  status: string;
  name: string;
  surename: string;
  paymentmethod: string;
  personcode: string;
  userid: string;
  ss1?: string;
  ss2?: string;
  key: string;
}