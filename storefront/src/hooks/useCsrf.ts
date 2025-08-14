import { useState, useEffect } from 'react';

interface CsrfData {
  token: string | null;
  sessionId: string | null;
  loading: boolean;
  error: string | null;
}

export function useCsrf() {
  const [csrfData, setCsrfData] = useState<CsrfData>({
    token: null,
    sessionId: null,
    loading: false,
    error: null
  });

  // Fetch CSRF token on mount
  useEffect(() => {
    fetchCsrfToken();
  }, []);

  const fetchCsrfToken = async () => {
    setCsrfData(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const response = await fetch('/api/csrf', {
        method: 'GET',
        credentials: 'include', // Important for cookies
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch CSRF token');
      }
      
      const data = await response.json();
      
      setCsrfData({
        token: data.csrfToken,
        sessionId: data.sessionId,
        loading: false,
        error: null
      });
      
      // Store token in session storage as backup
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('csrf-token', data.csrfToken);
      }
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch CSRF token';
      setCsrfData({
        token: null,
        sessionId: null,
        loading: false,
        error: errorMessage
      });
    }
  };

  const validateCsrfToken = async (token: string): Promise<boolean> => {
    try {
      const response = await fetch('/api/csrf', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ csrfToken: token })
      });
      
      if (!response.ok) {
        return false;
      }
      
      const data = await response.json();
      return data.valid === true;
      
    } catch (error) {
      console.error('CSRF validation error:', error);
      return false;
    }
  };

  // Get CSRF headers for API requests
  const getCsrfHeaders = () => {
    if (!csrfData.token) {
      // Try to get from session storage as fallback
      const storedToken = typeof window !== 'undefined' ? 
        sessionStorage.getItem('csrf-token') : null;
      
      if (storedToken) {
        return {
          'X-CSRF-Token': storedToken
        };
      }
      
      return {};
    }
    
    return {
      'X-CSRF-Token': csrfData.token
    };
  };

  // Refresh token if needed
  const refreshToken = async () => {
    await fetchCsrfToken();
  };

  return {
    csrfToken: csrfData.token,
    sessionId: csrfData.sessionId,
    loading: csrfData.loading,
    error: csrfData.error,
    getCsrfHeaders,
    validateCsrfToken,
    refreshToken
  };
}

// Higher-order function to add CSRF protection to fetch requests
export function fetchWithCsrf(url: string, options: RequestInit = {}) {
  // Get CSRF token from session storage
  const csrfToken = typeof window !== 'undefined' ? 
    sessionStorage.getItem('csrf-token') : null;
  
  const headers = {
    ...options.headers,
    ...(csrfToken ? { 'X-CSRF-Token': csrfToken } : {})
  };
  
  return fetch(url, {
    ...options,
    headers,
    credentials: 'include' // Always include credentials for CSRF
  });
}
