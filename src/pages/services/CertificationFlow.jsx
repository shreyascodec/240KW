import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Award,
  Globe2,
  FileText,
  Upload,
  ArrowLeft,
  ArrowRight,
  Save,
  CheckCircle,
  CheckCircle2,
  Info,
} from 'lucide-react'
import toast from 'react-hot-toast'
import { useData } from '../../contexts/DataContext'

function CertificationFlow() {
  const navigate = useNavigate()
  const { addProduct, addOrder, addMessage } = useData()

  const [currentStep, setCurrentStep] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    region: '',
    productName: '',
    category: '',
    standardsPassed: ['IEC 61000-4-5', 'CISPR 32', 'IEC 61851'],
    newStandard: '',
    documents: {},
    additionalNotes: '',
    confirmInfoAccurate: false,
    confirmDocsCorrect: false,
    confirmFeesUnderstood: false,
  })

  const steps = [
    { id: 'docs', title: 'Certification Documents' },
    { id: 'review', title: 'Submission Review' },
  ]

  const isSuccess = currentStep >= steps.length

  const handleFieldChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleFileUpload = (docType, file) => {
    if (!file) return
    setFormData(prev => ({
      ...prev,
      documents: {
        ...prev.documents,
        [docType]: { name: file.name, size: `${(file.size / (1024 * 1024)).toFixed(1)} MB` },
      },
    }))
    toast.success(`${docType} uploaded successfully`)
  }

  const handleAddStandard = () => {
    const value = formData.newStandard.trim()
    if (!value) return
    if (!formData.standardsPassed.includes(value)) {
      setFormData(prev => ({
        ...prev,
        standardsPassed: [...prev.standardsPassed, value],
        newStandard: '',
      }))
    } else {
      setFormData(prev => ({ ...prev, newStandard: '' }))
    }
  }

  const saveDraft = () => {
    localStorage.setItem('certification_flow_draft', JSON.stringify(formData))
    toast.success('Draft saved successfully.')
  }

  const handleNext = () => {
    if (currentStep === 0) {
      if (!formData.region || !formData.productName || !formData.category) {
        toast.error('Please fill in region, product name, and category.')
        return
      }
      if (Object.keys(formData.documents).length === 0) {
        toast.error('Please upload at least one supporting document.')
        return
      }
      setCurrentStep(1)
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }

    if (currentStep === 1) {
      if (
        !formData.confirmInfoAccurate ||
        !formData.confirmDocsCorrect ||
        !formData.confirmFeesUnderstood
      ) {
        toast.error('Please check all confirmation boxes before submitting.')
        return
      }
      handleSubmit()
    }
  }

  const handlePrevious = () => {
    if (currentStep === 0) {
      navigate(-1)
    } else if (currentStep === 1) {
      setCurrentStep(0)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true)

      const product = addProduct({
        name: formData.productName || 'Certification Submission',
        service: 'Certification',
        description: `Certification request for ${formData.productName || 'product'} in ${
          formData.region || 'selected region'
        }.`,
        category: formData.category || 'Electronics',
      })

      addOrder({
        productId: product.id,
        productName: product.name,
        service: 'Certification',
        status: 'Awaiting',
        total: 299,
      })

      addMessage({
        from: 'Certification Team',
        subject: `Certification documents submitted for ${product.name}`,
        body:
          'Your certification documents have been submitted. They will be forwarded to the relevant certification body, and you will be notified once the review is complete.',
        type: 'notification',
      })

      setCurrentStep(steps.length)
      toast.success('Documents submitted for certification!')
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
          <div className="max-w-5xl mx-auto px-6 py-4 flex items-center gap-2">
            <Award className="w-6 h-6 text-primary" />
            <span className="font-semibold text-lg tracking-tight">240KW</span>
          </div>
        </div>
      )}

      <div className="flex-1 max-w-5xl mx-auto px-4 lg:px-6 py-8">
        {isSuccess ? (
          <CertificationSuccess
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
                    <StepSubmission formData={formData} onFieldChange={handleFieldChange} onFileUpload={handleFileUpload} onAddStandard={handleAddStandard} />
                  )}
                  {currentStep === 1 && (
                    <StepReview
                      formData={formData}
                      onFieldChange={handleFieldChange}
                      onFileUpload={handleFileUpload}
                      onEdit={() => setCurrentStep(0)}
                    />
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
                  {currentStep === 0 ? 'Back' : 'Go Back & Edit'}
                </button>

                <div className="flex items-center gap-3 ml-auto">
                  <button
                    type="button"
                    onClick={saveDraft}
                    className="inline-flex items-center gap-2 px-5 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <Save className="w-4 h-4" />
                    Save & Continue Later
                  </button>
                  <button
                    type="button"
                    onClick={handleNext}
                    disabled={isSubmitting}
                    className="inline-flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {currentStep === 1 ? 'Submit for Review' : 'Submit for Review'}
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

function StepSubmission({ formData, onFieldChange, onFileUpload, onAddStandard }) {
  const regions = ['European Union (CE)', 'United States (FCC)', 'United Kingdom (UKCA)', 'Global']
  const categories = [
    'Electronics - Consumer Devices',
    'Electronics - Industrial',
    'Automotive',
    'Medical Devices',
  ]

  const docTypes = ['Test Report PDF', 'Technical File / Product Manual', 'Additional Compliance Documents']

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-4">Certification Submission</h1>

      {/* Product & Region Details */}
      <section className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <Globe2 className="w-5 h-5 text-blue-600" />
          <h2 className="text-lg font-semibold text-gray-900">Product &amp; Region Details</h2>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <SelectField
            label="Target Region / Country"
            value={formData.region}
            onChange={value => onFieldChange('region', value)}
            options={regions}
            placeholder="Select region"
          />
          <TextField
            label="Product Name"
            placeholder="Enter product name"
            value={formData.productName}
            onChange={value => onFieldChange('productName', value)}
          />
          <SelectField
            label="Product Category"
            value={formData.category}
            onChange={value => onFieldChange('category', value)}
            options={categories}
            placeholder="Select category"
          />
        </div>

        {/* Standards passed */}
        <div className="pt-3 border-t border-dashed border-gray-200 space-y-3">
          <div className="text-xs font-semibold text-gray-500">Standards Passed</div>
          <div className="flex flex-wrap gap-2">
            {formData.standardsPassed.map(std => (
              <span
                key={std}
                className="inline-flex items-center px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-medium"
              >
                {std}
              </span>
            ))}
          </div>
          <div className="flex flex-wrap gap-2 items-center">
            <InputBase
              placeholder="Add another standard (optional)"
              value={formData.newStandard}
              onChange={e => onFieldChange('newStandard', e.target.value)}
              className="max-w-xs"
            />
            <button
              type="button"
              onClick={onAddStandard}
              className="px-3 py-1.5 text-xs rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              + Add Standard
            </button>
          </div>

          {/* Estimated fee */}
          <div className="mt-3 flex items-center justify-between bg-blue-50 border border-blue-100 rounded-xl px-4 py-3 text-sm">
            <div>
              <div className="text-xs font-semibold text-gray-500">Estimated Fee Range</div>
              <div className="font-semibold text-gray-900">$150 – $400</div>
              <p className="text-xs text-gray-600">
                Fees vary by region. Final amount is confirmed by the certification authority.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Upload Supporting Documents */}
      <section className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <FileText className="w-5 h-5 text-blue-600" />
          <h2 className="text-lg font-semibold text-gray-900">Upload Supporting Documents</h2>
        </div>
        <p className="text-sm text-gray-600 mb-2">
          Upload compliance test reports, lab results, technical files, or declarations.
        </p>

        {docTypes.map(type => {
          const doc = formData.documents[type]
          return (
            <div
              key={type}
              className="flex items-center justify-between gap-4 p-4 rounded-lg border border-gray-200"
            >
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-blue-600" />
                <div>
                  <div className="font-medium text-gray-900">{type}</div>
                  <div className="text-xs text-gray-500">
                    {doc ? `${doc.name} · ${doc.size}` : 'No file uploaded'}
                  </div>
                </div>
              </div>
              <label className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 cursor-pointer">
                <Upload className="w-4 h-4" />
                <span>{doc ? 'Replace' : 'Upload'}</span>
                <input
                  type="file"
                  className="hidden"
                  onChange={e => onFileUpload(type, e.target.files?.[0])}
                />
              </label>
            </div>
          )
        })}
      </section>
    </div>
  )
}

