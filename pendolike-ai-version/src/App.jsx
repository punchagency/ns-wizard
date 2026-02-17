import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import AppLayout from './components/layout/AppLayout'
import MarketingLayout from './components/layout/MarketingLayout'
import Landing from './pages/Landing'
import Features from './pages/Features'
import Pricing from './pages/Pricing'
import About from './pages/About'
import Contact from './pages/Contact'
import Demo from './pages/Demo'
import PrivacyPolicy from './pages/PrivacyPolicy'
import TermsOfService from './pages/TermsOfService'
import Dashboard from './pages/Dashboard'
import Projects from './pages/Projects'
import ProjectDetails from './pages/ProjectDetails'
import Invoices from './pages/Invoices'
import CreateInvoice from './pages/CreateInvoice'
import Analytics from './pages/Analytics'
import Team from './pages/Team'
import Settings from './pages/Settings'
import ToastProvider from './components/ui/ToastProvider'

const AnimatedPage = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    transition={{ duration: 0.3 }}
  >
    {children}
  </motion.div>
)

const AppRoutes = () => {
  const location = useLocation()
  const isAppRoute = location.pathname.startsWith('/dashboard') ||
                     location.pathname.startsWith('/projects') ||
                     location.pathname.startsWith('/invoices') ||
                     location.pathname.startsWith('/analytics') ||
                     location.pathname.startsWith('/team') ||
                     location.pathname.startsWith('/settings')

  if (isAppRoute) {
    return (
      <AppLayout>
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/dashboard" element={<AnimatedPage><Dashboard /></AnimatedPage>} />
            <Route path="/projects" element={<AnimatedPage><Projects /></AnimatedPage>} />
            <Route path="/projects/:id" element={<AnimatedPage><ProjectDetails /></AnimatedPage>} />
            <Route path="/invoices" element={<AnimatedPage><Invoices /></AnimatedPage>} />
            <Route path="/invoices/new" element={<AnimatedPage><CreateInvoice /></AnimatedPage>} />
            <Route path="/analytics" element={<AnimatedPage><Analytics /></AnimatedPage>} />
            <Route path="/team" element={<AnimatedPage><Team /></AnimatedPage>} />
            <Route path="/settings" element={<AnimatedPage><Settings /></AnimatedPage>} />
          </Routes>
        </AnimatePresence>
      </AppLayout>
    )
  }

  return (
    <MarketingLayout>
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<AnimatedPage><Landing /></AnimatedPage>} />
          <Route path="/features" element={<AnimatedPage><Features /></AnimatedPage>} />
          <Route path="/pricing" element={<AnimatedPage><Pricing /></AnimatedPage>} />
          <Route path="/about" element={<AnimatedPage><About /></AnimatedPage>} />
          <Route path="/contact" element={<AnimatedPage><Contact /></AnimatedPage>} />
          <Route path="/demo" element={<AnimatedPage><Demo /></AnimatedPage>} />
          <Route path="/privacy" element={<AnimatedPage><PrivacyPolicy /></AnimatedPage>} />
          <Route path="/terms" element={<AnimatedPage><TermsOfService /></AnimatedPage>} />
        </Routes>
      </AnimatePresence>
    </MarketingLayout>
  )
}

function App() {
  return (
    <ToastProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </ToastProvider>
  )
}

export default App
