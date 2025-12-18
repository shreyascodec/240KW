/**
 * Certification API Service
 * Ready for backend integration - currently uses mock data
 */

import apiClient from './apiClient'
import { API_ENDPOINTS } from '../config/api'

/**
 * Submit certification request
 * @param {Object} data - Certification data to submit
 * @returns {Promise<Object>} Success response
 */
export const submitCertification = async (data) => {
  try {
    const response = await apiClient.post(API_ENDPOINTS.CERTIFICATION.SUBMIT, data)
    return {
      success: true,
      data: response.data,
      message: 'Certification submitted successfully',
    }
  } catch (error) {
    console.error('Error submitting certification:', error)
    return {
      success: false,
      error: error.response?.data || error.message,
      message: error.response?.data?.message || 'Failed to submit certification',
    }
  }
}

/**
 * Fetch all certification requests
 * @returns {Promise<Array>} Array of certification requests
 */
export const fetchCertifications = async () => {
  try {
    const response = await apiClient.get(API_ENDPOINTS.CERTIFICATION.GET_ALL)
    return {
      success: true,
      data: response.data,
      certifications: Array.isArray(response.data) ? response.data : response.data?.certifications || [],
    }
  } catch (error) {
    console.error('Error fetching certifications:', error)
    return {
      success: false,
      error: error.response?.data || error.message,
      certifications: [],
      message: error.response?.data?.message || 'Failed to fetch certifications',
    }
  }
}

/**
 * Get certification by ID
 * @param {string} id - Certification ID
 * @returns {Promise<Object>} Certification data
 */
export const getCertificationById = async (id) => {
  try {
    const response = await apiClient.get(API_ENDPOINTS.CERTIFICATION.GET_BY_ID(id))
    return {
      success: true,
      data: response.data,
    }
  } catch (error) {
    console.error('Error fetching certification:', error)
    return {
      success: false,
      error: error.response?.data || error.message,
      message: error.response?.data?.message || 'Failed to fetch certification',
    }
  }
}

export default {
  submitCertification,
  fetchCertifications,
  getCertificationById,
}