function StepReview({ formData, onFieldChange, onFileUpload, onEdit }) {
  const docTypes = ['Test Report PDF', 'Technical File / Product Manual', 'Additional Compliance Documents']

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-4">Review Submitted Documents</h1>

      {/* Product & Region Summary */}
      <section className="bg-white rounded-xl border border-gray-200 p-6 space-y-3">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg font-semibold text-gray-900">Product &amp; Region Summary</h2>
          <button
            type="button"
            onClick={onEdit}
            className="text-xs font-medium text-blue-600 hover:text-blue-700"
          >
            Edit
          </button>
        </div>
        <div className="grid md:grid-cols-2 gap-3 text-sm text-gray-800">
          <div>
            <div className="text-xs text-gray-500">Target Region / Country</div>
            <div>{formData.region || '—'}</div>
          </div>
          <div>
            <div className="text-xs text-gray-500">Product Name</div>
            <div>{formData.productName || '—'}</div>
          </div>
          <div>
            <div className="text-xs text-gray-500">Product Category</div>
            <div>{formData.category || '—'}</div>
          </div>
          <div>
            <div className="text-xs text-gray-500">Estimated Fee Range</div>
            <div>$150 – $400</div>
            <div className="text-[11px] text-gray-500">
              Final amount is confirmed by the certification authority.
            </div>
          </div>
        </div>
        <div className="pt-3 border-t border-dashed border-gray-200">
          <div className="text-xs font-semibold text-gray-500 mb-2">Standards Passed</div>
          <div className="flex flex-wrap gap-2">
            {formData.standardsPassed.map(std => (
              <span
                key={std}
                className="inline-flex items-center px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-medium"
              >
                {std}
              </span>
            ))}
          </div>
          <button
            type="button"
            onClick={onEdit}
            className="mt-2 text-xs text-blue-600 hover:text-blue-700"
          >
            View all standards
          </button>
        </div>
      </section>

      {/* Uploaded supporting documents */}
      <section className="bg-white rounded-xl border border-gray-200 p-6 space-y-3">
        <h2 className="text-lg font-semibold text-gray-900">Uploaded Supporting Documents</h2>
        {docTypes.map(type => {
          const doc = formData.documents[type]
          return (
            <div
              key={type}
              className="flex items-center justify-between gap-4 p-3 rounded-lg border border-gray-200"
            >
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-blue-600" />
                <div>
                  <div className="font-medium text-gray-900 text-sm">{type}</div>
                  <div className="text-xs text-gray-500">
                    {doc ? `${doc.name} · ${doc.size}` : 'No file uploaded'}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  className="text-xs text-gray-500 hover:text-gray-700"
                >
                  View
                </button>
                <label className="text-xs font-medium text-blue-600 hover:text-blue-700 cursor-pointer">
                  Replace
                  <input
                    type="file"
                    className="hidden"
                    onChange={e => onFileUpload(type, e.target.files?.[0])}
                  />
                </label>
              </div>
            </div>
          )
        })}
        <div className="mt-2 flex items-start gap-2 text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
          <Info className="w-4 h-4 mt-0.5" />
          <span>All documents must be clear and readable. Misuploaded files may delay certification.</span>
        </div>
      </section>

      {/* Additional Notes */}
      <section className="bg-white rounded-xl border border-gray-200 p-6 space-y-3">
        <h2 className="text-sm font-semibold text-gray-900">Additional Notes or Declaration (Optional)</h2>
        <TextArea
          placeholder="You may add clarifications, disclaimers, or notes for the certification authority..."
          value={formData.additionalNotes}
          onChange={value => onFieldChange('additionalNotes', value)}
        />
      </section>

      {/* Need help */}
      <section className="bg-blue-50 border border-blue-100 rounded-xl px-4 py-3 flex flex-wrap items-center justify-between gap-3 text-sm">
        <div className="flex items-center gap-2 text-blue-800">
          <Info className="w-4 h-4" />
          <span>Need Help? Our support team is here to assist you with your certification submission.</span>
        </div>
        <button
          type="button"
          className="text-xs font-semibold text-blue-700 hover:text-blue-800"
        >
          Contact Support →
        </button>
      </section>

      {/* Final confirmation */}
      <section className="bg-white rounded-xl border border-gray-200 p-6 space-y-3">
        <h2 className="text-sm font-semibold text-gray-900">Final Confirmation</h2>
        <div className="space-y-2 text-sm text-gray-700">
          <Checkbox
            label="I confirm that all information provided is accurate."
            checked={formData.confirmInfoAccurate}
            onChange={value => onFieldChange('confirmInfoAccurate', value)}
          />
          <Checkbox
            label="I agree that supporting documents are correct and complete."
            checked={formData.confirmDocsCorrect}
            onChange={value => onFieldChange('confirmDocsCorrect', value)}
          />
          <Checkbox
            label="I understand that fees are finalized by the certification authority."
            checked={formData.confirmFeesUnderstood}
            onChange={value => onFieldChange('confirmFeesUnderstood', value)}
          />
        </div>
      </section>
    </div>
  )
}

