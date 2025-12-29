/**
 * Certification Flow API Service
 * Handles GET and POST requests for each step of the certification flow
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'
const STORAGE_KEY = 'certification_flow_data'

const getSessionId = () => {
  let sessionId = sessionStorage.getItem('certification_session_id')
  if (!sessionId) {
    sessionId = `certification_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    sessionStorage.setItem('certification_session_id', sessionId)
  }
  return sessionId
}

export const getStepData = async (stepId) => {
  try {
    const sessionId = getSessionId()
    
    if (API_BASE_URL && API_BASE_URL !== 'http://localhost:3000/api') {
      const response = await fetch(`${API_BASE_URL}/certification/step/${stepId}?sessionId=${sessionId}`, {
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

export const postStepData = async (stepId, stepData) => {
  try {
    const sessionId = getSessionId()
    
    if (API_BASE_URL && API_BASE_URL !== 'http://localhost:3000/api') {
      const response = await fetch(`${API_BASE_URL}/certification/step/${stepId}`, {
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

export const submitFormData = async (formData) => {
  try {
    const sessionId = getSessionId()
    
    if (API_BASE_URL && API_BASE_URL !== 'http://localhost:3000/api') {
      const response = await fetch(`${API_BASE_URL}/certification/submit`, {
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

    console.log('Certification form submitted:', formData)
    localStorage.removeItem(`${STORAGE_KEY}_${sessionId}`)
    return { success: true, data: { message: 'Certification form submitted successfully' } }
  } catch (error) {
    console.error('Error submitting form:', error)
    return { success: false, error: error.message }
  }
}

export const clearSessionData = () => {
  const sessionId = getSessionId()
  localStorage.removeItem(`${STORAGE_KEY}_${sessionId}`)
  sessionStorage.removeItem('certification_session_id')
}

