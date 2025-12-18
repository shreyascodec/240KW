# API Integration Guide

This document describes how the frontend is structured to integrate with backend API endpoints.

## 📋 Overview

The frontend is fully prepared for API integration across all modules. The architecture includes:

- **Centralized API Configuration** (`src/config/api.js`)
- **Base API Client** (`src/services/apiClient.js`) with interceptors
- **Module-specific API Services** for each feature
- **Context Integration** for state management

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
# API Base URL
VITE_API_URL=http://localhost:5000

# Optional: API Timeout (default: 30000ms)
VITE_API_TIMEOUT=30000

# Optional: Enable debug logging
VITE_API_DEBUG=true
```

### API Endpoints Structure

All endpoints follow the pattern: `/api/module1/{resource}`

**Current Implementations:**
- ✅ Equipment: `/api/module1/equipment`
- 🔄 Simulation: `/api/module1/simulation` (ready)
- 🔄 Debugging: `/api/module1/debugging` (ready)
- 🔄 Certification: `/api/module1/certification` (ready)
- 🔄 Calibration: `/api/module1/calibration` (ready)

**Ready for Integration:**
- Products: `/api/module1/products`
- Orders: `/api/module1/orders`
- Messages: `/api/module1/messages`
- Documents: `/api/module1/documents`

## 📦 API Services

### Equipment API (✅ Implemented)

**File:** `src/services/equipmentApi.js`

**Functions:**
- `submitEquipment(data)` → POST `/api/module1/equipment`
- `fetchEquipment()` → GET `/api/module1/equipment`
- `updateEquipment(id, data)` → PUT `/api/module1/equipment/:id`
- `deleteEquipment(id)` → DELETE `/api/module1/equipment/:id`
- `getEquipmentById(id)` → GET `/api/module1/equipment/:id`

**Usage:**
```javascript
import { useData } from '../contexts/DataContext'

const { addEquipment, equipment, equipmentLoading } = useData()

// Submit equipment
const result = await addEquipment(equipmentData)
```

### Simulation API (🔄 Ready)

**File:** `src/services/simulationApi.js`

**Functions:**
- `submitSimulation(data)` → POST `/api/module1/simulation`
- `fetchSimulations()` → GET `/api/module1/simulation`
- `getSimulationById(id)` → GET `/api/module1/simulation/:id`

### Debugging API (🔄 Ready)

**File:** `src/services/debuggingApi.js`

**Functions:**
- `submitDebugging(data)` → POST `/api/module1/debugging`
- `fetchDebuggingRequests()` → GET `/api/module1/debugging`
- `getDebuggingById(id)` → GET `/api/module1/debugging/:id`

### Certification API (🔄 Ready)

**File:** `src/services/certificationApi.js`

**Functions:**
- `submitCertification(data)` → POST `/api/module1/certification`
- `fetchCertifications()` → GET `/api/module1/certification`
- `getCertificationById(id)` → GET `/api/module1/certification/:id`

### Calibration API (🔄 Ready)

**File:** `src/services/calibrationApi.js`

**Functions:**
- `submitCalibration(data)` → POST `/api/module1/calibration`
- `fetchCalibrations()` → GET `/api/module1/calibration`
- `getCalibrationById(id)` → GET `/api/module1/calibration/:id`

## 🔐 Authentication

The API client automatically handles authentication tokens:

1. **Token Storage:** Checks multiple storage locations:
   - `localStorage.accessToken`
   - `localStorage.labManagementAccessToken`
   - `localStorage.authToken`
   - `sessionStorage.accessToken`

2. **Authorization Header:** Automatically adds `Authorization: Bearer {token}` to requests

3. **Token Expiration:** On 401 errors, tokens are automatically cleared

## 📝 Integration Steps

### Step 1: Update API Configuration

Edit `src/config/api.js` to match your backend endpoints:

```javascript
export const API_ENDPOINTS = {
  EQUIPMENT: {
    BASE: '/api/module1/equipment',
    // ... other endpoints
  }
}
```

### Step 2: Enable API in Service Flows

For each service flow (Simulation, Debugging, Certification, Calibration):

1. Import the API service:
```javascript
import { submitSimulation } from '../../services/simulationApi'
```

2. Update the submit handler:
```javascript
const handleSubmit = async () => {
  const result = await submitSimulation(formData)
  if (result.success) {
    // Handle success
  } else {
    // Handle error
  }
}
```

### Step 3: Update DataContext (Optional)

To integrate API data into global state:

1. Add state and functions to `DataContext.jsx`:
```javascript
const [simulations, setSimulations] = useState([])
const [simulationsLoading, setSimulationsLoading] = useState(false)

