/**
 * Calibration API Service
 * Ready for backend integration - currently uses mock data
 */

import apiClient from './apiClient'
import { API_ENDPOINTS } from '../config/api'

/**
 * Submit calibration request
 * @param {Object} data - Calibration data to submit
 * @returns {Promise<Object>} Success response
 */
export const submitCalibration = async (data) => {
  try {
    const response = await apiClient.post(API_ENDPOINTS.CALIBRATION.SUBMIT, data)
    return {
      success: true,
      data: response.data,
      message: 'Calibration submitted successfully',
    }
  } catch (error) {
    console.error('Error submitting calibration:', error)
    return {
      success: false,
      error: error.response?.data || error.message,
      message: error.response?.data?.message || 'Failed to submit calibration',
    }
  }
}

/**
 * Fetch all calibration requests
 * @returns {Promise<Array>} Array of calibration requests
 */
export const fetchCalibrations = async () => {
  try {
    const response = await apiClient.get(API_ENDPOINTS.CALIBRATION.GET_ALL)
    return {
      success: true,
      data: response.data,
      calibrations: Array.isArray(response.data) ? response.data : response.data?.calibrations || [],
    }
  } catch (error) {
    console.error('Error fetching calibrations:', error)
    return {
      success: false,
      error: error.response?.data || error.message,
      calibrations: [],
      message: error.response?.data?.message || 'Failed to fetch calibrations',
    }
  }
}

/**
 * Get calibration by ID
 * @param {string} id - Calibration ID
 * @returns {Promise<Object>} Calibration data
 */
export const getCalibrationById = async (id) => {
  try {
    const response = await apiClient.get(API_ENDPOINTS.CALIBRATION.GET_BY_ID(id))
    return {
      success: true,
      data: response.data,
    }
  } catch (error) {
    console.error('Error fetching calibration:', error)
    return {
      success: false,
      error: error.response?.data || error.message,
      message: error.response?.data?.message || 'Failed to fetch calibration',
    }
  }
}

export default {
  submitCalibration,
  fetchCalibrations,
  getCalibrationById,
}

