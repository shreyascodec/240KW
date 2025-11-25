import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Toaster } from 'react-hot-toast'
import { lazy, Suspense, useEffect } from 'react'
import { RoleProvider } from './contexts/RoleContext'
import { DataProvider } from './contexts/DataContext'
import { LabDataProvider } from './contexts/LabDataContext'
import Header from './components/Header'
import Footer from './components/Footer'
import Home from './pages/Home'
import Services from './pages/Services'
import Pricing from './pages/Pricing'
import Blog from './pages/Blog'
import About from './pages/About'
import Contact from './pages/Contact'
import Login from './pages/Login'
import SignUp from './pages/SignUp'
import ProductDetails from './pages/ProductDetails'
import DashboardLayout from './layouts/DashboardLayout'
import CustomerDashboard from './pages/customer/Dashboard'
import Documents from './pages/customer/Documents'
import OrderHistory from './pages/customer/OrderHistory'
import Profile from './pages/customer/Profile'
import Products from './pages/customer/Products'
import ProductDetail from './pages/customer/ProductDetail'
import OrderDetail from './pages/customer/OrderDetail'
import Messages from './pages/customer/Messages'
import Settings from './pages/customer/Settings'
import ServiceSelection from './pages/ServiceSelection'
import CustomerDetails from './pages/jrf/CustomerDetails'
import EUTDetails from './pages/jrf/EUTDetails'
import TestingRequirements from './pages/jrf/TestingRequirements'
import TestingStandards from './pages/jrf/TestingStandards'
import LabsReview from './pages/jrf/LabsReview'
import LabLayout from './layouts/LabLayout'
import LabLogin from './pages/lab/Login'
import LabSignupPersonal from './pages/lab/SignupPersonal'
import LabSignupDocuments from './pages/lab/SignupDocuments'
import LabDashboard from './pages/lab/Dashboard'
import LabQueue from './pages/lab/Queue'
import LabSchedule from './pages/lab/Schedule'
import RequestDetail from './pages/lab/RequestDetail'
import PortalSelection from './pages/lab/PortalSelection'
import LabManagementLayout from './layouts/LabManagementLayout'

// Lazy load lab management pages for better performance
const LabManagementDashboard = lazy(() => import('./pages/lab/management/Dashboard'))
const LabManagementCustomers = lazy(() => import('./pages/lab/management/Customers'))
const LabManagementProjects = lazy(() => import('./pages/lab/management/Projects'))
const LabManagementRFQs = lazy(() => import('./pages/lab/management/RFQs'))
const LabManagementEstimations = lazy(() => import('./pages/lab/management/Estimations'))
const LabManagementTestPlans = lazy(() => import('./pages/lab/management/TestPlans'))
const LabManagementTestExecutions = lazy(() => import('./pages/lab/management/TestExecutions'))
const LabManagementTestResults = lazy(() => import('./pages/lab/management/TestResults'))
const LabManagementSamples = lazy(() => import('./pages/lab/management/Samples'))
const LabManagementTRFs = lazy(() => import('./pages/lab/management/TRFs'))
const LabManagementDocuments = lazy(() => import('./pages/lab/management/Documents'))
const LabManagementReports = lazy(() => import('./pages/lab/management/Reports'))
const LabManagementAudits = lazy(() => import('./pages/lab/management/Audits'))
const LabManagementNCRs = lazy(() => import('./pages/lab/management/NCRs'))
const LabManagementCertifications = lazy(() => import('./pages/lab/management/Certifications'))
const ProjectDetail = lazy(() => import('./pages/lab/management/ProjectDetail'))
const PlaceholderPage = lazy(() => import('./pages/lab/management/PlaceholderPage'))

// Loading component
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="text-center">
      <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
      <p className="mt-4 text-gray-600">Loading...</p>
    </div>
  </div>
)

import Design from './pages/services/Design'
import Testing from './pages/services/Testing'
import Calibration from './pages/services/Calibration'
import Simulation from './pages/services/Simulation'
import Debugging from './pages/services/Debugging'
import Certification from './pages/services/Certification'

// ScrollToTop component to scroll to top on route change
function ScrollToTop() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return null
}