const loadSimulations = async () => {
  setSimulationsLoading(true)
  const result = await fetchSimulations()
  if (result.success) {
    setSimulations(result.simulations)
  }
  setSimulationsLoading(false)
}
```

2. Export in context value:
```javascript
const value = {
  // ... existing values
  simulations,
  simulationsLoading,
  loadSimulations,
}
```

## 🎯 Current Implementation Status

| Module | API Service | Context Integration | Flow Integration |
|--------|-------------|---------------------|-----------------|
| Equipment | ✅ Complete | ✅ Complete | ✅ CalibrationFlow |
| Simulation | 🔄 Ready | ⏳ Pending | ⏳ Pending |
| Debugging | 🔄 Ready | ⏳ Pending | ⏳ Pending |
| Certification | 🔄 Ready | ⏳ Pending | ⏳ Pending |
| Calibration | 🔄 Ready | ⏳ Pending | ✅ CalibrationFlow |

## 🚀 Testing API Integration

### 1. Start Backend Server

Ensure your backend is running on the configured port (default: `http://localhost:5000`)

### 2. Test Equipment API

The equipment API is fully integrated. Test by:

1. Navigate to `/services/calibration/start`
2. Fill out the calibration form
3. Submit - equipment data will be sent to `/api/module1/equipment`

### 3. Monitor Network Requests

Open browser DevTools → Network tab to see API calls

### 4. Check Console Logs

In development mode, API requests are logged:
- ✅ Success: Green checkmark with timing
- ❌ Error: Red X with error details

## 🔍 Error Handling

All API services return consistent error responses:

```javascript
{
  success: false,
  error: error.response?.data || error.message,
  message: 'User-friendly error message'
}
```

The base API client handles:
- **401 Unauthorized:** Clears tokens
- **403 Forbidden:** Logs access denied
- **404 Not Found:** Logs resource not found
- **500 Server Error:** Logs server error
- **Network Errors:** Handles connection issues

## 📚 Example: Adding a New API Module

1. **Create API Service** (`src/services/newModuleApi.js`):
```javascript
import apiClient from './apiClient'
import { API_ENDPOINTS } from '../config/api'

export const submitNewModule = async (data) => {
  try {
    const response = await apiClient.post(API_ENDPOINTS.NEW_MODULE.SUBMIT, data)
    return { success: true, data: response.data }
  } catch (error) {
    return { success: false, error: error.response?.data || error.message }
  }
}
```

2. **Add to API Config** (`src/config/api.js`):
```javascript
NEW_MODULE: {
  BASE: '/api/module1/new-module',
  SUBMIT: '/api/module1/new-module',
  GET_ALL: '/api/module1/new-module',
  GET_BY_ID: (id) => `/api/module1/new-module/${id}`,
}
```

3. **Use in Component**:
```javascript
import { submitNewModule } from '../services/newModuleApi'

const result = await submitNewModule(data)
```

## 🎨 Best Practices

1. **Always use the centralized API client** - Don't create new axios instances
2. **Use API_ENDPOINTS constants** - Don't hardcode URLs
3. **Handle errors gracefully** - Show user-friendly messages
4. **Use loading states** - Provide feedback during API calls
5. **Cache data when appropriate** - Use context or state management
6. **Test with mock data first** - Ensure UI works before API integration

## 📞 Support

For questions or issues with API integration:
1. Check the console for error messages
2. Verify API endpoint URLs in `src/config/api.js`
3. Ensure backend CORS is configured correctly
4. Check network tab in DevTools for request/response details

