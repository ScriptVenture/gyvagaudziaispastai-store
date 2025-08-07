import type { 
  MedusaRequest, 
  MedusaResponse,
} from "@medusajs/framework/http"

export const GET = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  try {
    // Get the Venipak service
    const fulfillmentModuleService = req.scope.resolve("fulfillment")
    
    // Try to get Venipak provider
    const providers = await fulfillmentModuleService.listFulfillmentProviders({})
    
    const venipakProvider = providers.find(p => p.id === "venipak_venipak")
    
    if (!venipakProvider) {
      return res.json({
        success: false,
        error: "Venipak provider not found or not enabled"
      })
    }

    // For now, return basic info
    return res.json({
      success: true,
      provider_found: true,
      provider_id: venipakProvider.id,
      message: "Venipak provider is available"
    })

  } catch (error: any) {
    console.error("Venipak test error:", error)
    return res.status(500).json({
      success: false,
      error: error.message
    })
  }
}