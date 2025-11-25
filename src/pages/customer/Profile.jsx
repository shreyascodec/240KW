import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { useData } from '../../contexts/DataContext'
import { Save, User, Mail, Phone, MapPin, Building, Camera, Upload, X } from 'lucide-react'
import toast from 'react-hot-toast'

function Profile() {
  const { profile, setProfile } = useData()
  const [formData, setFormData] = useState({
    ...profile,
    profileImage: profile?.profileImage || null
  })
  const [isSaving, setIsSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [imagePreview, setImagePreview] = useState(profile?.profileImage || null)
  const fileInputRef = useRef(null)

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value })
    setSaveSuccess(false)
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error('Please select a valid image file')
        return
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size should be less than 5MB')
        return
      }

      // Create preview
      const reader = new FileReader()
      reader.onloadend = () => {
        const imageDataUrl = reader.result
        setImagePreview(imageDataUrl)
        setFormData({ ...formData, profileImage: imageDataUrl })
        setSaveSuccess(false)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleRemoveImage = () => {
    setImagePreview(null)
    setFormData({ ...formData, profileImage: null })
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
    setSaveSuccess(false)
  }

  const handleSave = () => {
    setIsSaving(true)
    // Simulate API call
    setTimeout(() => {
      setProfile({ ...formData, profileImage: imagePreview })
      setIsSaving(false)
      setSaveSuccess(true)
      toast.success('Profile saved successfully!')
      setTimeout(() => setSaveSuccess(false), 3000)
    }, 500)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Profile</h2>
        {saveSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="px-4 py-2 bg-green-100 text-green-700 rounded-lg text-sm"
          >
            Profile saved successfully!
          </motion.div>
        )}
      </div>

      {/* Profile Image Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl border border-gray-200 p-6"
      >
        <div className="flex flex-col items-center justify-center">
          <div className="relative mb-4">
            <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-gray-200 shadow-lg">
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center">
                  <User className="w-16 h-16 text-white" />
                </div>
              )}
            </div>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => fileInputRef.current?.click()}
              className="absolute bottom-0 right-0 w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center shadow-lg hover:bg-primary-dark transition-colors border-4 border-white"
            >
              <Camera className="w-5 h-5" />
            </motion.button>
            {imagePreview && (
              <motion.button
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleRemoveImage}
                className="absolute top-0 right-0 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-red-600 transition-colors"
              >
                <X className="w-4 h-4" />
              </motion.button>
            )}
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
          />
          <div className="text-center">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="text-sm text-primary hover:text-primary-dark font-medium flex items-center gap-2"
            >
              <Upload className="w-4 h-4" />
              {imagePreview ? 'Change Photo' : 'Upload Photo'}
            </button>
            <p className="text-xs text-gray-500 mt-1">JPG, PNG or GIF. Max size 5MB</p>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-xl border border-gray-200 p-6"
      >
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="text-sm text-gray-600 flex items-center gap-2 mb-1">
                <User className="w-4 h-4" />
                Full Name / Username
              </label>
              <input
                value={formData.fullName || ''}
                onChange={(e) => handleChange('fullName', e.target.value)}
                className="w-full mt-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Your Full Name"
              />
            </div>
            <div>
              <label className="text-sm text-gray-600">Gender</label>
              <select
                value={formData.gender || ''}
                onChange={(e) => handleChange('gender', e.target.value)}
                className="w-full mt-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
                <option value="Prefer not to say">Prefer not to say</option>
              </select>
            </div>
            <div>
              <label className="text-sm text-gray-600">Language</label>
              <select
                value={formData.language || ''}
                onChange={(e) => handleChange('language', e.target.value)}
                className="w-full mt-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="English">English</option>
                <option value="Spanish">Spanish</option>
                <option value="French">French</option>
                <option value="German">German</option>
                <option value="Chinese">Chinese</option>
              </select>
            </div>
            <div>
              <label className="text-sm text-gray-600 flex items-center gap-2 mb-1">
                <Building className="w-4 h-4" />
                Company Name
              </label>
              <input
                value={formData.companyName || ''}
                onChange={(e) => handleChange('companyName', e.target.value)}
                className="w-full mt-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Company Name"
              />
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <label className="text-sm text-gray-600">User ID</label>
              <input
                value={formData.userId || ''}
                disabled
                className="w-full mt-1 px-3 py-2 border rounded-lg bg-gray-50 text-gray-500"
                placeholder="User ID"
              />
            </div>
            <div>
              <label className="text-sm text-gray-600 flex items-center gap-2 mb-1">
                <MapPin className="w-4 h-4" />
                Country
              </label>
              <input
                value={formData.country || ''}
                onChange={(e) => handleChange('country', e.target.value)}
                className="w-full mt-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Country"
              />
            </div>
            <div>
              <label className="text-sm text-gray-600">Address</label>
              <textarea
                value={formData.address || ''}
                onChange={(e) => handleChange('address', e.target.value)}
                rows={3}
                className="w-full mt-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Address"
              />
            </div>
            <div>
              <label className="text-sm text-gray-600 flex items-center gap-2 mb-1">
                <Phone className="w-4 h-4" />
                Phone No
              </label>
              <input
                value={formData.phone || ''}
                onChange={(e) => handleChange('phone', e.target.value)}
                className="w-full mt-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Phone No"
              />
            </div>
            <div>
              <label className="text-sm text-gray-600 flex items-center gap-2 mb-1">
                <Mail className="w-4 h-4" />
                Email
              </label>
              <input
                type="email"
                value={formData.email || ''}
                onChange={(e) => handleChange('email', e.target.value)}
                className="w-full mt-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Email"
              />
            </div>
          </div>
        </div>
        <div className="mt-6 flex justify-end">
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save className="w-4 h-4" />
            {isSaving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </motion.div>
    </div>
  )
}

export default Profile


