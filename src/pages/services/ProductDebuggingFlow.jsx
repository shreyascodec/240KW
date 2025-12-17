import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Bug,
  Package,
  TestTube,
  Link as LinkIcon,
  FileText,
  Upload,
  ArrowLeft,
  ArrowRight,
  Save,
  CheckCircle,
  CheckCircle2,
  ClipboardList,
  Search,
  DollarSign,
} from 'lucide-react'
import toast from 'react-hot-toast'
import { useData } from '../../contexts/DataContext'

function ProductDebuggingFlow() {
  const navigate = useNavigate()
  const { addProduct, addOrder, addMessage } = useData()

  const [currentStep, setCurrentStep] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    // Product details
    eutName: '',
    quantity: '',
    manufacturer: '',
    modelNo: '',
    serialNo: '',
    supplyVoltage: '',
    operatingFrequency: '',
    current: '',
    weight: '',
    length: '',
    width: '',
    height: '',
    powerPorts: '',
    signalLines: '',
    softwareName: '',
    softwareVersion: '',

    // Industry / application
    industry: [],
    industryOther: '',

    // Documents
    documents: {},

    // Debugging details
    selectedTests: [],
    uploadedReports: [],
    observedIssues: '',

    // Engineer review
    issueCategory: 'EMI / EMC',
    severity: 'Low',
    confidenceScore: 75,
    debugPath: 'full', // 'recommendation' | 'full'
    engineerComments: '',
  })

  const steps = [
    { id: 'product', title: 'Product Details' },
    { id: 'documents', title: 'Technical Specification Documents' },
    { id: 'debug', title: 'Product Debugging Details' },
    { id: 'review', title: 'Request under Review' },
    { id: 'issues', title: 'Issue Identification & Review' },
    { id: 'submit', title: 'Submit Request' },
  ]

  const isSuccess = currentStep >= steps.length

  const handleFieldChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleArrayToggle = (field, value) => {
    setFormData(prev => {
      const current = prev[field] || []
      const updated = current.includes(value)
        ? current.filter(item => item !== value)
        : [...current, value]
      return { ...prev, [field]: updated }
    })
  }

  const handleFileUpload = (docType, file) => {
    if (!file) return
    setFormData(prev => ({
      ...prev,
      documents: {
        ...prev.documents,
        [docType]: file.name,
      },
    }))
    toast.success(`${docType} uploaded successfully`)
  }

  const handleReportUpload = files => {
    if (!files || files.length === 0) return
    const names = Array.from(files).map(f => f.name)
    setFormData(prev => ({
      ...prev,
      uploadedReports: [...prev.uploadedReports, ...names],
    }))
    toast.success('Test reports uploaded successfully')
  }

  const handleNext = () => {
    // Simple validations
    if (currentStep === 0) {
      if (!formData.eutName || !formData.quantity || !formData.manufacturer || !formData.modelNo) {
        toast.error('Please fill in all required Product Details fields.')
        return
      }
    }

    if (currentStep === 1) {
      if (Object.keys(formData.documents).length === 0) {
        toast.error('Please upload at least one technical document.')
        return
      }
    }

    if (currentStep === 2) {
      if (formData.selectedTests.length === 0) {
        toast.error('Select at least one test area to debug.')
        return
      }
      if (formData.uploadedReports.length === 0) {
        toast.error('Upload at least one failed test report.')
        return
      }
    }

    if (currentStep < steps.length - 1) {
      setCurrentStep(step => step + 1)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } else {
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

  const handleSaveDraft = () => {
    localStorage.setItem('product_debugging_draft', JSON.stringify(formData))
    toast.success('Draft saved successfully.')
  }

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true)

      const product = addProduct({
        name: formData.eutName || 'Debugging Request',
        service: 'Product Debugging',
        description:
          'Debugging request for ' +
          (formData.eutName || 'product') +
          (formData.modelNo ? ` (Model ${formData.modelNo})` : ''),
        category: 'Electronics',
      })

      addOrder({
        productId: product.id,
        productName: product.name,
        service: 'Product Debugging',
        status: 'Awaiting',
        total: 2400,
      })

      addMessage({
        from: 'Debugging Team',
        subject: `Debugging request submitted for ${product.name}`,
        body:
          'Your debugging request has been submitted. Our engineers are analyzing your test reports and will notify you once diagnostics and issue identification are complete.',
        type: 'notification',
      })

      setCurrentStep(steps.length)
      toast.success('Diagnostics & debugging initiated!')
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
          <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bug className="w-6 h-6 text-primary" />
              <span className="font-semibold text-lg tracking-tight">240KW</span>
            </div>
          </div>
        </div>
      )}

      <div className="flex-1 max-w-6xl mx-auto px-4 lg:px-6 py-8">
        {isSuccess ? (
          <DebuggingSuccess
            formData={formData}
            onReturnDashboard={() => navigate('/customer/dashboard')}
            onViewSubmitted={() => navigate('/customer/order-history')}
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
                    <StepProductDetails formData={formData} onFieldChange={handleFieldChange} />
                  )}
                  {currentStep === 1 && (
                    <StepDocuments formData={formData} onFileUpload={handleFileUpload} />
                  )}
                  {currentStep === 2 && (
                    <StepDebugDetails
                      formData={formData}
                      onArrayToggle={handleArrayToggle}
                      onReportUpload={handleReportUpload}
                      onFieldChange={handleFieldChange}
                    />
                  )}
                  {currentStep === 3 && <StepUnderReview />}
                  {currentStep === 4 && (
                    <StepIssueIdentification formData={formData} onFieldChange={handleFieldChange} />
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
                    onClick={handleSaveDraft}
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
                    {currentStep === steps.length - 1 ? 'Submit Request' : 'Next'}
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Footer links */}
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

function StepProductDetails({ formData, onFieldChange }) {
  const industries = [
    'Telecommunication',
    'Medical',
    'Automotive',
    'Industrial Equipment',
    'Consumer Electronics',
    'IoT',
    'Aerospace & Defense',
    'Energy & Power',
    'Others',
  ]

  const toggleIndustry = value => {
    onFieldChange(
      'industry',
      formData.industry.includes(value)
        ? formData.industry.filter(i => i !== value)
        : [...formData.industry, value],
    )
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-4">Product Details</h1>

      {/* Basic Equipment Information */}
      <section className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center gap-2 mb-4">
          <Package className="w-5 h-5 text-blue-600" />
          <h2 className="text-lg font-semibold text-gray-900">Basic Equipment Information</h2>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <TextField
            required
            label="Name of EUT *"
            placeholder="Exact product name or identifier"
            value={formData.eutName}
            onChange={value => onFieldChange('eutName', value)}
          />
          <TextField
            required
            label="Quantity of EUT *"
            placeholder="Number of units"
            value={formData.quantity}
            onChange={value => onFieldChange('quantity', value)}
          />
          <div className="md:col-span-2">
            <TextArea
              required
              label="Manufacturer / Make & Address *"
              placeholder="Official manufacturer details and complete address"
              value={formData.manufacturer}
              onChange={value => onFieldChange('manufacturer', value)}
            />
          </div>
          <TextField
            required
            label="Model No. *"
            placeholder="Model number or variant"
            value={formData.modelNo}
            onChange={value => onFieldChange('modelNo', value)}
          />
          <TextField
            label="Serial No."
            placeholder="Serial or batch number"
            value={formData.serialNo}
            onChange={value => onFieldChange('serialNo', value)}
          />
        </div>
      </section>

      {/* Technical Specifications */}
      <section className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center gap-2 mb-4">
          <TestTube className="w-5 h-5 text-blue-600" />
          <h2 className="text-lg font-semibold text-gray-900">Technical Specifications</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          <TextField
            required
            label="Supply Voltage *"
            placeholder="e.g., 220V AC ± 10%"
            value={formData.supplyVoltage}
            onChange={value => onFieldChange('supplyVoltage', value)}
          />
          <TextField
            label="Operating Frequency"
            placeholder="e.g., 2.4 GHz - 2.5 GHz"
            value={formData.operatingFrequency}
            onChange={value => onFieldChange('operatingFrequency', value)}
          />
          <TextField
            required
            label="Current *"
            placeholder="e.g., 2.5A max"
            value={formData.current}
            onChange={value => onFieldChange('current', value)}
          />
          <TextField
            required
            label="Weight (Kg) *"
            placeholder="Physical weight"
            value={formData.weight}
            onChange={value => onFieldChange('weight', value)}
          />
          <div className="md:col-span-2">
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              Dimensions (L x W x H) *
            </label>
            <div className="grid grid-cols-3 gap-2">
              <InputBase
                placeholder="Length (mm)"
                value={formData.length}
                onChange={e => onFieldChange('length', e.target.value)}
              />
              <InputBase
                placeholder="Width (mm)"
                value={formData.width}
                onChange={e => onFieldChange('width', e.target.value)}
              />
              <InputBase
                placeholder="Height (mm)"
                value={formData.height}
                onChange={e => onFieldChange('height', e.target.value)}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Connectivity & Interfaces */}
      <section className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center gap-2 mb-4">
          <LinkIcon className="w-5 h-5 text-blue-600" />
          <h2 className="text-lg font-semibold text-gray-900">Connectivity & Interfaces</h2>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <TextField
            required
            label="No. of Power Ports & Connector Type *"
            placeholder="e.g., 1x IEC C14 inlet, 1x DC barrel jack (5.5mm)"
            value={formData.powerPorts}
            onChange={value => onFieldChange('powerPorts', value)}
          />
          <TextField
            required
            label="No. of Signal Lines & Connector Type *"
            placeholder="e.g., 2x USB-A, 1x Ethernet RJ45, 1x HDMI"
            value={formData.signalLines}
            onChange={value => onFieldChange('signalLines', value)}
          />
        </div>
      </section>

      {/* Software Information */}
      <section className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center gap-2 mb-4">
          <TestTube className="w-5 h-5 text-blue-600" />
          <h2 className="text-lg font-semibold text-gray-900">Software Information</h2>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <TextField
            label="Name of the Software"
            placeholder="Software/firmware name"
            value={formData.softwareName}
            onChange={value => onFieldChange('softwareName', value)}
          />
          <TextField
            label="Software Version No."
            placeholder="e.g., v2.1.4 or build 20251201"
            value={formData.softwareVersion}
            onChange={value => onFieldChange('softwareVersion', value)}
          />
        </div>
      </section>

      {/* Industry / Application */}
      <section className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center gap-2 mb-4">
          <TestTube className="w-5 h-5 text-blue-600" />
          <h2 className="text-lg font-semibold text-gray-900">Industry / Application</h2>
        </div>
        <p className="text-sm text-gray-600 mb-4">
          Select the industry or application category where the EUT will be used. This helps
          identify relevant standards and debugging context.
        </p>
        <div className="grid md:grid-cols-3 gap-3 mb-4">
          {industries.map(ind => (
            <label key={ind} className="flex items-center gap-2 text-sm cursor-pointer">
              <input
                type="checkbox"
                checked={formData.industry.includes(ind)}
                onChange={() => toggleIndustry(ind)}
                className="w-4 h-4 text-blue-600 rounded border-gray-300"
              />
              <span>{ind}</span>
            </label>
          ))}
        </div>
        {formData.industry.includes('Others') && (
          <InputBase
            placeholder="If Others, please specify..."
            value={formData.industryOther}
            onChange={e => onFieldChange('industryOther', e.target.value)}
          />
        )}
      </section>
    </div>
  )
}