function AnimatedRoutes() {
  const location = useLocation()

  const pageVariants = {
    initial: {
      opacity: 0,
      y: 20,
    },
    animate: {
      opacity: 1,
      y: 0,
    },
    exit: {
      opacity: 0,
      y: -20,
    },
  }

  const pageTransition = {
    type: 'tween',
    ease: 'anticipate',
    duration: 0.4,
  }

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route
          path="/"
          element={
            <motion.div
              initial="initial"
              animate="animate"
              exit="exit"
              variants={pageVariants}
              transition={pageTransition}
            >
              <Home />
            </motion.div>
          }
        />
        <Route
          path="/services"
          element={
            <motion.div
              initial="initial"
              animate="animate"
              exit="exit"
              variants={pageVariants}
              transition={pageTransition}
            >
              <Services />
            </motion.div>
          }
        />
        <Route
          path="/pricing"
          element={
            <motion.div
              initial="initial"
              animate="animate"
              exit="exit"
              variants={pageVariants}
              transition={pageTransition}
            >
              <Pricing />
            </motion.div>
          }
        />
        <Route
          path="/blog"
          element={
            <motion.div
              initial="initial"
              animate="animate"
              exit="exit"
              variants={pageVariants}
              transition={pageTransition}
            >
              <Blog />
            </motion.div>
          }
        />
        <Route
          path="/about"
          element={
            <motion.div
              initial="initial"
              animate="animate"
              exit="exit"
              variants={pageVariants}
              transition={pageTransition}
            >
              <About />
            </motion.div>
          }
        />
        <Route
          path="/contact"
          element={
            <motion.div
              initial="initial"
              animate="animate"
              exit="exit"
              variants={pageVariants}
              transition={pageTransition}
            >
              <Contact />
            </motion.div>
          }
        />
        <Route
          path="/login"
          element={
            <motion.div
              initial="initial"
              animate="animate"
              exit="exit"
              variants={pageVariants}
              transition={pageTransition}
            >
              <Login />
            </motion.div>
          }
        />
        <Route
          path="/signup"
          element={
            <motion.div
              initial="initial"
              animate="animate"
              exit="exit"
              variants={pageVariants}
              transition={pageTransition}
            >
              <SignUp />
            </motion.div>
          }
        />
        <Route
          path="/product-details"
          element={
            <motion.div
              initial="initial"
              animate="animate"
              exit="exit"
              variants={pageVariants}
              transition={pageTransition}
            >
              <ProductDetails />
            </motion.div>
          }
        />
        <Route
          path="/services/select"
          element={
            <motion.div
              initial="initial"
              animate="animate"
              exit="exit"
              variants={pageVariants}
              transition={pageTransition}
            >
              <ServiceSelection />
            </motion.div>
          }
        />
        {/* Service Detail Pages */}
        <Route
          path="/services/design"
          element={
            <motion.div
              initial="initial"
              animate="animate"
              exit="exit"
              variants={pageVariants}
              transition={pageTransition}
            >
              <Design />
            </motion.div>
          }
        />
        <Route
          path="/services/testing"
          element={
            <motion.div
              initial="initial"
              animate="animate"
              exit="exit"
              variants={pageVariants}
              transition={pageTransition}
            >
              <Testing />
            </motion.div>
          }
        />
        <Route
          path="/services/calibration"
          element={
            <motion.div
              initial="initial"
              animate="animate"
              exit="exit"
              variants={pageVariants}
              transition={pageTransition}
            >
              <Calibration />
            </motion.div>
          }
        />
        <Route
          path="/services/simulation"
          element={
            <motion.div
              initial="initial"
              animate="animate"
              exit="exit"
              variants={pageVariants}
              transition={pageTransition}
            >
              <Simulation />
            </motion.div>
          }
        />
        <Route
          path="/services/product-debugging"
          element={
            <motion.div
              initial="initial"
              animate="animate"
              exit="exit"
              variants={pageVariants}
              transition={pageTransition}
            >
              <Debugging />
            </motion.div>
          }
        />
        <Route
          path="/services/certification"
          element={
            <motion.div
              initial="initial"
              animate="animate"
              exit="exit"
              variants={pageVariants}
              transition={pageTransition}
            >
              <Certification />
            </motion.div>
          }
        />
        {/* Customer Area */}
        <Route path="/customer" element={<DashboardLayout />}>
          <Route path="dashboard" element={<CustomerDashboard />} />
          <Route path="profile" element={<Profile />} />
          <Route path="products" element={<Products />} />
          <Route path="products/:id" element={<ProductDetail />} />
          <Route path="documents" element={<Documents />} />
          <Route path="order-history" element={<OrderHistory />} />
          <Route path="order-history/:id" element={<OrderDetail />} />
          <Route path="messages" element={<Messages />} />
          <Route path="settings" element={<Settings />} />
        </Route>
        {/* JRF Multi-step */}
        <Route path="/jrf/customer-details" element={<CustomerDetails />} />
        <Route path="/jrf/eut-details" element={<EUTDetails />} />
        <Route path="/jrf/testing-requirements" element={<TestingRequirements />} />
        <Route path="/jrf/testing-standards" element={<TestingStandards />} />
        <Route path="/jrf/labs-review" element={<LabsReview />} />
        {/* Lab Area */}
        <Route path="/lab/portal" element={<PortalSelection />} />
        <Route path="/lab/login" element={<LabLogin />} />
        <Route path="/lab/signup" element={<LabSignupPersonal />} />
        <Route path="/lab/signup/documents" element={<LabSignupDocuments />} />
        <Route path="/lab" element={<LabLayout />}>
          <Route path="dashboard" element={<LabDashboard />} />
          <Route path="queue" element={<LabQueue />} />
          <Route path="queue/:id" element={<RequestDetail />} />
          <Route path="schedule" element={<LabSchedule />} />
        </Route>
        {/* Lab Management System */}
        <Route path="/lab/management" element={<LabManagementLayout />}>
          <Route path="dashboard" element={<Suspense fallback={<PageLoader />}><LabManagementDashboard /></Suspense>} />
          <Route path="customers" element={<Suspense fallback={<PageLoader />}><LabManagementCustomers /></Suspense>} />
          <Route path="rfqs" element={<Suspense fallback={<PageLoader />}><LabManagementRFQs /></Suspense>} />
          <Route path="estimations" element={<Suspense fallback={<PageLoader />}><LabManagementEstimations /></Suspense>} />
          <Route path="projects" element={<Suspense fallback={<PageLoader />}><LabManagementProjects /></Suspense>} />
          <Route path="projects/:id" element={<Suspense fallback={<PageLoader />}><ProjectDetail /></Suspense>} />
          <Route path="test-plans" element={<Suspense fallback={<PageLoader />}><LabManagementTestPlans /></Suspense>} />
          <Route path="test-plans/:id" element={<Suspense fallback={<PageLoader />}><PlaceholderPage title="Test Plan Details" description="Detailed test plan information" /></Suspense>} />
          <Route path="test-executions" element={<Suspense fallback={<PageLoader />}><LabManagementTestExecutions /></Suspense>} />
          <Route path="test-executions/:id" element={<Suspense fallback={<PageLoader />}><PlaceholderPage title="Test Execution Details" description="Detailed test execution information" /></Suspense>} />
          <Route path="test-results" element={<Suspense fallback={<PageLoader />}><LabManagementTestResults /></Suspense>} />
          <Route path="test-results/:id" element={<Suspense fallback={<PageLoader />}><PlaceholderPage title="Test Result Details" description="Detailed test result information" /></Suspense>} />
          <Route path="samples" element={<Suspense fallback={<PageLoader />}><LabManagementSamples /></Suspense>} />
          <Route path="samples/:id" element={<Suspense fallback={<PageLoader />}><PlaceholderPage title="Sample Details" description="Detailed sample information" /></Suspense>} />
          <Route path="trfs" element={<Suspense fallback={<PageLoader />}><LabManagementTRFs /></Suspense>} />
          <Route path="trfs/:id" element={<Suspense fallback={<PageLoader />}><PlaceholderPage title="TRF Details" description="Detailed TRF information" /></Suspense>} />
          <Route path="documents" element={<Suspense fallback={<PageLoader />}><LabManagementDocuments /></Suspense>} />
          <Route path="documents/:id" element={<Suspense fallback={<PageLoader />}><PlaceholderPage title="Document Details" description="Detailed document information" /></Suspense>} />
          <Route path="reports" element={<Suspense fallback={<PageLoader />}><LabManagementReports /></Suspense>} />
          <Route path="audits" element={<Suspense fallback={<PageLoader />}><LabManagementAudits /></Suspense>} />
          <Route path="ncrs" element={<Suspense fallback={<PageLoader />}><LabManagementNCRs /></Suspense>} />
          <Route path="certifications" element={<Suspense fallback={<PageLoader />}><LabManagementCertifications /></Suspense>} />
        </Route>
      </Routes>
    </AnimatePresence>
  )
}

