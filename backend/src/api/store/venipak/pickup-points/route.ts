import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { Logger } from "@medusajs/types";
import { VenipakPickupPointsRequest } from "../../../../modules/venipak/types";
import VenipakFulfillmentProvider from "../../../../modules/venipak/service";

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const logger: Logger = req.scope.resolve("logger");
  try {
    logger.info("🏪 Venipak pickup points endpoint called");
    
    const { 
      country = 'LT', 
      city, 
      postal_code, 
      type = 'all',
      limit = '50'
    } = req.query as Record<string, string>;
    
    const pickupPointParams: VenipakPickupPointsRequest = {
      country,
      city,
      postal_code,
      type: type as any, // Cast to any to avoid type error
      limit: parseInt(limit, 10)
    };

    logger.info(`Pickup points request params: ${JSON.stringify(pickupPointParams)}`);

    try {
      const venipakService = req.scope.resolve<VenipakFulfillmentProvider>("venipakFulfillmentProvider");
      
      const pickupPointsResponse = await venipakService.getPickupPoints(pickupPointParams);
      
      if (!pickupPointsResponse.success) {
        logger.warn(`Failed to get pickup points from Venipak service: ${pickupPointsResponse.error}`);
        return res.status(500).json(pickupPointsResponse);
      }

      logger.info(
        `Successfully fetched pickup points, count: ${pickupPointsResponse.pickup_points?.length || 0}`
      );

      return res.json({
        ...pickupPointsResponse,
        filters: pickupPointParams
      });
      
    } catch (providerError: any) {
      logger.error(`Error resolving or calling Venipak provider: ${providerError.message}`);
      
      return res.status(500).json({
        success: false,
        error: "Internal server error while fetching pickup points.",
        pickup_points: [],
        total_count: 0
      });
    }

  } catch (error: any) {
    logger.error(`Venipak pickup points endpoint error: ${error.message}`);
    return res.status(500).json({
      success: false,
      error: "An unexpected error occurred.",
      pickup_points: [],
      total_count: 0
    });
  }
}