import apiClient from './apiClient'
import { API_ENDPOINTS } from '../config/api'

/**
 * Submit equipment data to the API
 * @param {Object} data - Equipment data to submit
 * @returns {Promise<Object>} Success response
 */
export const submitEquipment = async (data) => {
  try {
    const response = await apiClient.post(API_ENDPOINTS.EQUIPMENT.CREATE, data)
    return {
      success: true,
      data: response.data,
      message: 'Equipment submitted successfully',
    }
  } catch (error) {
    console.error('Error submitting equipment:', error)
    return {
      success: false,
      error: error.response?.data || error.message,
      message: error.response?.data?.message || 'Failed to submit equipment',
    }
  }
}

/**
 * Fetch equipment data from the API
 * @returns {Promise<Array>} Array of equipment items
 */
export const fetchEquipment = async () => {
  try {
    const response = await apiClient.get(API_ENDPOINTS.EQUIPMENT.GET_ALL)
    return {
      success: true,
      data: response.data,
      equipment: Array.isArray(response.data) ? response.data : response.data?.equipment || [],
    }
  } catch (error) {
    console.error('Error fetching equipment:', error)
    return {
      success: false,
      error: error.response?.data || error.message,
      equipment: [],
      message: error.response?.data?.message || 'Failed to fetch equipment',
    }
  }
}

/**
 * Update equipment data
 * @param {string} id - Equipment ID
 * @param {Object} data - Updated equipment data
 * @returns {Promise<Object>} Success response
 */
export const updateEquipment = async (id, data) => {
  try {
    const response = await apiClient.put(API_ENDPOINTS.EQUIPMENT.UPDATE(id), data)
    return {
      success: true,
      data: response.data,
      message: 'Equipment updated successfully',
    }
  } catch (error) {
    console.error('Error updating equipment:', error)
    return {
      success: false,
      error: error.response?.data || error.message,
      message: error.response?.data?.message || 'Failed to update equipment',
    }
  }
}

/**
 * Delete equipment
 * @param {string} id - Equipment ID
 * @returns {Promise<Object>} Success response
 */
export const deleteEquipment = async (id) => {
  try {
    const response = await apiClient.delete(API_ENDPOINTS.EQUIPMENT.DELETE(id))
    return {
      success: true,
      data: response.data,
      message: 'Equipment deleted successfully',
    }
  } catch (error) {
    console.error('Error deleting equipment:', error)
    return {
      success: false,
      error: error.response?.data || error.message,
      message: error.response?.data?.message || 'Failed to delete equipment',
    }
  }
}

/**
 * Get single equipment by ID
 * @param {string} id - Equipment ID
 * @returns {Promise<Object>} Equipment data
 */
export const getEquipmentById = async (id) => {
  try {
    const response = await apiClient.get(API_ENDPOINTS.EQUIPMENT.GET_BY_ID(id))
    return {
      success: true,
      data: response.data,
    }
  } catch (error) {
    console.error('Error fetching equipment by ID:', error)
    return {
      success: false,
      error: error.response?.data || error.message,
      message: error.response?.data?.message || 'Failed to fetch equipment',
    }
  }
}

export default {
  submitEquipment,
  fetchEquipment,
  updateEquipment,
  deleteEquipment,
  getEquipmentById,
}

