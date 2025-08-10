import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

export const GET = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  // Get query parameters
  const { limit = 50, offset = 0 } = req.query

  try {
    // Query products from the database using the query builder
    const query = req.scope.resolve("query")
    
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
        "collection.*"
      ],
      filters: {
        status: "published"
      },
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
    console.error("Error fetching products:", error)
    return res.status(500).json({ 
      error: "Failed to fetch products",
      details: error.message 
    })
  }
}