import { medusaIntegrationTestRunner } from "@medusajs/test-utils"

jest.setTimeout(60 * 1000)

medusaIntegrationTestRunner({
  inApp: true,
  env: {
    PAYSERA_PROJECT_ID: "test_project_id",
    PAYSERA_SIGN_PASSWORD: "test_sign_password",
    PAYSERA_TEST_MODE: "true"
  },
  testSuite: ({ api }) => {
    describe("Paysera Payment Module", () => {
      describe("Payment Creation", () => {
        it("should create a payment session", async () => {
          const response = await api.post('/api/paysera/create-payment', {
            amount: 2000,
            currency: "EUR", 
            order_id: "test_order_123",
            customer_email: "test@example.com",
            return_url: "http://localhost:3000/success",
            cancel_url: "http://localhost:3000/cancel"
          })
          
          expect(response.status).toEqual(200)
          expect(response.data).toHaveProperty('payment_url')
          expect(response.data.payment_url).toContain('paysera.com')
        })

        it("should validate required payment data", async () => {
          const response = await api.post('/api/paysera/create-payment', {
            // Missing required fields
          })
          
          expect(response.status).toEqual(400)
        })

        it("should handle invalid amount", async () => {
          const response = await api.post('/api/paysera/create-payment', {
            amount: -100, // Invalid negative amount
            currency: "EUR", 
            order_id: "test_order_123",
            customer_email: "test@example.com"
          })
          
          expect(response.status).toEqual(400)
        })
      })

      describe("Payment Callbacks", () => {
        it("should handle successful payment callback", async () => {
          const callbackData = {
            projectid: "test_project_id",
            orderid: "test_order_123",
            amount: "2000",
            currency: "EUR",
            payment: "hanzabank",
            country: "LT",
            paytext: "Test payment",
            status: "1", // Success status
            sign: "valid_signature"
          }

          const response = await api.post('/api/paysera/callback', callbackData)
          expect(response.status).toEqual(200)
        })

        it("should reject callback with invalid signature", async () => {
          const callbackData = {
            projectid: "test_project_id",
            orderid: "test_order_123",
            amount: "2000",
            currency: "EUR", 
            status: "1",
            sign: "invalid_signature"
          }

          const response = await api.post('/api/paysera/callback', callbackData)
          expect(response.status).toEqual(400)
        })

        it("should handle cancelled payment callback", async () => {
          const callbackData = {
            projectid: "test_project_id",
            orderid: "test_order_123", 
            status: "0", // Cancelled status
            sign: "valid_signature"
          }

          const response = await api.post('/api/paysera/callback', callbackData)
          expect(response.status).toEqual(200)
        })
      })
    })
  },
})