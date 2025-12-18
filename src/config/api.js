/**
 * API Configuration
 * Centralized configuration for all API endpoints
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

export const API_ENDPOINTS = {
  // Equipment endpoints
  EQUIPMENT: {
    BASE: '/api/module1/equipment',
    GET_ALL: '/api/module1/equipment',
    GET_BY_ID: (id) => `/api/module1/equipment/${id}`,
    CREATE: '/api/module1/equipment',
    UPDATE: (id) => `/api/module1/equipment/${id}`,
    DELETE: (id) => `/api/module1/equipment/${id}`,
  },
  
  // Products endpoints (ready for future API integration)
  PRODUCTS: {
    BASE: '/api/module1/products',
    GET_ALL: '/api/module1/products',
    GET_BY_ID: (id) => `/api/module1/products/${id}`,
    CREATE: '/api/module1/products',
    UPDATE: (id) => `/api/module1/products/${id}`,
    DELETE: (id) => `/api/module1/products/${id}`,
  },
  
  // Orders endpoints (ready for future API integration)
  ORDERS: {
    BASE: '/api/module1/orders',
    GET_ALL: '/api/module1/orders',
    GET_BY_ID: (id) => `/api/module1/orders/${id}`,
    CREATE: '/api/module1/orders',
    UPDATE: (id) => `/api/module1/orders/${id}`,
    DELETE: (id) => `/api/module1/orders/${id}`,
  },
  
  // Messages endpoints (ready for future API integration)
  MESSAGES: {
    BASE: '/api/module1/messages',
    GET_ALL: '/api/module1/messages',
    GET_BY_ID: (id) => `/api/module1/messages/${id}`,
    CREATE: '/api/module1/messages',
    UPDATE: (id) => `/api/module1/messages/${id}`,
    DELETE: (id) => `/api/module1/messages/${id}`,
    MARK_READ: (id) => `/api/module1/messages/${id}/read`,
  },
  
  // Documents endpoints (ready for future API integration)
  DOCUMENTS: {
    BASE: '/api/module1/documents',
    GET_ALL: '/api/module1/documents',
    GET_BY_ID: (id) => `/api/module1/documents/${id}`,
    UPLOAD: '/api/module1/documents/upload',
    DELETE: (id) => `/api/module1/documents/${id}`,
  },
  
  // Simulation endpoints (ready for future API integration)
  SIMULATION: {
    BASE: '/api/module1/simulation',
    SUBMIT: '/api/module1/simulation',
    GET_ALL: '/api/module1/simulation',
    GET_BY_ID: (id) => `/api/module1/simulation/${id}`,
  },
  
  // Product Debugging endpoints (ready for future API integration)
  DEBUGGING: {
    BASE: '/api/module1/debugging',
    SUBMIT: '/api/module1/debugging',
    GET_ALL: '/api/module1/debugging',
    GET_BY_ID: (id) => `/api/module1/debugging/${id}`,
  },
  
  // Certification endpoints (ready for future API integration)
  CERTIFICATION: {
    BASE: '/api/module1/certification',
    SUBMIT: '/api/module1/certification',
    GET_ALL: '/api/module1/certification',
    GET_BY_ID: (id) => `/api/module1/certification/${id}`,
  },
  
  // Calibration endpoints (ready for future API integration)
  CALIBRATION: {
    BASE: '/api/module1/calibration',
    SUBMIT: '/api/module1/calibration',
    GET_ALL: '/api/module1/calibration',
    GET_BY_ID: (id) => `/api/module1/calibration/${id}`,
  },
}

export default {
  API_BASE_URL,
  API_ENDPOINTS,
}

