import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Settings,
  ClipboardList,
  FileText,
  Upload,
  ArrowLeft,
  ArrowRight,
  Save,
  CheckCircle,
  CheckCircle2,
  AlertCircle,
  CalendarDays,
} from 'lucide-react'
import toast from 'react-hot-toast'
import { useData } from '../../contexts/DataContext'

function CalibrationFlow() {
  const navigate = useNavigate()
  const { addProduct, addOrder, addMessage } = useData()

  const [currentStep, setCurrentStep] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    // Basic request
    calibrationType: 'instrument', // 'instrument' | 'chamber'
    instrumentType: '',
    chamberType: '',
    equipmentCondition: 'Good',
    modelNumber: '',
    serialNumber: '',
    manufacturer: '',
    previousCert: null,

    // Scope
    scopeFull: true,
    scopeFunctional: false,
    scopeAdjustment: false,
    specificParams: [],

    // Electrical parameters
    voltageRange: '',
    currentRange: '',
    frequencyRange: '',
    powerRange: '',

    // Work order / scheduling
    workOrderNumber: '',
    jobId: '',
    preferredDate: '',
    urgentService: false,

    // Location / mode
    serviceMode: 'On-Site',
    calibrationLocation: 'Lab',

    // Additional
    specialInstructions: '',
    additionalDocs: [],

    // Step 2 confirmations
    confirmPlan: false,
    confirmExtraTests: false,

    // Step 3 terms
    termsAccurate: false,
    termsApprovePlan: false,
    termsCharges: false,
  })

  const steps = [
    { id: 'request', title: 'Calibration Request' },
    { id: 'details', title: 'Calibration Details' },
    { id: 'review', title: 'Review & Submit' },
  ]

  const isSuccess = currentStep >= steps.length

  const handleFieldChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const toggleSpecificParam = value => {
    setFormData(prev => {
      const current = prev.specificParams
      const updated = current.includes(value)
        ? current.filter(p => p !== value)
        : [...current, value]
      return { ...prev, specificParams: updated }
    })
  }

  const handleUploadPreviousCert = file => {
    if (!file) return
    setFormData(prev => ({
      ...prev,
      previousCert: {
        name: file.name,
        size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
      },
    }))
    toast.success('Previous calibration certificate uploaded.')
  }

  const handleAdditionalDocUpload = files => {
    if (!files || files.length === 0) return
    const docs = Array.from(files).map(f => ({
      name: f.name,
      size: `${(f.size / (1024 * 1024)).toFixed(1)} MB`,
    }))
    setFormData(prev => ({ ...prev, additionalDocs: [...prev.additionalDocs, ...docs] }))
    toast.success('Additional documents uploaded.')
  }

  const saveDraft = () => {
    localStorage.setItem('calibration_flow_draft', JSON.stringify(formData))
    toast.success('Calibration draft saved.')
  }

  const handleNext = () => {
    if (currentStep === 0) {
      const isInstrument = formData.calibrationType === 'instrument'
      const typeField = isInstrument ? formData.instrumentType : formData.chamberType
      if (
        !typeField ||
        !formData.modelNumber ||
        !formData.serialNumber ||
        !formData.manufacturer ||
        !formData.workOrderNumber ||
        !formData.jobId ||
        !formData.preferredDate
      ) {
        toast.error('Please complete the required calibration request fields.')
        return
      }
      setCurrentStep(1)
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }

    if (currentStep === 1) {
      if (!formData.confirmPlan || !formData.confirmExtraTests) {
        toast.error('Please review and approve the calibration test plan.')
        return
      }
      setCurrentStep(2)
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }

    if (currentStep === 2) {
      if (!formData.termsAccurate || !formData.termsApprovePlan || !formData.termsCharges) {
        toast.error('Please accept the terms and approval checkboxes before submitting.')
        return
      }
      handleSubmit()
    }
  }

  const handlePrevious = () => {
    if (currentStep === 0) {
      navigate(-1)
      return
    }
    setCurrentStep(step => Math.max(0, step - 1))
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true)

      const nameBase =
        formData.calibrationType === 'instrument'
          ? formData.instrumentType || 'Instrument Calibration'
          : formData.chamberType || 'Chamber Calibration'

      const product = addProduct({
        name: `${nameBase} Calibration`,
        service: 'Calibration',
        description: `Calibration request for model ${formData.modelNumber || '-'} (WO ${
          formData.workOrderNumber || '-'
        }).`,
        category: 'Test & Measurement',
      })

      addOrder({
        productId: product.id,
        productName: product.name,
        service: 'Calibration',
        status: 'Awaiting',
        total: 79,
      })

      addMessage({
        from: 'Calibration Team',
        subject: `Calibration request submitted for ${product.name}`,
        body:
          'Your calibration request has been submitted and is currently under review. Our team will contact you to confirm scheduling and next steps.',
        type: 'notification',
      })

      setCurrentStep(steps.length)
      toast.success('Your calibration request has been submitted!')
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } finally {
      setIsSubmitting(false)
    }
  }

  const sidebarSteps = steps.map((step, index) => ({
    ...step,
    completed: !isSuccess && index < currentStep,
    active: !isSuccess && index === currentStep,
  }))

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {!isSuccess && (
        <div className="bg-white border-b">
          <div className="max-w-6xl mx-auto px-6 py-4 flex items-center gap-2">
            <Settings className="w-6 h-6 text-primary" />
            <span className="font-semibold text-lg tracking-tight">240KW</span>
          </div>
        </div>
      )}

      <div className="flex-1 max-w-6xl mx-auto px-4 lg:px-6 py-8">
        {isSuccess ? (
          <CalibrationSuccess
            formData={formData}
            onReturnDashboard={() => navigate('/customer/dashboard')}
          />
        ) : (
          <div className="flex flex-col md:flex-row gap-8">
            {/* Sidebar */}
            <aside className="md:w-64 md:flex-shrink-0">
              <div className="bg-gray-100 rounded-xl p-6">
                <div className="space-y-6">
                  {sidebarSteps.map((step, index) => (
                    <div key={step.id} className="flex items-start gap-3">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                          step.active
                            ? 'bg-blue-600 text-white'
                            : step.completed
                            ? 'bg-green-500 text-white'
                            : 'bg-gray-300 text-gray-600'
                        }`}
                      >
                        {step.completed ? (
                          <CheckCircle className="w-4 h-4" />
                        ) : (
                          <span className="text-sm font-medium">{index + 1}</span>
                        )}
                      </div>
                      <div className="flex-1">
                        <div
                          className={`text-sm font-medium ${
                            step.active ? 'text-gray-900' : 'text-gray-600'
                          }`}
                        >
                          {step.title}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </aside>

            {/* Main content */}
            <div className="flex-1">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.25 }}
                >
                  {currentStep === 0 && (
                    <StepCalibrationRequest
                      formData={formData}
                      onFieldChange={handleFieldChange}
                      onUploadPrevCert={handleUploadPreviousCert}
                      onUploadAdditional={handleAdditionalDocUpload}
                      onToggleSpecific={toggleSpecificParam}
                    />
                  )}
                  {currentStep === 1 && <StepCalibrationDetails formData={formData} onFieldChange={handleFieldChange} />}
                  {currentStep === 2 && (
                    <StepReviewSubmit formData={formData} onFieldChange={handleFieldChange} />
                  )}
                </motion.div>
              </AnimatePresence>

              {/* Navigation */}
              <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
                <button
                  type="button"
                  onClick={handlePrevious}
                  className="inline-flex items-center gap-2 px-5 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Previous
                </button>

                <div className="flex items-center gap-3 ml-auto">
                  <button
                    type="button"
                    onClick={saveDraft}
                    className="inline-flex items-center gap-2 px-5 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <Save className="w-4 h-4" />
                    Save as Draft
                  </button>
                  <button
                    type="button"
                    onClick={handleNext}
                    disabled={isSubmitting}
                    className="inline-flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {currentStep === steps.length - 1 ? 'Submit Calibration Request' : 'Next'}
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Footer */}
              <div className="mt-8 flex items-center justify-end gap-6 text-sm text-gray-600">
                <button type="button" className="hover:text-gray-900">
                  Help
                </button>
                <button type="button" className="hover:text-gray-900">
                  Privacy
                </button>
                <button type="button" className="hover:text-gray-900">
                  Terms
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function StepCalibrationRequest({
  formData,
  onFieldChange,
  onUploadPrevCert,
  onUploadAdditional,
  onToggleSpecific,
}) {
  const specificOptions = [
    'Frequency Accuracy',
    'Amplitude Accuracy',
    'Phase Noise',
    'Harmonic Distortion',
    'Return Loss',
    'Power Level Accuracy',
  ]

  const calibrationTypeCard = (type, title, description) => (
    <button
      type="button"
      onClick={() => onFieldChange('calibrationType', type)}
      className={`w-full text-left p-4 rounded-xl border transition-all ${
        formData.calibrationType === type
          ? 'border-blue-600 bg-blue-50 shadow-sm'
          : 'border-gray-200 hover:border-blue-400 hover:bg-blue-50/40'
      }`}
    >
      <div className="font-semibold text-gray-900 mb-1">{title}</div>
      <p className="text-xs text-gray-600">{description}</p>
    </button>
  )

  const isInstrument = formData.calibrationType === 'instrument'

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-4">Calibration Request</h1>

      {/* Select Calibration Type */}
      <section className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <ClipboardList className="w-5 h-5 text-blue-600" />
          <h2 className="text-lg font-semibold text-gray-900">Select Calibration Type</h2>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          {calibrationTypeCard(
            'instrument',
            'Instrument Calibration',
            'Calibrate measurement instruments and testing equipment.',
          )}
          {calibrationTypeCard(
            'chamber',
            'Chamber Calibration',
            'Validate testing chambers and controlled environments.',
          )}
        </div>
      </section>

      {/* Equipment Information */}
      <section className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <Settings className="w-5 h-5 text-blue-600" />
          <h2 className="text-lg font-semibold text-gray-900">Equipment Information</h2>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <SelectField
            label={isInstrument ? 'Instrument Type *' : 'Chamber Type *'}
            value={isInstrument ? formData.instrumentType : formData.chamberType}
            onChange={value =>
              onFieldChange(isInstrument ? 'instrumentType' : 'chamberType', value)
            }
            options={
              isInstrument
                ? ['Oscilloscope', 'Multimeter', 'Power Supply', 'Signal Generator', 'Spectrum Analyzer']
                : ['EMC Chamber', 'Environmental Chamber', 'Vibration Chamber']
            }
            placeholder={isInstrument ? 'Select instrument type' : 'Select chamber type'}
          />
          <SelectField
            label="Equipment Condition *"
            value={formData.equipmentCondition}
            onChange={value => onFieldChange('equipmentCondition', value)}
            options={['Good', 'Needs Maintenance', 'Critical']}
            placeholder="Select condition"
          />
          <TextField
            label="Model Number *"
            placeholder="e.g., N9020A"
            value={formData.modelNumber}
            onChange={value => onFieldChange('modelNumber', value)}
          />
          <TextField
            label="Serial Number *"
            placeholder="e.g., SG12345678"
            value={formData.serialNumber}
            onChange={value => onFieldChange('serialNumber', value)}
          />
          <TextField
            label="Manufacturer *"
            placeholder="e.g., Keysight Technologies"
            value={formData.manufacturer}
            onChange={value => onFieldChange('manufacturer', value)}
          />
        </div>

        {/* Previous cert upload */}
        <div className="pt-4 border-t border-dashed border-gray-200">
          <label className="text-xs font-semibold text-gray-700 mb-2 block">
            Previous Calibration Certificate (Optional)
          </label>
          <label className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-gray-300 rounded-xl py-4 cursor-pointer hover:border-blue-400 hover:bg-blue-50/40 transition-colors text-xs text-gray-600">
            <span>{formData.previousCert ? formData.previousCert.name : 'Click to upload or drag and drop'}</span>
            <span className="text-[11px] text-gray-500">PDF, DOC up to 10MB</span>
            <input
              type="file"
              className="hidden"
              onChange={e => onUploadPrevCert(e.target.files?.[0])}
            />
          </label>
        </div>
      </section>

      {/* Define Calibration Scope */}
      <section className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <ClipboardList className="w-5 h-5 text-blue-600" />
          <h2 className="text-lg font-semibold text-gray-900">Define Calibration Scope</h2>
        </div>
        <div className="space-y-2 text-sm text-gray-700">
          <Checkbox
            label="Full Calibration"
            checked={formData.scopeFull}
            onChange={value => onFieldChange('scopeFull', value)}
          />
          <Checkbox
            label="Functional Verification"
            checked={formData.scopeFunctional}
            onChange={value => onFieldChange('scopeFunctional', value)}
          />
          <Checkbox
            label="Adjustment Required"
            checked={formData.scopeAdjustment}
            onChange={value => onFieldChange('scopeAdjustment', value)}
          />
        </div>

        <div className="mt-4">
          <div className="text-xs font-semibold text-gray-500 mb-2">
            Specific Parameters (Optional)
          </div>
          <div className="grid md:grid-cols-3 gap-2 text-sm text-gray-700">
            {specificOptions.map(option => (
              <Checkbox
                key={option}
                label={option}
                checked={formData.specificParams.includes(option)}
                onChange={() => onToggleSpecific(option)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Instrument Calibration Parameters */}
      <section className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
        <h2 className="text-lg font-semibold text-gray-900">Instrument Calibration Parameters</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <TextField
            label="Voltage Range (AC & DC)"
            placeholder="e.g., 0–1000V"
            value={formData.voltageRange}
            onChange={value => onFieldChange('voltageRange', value)}
          />
          <TextField
            label="Current Range (AC & DC)"
            placeholder="e.g., 0–10A"
            value={formData.currentRange}
            onChange={value => onFieldChange('currentRange', value)}
          />
          <TextField
            label="Frequency Range"
            placeholder="e.g., 10Hz–1MHz"
            value={formData.frequencyRange}
            onChange={value => onFieldChange('frequencyRange', value)}
          />
          <TextField
            label="Power Range (W/VA/VAR)"
            placeholder="e.g., 0–10kW"
            value={formData.powerRange}
            onChange={value => onFieldChange('powerRange', value)}
          />
        </div>
      </section>

      {/* Work order & additional instructions */}
      <section className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
        <h2 className="text-lg font-semibold text-gray-900">Work Order &amp; Job Registration</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <TextField
            label="Work Order Number *"
            placeholder="WO-2024-001234"
            value={formData.workOrderNumber}
            onChange={value => onFieldChange('workOrderNumber', value)}
          />
          <TextField
            label="Job ID *"
            placeholder="JOB-CAL-456789"
            value={formData.jobId}
            onChange={value => onFieldChange('jobId', value)}
          />
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              Preferred Calibration Date *
            </label>
            <input
              type="date"
              value={formData.preferredDate}
              onChange={e => onFieldChange('preferredDate', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="flex items-center gap-3 mt-1">
            <label className="text-xs font-medium text-gray-700">Urgent Service Required?</label>
            <button
              type="button"
              onClick={() => onFieldChange('urgentService', !formData.urgentService)}
              className={`relative inline-flex h-5 w-9 items-center rounded-full border transition-colors ${
                formData.urgentService ? 'bg-blue-600 border-blue-600' : 'bg-gray-200 border-gray-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
                  formData.urgentService ? 'translate-x-4' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>

        <div className="pt-4 border-t border-dashed border-gray-200 space-y-3">
          <label className="text-sm font-medium text-gray-700">
            Special Instructions or Site Guidelines
          </label>
          <TextArea
            placeholder="Please include any special handling requirements, safety protocols, or site-specific guidelines our team should be aware of..."
            value={formData.specialInstructions}
            onChange={value => onFieldChange('specialInstructions', value)}
          />

          <label className="text-xs font-semibold text-gray-700 mt-2">
            Additional Documents
          </label>
          <label className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-gray-300 rounded-xl py-4 cursor-pointer hover:border-blue-400 hover:bg-blue-50/40 transition-colors text-xs text-gray-600">
            <span>Click to upload or drag and drop</span>
            <span className="text-[11px] text-gray-500">PDF, DOC up to 10MB</span>
            <input
              type="file"
              multiple
              className="hidden"
              onChange={e => onUploadAdditional(e.target.files)}
            />
          </label>
        </div>
      </section>
    </div>
  )
}

function StepCalibrationDetails({ formData, onFieldChange }) {
  const tests = [
    'Frequency Accuracy',
    'Amplitude Accuracy',
    'Bandwidth / RBW Verification',
    'Display Linearity',
    'Time Base / Trigger Accuracy',
    'Noise Floor Measurement',
    'Probe Calibration / Offset Tests',
    'Self-Test & Functional Checks',
  ]

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-4">Calibration Details</h1>

      {/* Equipment Summary */}
      <section className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
        <h2 className="text-sm font-semibold text-gray-900">Equipment Summary</h2>
        <div className="grid md:grid-cols-3 gap-3 text-xs text-gray-800">
          <SummaryField label="Calibration Type" value={formData.calibrationType === 'instrument' ? 'Instrument' : 'Chamber'} />
          <SummaryField
            label="Equipment Name"
            value={formData.instrumentType || formData.chamberType || '—'}
          />
          <SummaryField
            label="Calibration Scope"
            value={
              formData.scopeFull
                ? 'Full'
                : formData.scopeFunctional
                ? 'Functional Verification'
                : 'Adjustment'
            }
          />
          <SummaryField
            label="Model & Serial Number"
            value={`${formData.modelNumber || '-'} / ${formData.serialNumber || '-'}`}
          />
          <SummaryField label="Calibration Location" value={formData.calibrationLocation || 'Lab'} />
          <SummaryField
            label="Scheduled Date"
            value={
              formData.preferredDate
                ? new Date(formData.preferredDate).toLocaleDateString()
                : 'TBD'
            }
          />
        </div>
      </section>

      {/* Tests to be performed */}
      <section className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
        <h2 className="text-sm font-semibold text-gray-900">Tests to Be Performed</h2>
        <div className="grid md:grid-cols-2 gap-2 text-sm text-gray-800">
          {tests.map(test => (
            <div key={test} className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-500" />
              <span>{test}</span>
            </div>
          ))}
        </div>
        {formData.specificParams.length > 0 && (
          <p className="text-xs text-gray-500 mt-2">
            Additional focus on: {formData.specificParams.join(', ')}.
          </p>
        )}
      </section>

      {/* How calibration will be performed & Deliverables */}
      <section className="grid md:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-2">
          <h2 className="text-sm font-semibold text-gray-900">How Calibration Will Be Performed</h2>
          <div className="mt-2 p-4 rounded-xl border border-dashed border-blue-200 bg-blue-50 text-xs text-gray-800">
            <div className="font-semibold text-gray-900 mb-1">Standards Reference</div>
            <p>ANSI & IEC standards based compliance verification, with traceable reference equipment.</p>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-2">
          <h2 className="text-sm font-semibold text-gray-900">Deliverables</h2>
          <ul className="space-y-1 text-sm text-gray-800">
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500" />
              <span>Calibration Certificate</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500" />
              <span>Next Calibration Due Date</span>
            </li>
          </ul>
        </div>
      </section>

      {/* Confirmation */}
      <section className="bg-white rounded-xl border border-gray-200 p-6 space-y-3">
        <h2 className="text-sm font-semibold text-gray-900">Confirmation</h2>
        <div className="space-y-2 text-sm text-gray-700">
          <Checkbox
            label="I have reviewed and approve the calibration test plan."
            checked={formData.confirmPlan}
            onChange={value => onFieldChange('confirmPlan', value)}
          />
          <Checkbox
            label="I understand additional tests may be required depending on equipment condition."
            checked={formData.confirmExtraTests}
            onChange={value => onFieldChange('confirmExtraTests', value)}
          />
        </div>
      </section>
    </div>
  )
}

function StepReviewSubmit({ formData, onFieldChange }) {
  const testsSelected = [
    'Frequency Accuracy',
    'Amplitude Accuracy',
    'RBW / Bandwidth Verification',
    'Linearity Checks',
    'Noise Floor Measurement',
    'Trigger / Time-Base Accuracy',
    'Functional Checks',
  ]

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-4">Review &amp; Submission</h1>

      {/* Work order summary */}
      <section className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
        <h2 className="text-sm font-semibold text-gray-900">Work Order Summary</h2>
        <div className="grid md:grid-cols-4 gap-3 text-xs text-gray-800">
          <SummaryField label="Work Order Number" value={formData.workOrderNumber || '—'} />
          <SummaryField label="Job ID" value={formData.jobId || '—'} />
          <SummaryField
            label="Calibration Type"
            value={formData.calibrationType === 'instrument' ? 'Instrument' : 'Chamber'}
          />
          <SummaryField
            label="Preferred Date"
            value={
              formData.preferredDate
                ? new Date(formData.preferredDate).toLocaleDateString()
                : '—'
            }
          />
        </div>
      </section>

      {/* Equipment & scope */}
      <section className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
        <h2 className="text-sm font-semibold text-gray-900">Equipment Details</h2>
        <div className="grid md:grid-cols-3 gap-3 text-xs text-gray-800">
          <SummaryField
            label="Instrument / Chamber Type"
            value={formData.instrumentType || formData.chamberType || '—'}
          />
          <SummaryField label="Model Number" value={formData.modelNumber || '—'} />
          <SummaryField label="Serial Number" value={formData.serialNumber || '—'} />
          <SummaryField label="Manufacturer" value={formData.manufacturer || '—'} />
          <SummaryField
            label="Equipment Condition"
            value={formData.equipmentCondition || '—'}
          />
          <SummaryField
            label="Previous Certificate"
            value={formData.previousCert ? formData.previousCert.name : 'Not attached'}
          />
        </div>
      </section>

      {/* Calibration scope summary & tests */}
      <section className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
        <h2 className="text-sm font-semibold text-gray-900">Calibration Scope Summary</h2>
        <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-800">
          <div>
            <div className="text-xs font-semibold text-gray-500 mb-1">Scope Selected</div>
            <div>
              {[
                formData.scopeFull && 'Full Calibration',
                formData.scopeFunctional && 'Functional Verification',
                formData.scopeAdjustment && 'Adjustment Required',
              ]
                .filter(Boolean)
                .join(', ') || '—'}
            </div>
          </div>
          <div>
            <div className="text-xs font-semibold text-gray-500 mb-1">Special Instructions</div>
            <div>{formData.specialInstructions || 'None provided'}</div>
          </div>
        </div>

        <div className="pt-4 border-t border-dashed border-gray-200">
          <h3 className="text-xs font-semibold text-gray-500 mb-2">Tests to Be Performed</h3>
          <div className="grid md:grid-cols-2 gap-2 text-sm text-gray-800">
            {testsSelected.map(test => (
              <div key={test} className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-600" />
                <span>{test}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final document upload */}
      <section className="bg-white rounded-xl border border-gray-200 p-6 space-y-3">
        <h2 className="text-sm font-semibold text-gray-900">Final Document Upload</h2>
        <label className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-gray-300 rounded-xl py-6 cursor-pointer hover:border-blue-400 hover:bg-blue-50/40 transition-colors text-xs text-gray-600">
          <span>Drop files here or click to browse</span>
          <span className="text-[11px] text-gray-500">
            Purchase Order (PO), previous certificate, setup diagrams, access documents, or special
            instructions (PDF/DOC).
          </span>
          <input type="file" multiple className="hidden" />
        </label>
      </section>

      {/* Terms & approval */}
      <section className="bg-white rounded-xl border border-gray-200 p-6 space-y-3">
        <h2 className="text-sm font-semibold text-gray-900">Terms &amp; Approval</h2>
        <div className="space-y-2 text-sm text-gray-700">
          <Checkbox
            label="I confirm all details provided are accurate."
            checked={formData.termsAccurate}
            onChange={value => onFieldChange('termsAccurate', value)}
          />
          <Checkbox
            label="I approve the calibration plan."
            checked={formData.termsApprovePlan}
            onChange={value => onFieldChange('termsApprovePlan', value)}
          />
          <Checkbox
            label="I understand additional charges may apply for repairs/adjustments."
            checked={formData.termsCharges}
            onChange={value => onFieldChange('termsCharges', value)}
          />
        </div>
      </section>
    </div>
  )
}

function CalibrationSuccess({ formData, onReturnDashboard }) {
  const steps = [
    'Request Submitted',
    'Technician Review',
    'Schedule Confirmation',
    'Calibration in Progress',
    'Report & Certificate',
  ]

  const contacts = [
    { label: 'Technical Review', desc: 'A technician reviews your request and documents.' },
    { label: 'Scheduling Confirmation', desc: 'You will receive a call or email within 24–48 hours.' },
    { label: 'On-Site Service Details', desc: 'On-site jobs will get technician contact and arrival time.' },
    { label: 'Lab Service Instructions', desc: 'Lab jobs receive drop-off/shipping instructions.' },
    { label: 'Results & Certificate', desc: 'After calibration, results and certificate are uploaded.' },
  ]

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4">
      <div className="mb-6 flex items-center gap-2">
        <Settings className="w-6 h-6 text-primary" />
        <span className="font-semibold text-lg tracking-tight">240KW</span>
      </div>

      <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
        <CheckCircle className="w-9 h-9 text-green-600" />
      </div>
      <h1 className="text-3xl font-bold text-gray-900 mb-2">
        Your Calibration Request Has Been Submitted
      </h1>
      <p className="text-gray-600 max-w-2xl text-center mb-8">
        Our technical team is now reviewing your details and documents.
      </p>

      {/* Confirmation summary */}
      <section className="w-full max-w-3xl bg-white rounded-2xl border border-gray-200 shadow-sm p-6 mb-6 space-y-4">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-sm font-semibold text-gray-900">Confirmation Summary</h2>
          <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold">
            Submitted
          </span>
        </div>
        <div className="grid md:grid-cols-4 gap-3 text-xs text-gray-800">
          <SummaryField label="Work Order Number" value={formData.workOrderNumber || '—'} />
          <SummaryField label="Job ID" value={formData.jobId || '—'} />
          <SummaryField
            label="Calibration Type"
            value={formData.calibrationType === 'instrument' ? 'Instrument' : 'Chamber'}
          />
          <SummaryField
            label="Preferred Date"
            value={
              formData.preferredDate
                ? new Date(formData.preferredDate).toLocaleDateString()
                : '—'
            }
          />
        </div>
        <div className="mt-3 bg-blue-50 border border-blue-100 rounded-xl px-4 py-2 text-xs text-blue-800 flex items-start gap-2">
          <AlertCircle className="w-4 h-4 mt-0.5" />
          <span>A technician will reach out soon to confirm scheduling.</span>
        </div>
      </section>

      {/* Progress + what happens next */}
      <section className="w-full max-w-3xl bg-white rounded-2xl border border-gray-200 shadow-sm p-6 mb-6 space-y-4">
        <h2 className="text-sm font-semibold text-gray-900">Current Status: Under Review</h2>
        <div className="flex flex-wrap items-center gap-3 text-xs text-gray-700">
          {steps.map((s, index) => (
            <div key={s} className="flex items-center gap-1">
              <div
                className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
                  index === 0
                    ? 'bg-blue-600 text-white'
                    : index === 1
                    ? 'bg-gray-200 text-gray-600'
                    : 'bg-gray-100 text-gray-400'
                }`}
              >
                {index + 1}
              </div>
              <span>{s}</span>
              {index < steps.length - 1 && (
                <span className="mx-1 h-px w-4 bg-gray-300 inline-block" />
              )}
            </div>
          ))}
        </div>

        <div className="pt-4 border-t border-dashed border-gray-200 space-y-2 text-xs text-gray-700">
          <h3 className="font-semibold text-gray-900 mb-1">What Happens Next</h3>
          <ul className="space-y-1">
            {contacts.map(item => (
              <li key={item.label} className="flex items-start gap-2">
                <span className="mt-1 w-2 h-2 rounded-full bg-blue-500" />
                <div>
                  <span className="font-semibold">{item.label}</span>
                  <span className="ml-1 text-gray-600">{item.desc}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Need help */}
      <section className="w-full max-w-3xl bg-white rounded-2xl border border-gray-200 shadow-sm p-6 mb-6 space-y-3 text-sm text-gray-800">
        <h2 className="font-semibold text-gray-900">Need Help?</h2>
        <p className="text-gray-600">Our support team is here to assist you.</p>
        <div className="grid md:grid-cols-2 gap-4 text-sm">
          <div>
            <div className="text-xs font-semibold text-gray-500 mb-1">Call Support</div>
            <div>1-800-555-1234</div>
          </div>
          <div>
            <div className="text-xs font-semibold text-gray-500 mb-1">Email Support</div>
            <div>support@calibrationhub.com</div>
          </div>
        </div>
      </section>

      <div className="flex flex-col sm:flex-row gap-4 items-center justify-center mb-8">
        <button
          type="button"
          onClick={onReturnDashboard}
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </button>
      </div>

      <div className="flex items-center justify-end gap-6 text-sm text-gray-600 w-full max-w-4xl">
        <button type="button" className="hover:text-gray-900">
          Help
        </button>
        <button type="button" className="hover:text-gray-900">
          Privacy
        </button>
        <button type="button" className="hover:text-gray-900">
          Terms
        </button>
      </div>
    </div>
  )
}

function TextField({ label, ...props }) {
  return (
    <div>
      <label className="text-sm font-medium text-gray-700 mb-2 block">{label}</label>
      <InputBase {...props} />
    </div>
  )
}

function SelectField({ label, value, onChange, options, placeholder }) {
  return (
    <div>
      <label className="text-sm font-medium text-gray-700 mb-2 block">{label}</label>
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      >
        <option value="">{placeholder}</option>
        {options.map(opt => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </div>
  )
}

function TextArea({ ...props }) {
  return (
    <textarea
      rows={props.rows || 4}
      {...props}
      className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm ${
        props.className || ''
      }`}
    />
  )
}

function InputBase(props) {
  return (
    <input
      type="text"
      {...props}
      className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm ${
        props.className || ''
      }`}
    />
  )
}

function Checkbox({ label, checked, onChange }) {
  return (
    <label className="flex items-start gap-2 cursor-pointer">
      <input
        type="checkbox"
        checked={checked}
        onChange={e => onChange(e.target.checked)}
        className="mt-0.5 w-4 h-4 text-blue-600 rounded border-gray-300"
      />
      <span className="text-sm text-gray-700">{label}</span>
    </label>
  )
}

function SummaryField({ label, value }) {
  return (
    <div>
      <div className="text-[11px] text-gray-500 mb-0.5">{label}</div>
      <div className="text-xs text-gray-800">{value}</div>
    </div>
  )
}

export default CalibrationFlow


