import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  CheckCircle,
  ArrowLeft,
  ArrowRight,
  Save,
  Cpu,
  FileText,
  ClipboardList,
  Send,
  Package,
  TestTube,
  Zap,
  Link as LinkIcon,
  DollarSign,
  Upload,
  CheckCircle2,
} from 'lucide-react'
import toast from 'react-hot-toast'
import { useData } from '../../contexts/DataContext'

function SimulationFlow() {
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

    // Industry / application
    industry: [],
    industryOther: '',

    // Documents
    documents: {},

    // Simulation details
    productType: 'new',
    simulationCategories: [],
    additionalSimulations: [],
    selectedSimulations: [],
  })

  const steps = [
    { id: 'product', title: 'Product Details' },
    { id: 'documents', title: 'Technical Specification Documents' },
    { id: 'details', title: 'Simulation Details' },
    { id: 'submit', title: 'Submit for Simulation' },
  ]

  const simulationCategories = [
    'EMC Simulation',
    'Thermal Simulation',
    'Power Integrity / Signal Integrity',
    'Safety Margin Checks',
    'Compliance Pre-Checks (based on earlier standards)',
  ]

  const additionalOptions = [
    { key: 'pcbEmi', label: 'PCB-level EMI', description: 'Analysis' },
    { key: 'highPowerSurge', label: 'High-Power Surge', description: 'Simulation' },
    { key: 'mechanicalStress', label: 'Mechanical Stress', description: 'FEA' },
  ]

  const basePrice = 4000
  const pricePerAdditional = 500

  const estimatedPrice = useMemo(() => {
    const extraCount = formData.additionalSimulations.length
    return basePrice + extraCount * pricePerAdditional
  }, [formData.additionalSimulations.length])

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

  const handleNext = () => {
    // Simple per-step validation
    if (currentStep === 0) {
      if (!formData.eutName || !formData.quantity || !formData.modelNo) {
        toast.error('Please complete the required Product Details fields.')
        return
      }
    }

    if (currentStep === 1) {
      if (Object.keys(formData.documents).length === 0) {
        toast.error('Please upload at least one technical document.')
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
    localStorage.setItem('simulation_flow_draft', JSON.stringify(formData))
    toast.success('Draft saved successfully.')
  }

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true)

      // Create a simulated product & order in the existing data context
      const product = addProduct({
        name: formData.eutName || 'Simulation Project',
        service: 'Simulation',
        description:
          'Simulation request for ' +
          (formData.eutName || 'product') +
          (formData.modelNo ? ` (Model ${formData.modelNo})` : ''),
        category: 'Electronics',
      })

      addOrder({
        productId: product.id,
        productName: product.name,
        service: 'Simulation',
        status: 'Awaiting',
        total: estimatedPrice,
      })

      addMessage({
        from: 'Simulation Team',
        subject: `Simulation request submitted for ${product.name}`,
        body:
          'Your design has been submitted for simulation. Our team will review the documents and simulation requirements and notify you once the results are ready.',
        type: 'notification',
      })

      setCurrentStep(steps.length) // move to success screen
      toast.success('Design submitted for simulation!')
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } finally {
      setIsSubmitting(false)
    }
  }

  const isSuccess = currentStep >= steps.length

  // Sidebar step states
  const sidebarSteps = steps.map((step, index) => ({
    ...step,
    completed: !isSuccess && index < currentStep,
    active: !isSuccess && index === currentStep,
  }))

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Top brand bar */}
      {!isSuccess && (
        <div className="bg-white border-b">
          <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Cpu className="w-6 h-6 text-primary" />
              <span className="font-semibold text-lg tracking-tight">240KW</span>
            </div>
          </div>
        </div>
      )}

      <div className="flex-1 max-w-6xl mx-auto px-4 lg:px-6 py-8">
        {isSuccess ? (
          <SuccessScreen
            onReturnDashboard={() => navigate('/customer/dashboard')}
            onViewDetails={() => navigate('/customer/order-history')}
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
                    <StepSimulationDetails
                      formData={formData}
                      onFieldChange={handleFieldChange}
                      onArrayToggle={handleArrayToggle}
                      simulationCategories={simulationCategories}
                      additionalOptions={additionalOptions}
                      estimatedPrice={estimatedPrice}
                    />
                  )}
                  {currentStep === 3 && (
                    <StepReview formData={formData} estimatedPrice={estimatedPrice} />
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
                    {currentStep === steps.length - 1 ? 'Submit for Simulation' : 'Next'}
                    {currentStep === steps.length - 1 ? (
                      <Send className="w-4 h-4" />
                    ) : (
                      <ArrowRight className="w-4 h-4" />
                    )}
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
    </div>
  )
}

