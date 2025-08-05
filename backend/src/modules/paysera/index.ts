import { ModuleProvider, Modules } from "@medusajs/framework/utils";
import PayseraPaymentService from "./service";

export const PAYSERA_PAYMENT_MODULE = "payseraPaymentService";

const services = [PayseraPaymentService];

export default ModuleProvider(Modules.PAYMENT, {
  services,
});

export * from "./types";