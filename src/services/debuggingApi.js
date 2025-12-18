/**
 * Product Debugging API Service
 * Ready for backend integration - currently uses mock data
 */

import apiClient from './apiClient'
import { API_ENDPOINTS } from '../config/api'

/**
 * Submit debugging request
 * @param {Object} data - Debugging data to submit
 * @returns {Promise<Object>} Success response
 */
export const submitDebugging = async (data) => {
  try {
    const response = await apiClient.post(API_ENDPOINTS.DEBUGGING.SUBMIT, data)
    return {
      success: true,
      data: response.data,
      message: 'Debugging request submitted successfully',
    }
  } catch (error) {
    console.error('Error submitting debugging request:', error)
    return {
      success: false,
      error: error.response?.data || error.message,
      message: error.response?.data?.message || 'Failed to submit debugging request',
    }
  }
}

/**
 * Fetch all debugging requests
 * @returns {Promise<Array>} Array of debugging requests
 */
export const fetchDebuggingRequests = async () => {
  try {
    const response = await apiClient.get(API_ENDPOINTS.DEBUGGING.GET_ALL)
    return {
      success: true,
      data: response.data,
      requests: Array.isArray(response.data) ? response.data : response.data?.requests || [],
    }
  } catch (error) {
    console.error('Error fetching debugging requests:', error)
    return {
      success: false,
      error: error.response?.data || error.message,
      requests: [],
      message: error.response?.data?.message || 'Failed to fetch debugging requests',
    }
  }
}

/**
 * Get debugging request by ID
 * @param {string} id - Debugging request ID
 * @returns {Promise<Object>} Debugging request data
 */
export const getDebuggingById = async (id) => {
  try {
    const response = await apiClient.get(API_ENDPOINTS.DEBUGGING.GET_BY_ID(id))
    return {
      success: true,
      data: response.data,
    }
  } catch (error) {
    console.error('Error fetching debugging request:', error)
    return {
      success: false,
      error: error.response?.data || error.message,
      message: error.response?.data?.message || 'Failed to fetch debugging request',
    }
  }
}

export default {
  submitDebugging,
  fetchDebuggingRequests,
  getDebuggingById,
}

