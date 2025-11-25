import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useData } from '../../contexts/DataContext'
import { CheckCircle2, XCircle, Eye, Calendar, DollarSign } from 'lucide-react'

function OrderHistory() {
  const { orders, products } = useData()
  
  const completed = orders.filter(o => o.status === 'Completed')
  const cancelled = orders.filter(o => o.status === 'Cancelled')
  const activeProducts = products.filter(p => p.status !== 'Complete' && p.status !== 'Cancelled')

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Order History</h2>
      
      {/* Active Workflows */}
      {activeProducts.length > 0 && (
        <section className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="font-semibold mb-3">Active Workflows</div>
          <div className="space-y-3">
            {activeProducts.map((product) => (
              <Link key={product.id} to={`/customer/products/${product.id}`}>
                <motion.div
                  whileHover={{ scale: 1.01 }}
                  className="bg-gray-50 p-4 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="font-medium">{product.service} - {product.name}</div>
                    <span className={`text-xs px-2 py-1 rounded ${
                      product.status === 'Testing' ? 'bg-blue-100 text-blue-700' :
                      'bg-yellow-100 text-yellow-700'
                    }`}>
                      {product.status}
                    </span>
                  </div>
                  <div className="h-2 rounded bg-gray-200 mb-3">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${product.progress}%` }}
                      transition={{ duration: 0.5 }}
                      className="h-full bg-primary"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Link
                      to={`/customer/products/${product.id}`}
                      className="px-3 py-1 bg-primary text-white rounded text-sm hover:bg-primary-dark transition-colors"
                    >
                      View Details
                    </Link>
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Completed Orders */}
      <section className="bg-white rounded-xl border border-gray-200">
        <div className="p-4 font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-green-500" />
          Completed ({completed.length})
        </div>
        {completed.length > 0 ? (
          <div className="divide-y">
            {completed.map((order, i) => (
              <Link key={order.id} to={`/customer/order-history/${order.id}`}>
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  <div className="flex-1">
                    <div className="font-medium">{order.productName}</div>
                    <div className="text-xs text-gray-500 flex items-center gap-2 mt-1">
                      <span>Order ID: {order.id}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(order.completedAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <div className="text-sm text-gray-600 mr-4">{order.service}</div>
                  <div className="text-sm font-semibold text-gray-700 mr-4 flex items-center gap-1">
                    <DollarSign className="w-4 h-4" />
                    {order.total.toFixed(2)}
                  </div>
                  <div className="text-xs px-2 py-1 rounded bg-green-100 text-green-700 mr-4">
                    {order.status}
                  </div>
                  <Link
                    to={`/customer/order-history/${order.id}`}
                    className="text-primary text-sm hover:underline flex items-center gap-1"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Eye className="w-4 h-4" />
                    View
                  </Link>
                </motion.div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center text-gray-500">
            No completed orders yet
          </div>
        )}
      </section>

      {/* Cancelled Orders */}
      <section className="bg-white rounded-xl border border-gray-200">
        <div className="p-4 font-semibold flex items-center gap-2">
          <XCircle className="w-5 h-5 text-red-500" />
          Cancelled ({cancelled.length})
        </div>
        {cancelled.length > 0 ? (
          <div className="divide-y">
            {cancelled.map((order, i) => (
              <Link key={order.id} to={`/customer/order-history/${order.id}`}>
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  <div className="flex-1">
                    <div className="font-medium">{order.productName}</div>
                    <div className="text-xs text-gray-500 flex items-center gap-2 mt-1">
                      <span>Order ID: {order.id}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(order.cancelledAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <div className="text-sm text-gray-600 mr-4">{order.service}</div>
                  <div className="text-xs px-2 py-1 rounded bg-red-100 text-red-700 mr-4">
                    Cancelled
                  </div>
                  <Link
                    to={`/customer/order-history/${order.id}`}
                    className="text-primary text-sm hover:underline flex items-center gap-1"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Eye className="w-4 h-4" />
                    View
                  </Link>
                </motion.div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center text-gray-500">
            No cancelled orders
          </div>
        )}
      </section>
    </div>
  )
}

export default OrderHistory


