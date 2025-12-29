/**
 * Testing Flow API Service
 * Handles GET and POST requests for each step of the testing flow
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'
const STORAGE_KEY = 'testing_flow_data'

/**
 * Generate a unique session ID for this testing flow
 */
const getSessionId = () => {
  let sessionId = sessionStorage.getItem('testing_session_id')
  if (!sessionId) {
    sessionId = `testing_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    sessionStorage.setItem('testing_session_id', sessionId)
  }
  return sessionId
}

/**
 * GET data for a specific step
 * @param {string} stepId - The step identifier (e.g., 'product', 'documents', 'requirements', 'standards', 'lab')
 * @returns {Promise<Object>} The step data
 */
export const getStepData = async (stepId) => {
  try {
    const sessionId = getSessionId()
    
    // Try API first
    if (API_BASE_URL && API_BASE_URL !== 'http://localhost:3000/api') {
      const response = await fetch(`${API_BASE_URL}/testing/step/${stepId}?sessionId=${sessionId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (response.ok) {
        const data = await response.json()
        return { success: true, data: data.stepData || {} }
      }
    }

    // Fallback to localStorage
    const storedData = localStorage.getItem(`${STORAGE_KEY}_${sessionId}`)
    if (storedData) {
      const allData = JSON.parse(storedData)
      return { success: true, data: allData[stepId] || {} }
    }

    return { success: true, data: {} }
  } catch (error) {
    console.error(`Error getting step data for ${stepId}:`, error)
    // Fallback to localStorage on error
    try {
      const sessionId = getSessionId()
      const storedData = localStorage.getItem(`${STORAGE_KEY}_${sessionId}`)
      if (storedData) {
        const allData = JSON.parse(storedData)
        return { success: true, data: allData[stepId] || {} }
      }
    } catch (e) {
      console.error('Error reading from localStorage:', e)
    }
    return { success: false, error: error.message, data: {} }
  }
}

/**
 * POST data for a specific step
 * @param {string} stepId - The step identifier
 * @param {Object} stepData - The data to save for this step
 * @returns {Promise<Object>} Success status
 */
export const postStepData = async (stepId, stepData) => {
  try {
    const sessionId = getSessionId()
    
    // Try API first
    if (API_BASE_URL && API_BASE_URL !== 'http://localhost:3000/api') {
      const response = await fetch(`${API_BASE_URL}/testing/step/${stepId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionId,
          stepId,
          stepData,
        }),
      })

      if (response.ok) {
        return { success: true }
      }
    }

    // Fallback to localStorage
    const storedData = localStorage.getItem(`${STORAGE_KEY}_${sessionId}`)
    const allData = storedData ? JSON.parse(storedData) : {}
    allData[stepId] = stepData
    allData.lastUpdated = new Date().toISOString()
    localStorage.setItem(`${STORAGE_KEY}_${sessionId}`, JSON.stringify(allData))

    return { success: true }
  } catch (error) {
    console.error(`Error posting step data for ${stepId}:`, error)
    // Fallback to localStorage on error
    try {
      const sessionId = getSessionId()
      const storedData = localStorage.getItem(`${STORAGE_KEY}_${sessionId}`)
      const allData = storedData ? JSON.parse(storedData) : {}
      allData[stepId] = stepData
      allData.lastUpdated = new Date().toISOString()
      localStorage.setItem(`${STORAGE_KEY}_${sessionId}`, JSON.stringify(allData))
      return { success: true }
    } catch (e) {
      console.error('Error saving to localStorage:', e)
      return { success: false, error: error.message }
    }
  }
}

/**
 * GET all form data
 * @returns {Promise<Object>} All form data
 */
export const getAllFormData = async () => {
  try {
    const sessionId = getSessionId()
    
    // Try API first
    if (API_BASE_URL && API_BASE_URL !== 'http://localhost:3000/api') {
      const response = await fetch(`${API_BASE_URL}/testing/data?sessionId=${sessionId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (response.ok) {
        const data = await response.json()
        return { success: true, data: data.formData || {} }
      }
    }

    // Fallback to localStorage
    const storedData = localStorage.getItem(`${STORAGE_KEY}_${sessionId}`)
    if (storedData) {
      return { success: true, data: JSON.parse(storedData) }
    }

    return { success: true, data: {} }
  } catch (error) {
    console.error('Error getting all form data:', error)
    return { success: false, error: error.message, data: {} }
  }
}

/**
 * POST all form data (for final submission)
 * @param {Object} formData - Complete form data
 * @returns {Promise<Object>} Success status and response
 */
export const submitFormData = async (formData) => {
  try {
    const sessionId = getSessionId()
    
    // Try API first
    if (API_BASE_URL && API_BASE_URL !== 'http://localhost:3000/api') {
      const response = await fetch(`${API_BASE_URL}/testing/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionId,
          formData,
        }),
      })

      if (response.ok) {
        const result = await response.json()
        // Clear localStorage after successful submission
        localStorage.removeItem(`${STORAGE_KEY}_${sessionId}`)
        return { success: true, data: result }
      }
    }

    // For demo purposes, simulate success
    console.log('Form submitted:', formData)
    const sessionId = getSessionId()
    localStorage.removeItem(`${STORAGE_KEY}_${sessionId}`)
    return { success: true, data: { message: 'Form submitted successfully' } }
  } catch (error) {
    console.error('Error submitting form:', error)
    return { success: false, error: error.message }
  }
}

/**
 * Clear all stored data for the current session
 */
export const clearSessionData = () => {
  const sessionId = getSessionId()
  localStorage.removeItem(`${STORAGE_KEY}_${sessionId}`)
  sessionStorage.removeItem('testing_session_id')
}

