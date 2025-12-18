/**
 * Simulation API Service
 * Ready for backend integration - currently uses mock data
 */

import apiClient from './apiClient'
import { API_ENDPOINTS } from '../config/api'

/**
 * Submit simulation request
 * @param {Object} data - Simulation data to submit
 * @returns {Promise<Object>} Success response
 */
export const submitSimulation = async (data) => {
  try {
    const response = await apiClient.post(API_ENDPOINTS.SIMULATION.SUBMIT, data)
    return {
      success: true,
      data: response.data,
      message: 'Simulation submitted successfully',
    }
  } catch (error) {
    console.error('Error submitting simulation:', error)
    return {
      success: false,
      error: error.response?.data || error.message,
      message: error.response?.data?.message || 'Failed to submit simulation',
    }
  }
}

/**
 * Fetch all simulation requests
 * @returns {Promise<Array>} Array of simulation requests
 */
export const fetchSimulations = async () => {
  try {
    const response = await apiClient.get(API_ENDPOINTS.SIMULATION.GET_ALL)
    return {
      success: true,
      data: response.data,
      simulations: Array.isArray(response.data) ? response.data : response.data?.simulations || [],
    }
  } catch (error) {
    console.error('Error fetching simulations:', error)
    return {
      success: false,
      error: error.response?.data || error.message,
      simulations: [],
      message: error.response?.data?.message || 'Failed to fetch simulations',
    }
  }
}

/**
 * Get simulation by ID
 * @param {string} id - Simulation ID
 * @returns {Promise<Object>} Simulation data
 */
export const getSimulationById = async (id) => {
  try {
    const response = await apiClient.get(API_ENDPOINTS.SIMULATION.GET_BY_ID(id))
    return {
      success: true,
      data: response.data,
    }
  } catch (error) {
    console.error('Error fetching simulation:', error)
    return {
      success: false,
      error: error.response?.data || error.message,
      message: error.response?.data?.message || 'Failed to fetch simulation',
    }
  }
}

export default {
  submitSimulation,
  fetchSimulations,
  getSimulationById,
}

