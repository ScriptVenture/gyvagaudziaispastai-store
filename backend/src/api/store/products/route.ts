import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { Logger } from "@medusajs/types";

export const GET = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  const logger: Logger = req.scope.resolve("logger");
  // Get query parameters
  const { limit = 50, offset = 0, category_id } = req.query

  try {
    // Query products from the database using the query builder
    const query = req.scope.resolve("query")
    
    // Build filters based on query parameters
    const filters: any = {
      status: "published"
    }
    
    // Add category filter if provided
    if (category_id) {
      filters.categories = {
        id: Array.isArray(category_id) ? category_id : [category_id]
      }
    }
    
    const { data: products, metadata } = await query.graph({
      entity: "product",
      fields: [
        "id",
        "title", 
        "description",
        "status",
        "thumbnail",
        "handle",
        "variants.*",
        "variants.prices.*",
        "images.*",
        "collection.*",
        "categories.*"
      ],
      filters,
      pagination: {
        skip: Number(offset),
        take: Number(limit)
      }
    })

    return res.json({
      products,
      count: metadata?.count || products.length,
      offset: Number(offset),
      limit: Number(limit)
    })

  } catch (error) {
    logger.error(`Error fetching products: ${error.message}`);
    return res.status(500).json({ 
      error: "Failed to fetch products",
      details: error.message 
    })
  }
}