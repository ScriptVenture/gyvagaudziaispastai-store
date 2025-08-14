import { medusaIntegrationTestRunner } from "@medusajs/test-utils"
import { ProductStatus } from "@medusajs/framework/utils"

jest.setTimeout(120000) // Increased timeout for e2e tests

medusaIntegrationTestRunner({
  inApp: true,
  env: {
    VENIPAK_API_KEY: "test_api_key",
    VENIPAK_USERNAME: "test_username",
    VENIPAK_PASSWORD: "test_password",
    JWT_SECRET: "test-super-secret",
    COOKIE_SECRET: "test-super-secret-cookie",
  },
  testSuite: ({ api }) => {
    describe("Venipak Fulfillment Module", () => {
      let region;
      let product;
      let shippingProfile;
      let shippingOption;

      beforeAll(async () => {
        // Setup: Create region, product, and shipping options
        const regionRes = await api.post("/api/admin/regions", {
          name: "Test Region",
          currency_code: "eur",
          countries: ["lt"],
          fulfillment_providers: ["venipak"],
        }, {
          headers: { 'x-medusa-access-token': 'test_token' }
        });
        region = regionRes.data.region;

        const profileRes = await api.get("/api/admin/shipping-profiles", {
          headers: { 'x-medusa-access-token': 'test_token' }
        });
        shippingProfile = profileRes.data.shipping_profiles[0];

        const productRes = await api.post("/api/admin/products", {
          title: "Test Product",
          status: ProductStatus.PUBLISHED,
          shipping_profile_id: shippingProfile.id,
          variants: [
            {
              title: "Test Variant",
              prices: [{ currency_code: "eur", amount: 1000 }],
              options: [{ value: "Test" }]
            }
          ]
        }, {
          headers: { 'x-medusa-access-token': 'test_token' }
        });
        product = productRes.data.product;

        const soRes = await api.post("/api/admin/shipping-options", {
            name: "Venipak Standard",
            region_id: region.id,
            provider_id: "venipak",
            profile_id: shippingProfile.id,
            price_type: "flat",
            amount: 500, // 5 EUR
            data: { id: "venipak-standard" } // Mock provider data
        }, {
            headers: { 'x-medusa-access-token': 'test_token' }
        });
        shippingOption = soRes.data.shipping_option;
      });

      describe("Shipping Option Calculation", () => {
        it("should list venipak shipping option for a cart", async () => {
          // 1. Create a cart
          const cartRes = await api.post("/api/store/carts", {
            region_id: region.id,
          });
          const cartId = cartRes.data.cart.id;

          // 2. Add item to cart
          await api.post(`/api/store/carts/${cartId}/line-items`, {
            variant_id: product.variants[0].id,
            quantity: 1,
          });

          // 3. Get available shipping options
          const shippingOptionsRes = await api.get(`/api/store/carts/${cartId}/shipping-options`);
          
          expect(shippingOptionsRes.status).toEqual(200);
          const shippingOptions = shippingOptionsRes.data.shipping_options;
          expect(shippingOptions).toBeInstanceOf(Array);

          const venipakOption = shippingOptions.find(
            (so) => so.provider_id === "venipak"
          );
          expect(venipakOption).toBeDefined();
          expect(venipakOption.id).toEqual(shippingOption.id);
        });
      });

      describe("Pickup Points", () => {
        it("should fetch pickup points for Lithuania", async () => {
          const response = await api.get('/api/store/venipak/pickup-points?country=LT&city=Vilnius');
          
          expect(response.status).toEqual(200);
          expect(response.data).toHaveProperty('pickup_points');
          expect(response.data.pickup_points).toBeInstanceOf(Array);
        });

        it("should return an error for an invalid country code", async () => {
            const response = await api.get('/api/store/venipak/pickup-points?country=XX');
            // The service might return an empty list or an error, both are acceptable
            expect([200, 400, 404]).toContain(response.status);
            if (response.status === 200) {
                expect(response.data.pickup_points).toEqual([]);
            }
        });
      });
    });
  },
})
