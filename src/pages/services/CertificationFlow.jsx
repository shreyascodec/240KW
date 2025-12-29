import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, ArrowRight, Save, CheckCircle, Loader2 } from 'lucide-react'
import CertificationDocuments from './CertificationDocuments'
import SubmissionReview from './SubmissionReview'
import CertificationSubmissionSuccess from './CertificationSubmissionSuccess'
import { getStepData, postStepData, submitFormData } from '../../services/certificationApi'

const steps = [
  { id: 'documents', title: 'Certification Documents', component: CertificationDocuments },
  { id: 'review', title: 'Submission Review', component: SubmissionReview },
]

function CertificationFlow() {
  const navigate = useNavigate()
  const [currentStep, setCurrentStep] = useState(0)
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    targetRegion: '',
    productName: '',
    productCategory: '',
    standards: ['IEC 61000-4-5', 'CISPR 32', 'IEC 61851'],
    uploadedCertDocs: {},
    additionalNotes: '',
    confirmAccurate: false,
    confirmCorrect: false,
    confirmUnderstand: false,
  })

  const CurrentStepComponent = steps[currentStep]?.component

  /**
   * Extract step-specific data from formData
   */
  const getStepDataForPost = (stepId) => {
    switch (stepId) {
      case 'documents':
        return {
          targetRegion: formData.targetRegion,
          productName: formData.productName,
          productCategory: formData.productCategory,
          standards: formData.standards,
          uploadedCertDocs: formData.uploadedCertDocs,
          additionalNotes: formData.additionalNotes,
        }
      case 'review':
        return {
          confirmAccurate: formData.confirmAccurate,
          confirmCorrect: formData.confirmCorrect,
          confirmUnderstand: formData.confirmUnderstand,
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
    if (!formData.confirmAccurate || !formData.confirmCorrect || !formData.confirmUnderstand) {
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
    { title: 'Certification Documents', completed: currentStep > 0 },
    { title: 'Submission Review', completed: currentStep > 1 },
  ]

  if (currentStep >= steps.length) {
    return <CertificationSubmissionSuccess formData={formData} />
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
                      onEdit={currentStep === 1 ? handleEdit : undefined}
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
                {currentStep === 1 ? (
                  <>
                    <ArrowLeft className="w-4 h-4" />
                    Go Back & Edit
                  </>
                ) : (
                  <>
                    <ArrowLeft className="w-4 h-4" />
                    Previous
                  </>
                )}
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
                className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {saving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    {currentStep === steps.length - 1 ? 'Submit for Review' : 'Next'}
                    <ArrowRight className="w-4 h-4" />
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

export default CertificationFlow

