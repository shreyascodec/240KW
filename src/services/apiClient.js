/**
 * Base API Client
 * Centralized axios instance for all API calls
 */

import axios from 'axios'
import { API_BASE_URL } from '../config/api'

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 seconds timeout
})

// Request interceptor for adding auth tokens
apiClient.interceptors.request.use(
  (config) => {
    // Try to get token from various possible storage keys
    const token = 
      localStorage.getItem('accessToken') || 
      localStorage.getItem('labManagementAccessToken') ||
      localStorage.getItem('authToken') ||
      sessionStorage.getItem('accessToken')
    
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`
    }
    
    // Add request timestamp for debugging
    config.metadata = { startTime: new Date() }
    
    return config
  },
  (error) => {
    console.error('Request interceptor error:', error)
    return Promise.reject(error)
  }
)

// Response interceptor for handling errors and logging
apiClient.interceptors.response.use(
  (response) => {
    // Log successful requests in development
    if (import.meta.env.DEV) {
      const duration = new Date() - response.config.metadata?.startTime
      console.log(`✅ ${response.config.method?.toUpperCase()} ${response.config.url} (${duration}ms)`)
    }
    return response
  },
  async (error) => {
    const duration = error.config?.metadata?.startTime 
      ? new Date() - error.config.metadata.startTime 
      : 0
    
    // Log errors in development
    if (import.meta.env.DEV) {
      console.error(
        `❌ ${error.config?.method?.toUpperCase()} ${error.config?.url} (${duration}ms)`,
        error.response?.data || error.message
      )
    }
    
    // Handle specific error cases
    if (error.response) {
      switch (error.response.status) {
        case 401:
          // Unauthorized - clear tokens and potentially redirect
          localStorage.removeItem('accessToken')
          localStorage.removeItem('labManagementAccessToken')
          localStorage.removeItem('authToken')
          sessionStorage.removeItem('accessToken')
          // Optionally redirect to login
          // window.location.href = '/login'
          break
        case 403:
          // Forbidden
          console.error('Access forbidden')
          break
        case 404:
          // Not found
          console.error('Resource not found')
          break
        case 500:
          // Server error
          console.error('Server error')
          break
        default:
          break
      }
    } else if (error.request) {
      // Request was made but no response received
      console.error('No response received from server')
    } else {
      // Error in request setup
      console.error('Error setting up request:', error.message)
    }
    
    return Promise.reject(error)
  }
)

export default apiClient

