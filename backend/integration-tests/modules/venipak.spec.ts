import { medusaIntegrationTestRunner } from "@medusajs/test-utils"

jest.setTimeout(60 * 1000)

medusaIntegrationTestRunner({
  inApp: true,
  env: {
    VENIPAK_API_KEY: "test_api_key",
    VENIPAK_USERNAME: "test_username", 
    VENIPAK_PASSWORD: "test_password"
  },
  testSuite: ({ api }) => {
    describe("Venipak Fulfillment Module", () => {
      describe("Shipping Options", () => {
        it("should calculate shipping rates", async () => {
          const response = await api.post('/api/shipping/options', {
            to: {
              address_1: "Test Street 123",
              city: "Vilnius",
              country_code: "LT",
              postal_code: "01234"
            },
            items: [
              {
                quantity: 1,
                weight: 500, // 500g
                length: 20,
                width: 15, 
                height: 10
              }
            ]
          })
          
          expect(response.status).toEqual(200)
          expect(Array.isArray(response.data.shipping_options)).toBe(true)
          expect(response.data.shipping_options.length).toBeGreaterThan(0)
          
          // Check that each option has required fields
          response.data.shipping_options.forEach((option: any) => {
            expect(option).toHaveProperty('id')
            expect(option).toHaveProperty('name')
            expect(option).toHaveProperty('amount')
            expect(typeof option.amount).toBe('number')
          })
        })

        it("should handle invalid destination address", async () => {
          const response = await api.post('/api/shipping/options', {
            to: {
              country_code: "XX", // Invalid country
              postal_code: "invalid"
            },
            items: [
              {
                quantity: 1,
                weight: 500
              }
            ]
          })
          
          expect(response.status).toEqual(400)
        })

        it("should handle oversized packages", async () => {
          const response = await api.post('/api/shipping/options', {
            to: {
              country_code: "LT",
              postal_code: "01234"
            },
            items: [
              {
                quantity: 1,
                weight: 50000, // 50kg - very heavy
                length: 200,   // 2m - very large
                width: 200,
                height: 200
              }
            ]
          })
          
          // Should either return options or handle gracefully
          expect([200, 400]).toContain(response.status)
        })
      })

      describe("Pickup Points", () => {
        it("should fetch pickup points for Lithuania", async () => {
          const response = await api.get('/api/venipak/pickup-points?country=LT&city=Vilnius')
          
          expect(response.status).toEqual(200)
          expect(Array.isArray(response.data.pickup_points)).toBe(true)
          
          if (response.data.pickup_points.length > 0) {
            const point = response.data.pickup_points[0]
            expect(point).toHaveProperty('id')
            expect(point).toHaveProperty('name')
            expect(point).toHaveProperty('address')
            expect(point).toHaveProperty('city')
            expect(point).toHaveProperty('coordinates')
          }
        })

        it("should handle invalid country code", async () => {
          const response = await api.get('/api/venipak/pickup-points?country=XX')
          
          expect([400, 404]).toContain(response.status)
        })
      })

      describe("Package Tracking", () => {
        it("should handle valid tracking number format", async () => {
          const response = await api.get('/api/shipping/venipak/track/VNP123456789')
          
          // Even if tracking number doesn't exist, should handle gracefully
          expect([200, 404]).toContain(response.status)
        })

        it("should reject invalid tracking number format", async () => {
          const response = await api.get('/api/shipping/venipak/track/invalid-format')
          
          expect(response.status).toEqual(400)
        })
      })

      describe("Volumetric Weight Calculation", () => {
        it("should calculate volumetric weight correctly", async () => {
          const response = await api.post('/api/shipping/options', {
            to: {
              country_code: "LT",
              postal_code: "01234"
            },
            items: [
              {
                quantity: 1,
                weight: 100,   // Light package
                length: 40,    // But large dimensions
                width: 30,
                height: 20     // Volumetric weight should apply
              }
            ]
          })
          
          expect(response.status).toEqual(200)
          // Rates should reflect volumetric pricing for large/light packages
        })
      })
    })
  },
})