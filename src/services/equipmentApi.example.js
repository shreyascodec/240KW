/**
 * Equipment API Usage Examples
 * 
 * This file demonstrates how to use the equipment API functions
 * throughout the application.
 */

import { submitEquipment, fetchEquipment, updateEquipment, deleteEquipment, getEquipmentById } from './equipmentApi'

// Example 1: Submit Equipment Data
export const exampleSubmitEquipment = async () => {
  const equipmentData = {
    calibrationType: 'instrument',
    equipmentType: 'Spectrum Analyzer',
    modelNumber: 'N9020A',
    serialNumber: 'SG12345678',
    manufacturer: 'Keysight Technologies',
    equipmentCondition: 'Good',
    scope: {
      full: true,
      functional: false,
      adjustment: false,
      specificParams: ['Frequency Accuracy', 'Amplitude Accuracy'],
    },
    parameters: {
      voltageRange: '0-1000V',
      currentRange: '0-10A',
      frequencyRange: '10Hz-1MHz',
      powerRange: '0-10kW',
    },
    workOrder: {
      workOrderNumber: 'WO-2024-001234',
      jobId: 'JOB-CAL-456789',
      preferredDate: '2024-12-15',
      urgentService: false,
    },
    serviceMode: 'On-Site',
    calibrationLocation: 'Lab',
    specialInstructions: 'Please handle with care',
  }

  const result = await submitEquipment(equipmentData)
  
  if (result.success) {
    console.log('Equipment submitted successfully:', result.data)
    return result.data
  } else {
    console.error('Failed to submit equipment:', result.error)
    return null
  }
}

// Example 2: Fetch All Equipment
export const exampleFetchEquipment = async () => {
  const result = await fetchEquipment()
  
  if (result.success) {
    console.log('Equipment fetched:', result.equipment)
    return result.equipment
  } else {
    console.error('Failed to fetch equipment:', result.error)
    return []
  }
}

// Example 3: Using Equipment API in React Component with DataContext
/**
 * import { useData } from '../contexts/DataContext'
 * 
 * function MyComponent() {
 *   const { 
 *     equipment, 
 *     equipmentLoading, 
 *     equipmentError,
 *     loadEquipment,
 *     addEquipment,
 *     updateEquipmentItem,
 *     removeEquipment 
 *   } = useData()
 * 
 *   useEffect(() => {
 *     // Equipment is automatically loaded on mount
 *     // Or manually refresh:
 *     loadEquipment()
 *   }, [])
 * 
 *   const handleSubmit = async () => {
 *     const equipmentData = {
 *       // ... your equipment data
 *     }
 *     
 *     const result = await addEquipment(equipmentData)
 *     if (result.success) {
 *       toast.success('Equipment submitted successfully!')
 *     } else {
 *       toast.error(result.error || 'Failed to submit equipment')
 *     }
 *   }
 * 
 *   return (
 *     <div>
 *       {equipmentLoading && <p>Loading equipment...</p>}
 *       {equipmentError && <p>Error: {equipmentError}</p>}
 *       {equipment.map(item => (
 *         <div key={item.id}>{item.modelNumber}</div>
 *       ))}
 *     </div>
 *   )
 * }
 */

// Example 4: Update Equipment
export const exampleUpdateEquipment = async (equipmentId, updates) => {
  const result = await updateEquipment(equipmentId, updates)
  
  if (result.success) {
    console.log('Equipment updated:', result.data)
    return result.data
  } else {
    console.error('Failed to update equipment:', result.error)
    return null
  }
}

// Example 5: Delete Equipment
export const exampleDeleteEquipment = async (equipmentId) => {
  const result = await deleteEquipment(equipmentId)
  
  if (result.success) {
    console.log('Equipment deleted successfully')
    return true
  } else {
    console.error('Failed to delete equipment:', result.error)
    return false
  }
}

// Example 6: Get Single Equipment by ID
export const exampleGetEquipmentById = async (equipmentId) => {
  const result = await getEquipmentById(equipmentId)
  
  if (result.success) {
    console.log('Equipment details:', result.data)
    return result.data
  } else {
    console.error('Failed to fetch equipment:', result.error)
    return null
  }
}

