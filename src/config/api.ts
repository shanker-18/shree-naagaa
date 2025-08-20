// API Configuration
// Always use relative paths for API calls to avoid CORS issues and hardcoded URLs
const getApiBaseUrl = () => {
  // Check if we have an explicit environment variable
  if (import.meta.env.VITE_API_BASE_URL) {
    return import.meta.env.VITE_API_BASE_URL;
  }
  
  // In production or when deployed, use relative paths
  if (import.meta.env.PROD || typeof window !== 'undefined' && window.location.hostname !== 'localhost') {
    // Use current origin for deployed versions
    return typeof window !== 'undefined' ? window.location.origin : '';
  }
  
  // Development fallback
  return 'http://localhost:5001';
};

const API_BASE_URL = getApiBaseUrl();

export const API_ENDPOINTS = {
  BASE: API_BASE_URL,
  ORDERS: `${API_BASE_URL}/api/orders`,
  HEALTH: `${API_BASE_URL}/api`
};

// For development and debugging
console.log('API Configuration:', {
  mode: import.meta.env.MODE,
  prod: import.meta.env.PROD,
  hostname: typeof window !== 'undefined' ? window.location.hostname : 'server',
  baseUrl: API_BASE_URL,
  endpoints: API_ENDPOINTS
});
