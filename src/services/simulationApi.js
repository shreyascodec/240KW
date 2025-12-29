/**
 * Simulation Flow API Service
 * Handles GET and POST requests for each step of the simulation flow
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'
const STORAGE_KEY = 'simulation_flow_data'

/**
 * Generate a unique session ID for this simulation flow
 */
const getSessionId = () => {
  let sessionId = sessionStorage.getItem('simulation_session_id')
  if (!sessionId) {
    sessionId = `simulation_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    sessionStorage.setItem('simulation_session_id', sessionId)
  }
  return sessionId
}

/**
 * GET data for a specific step
 */
export const getStepData = async (stepId) => {
  try {
    const sessionId = getSessionId()
    
    if (API_BASE_URL && API_BASE_URL !== 'http://localhost:3000/api') {
      const response = await fetch(`${API_BASE_URL}/simulation/step/${stepId}?sessionId=${sessionId}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      })
      if (response.ok) {
        const data = await response.json()
        return { success: true, data: data.stepData || {} }
      }
    }

    const storedData = localStorage.getItem(`${STORAGE_KEY}_${sessionId}`)
    if (storedData) {
      const allData = JSON.parse(storedData)
      return { success: true, data: allData[stepId] || {} }
    }
    return { success: true, data: {} }
  } catch (error) {
    console.error(`Error getting step data for ${stepId}:`, error)
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
 */
export const postStepData = async (stepId, stepData) => {
  try {
    const sessionId = getSessionId()
    
    if (API_BASE_URL && API_BASE_URL !== 'http://localhost:3000/api') {
      const response = await fetch(`${API_BASE_URL}/simulation/step/${stepId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId, stepId, stepData }),
      })
      if (response.ok) return { success: true }
    }

    const storedData = localStorage.getItem(`${STORAGE_KEY}_${sessionId}`)
    const allData = storedData ? JSON.parse(storedData) : {}
    allData[stepId] = stepData
    allData.lastUpdated = new Date().toISOString()
    localStorage.setItem(`${STORAGE_KEY}_${sessionId}`, JSON.stringify(allData))
    return { success: true }
  } catch (error) {
    console.error(`Error posting step data for ${stepId}:`, error)
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
 * POST all form data (for final submission)
 */
export const submitFormData = async (formData) => {
  try {
    const sessionId = getSessionId()
    
    if (API_BASE_URL && API_BASE_URL !== 'http://localhost:3000/api') {
      const response = await fetch(`${API_BASE_URL}/simulation/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId, formData }),
      })
      if (response.ok) {
        const result = await response.json()
        localStorage.removeItem(`${STORAGE_KEY}_${sessionId}`)
        return { success: true, data: result }
      }
    }

    console.log('Simulation form submitted:', formData)
    localStorage.removeItem(`${STORAGE_KEY}_${sessionId}`)
    return { success: true, data: { message: 'Simulation form submitted successfully' } }
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
  sessionStorage.removeItem('simulation_session_id')
}

