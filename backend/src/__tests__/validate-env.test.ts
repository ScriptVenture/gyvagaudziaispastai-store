/**
 * Unit tests for environment validation
 */

describe('Environment Validation', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    // Reset modules to get fresh imports
    jest.resetModules();
    
    // Clear environment
    process.env = { ...originalEnv };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  describe('validateEnvironment', () => {
    it('should pass with all required environment variables', () => {
      // Set all required variables
      process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/test';
      process.env.JWT_SECRET = 'test-jwt-secret-with-sufficient-length-32-chars';
      process.env.COOKIE_SECRET = 'test-cookie-secret-with-sufficient-length-32-chars';
      process.env.STORE_CORS = 'http://localhost:3000';
      process.env.ADMIN_CORS = 'http://localhost:9000';
      process.env.AUTH_CORS = 'http://localhost:3000';
      process.env.PAYSERA_PROJECT_ID = 'test_project_id';
      process.env.PAYSERA_SIGN_PASSWORD = 'test_sign_password';
      process.env.MEDUSA_BACKEND_URL = 'http://localhost:9000';
      process.env.FRONTEND_URL = 'http://localhost:3000';

      const { validateEnvironment } = require('../utils/validate-env');
      
      expect(() => validateEnvironment()).not.toThrow();
    });

    it('should throw error when required variables are missing', () => {
      const { validateEnvironment } = require('../utils/validate-env');
      
      expect(() => validateEnvironment()).toThrow('Missing required environment variables');
    });

    it('should throw error for weak JWT secret in production', () => {
      process.env.NODE_ENV = 'production';
      process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/test';
      process.env.JWT_SECRET = 'weak'; // Too short
      process.env.COOKIE_SECRET = 'test-cookie-secret-with-sufficient-length-32-chars';
      process.env.STORE_CORS = 'https://yourdomain.com';
      process.env.ADMIN_CORS = 'https://admin.yourdomain.com';
      process.env.AUTH_CORS = 'https://yourdomain.com';
      process.env.PAYSERA_PROJECT_ID = 'prod_project_id';
      process.env.PAYSERA_SIGN_PASSWORD = 'prod_sign_password';
      process.env.MEDUSA_BACKEND_URL = 'https://api.yourdomain.com';
      process.env.FRONTEND_URL = 'https://yourdomain.com';

      const { validateEnvironment } = require('../utils/validate-env');
      
      expect(() => validateEnvironment()).toThrow('JWT_SECRET must be at least 32 characters long');
    });

    it('should throw error for development secrets in production', () => {
      process.env.NODE_ENV = 'production';
      process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/test';
      process.env.JWT_SECRET = 'dev-jwt-secret-change-for-production-use-256-bits'; // Contains 'dev'
      process.env.COOKIE_SECRET = 'test-cookie-secret-with-sufficient-length-32-chars';
      process.env.STORE_CORS = 'https://yourdomain.com';
      process.env.ADMIN_CORS = 'https://admin.yourdomain.com';
      process.env.AUTH_CORS = 'https://yourdomain.com';
      process.env.PAYSERA_PROJECT_ID = 'prod_project_id';
      process.env.PAYSERA_SIGN_PASSWORD = 'prod_sign_password';
      process.env.MEDUSA_BACKEND_URL = 'https://api.yourdomain.com';
      process.env.FRONTEND_URL = 'https://yourdomain.com';

      const { validateEnvironment } = require('../utils/validate-env');
      
      expect(() => validateEnvironment()).toThrow('Production environment cannot use development secrets');
    });

    it('should allow optional variables to be missing', () => {
      // Set only required variables
      process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/test';
      process.env.JWT_SECRET = 'test-jwt-secret-with-sufficient-length-32-chars';
      process.env.COOKIE_SECRET = 'test-cookie-secret-with-sufficient-length-32-chars';
      process.env.STORE_CORS = 'http://localhost:3000';
      process.env.ADMIN_CORS = 'http://localhost:9000';
      process.env.AUTH_CORS = 'http://localhost:3000';
      process.env.PAYSERA_PROJECT_ID = 'test_project_id';
      process.env.PAYSERA_SIGN_PASSWORD = 'test_sign_password';
      process.env.MEDUSA_BACKEND_URL = 'http://localhost:9000';
      process.env.FRONTEND_URL = 'http://localhost:3000';

      // Don't set optional variables like REDIS_URL, VENIPAK_API_KEY, etc.
      
      const { validateEnvironment } = require('../utils/validate-env');
      
      expect(() => validateEnvironment()).not.toThrow();
    });
  });
});