import { ModuleProvider, Modules } from "@medusajs/framework/utils";
import VenipakFulfillmentProvider from "./service";

export const VENIPAK_FULFILLMENT_MODULE = "venipakFulfillmentProvider";

const services = [VenipakFulfillmentProvider];

export default ModuleProvider(Modules.FULFILLMENT, {
  services,
});

export * from "./types";