function StepDocuments({ formData, onFileUpload }) {
  const documentTypes = [
    'Circuit Diagram',
    'PCB Gerber Files',
    'Block Diagram',
    'Component List / BOM',
    'Ratings & Power Specs',
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

function StepSimulationDetails({
  formData,
  onFieldChange,
  onArrayToggle,
  simulationCategories,
  additionalOptions,
  estimatedPrice,
}) {
  const toggleAdditional = key => {
    onArrayToggle('additionalSimulations', key)
    const option = additionalOptions.find(o => o.key === key)
    if (!option) return
    const label = option.label
    const already = formData.selectedSimulations.includes(label)
    if (already) {
      onArrayToggle('selectedSimulations', label)
    } else {
      onArrayToggle('selectedSimulations', label)
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-1">Simulation Details</h1>
      <p className="text-gray-600 mb-4">
        Configure your EMC &amp; Safety simulation parameters for this design.
      </p>

      {/* Product Type Selection */}
      <section className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
        <h2 className="text-lg font-semibold text-gray-900 mb-2">Product Type Selection</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <SelectableCard
            active={formData.productType === 'new'}
            onClick={() => onFieldChange('productType', 'new')}
            title="New Product"
            description="Start simulation for a brand-new design."
          />
          <SelectableCard
            active={formData.productType === 'retest'}
            onClick={() => onFieldChange('productType', 'retest')}
            title="Retesting Existing Product"
            description="Upload previous lab failure reports to help us run targeted simulations."
            icon="retry"
          />
        </div>
      </section>

      {/* Simulation Requirements Overview */}
      <section className="bg-white rounded-xl border border-gray-200 p-6 space-y-3">
        <h2 className="text-lg font-semibold text-gray-900 mb-2">
          Simulation Requirements Overview
        </h2>
        {simulationCategories.map(cat => (
          <button
            key={cat}
            type="button"
            onClick={() => onArrayToggle('simulationCategories', cat)}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-lg border text-left text-sm ${
              formData.simulationCategories.includes(cat)
                ? 'border-blue-500 bg-blue-50 text-blue-700'
                : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50/40'
            }`}
          >
            <span>{cat}</span>
            {formData.simulationCategories.includes(cat) && (
              <CheckCircle2 className="w-4 h-4 text-blue-600" />
            )}
          </button>
        ))}
        <p className="mt-3 text-xs text-gray-500 flex items-start gap-2">
          <InfoDot />
          <span>
            These requirements were automatically generated based on your selected standards and
            EUT parameters. You can fine-tune them in advanced settings later.
          </span>
        </p>
      </section>

      {/* Additional Simulation Options */}
      <section className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
        <h2 className="text-lg font-semibold text-gray-900 mb-2">Additional Simulation Options</h2>
        <p className="text-sm text-gray-600 mb-4">
          Optional simulations that can provide additional insights into your design.
        </p>
        <div className="grid md:grid-cols-3 gap-4">
          {additionalOptions.map(option => (
            <button
              key={option.key}
              type="button"
              onClick={() => toggleAdditional(option.key)}
              className={`text-left p-4 rounded-xl border flex flex-col gap-2 transition-all ${
                formData.additionalSimulations.includes(option.key)
                  ? 'border-blue-500 bg-blue-50 shadow-sm'
                  : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50/40'
              }`}
            >
              <div className="flex items-center gap-2">
                <TestTube className="w-5 h-5 text-blue-600" />
                <div className="font-medium text-gray-900">{option.label}</div>
              </div>
              <div className="text-xs text-gray-500">{option.description}</div>
            </button>
          ))}
        </div>

        {/* Selected simulations */}
        {formData.selectedSimulations.length > 0 && (
          <div className="pt-4 border-t border-dashed border-gray-200">
            <div className="text-xs font-semibold text-gray-500 mb-2">
              Selected Simulations
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.selectedSimulations.map(item => (
                <span
                  key={item}
                  className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Estimated price */}
        <div className="mt-4 flex items-center justify-between border-t pt-4">
          <div>
            <div className="text-xs font-semibold text-gray-500 flex items-center gap-1">
              <DollarSign className="w-4 h-4 text-blue-600" />
              Estimated Price
            </div>
            <div className="text-xl font-bold text-gray-900">
              ${estimatedPrice.toLocaleString()}
            </div>
            <p className="text-xs text-gray-500 max-w-md mt-1">
              This is an automatically generated estimate to help you plan your design verification
              journey. Final pricing may vary based on simulation complexity and additional testing
              requirements.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}

function StepReview({ formData, estimatedPrice }) {
  const summaryItems = [
    'Technical Specifications',
    'Uploaded Design Documents',
    'Simulation Configuration & Options',
    'Estimated Pricing & Timeline',
  ]

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-1">Submit for Simulation</h1>
      <p className="text-gray-600 mb-4">
        Review your details before submitting. You can still edit fields by navigating back to
        previous steps.
      </p>

      <section className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
        <h2 className="text-lg font-semibold text-gray-900 mb-2">Submission Summary</h2>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="text-xs font-semibold text-gray-500">Product</div>
            <div className="text-sm text-gray-900">
              {formData.eutName || '—'}{' '}
              {formData.modelNo && <span className="text-gray-500">({formData.modelNo})</span>}
            </div>
            <div className="text-xs text-gray-500">
              Qty: {formData.quantity || '—'} • Voltage: {formData.supplyVoltage || '—'} • Current:{' '}
              {formData.current || '—'}
            </div>
          </div>
          <div className="space-y-2">
            <div className="text-xs font-semibold text-gray-500">Simulation Profile</div>
            <div className="text-sm text-gray-900 capitalize">
              Product type: {formData.productType === 'retest' ? 'Retesting Existing Product' : 'New Product'}
            </div>
            <div className="text-xs text-gray-500">
              Categories:{' '}
              {formData.simulationCategories.length > 0
                ? formData.simulationCategories.join(', ')
                : 'None selected'}
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-dashed border-gray-200">
          <div className="text-xs font-semibold text-gray-500 mb-2">Included Items</div>
          <ul className="space-y-2">
            {summaryItems.map(item => (
              <li key={item} className="flex items-center gap-2 text-sm text-gray-700">
                <CheckCircle2 className="w-4 h-4 text-blue-600" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="pt-4 border-t border-gray-200 flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-gray-500">Estimated Price</div>
            <div className="text-xl font-bold text-gray-900">${estimatedPrice.toLocaleString()}</div>
          </div>
          <div className="text-xs text-gray-500 max-w-sm text-right">
            By submitting, you confirm that the provided information and documents are accurate to
            the best of your knowledge. Our simulation team will validate the inputs and may reach
            out for clarifications.
          </div>
        </div>
      </section>
    </div>
  )
}

function SuccessScreen({ onReturnDashboard, onViewDetails }) {
  const submittedItems = [
    'Technical Specifications',
    'Uploaded Test Reports',
    'Design & Documentation Files',
    'Simulation Requirements',
  ]

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4">
      <div className="mb-6 flex items-center gap-2">
        <Cpu className="w-6 h-6 text-primary" />
        <span className="font-semibold text-lg tracking-tight">240KW</span>
      </div>

      <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
        <CheckCircle className="w-9 h-9 text-green-600" />
      </div>
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Design Submitted for Simulation</h1>
      <p className="text-gray-600 max-w-xl text-center mb-8">
        Your documents and details have been received. Our simulation team will now begin the
        verification process.
      </p>

      <section className="w-full max-w-2xl bg-white rounded-2xl border border-gray-200 shadow-sm p-6 mb-8">
        <h2 className="text-base font-semibold text-gray-900 mb-4 border-b pb-3">
          Submitted Items
        </h2>
        <ul className="space-y-3">
          {submittedItems.map(item => (
            <li
              key={item}
              className="flex items-center justify-between px-3 py-2 rounded-lg bg-gray-50"
            >
              <div className="flex items-center gap-2 text-sm text-gray-800">
                <ClipboardList className="w-4 h-4 text-blue-600" />
                {item}
              </div>
              <CheckCircle2 className="w-4 h-4 text-green-500" />
            </li>
          ))}
        </ul>
        <p className="mt-4 text-xs text-gray-500 flex items-start gap-2">
          <InfoDot />
          <span>You will be notified once the simulation results are ready.</span>
        </p>
      </section>

      <div className="flex flex-col sm:flex-row gap-4 items-center justify-center mb-8">
        <button
          type="button"
          onClick={onReturnDashboard}
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Return to Dashboard
        </button>
        <button
          type="button"
          onClick={onViewDetails}
          className="inline-flex items-center gap-2 text-sm text-gray-700 hover:text-gray-900"
        >
          <ClipboardList className="w-4 h-4" />
          View Submission Details
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
      <label className="text-sm font-medium text-gray-700 mb-2 block">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      <textarea
        rows={props.rows || 3}
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

function SelectableCard({ active, title, description, icon }) {
  return (
    <div
      className={`cursor-pointer h-full p-5 rounded-xl border transition-all ${
        active
          ? 'border-blue-600 bg-blue-50 shadow-sm'
          : 'border-gray-200 hover:border-blue-400 hover:bg-blue-50/40'
      }`}
    >
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-lg bg-blue-600 text-white flex items-center justify-center flex-shrink-0">
          {icon === 'retry' ? <ArrowRight className="w-5 h-5 rotate-180" /> : <TestTube className="w-5 h-5" />}
        </div>
        <div>
          <div className="font-semibold text-gray-900 mb-1">{title}</div>
          <p className="text-xs text-gray-600">{description}</p>
        </div>
      </div>
    </div>
  )
}

function InfoDot() {
  return <span className="mt-1 w-4 h-4 rounded-full bg-blue-100 border border-blue-300" />
}

export default SimulationFlow


