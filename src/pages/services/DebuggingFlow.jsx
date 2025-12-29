import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, ArrowRight, Save, CheckCircle, Loader2 } from 'lucide-react'
import ProductDetails from '../jrf/ProductDetails'
import DebuggingTechnicalDocuments from './DebuggingTechnicalDocuments'
import ProductDebuggingDetails from './ProductDebuggingDetails'
import RequestUnderReview from './RequestUnderReview'
import IssueIdentificationReview from './IssueIdentificationReview'
import DebuggingSubmissionSuccess from './DebuggingSubmissionSuccess'
import { getStepData, postStepData, submitFormData } from '../../services/debuggingApi'

const steps = [
  { id: 'product', title: 'Product Details', component: ProductDetails },
  { id: 'documents', title: 'Technical Specification Documents', component: DebuggingTechnicalDocuments },
  { id: 'debugging', title: 'Product Debugging Details', component: ProductDebuggingDetails },
  { id: 'review', title: 'Request under Review', component: RequestUnderReview },
  { id: 'issue', title: 'Issue Identification & Review', component: IssueIdentificationReview },
]

function DebuggingFlow() {
  const navigate = useNavigate()
  const [currentStep, setCurrentStep] = useState(0)
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    // Product Details
    eutName: '',
    eutQuantity: '',
    manufacturer: '',
    modelNo: '',
    serialNo: '',
    supplyVoltage: '',
    operatingFrequency: '',
    current: '',
    weight: '',
    dimensions: { length: '', width: '', height: '' },
    powerPorts: '',
    signalLines: '',
    softwareName: '',
    softwareVersion: '',
    
    // Industry/Application
    industry: [],
    industryOther: '',
    
    // Testing dates
    preferredDate: '',
    additionalNotes: '',
    
    // Debugging Details
    selectedDebugTests: [],
    customTest: '',
    uploadedTestReports: [],
    issueDescription: '',
    
    // Issue Review
    engineerComments: '',
    issueCategory: 'EMI / EMC Category',
    severityRating: 'Low Severity',
    confidenceScore: 75,
    debugPath: 'full',
    
    // Documents
    uploadedDocs: {}
  })

  const CurrentStepComponent = steps[currentStep]?.component

  /**
   * Extract step-specific data from formData
   */
  const getStepDataForPost = (stepId) => {
    switch (stepId) {
      case 'product':
        return {
          eutName: formData.eutName,
          eutQuantity: formData.eutQuantity,
          manufacturer: formData.manufacturer,
          modelNo: formData.modelNo,
          serialNo: formData.serialNo,
          supplyVoltage: formData.supplyVoltage,
          operatingFrequency: formData.operatingFrequency,
          current: formData.current,
          weight: formData.weight,
          dimensions: formData.dimensions,
          powerPorts: formData.powerPorts,
          signalLines: formData.signalLines,
          softwareName: formData.softwareName,
          softwareVersion: formData.softwareVersion,
          industry: formData.industry,
          industryOther: formData.industryOther,
          preferredDate: formData.preferredDate,
          additionalNotes: formData.additionalNotes,
        }
      case 'documents':
        return {
          uploadedDocs: formData.uploadedDocs,
        }
      case 'debugging':
        return {
          selectedDebugTests: formData.selectedDebugTests,
          customTest: formData.customTest,
          uploadedTestReports: formData.uploadedTestReports,
          issueDescription: formData.issueDescription,
        }
      case 'review':
        return {} // RequestUnderReview doesn't have form data to save
      case 'issue':
        return {
          engineerComments: formData.engineerComments,
          issueCategory: formData.issueCategory,
          severityRating: formData.severityRating,
          confidenceScore: formData.confidenceScore,
          debugPath: formData.debugPath,
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

    // Skip saving for review step as it doesn't have form data
    if (stepId === 'review') return

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
      if (stepId && stepId !== 'review') {
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
    setSaving(true)
    try {
      const stepId = steps[currentStep]?.id
      if (stepId && stepId !== 'review') {
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

  const updateFormData = (updates) => {
    setFormData(prev => ({ ...prev, ...updates }))
  }

  // Sidebar navigation
  const sidebarSteps = [
    { title: 'Product Details', completed: currentStep > 0 },
    { title: 'Technical Specification Documents', completed: currentStep > 1 },
    { title: 'Product Debugging Details', completed: currentStep > 2 },
    { title: 'Request under Review', completed: currentStep > 3 },
    { title: 'Issue Identification & Review', completed: currentStep > 4 },
    { title: 'Submit Request', completed: currentStep > 5 },
  ]

  if (currentStep >= steps.length) {
    return <DebuggingSubmissionSuccess />
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
                      onNext={currentStep === 3 ? handleNext : undefined}
                    />
                  )}
                </motion.div>
              </AnimatePresence>
            )}

            {/* Navigation Buttons */}
            {currentStep !== 3 && ( // Hide navigation on Request under Review step
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
                      Save as Draft
                    </>
                  )}
                </button>

                <button
                  onClick={handleNext}
                  disabled={saving || loading}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {saving ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      {currentStep === steps.length - 1 ? 'Submit Request' : currentStep === 2 ? 'Continue to Diagnostics →' : 'Next'}
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            )}

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

export default DebuggingFlow

