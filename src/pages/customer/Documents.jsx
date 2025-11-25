import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useData } from '../../contexts/DataContext'
import { FileText, Download, Eye, Upload, X, Package } from 'lucide-react'

function Documents() {
  const { documents, products, addDocument, deleteDocument } = useData()
  const [selectedProduct, setSelectedProduct] = useState('all')
  const [showUpload, setShowUpload] = useState(false)
  const [uploadFile, setUploadFile] = useState(null)

  const productsWithDocs = products.map(product => ({
    ...product,
    docs: documents.filter(doc => doc.productId === product.id)
  })).filter(p => selectedProduct === 'all' || p.id === selectedProduct)

  const handleFileSelect = (e) => {
    const file = e.target.files[0]
    if (file) {
      setUploadFile(file)
    }
  }

  const handleUpload = () => {
    if (!uploadFile || !selectedProduct || selectedProduct === 'all') {
      alert('Please select a product and file')
      return
    }

    const product = products.find(p => p.id === selectedProduct)
    if (!product) return

    const newDoc = {
      productId: selectedProduct,
      productName: product.name,
      title: uploadFile.name,
      type: uploadFile.type.includes('pdf') ? 'PDF' : 'Document',
      size: `${(uploadFile.size / 1024 / 1024).toFixed(2)} MB`,
      url: '#',
    }

    addDocument(newDoc)
    setUploadFile(null)
    setShowUpload(false)
    alert('Document uploaded successfully!')
  }

  const handleDownload = (doc) => {
    // Simulate download
    alert(`Downloading ${doc.title}...`)
  }

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this document?')) {
      deleteDocument(id)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Documents</h2>
        <button
          onClick={() => setShowUpload(!showUpload)}
          className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors flex items-center gap-2"
        >
          <Upload className="w-4 h-4" />
          Upload Document
        </button>
      </div>

      {/* Upload Modal */}
      {showUpload && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl border border-gray-200 p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Upload Document</h3>
            <button
              onClick={() => {
                setShowUpload(false)
                setUploadFile(null)
              }}
              className="p-1 hover:bg-gray-100 rounded"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="space-y-4">
            <div>
              <label className="text-sm text-gray-600 mb-2 block">Select Product</label>
              <select
                value={selectedProduct}
                onChange={(e) => setSelectedProduct(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="all">All Products</option>
                {products.map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm text-gray-600 mb-2 block">Choose File</label>
              <div className="border-2 border-dashed rounded-xl p-6 text-center">
                {uploadFile ? (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FileText className="w-5 h-5 text-primary" />
                      <span className="text-sm">{uploadFile.name}</span>
                    </div>
                    <button
                      onClick={() => setUploadFile(null)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <>
                    <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-600 mb-2">Click to select or drag and drop</p>
                    <label className="inline-block px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors cursor-pointer">
                      Choose File
                      <input
                        type="file"
                        className="hidden"
                        onChange={handleFileSelect}
                      />
                    </label>
                  </>
                )}
              </div>
            </div>
            {uploadFile && selectedProduct !== 'all' && (
              <button
                onClick={handleUpload}
                className="w-full px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
              >
                Upload
              </button>
            )}
          </div>
        </motion.div>
      )}

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="mb-4">
            <label className="text-sm text-gray-600 mb-2 block">Filter by Product</label>
            <select
              value={selectedProduct}
              onChange={(e) => setSelectedProduct(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="all">All Products</option>
              {products.map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>

          <div className="space-y-6">
            {productsWithDocs.length > 0 ? (
              productsWithDocs.map((product, idx) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-primary-dark text-white flex items-center justify-center text-xs font-bold">
                      <Package className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-semibold">{product.name}</div>
                      <div className="text-xs text-gray-500">ID: {product.id}</div>
                    </div>
                  </div>
                  {product.docs.length > 0 ? (
                    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                      {product.docs.map((doc, i) => (
                        <div
                          key={doc.id}
                          className="flex items-center justify-between px-4 py-3 border-b last:border-b-0 hover:bg-gray-50 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <FileText className="w-5 h-5 text-primary" />
                            <div>
                              <div className="font-medium">{doc.title}</div>
                              <div className="text-xs text-gray-500">
                                {doc.type} • {doc.size} • {new Date(doc.uploadedAt).toLocaleDateString()}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => handleDownload(doc)}
                              className="text-primary hover:underline text-sm flex items-center gap-1"
                            >
                              <Eye className="w-4 h-4" />
                              View
                            </button>
                            <button
                              onClick={() => handleDownload(doc)}
                              className="text-primary hover:underline text-sm flex items-center gap-1"
                            >
                              <Download className="w-4 h-4" />
                              Download
                            </button>
                            <button
                              onClick={() => handleDelete(doc.id)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="bg-white rounded-xl border border-gray-200 p-6 text-center text-gray-500 text-sm">
                      No documents for this product
                    </div>
                  )}
                </motion.div>
              ))
            ) : (
              <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
                <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600">No documents found</p>
              </div>
            )}
          </div>
        </div>
        <aside>
          <div className="bg-white rounded-xl border border-gray-200 p-6 sticky top-6">
            <h3 className="font-semibold mb-4">Quick Stats</h3>
            <div className="space-y-3">
              <div>
                <div className="text-2xl font-bold text-primary">{documents.length}</div>
                <div className="text-sm text-gray-600">Total Documents</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">
                  {products.filter(p => documents.some(d => d.productId === p.id)).length}
                </div>
                <div className="text-sm text-gray-600">Products with Docs</div>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}

export default Documents