function CertificationSuccess({ formData, onReturnDashboard }) {
  const uploadedDocs = Object.values(formData.documents)

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4">
      <div className="mb-6 flex items-center gap-2">
        <Award className="w-6 h-6 text-primary" />
        <span className="font-semibold text-lg tracking-tight">240KW</span>
      </div>

      <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
        <CheckCircle className="w-9 h-9 text-green-600" />
      </div>
      <h1 className="text-3xl font-bold text-gray-900 mb-2">
        Documents Submitted for Certification
      </h1>
      <p className="text-gray-600 max-w-xl text-center mb-8">
        Your documents have been successfully uploaded and forwarded to the certification authority.
        You will be notified once the review is completed.
      </p>

      <section className="w-full max-w-2xl bg-white rounded-2xl border border-gray-200 shadow-sm p-6 mb-6">
        <h2 className="text-sm font-semibold text-gray-900 mb-3">Uploaded Documents</h2>
        <ul className="space-y-2 text-sm text-gray-800">
          {uploadedDocs.length > 0 ? (
            uploadedDocs.map(doc => (
              <li
                key={doc.name}
                className="flex items-center justify-between px-3 py-2 rounded-lg bg-gray-50"
              >
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-blue-600" />
                  <span>{doc.name}</span>
                </div>
                <span className="text-xs text-gray-500">{doc.size}</span>
              </li>
            ))
          ) : (
            <li className="text-xs text-gray-500">Documents are linked from your submission.</li>
          )}
        </ul>
        <p className="mt-3 text-xs text-gray-500 flex items-start gap-2">
          <span className="mt-1 w-2 h-2 rounded-full bg-gray-400" />
          <span>Review timelines vary based on the certification body.</span>
        </p>
      </section>

      <button
        type="button"
        onClick={onReturnDashboard}
        className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors mb-8"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Dashboard
      </button>

      <div className="flex items-center justify-end gap-6 text-sm text-gray-600 w-full max-w-3xl">
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

export default CertificationFlow