function StepDocuments({ formData, onFileUpload }) {
  const documentTypes = [
    'Circuit Diagram / Schematic',
    'Product Datasheet',
    'PCB Layout (Gerber Files)',
    'DUT Operation Manual',
    'Previous Reports',
    'Firmware Details',
  ]

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-4">Technical Specification Documents</h1>
      <section className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
        {documentTypes.map(type => (
          <div
            key={type}
            className="flex items-center justify-between gap-4 p-4 rounded-lg border border-gray-200 hover:border-blue-500 transition-colors"
          >
            <div className="flex items-center gap-3">
              <FileText className="w-5 h-5 text-blue-600" />
              <div>
                <div className="font-medium text-gray-900">{type}</div>
                <div className="text-xs text-gray-500">
                  {formData.documents[type]
                    ? `Uploaded: ${formData.documents[type]}`
                    : 'Upload relevant document for this category'}
                </div>
              </div>
            </div>
            <label className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 cursor-pointer">
              <Upload className="w-4 h-4" />
              <span>{formData.documents[type] ? 'Replace' : 'Upload'}</span>
              <input
                type="file"
                className="hidden"
                onChange={e => onFileUpload(type, e.target.files?.[0])}
              />
            </label>
          </div>
        ))}
      </section>
    </div>
  )
}

