import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { Logger } from "@medusajs/types";

export const GET = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  const logger: Logger = req.scope.resolve("logger");
  try {
    // Query product categories from the database using the query builder
    const query = req.scope.resolve("query")
    
    const { data: categories } = await query.graph({
      entity: "product_category",
      fields: [
        "id",
        "name",
        "description",
        "handle",
        "parent_category_id",
        "rank",
        "is_active",
        "is_internal"
      ],
      filters: {
        is_active: true,
        is_internal: false
      }
    })

    return res.json({
      product_categories: categories
    })

  } catch (error) {
    logger.error(`Error fetching categories: ${error.message}`);
    return res.status(500).json({ 
      error: "Failed to fetch categories",
      details: error.message 
    })
  }
}
