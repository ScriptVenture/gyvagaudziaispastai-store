import { loadEnv, defineConfig } from '@medusajs/framework/utils'

loadEnv(process.env.NODE_ENV || 'development', process.cwd())

module.exports = defineConfig({
  projectConfig: {
    databaseUrl: process.env.DATABASE_URL,
    databaseDriverOptions: {
      ssl: process.env.DATABASE_SSL === "false" ? false : (process.env.NODE_ENV === "production" ? {
        rejectUnauthorized: false
      } : false),
    },
    redisUrl: process.env.REDIS_URL,
    http: {
      storeCors: process.env.STORE_CORS || "https://gyva.appiolabs.com",
      adminCors: process.env.ADMIN_CORS || "https://gyva.appiolabs.com",
      authCors: process.env.AUTH_CORS || "https://gyva.appiolabs.com",
      jwtSecret: process.env.JWT_SECRET || "supersecret",
      cookieSecret: process.env.COOKIE_SECRET || "supersecret",
      authMethodsPerActor: {
        user: ["session", "bearer", "emailpass"],
        customer: ["session", "bearer", "emailpass"]
      }
    }
  },
  admin: {
    backendUrl: process.env.MEDUSA_BACKEND_URL,
    path: "/app",
  },
  modules: [
    {
      resolve: "@medusajs/file",
      options: {
        providers: [
          {
            resolve: "@medusajs/file-local",
            id: "local",
            options: {
              upload_dir: "/server/static",
              backend_url: process.env.MEDUSA_BACKEND_URL || "https://gyva.appiolabs.com",
            },
          },
        ],
      },
    },
    {
      resolve: "@medusajs/auth",
      options: {
        providers: [
          {
            resolve: "@medusajs/auth-emailpass",
            id: "emailpass",
          },
        ],
      },
    },
    {
      resolve: "@medusajs/user",
      options: {
        jwt_secret: process.env.JWT_SECRET || "supersecret",
      },
    },
    {
      resolve: "@medusajs/payment",
      options: {
        providers: [
          {
            resolve: "./src/modules/paysera",
            id: "paysera",
            options: {
              project_id: process.env.PAYSERA_PROJECT_ID,
              sign_password: process.env.PAYSERA_SIGN_PASSWORD,
              test_mode: process.env.NODE_ENV !== "production",
            },
          },
        ],
      },
    },
    {
      resolve: "@medusajs/fulfillment",
      options: {
        providers: [
          {
            resolve: "@medusajs/fulfillment-manual",
            id: "manual",
          },
          {
            resolve: "./src/modules/venipak",
            id: "venipak",
            options: {
              api_key: process.env.VENIPAK_API_KEY || "",
              username: process.env.VENIPAK_USERNAME || "",
              password: process.env.VENIPAK_PASSWORD || "",
              test_mode: process.env.NODE_ENV !== "production",
              default_currency: "EUR"
            },
          },
        ],
      },
    },
  ]
})