function StepDebugDetails({ formData, onArrayToggle, onReportUpload, onFieldChange }) {
  const testOptions = [
    'Conducted EMI',
    'Radiated EMI',
    'ESD',
    'Surge / EFT',
    'Harmonics & Flicker',
    'RF Emissions',
    'Power Quality',
    'Functional Testing',
    'Custom Test',
  ]

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-4">Product Debugging – Targeted Testing</h1>

      {/* Select Testing to Debug */}
      <section className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <ClipboardList className="w-5 h-5 text-blue-600" />
          <h2 className="text-lg font-semibold text-gray-900">Select Testing to Debug</h2>
        </div>
        <p className="text-sm text-gray-600 mb-2">
          Select the testing areas where issues were observed and need debugging.
        </p>
        <div className="grid md:grid-cols-3 gap-3">
          {testOptions.map(option => (
            <button
              key={option}
              type="button"
              onClick={() => onArrayToggle('selectedTests', option)}
              className={`text-left px-4 py-2.5 rounded-lg border text-sm transition-all ${
                formData.selectedTests.includes(option)
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50/40'
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      </section>

      {/* Upload test reports */}
      <section className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <Upload className="w-5 h-5 text-blue-600" />
          <h2 className="text-lg font-semibold text-gray-900">
            Upload Test Reports <span className="text-xs text-red-500">(Mandatory)</span>
          </h2>
        </div>
        <p className="text-sm text-gray-600">
          Upload the failed or problematic test reports from your lab. This helps our engineers
          analyze and identify issues accurately.
        </p>
        <label className="mt-2 flex flex-col items-center justify-center gap-2 border-2 border-dashed border-gray-300 rounded-xl py-8 cursor-pointer hover:border-blue-400 hover:bg-blue-50/40 transition-colors">
          <span className="text-sm text-gray-700 font-medium">
            Drag and drop files here or click to browse
          </span>
          <span className="text-xs text-gray-500">
            Supported formats: PDF, PNG, JPG, DOCX
          </span>
          <input
            type="file"
            multiple
            className="hidden"
            onChange={e => onReportUpload(e.target.files)}
          />
        </label>
        {formData.uploadedReports.length > 0 && (
          <div className="pt-4 border-t border-dashed border-gray-200">
            <div className="text-xs font-semibold text-gray-500 mb-2">Uploaded Reports</div>
            <ul className="space-y-1 text-xs text-gray-700">
              {formData.uploadedReports.map(name => (
                <li key={name} className="flex items-center gap-2">
                  <FileText className="w-3 h-3 text-blue-500" />
                  {name}
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>

      {/* Describe Observed Issues */}
      <section className="bg-white rounded-xl border border-gray-200 p-6 space-y-3">
        <div className="flex items-center gap-2 mb-2">
          <Bug className="w-5 h-5 text-blue-600" />
          <h2 className="text-lg font-semibold text-gray-900">
            Describe Observed Issues <span className="text-xs text-gray-500">(Optional)</span>
          </h2>
        </div>
        <TextArea
          label="Describe symptoms, failure points, unusual waveforms, or any observations..."
          value={formData.observedIssues}
          onChange={value => onFieldChange('observedIssues', value)}
        />
        <p className="mt-1 text-xs text-blue-700 bg-blue-50 rounded-lg px-3 py-2 flex items-start gap-2">
          <span className="mt-1 w-2 h-2 rounded-full bg-blue-500" />
          <span>
            Next Step: After submission, our engineers will perform issue identification and
            diagnostics based on your uploaded reports.
          </span>
        </p>
      </section>
    </div>
  )
}

function StepUnderReview() {
  return (
    <div className="space-y-8 flex flex-col items-center text-center">
      <div className="mt-8">
        <Search className="w-14 h-14 text-blue-600 mx-auto mb-4" />
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Your Debugging Request is Under Review
        </h1>
        <p className="text-gray-600 max-w-xl">
          Our engineers are analyzing your test reports and identifying the root cause of the issue.
          We&apos;ll notify you as soon as the diagnostics phase is complete.
        </p>
      </div>
      <div className="bg-blue-50 border border-blue-100 rounded-xl px-4 py-3 text-sm text-blue-800 flex items-start gap-2 max-w-xl">
        <span className="mt-1 w-2 h-2 rounded-full bg-blue-500" />
        <span>No action needed from your side. We&apos;ll keep you updated.</span>
      </div>
    </div>
  )
}

function StepIssueIdentification({ formData, onFieldChange }) {
  const costBreakdown = [
    { label: 'Analysis & Planning', value: 600 },
    { label: 'Hardware Modifications', value: 900 },
    { label: 'Testing & Validation', value: 700 },
    { label: 'Documentation', value: 200 },
  ]

  const detectedIssues = [
    'Excessive conducted emissions in mid-frequency range (2–9MHz)',
    'Power supply switching noise propagating through AC mains',
    'Insufficient input filtering on primary power stage',
    'Ground loop potential detected in chassis-to-earth connection',
  ]

  const predictedCost = 2400
  const variance = 300

  const severityOptions = ['Low', 'Medium', 'High']

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Issue Identification & Engineer Review</h1>
      <p className="text-gray-600">
        Review AI-extracted insights along with engineering assessment and select your preferred
        debugging path.
      </p>

      <div className="grid lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] gap-6">
        {/* Left: issue summary + engineer review */}
        <div className="space-y-6">
          {/* Issue Identification Summary */}
          <section className="bg-white rounded-xl border border-gray-200 p-6 space-y-3">
            <div className="flex items-center gap-2 mb-2">
              <Search className="w-5 h-5 text-blue-600" />
              <h2 className="text-lg font-semibold text-gray-900">Issue Identification Summary</h2>
            </div>
            <div className="text-sm">
              <div className="mb-2">
                <span className="font-semibold text-gray-700">Detected Test Type:</span>{' '}
                <span className="text-gray-800">Conducted EMI Testing</span>
              </div>
              <div className="mb-1 font-semibold text-gray-700">Report Parsing Summary</div>
              <p className="text-gray-600 text-sm mb-3">
                Test report analyzed for frequency range 150kHz – 30MHz. Multiple exceedances
                detected in the 2–5MHz range with peak violations at 3.2MHz (+8dB above limit).
                Power supply harmonics showing non-compliance patterns.
              </p>
              <div className="mb-1 font-semibold text-gray-700">Initial Issues Identified</div>
              <ul className="space-y-1 text-sm text-gray-700">
                {detectedIssues.map(issue => (
                  <li key={issue} className="flex items-start gap-2">
                    <span className="mt-1 w-2 h-2 rounded-full bg-yellow-400" />
                    <span>{issue}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* Technician / Engineer review */}
          <section className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <Bug className="w-5 h-5 text-blue-600" />
              <h2 className="text-lg font-semibold text-gray-900">
                Technician / Engineer Review Commenting
              </h2>
            </div>
            <TextArea
              label="Comments"
              placeholder="Write to the technician / engineer…"
              value={formData.engineerComments}
              onChange={value => onFieldChange('engineerComments', value)}
            />

            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Issue Category</label>
                <select
                  value={formData.issueCategory}
                  onChange={e => onFieldChange('issueCategory', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="EMI / EMC">EMI / EMC Category</option>
                  <option value="Thermal">Thermal / Power</option>
                  <option value="Functional">Functional Behavior</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Severity Rating</label>
                <select
                  value={formData.severity}
                  onChange={e => onFieldChange('severity', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {severityOptions.map(option => (
                    <option key={option} value={option}>
                      {option} Severity
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">
                  Issue Confidence Score
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={formData.confidenceScore}
                    onChange={e => onFieldChange('confidenceScore', Number(e.target.value))}
                    className="flex-1"
                  />
                  <span className="text-xs text-gray-700 w-12 text-right">
                    {formData.confidenceScore}%
                  </span>
                </div>
              </div>
            </div>

            {/* Debug path selection */}
            <div className="pt-4 border-t border-dashed border-gray-200">
              <div className="text-sm font-semibold text-gray-800 mb-3">Debug Path Selection</div>
              <div className="grid md:grid-cols-2 gap-4">
                <SelectableCard
                  active={formData.debugPath === 'recommendation'}
                  title="Recommendation Only"
                  description="Only provide debugging recommendations based on the identified issue. No hands-on debugging required."
                  onClick={() => onFieldChange('debugPath', 'recommendation')}
                />
                <SelectableCard
                  active={formData.debugPath === 'full'}
                  title="Full Debugging"
                  description="Proceed with full debugging including fix strategy, implementation planning, and retesting pathway."
                  highlight
                  onClick={() => onFieldChange('debugPath', 'full')}
                />
              </div>
            </div>
          </section>
        </div>

        {/* Right: Estimated cost */}
        <section className="bg-white rounded-xl border border-gray-200 p-6 space-y-4 self-start">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="w-5 h-5 text-green-600" />
            <h2 className="text-lg font-semibold text-gray-900">Estimated Debug Cost</h2>
          </div>
          <div className="text-center py-2">
            <div className="text-xs uppercase tracking-wide text-gray-500 mb-1">
              Predicted Cost Range
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">
              ${predictedCost.toLocaleString()}
            </div>
            <div className="text-xs text-gray-500">± ${variance}</div>
          </div>
          <div className="space-y-1 text-sm text-gray-700">
            {costBreakdown.map(item => (
              <div key={item.label} className="flex items-center justify-between">
                <span>{item.label}</span>
                <span>${item.value.toLocaleString()}</span>
              </div>
            ))}
          </div>
          <p className="mt-2 text-xs text-gray-500 flex items-start gap-2">
            <span className="mt-1 w-2 h-2 rounded-full bg-blue-500" />
            <span>
              This is an approximate cost. Actual cost depends on debugging complexity and required
              iterations.
            </span>
          </p>
          <div className="pt-3 border-t border-dashed border-gray-200 text-sm">
            <div className="text-xs font-semibold text-gray-500 mb-1">Estimated Timeline</div>
            <div className="flex items-center gap-2 text-gray-800">
              <ClockIcon />
              <span>3–5 business days</span>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

function DebuggingSuccess({ formData, onReturnDashboard, onViewSubmitted }) {
  const issues = [
    'Memory leak in user authentication module',
    'Database connection timeout errors',
    'API response delays in payment gateway',
    'Frontend rendering inconsistencies',
  ]

  const stages = [
    { label: 'Diagnostics Completed', status: 'Finished' },
    { label: 'Debugging & Implementation', status: 'In Progress' },
    { label: 'Retesting', status: 'Pending' },
    { label: 'Final Report Delivery', status: 'Pending' },
  ]

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4">
      <div className="mb-6 flex items-center gap-2">
        <Bug className="w-6 h-6 text-primary" />
        <span className="font-semibold text-lg tracking-tight">240KW</span>
      </div>

      <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
        <CheckCircle className="w-9 h-9 text-green-600" />
      </div>
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Diagnostics & Debugging Initiated</h1>
      <p className="text-gray-600 max-w-2xl text-center mb-8">
        Our engineering team has begun evaluating the issues identified from your test reports.
      </p>

      <section className="w-full max-w-3xl bg-white rounded-2xl border border-gray-200 shadow-sm p-6 mb-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h2 className="text-sm font-semibold text-gray-800 mb-2">
              Diagnostics Outcome Summary
            </h2>
            <div className="text-xs font-semibold text-gray-500 mb-1">Detected Issues</div>
            <ul className="space-y-1 text-sm text-gray-700">
              {issues.map(issue => (
                <li key={issue} className="flex items-start gap-2">
                  <span className="mt-1 w-2 h-2 rounded-full bg-red-400" />
                  <span>{issue}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="text-sm font-semibold text-gray-800 mb-2">Service Path Selected</h2>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 text-blue-700 text-xs font-medium mb-3">
              <Bug className="w-3 h-3" />
              {formData.debugPath === 'recommendation'
                ? 'Recommendation Only'
                : 'Full Debugging + Fix Implementation'}
            </div>
            <div className="text-xs font-semibold text-gray-500 mb-1">Your Submitted Reports</div>
            <ul className="space-y-1 text-xs text-gray-700">
              {formData.uploadedReports.length > 0 ? (
                formData.uploadedReports.map(name => (
                  <li key={name} className="flex items-center gap-2">
                    <FileText className="w-3 h-3 text-blue-500" />
                    {name}
                  </li>
                ))
              ) : (
                <li className="text-gray-500">Reports linked from your previous upload.</li>
              )}
            </ul>
          </div>
        </div>

        {/* What happens next */}
        <div className="mt-6 pt-4 border-t border-dashed border-gray-200">
          <div className="text-xs font-semibold text-gray-500 mb-3">What Happens Next</div>
          <div className="grid md:grid-cols-4 gap-4 text-xs text-gray-700">
            {stages.map((stage, idx) => (
              <div key={stage.label} className="flex flex-col items-start gap-1">
                <div className="flex items-center gap-2">
                  <span
                    className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
                      idx === 0
                        ? 'bg-green-100 text-green-700'
                        : idx === 1
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-gray-100 text-gray-500'
                    }`}
                  >
                    {idx + 1}
                  </span>
                  <span className="font-medium">{stage.label}</span>
                </div>
                <span
                  className={`text-[11px] ${
                    idx === 0
                      ? 'text-green-600'
                      : idx === 1
                      ? 'text-blue-600'
                      : 'text-gray-500'
                  }`}
                >
                  {stage.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Info message */}
        <div className="mt-6 bg-blue-50 border border-blue-100 rounded-xl px-4 py-3 text-sm text-blue-800 flex items-start gap-2">
          <span className="mt-1 w-2 h-2 rounded-full bg-blue-500" />
          <span>
            You don&apos;t need to take any further action. Our engineers will notify you once a
            detailed debugging report is ready. Time varies based on complexity; no fixed ETA.
          </span>
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
        <button
          type="button"
          onClick={onViewSubmitted}
          className="inline-flex items-center gap-2 text-sm text-gray-700 hover:text-gray-900"
        >
          <ClipboardList className="w-4 h-4" />
          View Submitted Data
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

function TextField({ label, required, ...props }) {
  return (
    <div>
      <label className="text-sm font-medium text-gray-700 mb-2 block">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      <InputBase {...props} />
    </div>
  )
}

function TextArea({ label, required, ...props }) {
  return (
    <div>
      {label && (
        <label className="text-sm font-medium text-gray-700 mb-2 block">
          {label}
          {required && <span className="text-red-500 ml-0.5">*</span>}
        </label>
      )}
      <textarea
        rows={props.rows || 4}
        {...props}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
      />
    </div>
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

function SelectableCard({ active, title, description, highlight, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`text-left w-full h-full p-4 rounded-xl border transition-all ${
        active
          ? highlight
            ? 'border-blue-600 bg-blue-50 shadow-sm'
            : 'border-gray-800 bg-gray-50'
          : 'border-gray-200 hover:border-blue-400 hover:bg-blue-50/40'
      }`}
    >
      <div className="font-semibold text-gray-900 mb-1">{title}</div>
      <p className="text-xs text-gray-600">{description}</p>
    </button>
  )
}

function ClockIcon() {
  return (
    <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-gray-100 text-gray-600 text-[10px]">
      ⏱
    </span>
  )
}

export default ProductDebuggingFlow


