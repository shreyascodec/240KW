import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useData } from '../../contexts/DataContext'
import { Package, TrendingUp, CheckCircle2, Clock } from 'lucide-react'

function Dashboard() {
  const { products, orders, messages } = useData()
  
  const activeProducts = products.filter(p => p.status !== 'Complete')
  const completedCount = products.filter(p => p.status === 'Complete').length
  const unreadMessages = messages.filter(m => !m.read).length

  const certificationRate = products.length > 0 
    ? Math.round((completedCount / products.length) * 100) 
    : 0

  const avgProgress = products.length > 0
    ? Math.round(products.reduce((sum, p) => sum + p.progress, 0) / products.length)
    : 0

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Dashboard</h2>
        <Link
          to="/customer/products"
          className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
        >
          View All Products
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl border border-gray-200 p-6"
        >
          <div className="flex items-center justify-between mb-2">
            <Package className="w-8 h-8 text-primary" />
            {unreadMessages > 0 && (
              <Link to="/customer/messages" className="relative">
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {unreadMessages}
                </span>
              </Link>
            )}
          </div>
          <div className="text-3xl font-bold">{products.length}</div>
          <div className="text-sm text-gray-500">Total Products</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl border border-gray-200 p-6"
        >
          <CheckCircle2 className="w-8 h-8 text-green-500 mb-2" />
          <div className="text-3xl font-bold text-green-600">{completedCount}</div>
          <div className="text-sm text-gray-500">Completed</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl border border-gray-200 p-6"
        >
          <Clock className="w-8 h-8 text-blue-500 mb-2" />
          <div className="text-3xl font-bold text-blue-600">{activeProducts.length}</div>
          <div className="text-sm text-gray-500">In Progress</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl border border-gray-200 p-6"
        >
          <TrendingUp className="w-8 h-8 text-purple-500 mb-2" />
          <div className="text-3xl font-bold text-purple-600">{certificationRate}%</div>
          <div className="text-sm text-gray-500">Success Rate</div>
        </motion.div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-lg font-semibold">Recent Products</h3>
          {activeProducts.length > 0 ? (
            activeProducts.slice(0, 5).map((p, idx) => (
              <Link key={p.id} to={`/customer/products/${p.id}`}>
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition-shadow cursor-pointer"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <div className="font-semibold">{p.name}</div>
                      <div className="text-sm text-gray-500">ID: {p.id}</div>
                    </div>
                    <div className="text-sm text-gray-600">{p.service}</div>
                    <div className="text-sm">
                      <span className="font-semibold">{p.progress}%</span>
                    </div>
                    <div className={`text-xs px-2 py-1 rounded ${
                      p.status === 'Complete' ? 'bg-green-100 text-green-700' :
                      p.status === 'Testing' ? 'bg-blue-100 text-blue-700' :
                      'bg-yellow-100 text-yellow-700'
                    }`}>
                      {p.status}
                    </div>
                  </div>
                  <div className="mt-3 h-2 rounded bg-gray-100 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${p.progress}%` }}
                      transition={{ duration: 0.5 }}
                      className="h-full bg-gradient-to-r from-primary to-primary-dark"
                    />
                  </div>
                </motion.div>
              </Link>
            ))
          ) : (
            <div className="bg-white rounded-xl border border-gray-200 p-8 text-center text-gray-500">
              No active products. <Link to="/services/select" className="text-primary hover:underline">Add a new product</Link>
            </div>
          )}
        </div>
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="font-semibold mb-3">Progress Analytics</div>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Certification Rate</span>
                  <span className="font-semibold">{certificationRate}%</span>
                </div>
                <div className="h-2 rounded bg-gray-100">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${certificationRate}%` }}
                    transition={{ duration: 1 }}
                    className="h-full bg-green-500"
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Average Progress</span>
                  <span className="font-semibold">{avgProgress}%</span>
                </div>
                <div className="h-2 rounded bg-gray-100">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${avgProgress}%` }}
                    transition={{ duration: 1, delay: 0.2 }}
                    className="h-full bg-blue-500"
                  />
                </div>
              </div>
            </div>
          </div>
          <Link to="/customer/messages">
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-white rounded-xl border border-gray-200 p-4 cursor-pointer hover:shadow-md transition-shadow"
            >
              <div className="font-semibold mb-2">Messages</div>
              <div className="text-sm text-gray-600">
                {unreadMessages > 0 ? (
                  <span className="text-primary font-medium">{unreadMessages} unread message{unreadMessages > 1 ? 's' : ''}</span>
                ) : (
                  'No new messages'
                )}
              </div>
            </motion.div>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Dashboard


