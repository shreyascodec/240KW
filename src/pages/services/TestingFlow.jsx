import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import {
  CheckCircle, Code, FileText, Clipboard, Package, 
  TestTube, Building2, ArrowRight, ArrowLeft, Clock, DollarSign,
  Upload, X, Search, ChevronDown, MessageCircle, BookOpen, MessageSquare
} from 'lucide-react'
import toast from 'react-hot-toast'

function TestingFlow() {
  const navigate = useNavigate()
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    // Product Details
    softwareName: '',
    softwareVersion: '',
    industry: [],
    industryOther: '',
    preferredDate: '',
    additionalNotes: '',
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
    
    // Documents
    documents: {},
    
    // Testing Requirements
    testType: 'final',
    selectedTests: [],
    
    // Testing Standards
    selectedCountries: [],
    selectedStandards: [],
    
    // Labs
    selectedLab: ''
  })

  const steps = [
    { id: 1, name: 'Product Details', icon: Package },
    { id: 2, name: 'Technical Specification Documents', icon: FileText },
    { id: 3, name: 'Testing Requirements', icon: Clipboard },
    { id: 4, name: 'Testing Standards', icon: TestTube },
    { id: 5, name: 'Lab selection and Review', icon: Building2 },
  ]

  const industries = [
    'Telecommunication',
    'Medical',
    'Automotive',
    'Industrial',
    'Consumer Electronics',
    'IoT',
    'Aerospace & Defense',
    'Energy & Power',
    'Others'
  ]

  const documentTypes = [
    { name: 'Circuit Diagram', icon: Code },
    { name: 'PCB Gerber Files', icon: FileText },
    { name: 'Block Diagram', icon: Package },
    { name: 'Component List / BOM', icon: Clipboard },
    { name: 'Ratings & Power Specs', icon: Zap },
    { name: 'Firmware Details', icon: Code }
  ]

  const testCategories = {
    'EMC Test': [
      'ESD immunity',
      'Radiated RF immunity',
      'EFT/Burst immunity',
      'Surge immunity',
      'Conducted RF immunity',
      'Power-frequency magnetic field immunity'
    ],
    'Environmental Test': [
      'Cold test',
      'Dry heat test',
      'Damp heat (steady state)',
      'Damp heat (cyclic)',
      'Thermal cycling',
      'Temperature shock',
      'Vibration (sinusoidal)'
    ],
    'Safety Test (Electrical & Mechanical)': [
      'Insulation resistance test',
      'Dielectric withstand / Hi-pot test',
      'Clearance & creepage distance check',
      'Leakage current test',
      'Overcurrent protection verification',
      'Overvoltage protection verification'
    ],
    'Functional Safety Test': [
      'Safety function verification',
      'Fault injection test (hardware)',
      'Diagnostic coverage validation',
      'Redundancy/safe state behavior test',
      'Software self-test verification',
      'Safety lifecycle documentation review'
    ]
  }

  const countries = ['India', 'Europe', 'Asia', 'USA', 'China']
  
  const recommendedStandards = [
    'ESD immunity: IEC 61000-4-2',
    'Conducted RF immunity: IEC 61000-4-6'
  ]
  
  const preferredStandards = [
    'Cold Test: IEC 60068-2-1',
    'Dry Heat Test: IEC 60068-2-2',
    'Damp Heat (Steady State): IEC 60068-2-78',
    'Damp Heat (Cyclic): IEC 60068-2-30',
    'Thermal Cycling: IEC 60068-2-14'
  ]

  const labs = [
    'TUV INDIA PVT. LTD., BANER, PUNE, MAHARASHTRA, INDIA',
    'SGS INDIA PRIVATE LIMITED, BENGALURU, KARNATAKA, INDIA',
    'ABB INDIA LIMITED- ELSP-TESTING LABORATORY',
    'HERRMANN RESEARCH PRODUCTS AND LABORATORIES PVT',
    'MARQUIS TECHNOLOGIES PRIVATE LIMITED',
    'METER TESTING LABORATORY, RBVPNL'
  ]

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value })
  }

  const handleArrayToggle = (field, value) => {
    const current = formData[field] || []
    const updated = current.includes(value)
      ? current.filter(item => item !== value)
      : [...current, value]
    setFormData({ ...formData, [field]: updated })
  }

  const handleFileUpload = (docType, file) => {
    setFormData({
      ...formData,
      documents: { ...formData.documents, [docType]: file }
    })
    toast.success(`${docType} uploaded successfully`)
  }

  const handleNext = () => {
    // Validation for each step
    if (currentStep === 1) {
      if (!formData.eutName || !formData.quantity) {
        toast.error('Please fill in required fields')
        return
      }
    }
    
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1)
      window.scrollTo(0, 0)
    } else {
      // Submit
      handleSubmit()
    }
  }

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
      window.scrollTo(0, 0)
    }
  }

  const handleSubmit = () => {
    setCurrentStep(6) // Success page
    toast.success('Testing request submitted successfully!')
  }

  const handleSaveDraft = () => {
    toast.success('Draft saved successfully!')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {currentStep < 6 && (
        <div className="bg-white border-b sticky top-0 z-10">
          <div className="container mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Package className="w-6 h-6" />
                <span className="font-bold text-lg">240KW</span>
              </div>
              
              {/* Progress Steps */}
              <div className="hidden md:flex items-center gap-4">
                {steps.map((step, index) => (
                  <div key={step.id} className="flex items-center">
                    <div className="flex flex-col items-center">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          currentStep === step.id
                            ? 'bg-blue-600 text-white'
                            : currentStep > step.id
                            ? 'bg-green-500 text-white'
                            : 'bg-gray-200 text-gray-600'
                        }`}
                      >
                        {currentStep > step.id ? (
                          <CheckCircle className="w-5 h-5" />
                        ) : (
                          <step.icon className="w-5 h-5" />
                        )}
                      </div>
                      <span className="text-xs mt-1 text-gray-600 max-w-[80px] text-center">
                        {step.name}
                      </span>
                    </div>
                    {index < steps.length - 1 && (
                      <div className={`w-12 h-0.5 mx-2 ${currentStep > step.id ? 'bg-green-500' : 'bg-gray-300'}`} />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="container mx-auto px-6 py-8">
        <AnimatePresence mode="wait">
          {/* Step 1: Product Details */}
          {currentStep === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="max-w-4xl mx-auto"
            >
              <h1 className="text-3xl font-bold text-center mb-8">Product Details</h1>
              
              {/* Software Information */}
              <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
                <div className="flex items-center gap-2 mb-4">
                  <Code className="w-5 h-5 text-blue-600" />
                  <h2 className="text-lg font-bold">Software Information</h2>
                </div>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                      Name of the Software
                    </label>
                    <input
                      type="text"
                      placeholder="Software/firmware name"
                      value={formData.softwareName}
                      onChange={(e) => handleChange('softwareName', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                      Software Version No.
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., v2.1.4 or build 20251201"
                      value={formData.softwareVersion}
                      onChange={(e) => handleChange('softwareVersion', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              {/* Industry/Application */}
              <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
                <div className="flex items-center gap-2 mb-4">
                  <Package className="w-5 h-5 text-blue-600" />
                  <h2 className="text-lg font-bold">Industry / Application</h2>
                </div>
                <p className="text-sm text-gray-600 mb-4">
                  Select the industry or application category where the EUT will be used. This helps identify relevant standards and testing requirements.
                </p>
                
                <div className="grid md:grid-cols-3 gap-4 mb-4">
                  {industries.map(industry => (
                    <label key={industry} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.industry.includes(industry)}
                        onChange={() => handleArrayToggle('industry', industry)}
                        className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                      />
                      <span className="text-sm">{industry}</span>
                    </label>
                  ))}
                </div>
                
                {formData.industry.includes('Others') && (
                  <input
                    type="text"
                    placeholder="If Others, please specify..."
                    value={formData.industryOther}
                    onChange={(e) => handleChange('industryOther', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                )}
              </div>

              {/* Preferable Testing Dates */}
              <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
                <div className="flex items-center gap-2 mb-4">
                  <Clock className="w-5 h-5 text-blue-600" />
                  <h2 className="text-lg font-bold">Preferable Testing Dates</h2>
                </div>
                <p className="text-sm text-gray-600 mb-4">
                  Select your preferred dates for testing or submission. These dates help the lab schedule resources and allocate test slots.
                </p>
                
                <div className="mb-4">
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Preferred Testing Date
                  </label>
                  <input
                    type="date"
                    value={formData.preferredDate}
                    onChange={(e) => handleChange('preferredDate', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Additional Requirements / Notes
                  </label>
                  <textarea
                    rows="4"
                    placeholder="Any special requirements, rush processing needs, or additional notes..."
                    value={formData.additionalNotes}
                    onChange={(e) => handleChange('additionalNotes', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Basic Equipment Information */}
              <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
                <div className="flex items-center gap-2 mb-4">
                  <Package className="w-5 h-5 text-blue-600" />
                  <h2 className="text-lg font-bold">Basic Equipment Information</h2>
                </div>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                      Name of EUT *
                    </label>
                    <input
                      type="text"
                      placeholder="Exact product name or identifier"
                      value={formData.eutName}
                      onChange={(e) => handleChange('eutName', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                      Quantity of EUT *
                    </label>
                    <input
                      type="text"
                      placeholder="Number of units"
                      value={formData.quantity}
                      onChange={(e) => handleChange('quantity', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                      Manufacturer / Make & Address *
                    </label>
                    <textarea
                      rows="2"
                      placeholder="Official manufacturer details and complete address"
                      value={formData.manufacturer}
                      onChange={(e) => handleChange('manufacturer', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                      Model No. *
                    </label>
                    <input
                      type="text"
                      placeholder="Model number or variant"
                      value={formData.modelNo}
                      onChange={(e) => handleChange('modelNo', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                      Serial No. *
                    </label>
                    <input
                      type="text"
                      placeholder="Serial or batch number"
                      value={formData.serialNo}
                      onChange={(e) => handleChange('serialNo', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              {/* Technical Specifications */}
              <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
                <div className="flex items-center gap-2 mb-4">
                  <TestTube className="w-5 h-5 text-blue-600" />
                  <h2 className="text-lg font-bold">Technical Specifications</h2>
                </div>
                
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                      Supply Voltage *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., 220V AC ± 10%"
                      value={formData.supplyVoltage}
                      onChange={(e) => handleChange('supplyVoltage', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                      Operating Frequency
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., 2.4 GHz - 2.5 GHz"
                      value={formData.operatingFrequency}
                      onChange={(e) => handleChange('operatingFrequency', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                      Current *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., 2.5A max"
                      value={formData.current}
                      onChange={(e) => handleChange('current', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                      Weight (Kg) *
                    </label>
                    <input
                      type="text"
                      placeholder="Physical weight"
                      value={formData.weight}
                      onChange={(e) => handleChange('weight', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                      Dimensions (L x W x H) *
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      <input
                        type="text"
                        placeholder="Length (mm)"
                        value={formData.length}
                        onChange={(e) => handleChange('length', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <input
                        type="text"
                        placeholder="Width (mm)"
                        value={formData.width}
                        onChange={(e) => handleChange('width', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <input
                        type="text"
                        placeholder="Height (mm)"
                        value={formData.height}
                        onChange={(e) => handleChange('height', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Connectivity & Interfaces */}
              <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
                <div className="flex items-center gap-2 mb-4">
                  <TestTube className="w-5 h-5 text-blue-600" />
                  <h2 className="text-lg font-bold">Connectivity & Interfaces</h2>
                </div>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                      No. of Power Ports & Connector Type *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., 1x IEC C14 inlet, 1x DC barrel jack (5.5mm)"
                      value={formData.powerPorts}
                      onChange={(e) => handleChange('powerPorts', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                      No. of Signal Lines & Connector Type *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., 2x USB-A, 1x Ethernet RJ45, 1x HDMI"
                      value={formData.signalLines}
                      onChange={(e) => handleChange('signalLines', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              {/* Navigation Buttons */}
              <div className="flex justify-between items-center pt-6 border-t">
                <button
                  onClick={() => navigate(-1)}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Previous
                </button>
                <div className="flex gap-3">
                  <button
                    onClick={handleSaveDraft}
                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Save as Draft
                  </button>
                  <button
                    onClick={handleNext}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                  >
                    Next
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* Additional steps will be added in the next part... */}
        </AnimatePresence>
      </div>

      {/* Footer */}
      {currentStep < 6 && (
        <div className="bg-white border-t mt-12">
          <div className="container mx-auto px-6 py-4">
            <div className="flex items-center justify-end gap-6 text-sm">
              <button className="text-gray-600 hover:text-gray-900">Help</button>
              <button className="text-gray-600 hover:text-gray-900">Privacy</button>
              <button className="text-gray-600 hover:text-gray-900">Terms</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default TestingFlow

