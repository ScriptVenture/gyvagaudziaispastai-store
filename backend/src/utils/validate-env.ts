/**
 * Environment Variables Validation
 * Ensures all required environment variables are present before application starts
 */

export interface RequiredEnvVars {
  // Database
  DATABASE_URL: string;
  
  // Security
  JWT_SECRET: string;
  COOKIE_SECRET: string;
  
  // CORS
  STORE_CORS: string;
  ADMIN_CORS: string;
  AUTH_CORS: string;
  
  // Payment
  PAYSERA_PROJECT_ID: string;
  PAYSERA_SIGN_PASSWORD: string;
  
  // Application URLs
  MEDUSA_BACKEND_URL: string;
  FRONTEND_URL: string;
}

export interface OptionalEnvVars {
  // Redis (optional, falls back to in-memory)
  REDIS_URL?: string;
  
  // Shipping (optional for basic functionality)
  VENIPAK_API_KEY?: string;
  VENIPAK_USERNAME?: string;
  VENIPAK_PASSWORD?: string;
  
  // SSL
  DATABASE_SSL?: string;
  
  // Test mode
  PAYSERA_TEST_MODE?: string;
}

/**
 * Validates that all required environment variables are present
 * Throws error if any required variables are missing
 */
export function validateEnvironment(): RequiredEnvVars & OptionalEnvVars {
  // Skip validation during build if flag is set
  if (process.env.SKIP_ENV_VALIDATION === 'true') {
    console.log('⏭️  Skipping environment validation during build');
    return process.env as unknown as RequiredEnvVars & OptionalEnvVars;
  }

  const missing: string[] = [];
  
  // Check required variables
  const requiredVars: (keyof RequiredEnvVars)[] = [
    'DATABASE_URL',
    'JWT_SECRET', 
    'COOKIE_SECRET',
    'STORE_CORS',
    'ADMIN_CORS', 
    'AUTH_CORS',
    'PAYSERA_PROJECT_ID',
    'PAYSERA_SIGN_PASSWORD',
    'MEDUSA_BACKEND_URL',
    'FRONTEND_URL'
  ];
  
  requiredVars.forEach(varName => {
    if (!process.env[varName]) {
      missing.push(varName);
    }
  });
  
  // Security validation for production
  if (process.env.NODE_ENV === 'production') {
    // Ensure JWT/Cookie secrets are strong (at least 32 characters)
    if (process.env.JWT_SECRET && process.env.JWT_SECRET.length < 32) {
      throw new Error('JWT_SECRET must be at least 32 characters long in production');
    }
    
    if (process.env.COOKIE_SECRET && process.env.COOKIE_SECRET.length < 32) {
      throw new Error('COOKIE_SECRET must be at least 32 characters long in production');
    }
    
    // Ensure no development secrets in production
    const dangerousSecrets = ['supersecret', 'dev-jwt-secret', 'dev-cookie-secret'];
    dangerousSecrets.forEach(secret => {
      if (process.env.JWT_SECRET?.includes(secret) || process.env.COOKIE_SECRET?.includes(secret)) {
        throw new Error(`Production environment cannot use development secrets containing: ${secret}`);
      }
    });
  }
  
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
  
  console.log('✅ Environment validation successful');
  
  return process.env as unknown as RequiredEnvVars & OptionalEnvVars;
}

/**
 * Validates environment on startup and exports validated config
 * Skip validation during build phase
 */
let config: RequiredEnvVars & OptionalEnvVars;

if (process.env.SKIP_ENV_VALIDATION !== 'true') {
  try {
    config = validateEnvironment();
    console.log('✅ Environment validation passed');
  } catch (error) {
    console.error('❌ Environment validation failed:', error);
    throw error;
  }
} else {
  console.log('⏭️  Environment validation skipped during build');
  config = process.env as unknown as RequiredEnvVars & OptionalEnvVars;
}

export { config };