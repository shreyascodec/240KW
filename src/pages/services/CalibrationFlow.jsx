import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, ArrowRight, Save, CheckCircle, Send, Loader2 } from 'lucide-react'
import CalibrationRequest from './CalibrationRequest'
import CalibrationDetails from './CalibrationDetails'
import CalibrationReview from './CalibrationReview'
import CalibrationSubmissionSuccess from './CalibrationSubmissionSuccess'
import { getStepData, postStepData, submitFormData } from '../../services/calibrationApi'

const steps = [
  { id: 'request', title: 'Calibration Request', component: CalibrationRequest },
  { id: 'details', title: 'Calibration Details', component: CalibrationDetails },
  { id: 'review', title: 'Review & Submit', component: CalibrationReview },
]

function CalibrationFlow() {
  const navigate = useNavigate()
  const [currentStep, setCurrentStep] = useState(0)
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    calibrationType: 'instrument',
    instrumentType: '',
    equipmentCondition: 'Good',
    modelNumber: '',
    serialNumber: '',
    manufacturer: '',
    calibrationServices: ['full'],
    specificParameters: [],
    workOrderNumber: `WO-2024-${String(Math.floor(Math.random() * 100000)).padStart(6, '0')}`,
    jobId: `JOB-CAL-${String(Math.floor(Math.random() * 100000)).padStart(6, '0')}`,
    preferredDate: '',
    urgentService: false,
    specialInstructions: '',
    uploadedCalibrationFiles: [],
    approvePlan: false,
    understandTests: false,
    confirmAccurate: false,
    confirmApprove: false,
    confirmUnderstand: false,
    uploadedFinalDocs: [],
  })

  const CurrentStepComponent = steps[currentStep]?.component

  /**
   * Extract step-specific data from formData
   */
  const getStepDataForPost = (stepId) => {
    switch (stepId) {
      case 'request':
        return {
          calibrationType: formData.calibrationType,
          instrumentType: formData.instrumentType,
          equipmentCondition: formData.equipmentCondition,
          modelNumber: formData.modelNumber,
          serialNumber: formData.serialNumber,
          manufacturer: formData.manufacturer,
          calibrationServices: formData.calibrationServices,
          specificParameters: formData.specificParameters,
          workOrderNumber: formData.workOrderNumber,
          jobId: formData.jobId,
          preferredDate: formData.preferredDate,
          urgentService: formData.urgentService,
          specialInstructions: formData.specialInstructions,
          uploadedCalibrationFiles: formData.uploadedCalibrationFiles,
        }
      case 'details':
        return {
          approvePlan: formData.approvePlan,
          understandTests: formData.understandTests,
        }
      case 'review':
        return {
          confirmAccurate: formData.confirmAccurate,
          confirmApprove: formData.confirmApprove,
          confirmUnderstand: formData.confirmUnderstand,
          uploadedFinalDocs: formData.uploadedFinalDocs,
        }
      default:
        return {}
    }
  }

  /**
   * Merge step data into formData
   */
  const mergeStepData = (stepId, stepData) => {
    setFormData(prev => ({
      ...prev,
      ...stepData,
    }))
  }

  /**
   * GET data when entering a step
   */
  useEffect(() => {
    const loadStepData = async () => {
      const stepId = steps[currentStep]?.id
      if (!stepId) return

      setLoading(true)
      try {
        const result = await getStepData(stepId)
        if (result.success && result.data && Object.keys(result.data).length > 0) {
          mergeStepData(stepId, result.data)
        }
      } catch (error) {
        console.error('Error loading step data:', error)
      } finally {
        setLoading(false)
      }
    }

    loadStepData()
  }, [currentStep])

  /**
   * POST data when leaving a step
   */
  const saveCurrentStep = async () => {
    const stepId = steps[currentStep]?.id
    if (!stepId) return

    setSaving(true)
    try {
      const stepData = getStepDataForPost(stepId)
      const result = await postStepData(stepId, stepData)
      if (!result.success) {
        console.error('Error saving step data:', result.error)
      }
    } catch (error) {
      console.error('Error saving step data:', error)
    } finally {
      setSaving(false)
    }
  }

  const handleNext = async () => {
    await saveCurrentStep()

    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } else {
      handleSubmit()
    }
  }

  const handlePrevious = async () => {
    await saveCurrentStep()

    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const handleSaveDraft = async () => {
    setSaving(true)
    try {
      const stepId = steps[currentStep]?.id
      if (stepId) {
        const stepData = getStepDataForPost(stepId)
        await postStepData(stepId, stepData)
      }
      alert('Draft saved successfully!')
    } catch (error) {
      console.error('Error saving draft:', error)
      alert('Error saving draft. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  const handleSubmit = async () => {
    // Validate confirmations
    if (!formData.confirmAccurate || !formData.confirmApprove || !formData.confirmUnderstand) {
      alert('Please confirm all statements before submitting.')
      return
    }

    setSaving(true)
    try {
      const stepId = steps[currentStep]?.id
      if (stepId) {
        const stepData = getStepDataForPost(stepId)
        await postStepData(stepId, stepData)
      }

      const result = await submitFormData(formData)
      if (result.success) {
        setCurrentStep(steps.length)
      } else {
        alert('Error submitting form. Please try again.')
      }
    } catch (error) {
      console.error('Error submitting form:', error)
      alert('Error submitting form. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  const handleEdit = () => {
    setCurrentStep(0) // Go back to first step
  }

  const updateFormData = (updates) => {
    setFormData(prev => ({ ...prev, ...updates }))
  }

  // Sidebar navigation
  const sidebarSteps = [
    { title: 'Calibration Request', completed: currentStep > 0 },
    { title: 'Calibration Details', completed: currentStep > 1 },
    { title: 'Review & Submit', completed: currentStep > 2 },
  ]

  if (currentStep >= steps.length) {
    return <CalibrationSubmissionSuccess formData={formData} />
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex gap-8">
          {/* Sidebar */}
          <aside className="w-64 flex-shrink-0">
            <div className="bg-gray-100 rounded-xl p-6 sticky top-8">
              <div className="space-y-4">
                {sidebarSteps.map((step, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3"
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      index === currentStep
                        ? 'bg-blue-600 text-white'
                        : step.completed
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-300 text-gray-600'
                    }`}>
                      {step.completed ? (
                        <CheckCircle className="w-5 h-5" />
                      ) : (
                        <span className="text-sm font-medium">{index + 1}</span>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className={`text-sm font-medium ${
                        index === currentStep ? 'text-gray-900' : 'text-gray-600'
                      }`}>
                        {step.title}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1">
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <div className="text-center">
                  <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
                  <p className="text-gray-600">Loading step data...</p>
                </div>
              </div>
            ) : (
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  {CurrentStepComponent && (
                    <CurrentStepComponent
                      formData={formData}
                      updateFormData={updateFormData}
                      onEdit={currentStep === 2 ? handleEdit : undefined}
                    />
                  )}
                </motion.div>
              </AnimatePresence>
            )}

            {/* Navigation Buttons */}
            <div className="mt-8 flex items-center justify-between">
              <button
                onClick={handlePrevious}
                disabled={currentStep === 0 || saving || loading}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Previous
              </button>

              <button
                onClick={handleSaveDraft}
                disabled={saving || loading}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {saving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Save & Continue Later
                  </>
                )}
              </button>

              <button
                onClick={handleNext}
                disabled={saving || loading}
                className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {saving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    {currentStep === steps.length - 1 ? (
                      <>
                        Submit Calibration Request
                        <Send className="w-4 h-4" />
                      </>
                    ) : currentStep === 1 ? (
                      <>
                        Proceed to Final Submission
                        <ArrowRight className="w-4 h-4" />
                      </>
                    ) : (
                      <>
                        Next
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </>
                )}
              </button>
            </div>

            {/* Footer */}
            <div className="mt-8 flex items-center justify-end gap-6 text-sm text-gray-600">
              <a href="#" className="hover:text-gray-900">Help</a>
              <a href="#" className="hover:text-gray-900">Privacy</a>
              <a href="#" className="hover:text-gray-900">Terms</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CalibrationFlow