function AppContent() {
  const location = useLocation()
  const isLabDashboardRoute = location.pathname.startsWith('/lab/dashboard') || 
                               location.pathname.startsWith('/lab/queue') || 
                               location.pathname.startsWith('/lab/schedule')
  const isLabManagementRoute = location.pathname.startsWith('/lab/management')
  const isLabAuthRoute = location.pathname.startsWith('/lab/login') || 
                         location.pathname.startsWith('/lab/signup')
  const isCustomerDashboardRoute = location.pathname.startsWith('/customer/')
  
  // Hide main header/footer on lab dashboard, lab management, and customer dashboard (they have their own layouts)
  // But show on lab auth pages and portal selection so users can switch roles
  const showMainHeader = !isLabDashboardRoute && !isLabManagementRoute && !isCustomerDashboardRoute
  const showMainFooter = !isLabDashboardRoute && !isLabManagementRoute && !isCustomerDashboardRoute

  return (
    <div className="min-h-screen flex flex-col">
      <ScrollToTop />
      {showMainHeader && <Header />}
      <main className="flex-grow">
        <AnimatedRoutes />
      </main>
      {showMainFooter && <Footer />}
      <Toaster position="top-right" />
    </div>
  )
}

function App() {
  return (
    <RoleProvider>
      <DataProvider>
        <LabDataProvider>
          <Router>
            <AppContent />
          </Router>
        </LabDataProvider>
      </DataProvider>
    </RoleProvider>
  )
}

export default App
