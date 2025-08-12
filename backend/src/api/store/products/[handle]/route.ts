import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

export const GET = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  const { handle } = req.params

  try {
    // Query product by handle using the query builder
    const query = req.scope.resolve("query")
    
    const { data: products } = await query.graph({
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
      filters: {
        handle: handle,
        status: "published"
      }
    })

    if (!products || products.length === 0) {
      return res.status(404).json({ 
        error: "Product not found" 
      })
    }

    return res.json({
      product: products[0]
    })

  } catch (error) {
    console.error("Error fetching product:", error)
    return res.status(500).json({ 
      error: "Failed to fetch product",
      details: error.message 
    })
  }
}
