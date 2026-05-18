import { useState, useCallback } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import LandingPage from './pages/LandingPage'
import Dashboard from './pages/Dashboard'
import FloatingAI from './components/ui/FloatingAI'
import NotificationToast from './components/ui/NotificationToast'
import './index.css'

export default function App() {
  const [page, setPage] = useState('landing')
  const [toasts, setToasts] = useState([])

  const pushToast = useCallback((msg, type = 'info') => {
    const id = Date.now()
    setToasts(t => [...t, { id, msg, type }])
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 5000)
  }, [])

  return (
    <div className="min-h-screen" style={{ background: 'var(--c-bg)' }}>
      <AnimatePresence mode="wait">
        {page === 'landing' ? (
          <motion.div key="landing"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            <LandingPage onEnter={() => setPage('dashboard')} />
          </motion.div>
        ) : (
          <motion.div key="dashboard"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            <Dashboard onBack={() => setPage('landing')} pushToast={pushToast} />
          </motion.div>
        )}
      </AnimatePresence>

      <FloatingAI />

      {/* Toast container */}
      <div className="fixed bottom-24 right-6 z-50 flex flex-col gap-3">
        <AnimatePresence>
          {toasts.map(t => (
            <NotificationToast key={t.id} msg={t.msg} type={t.type}
              onDismiss={() => setToasts(ts => ts.filter(x => x.id !== t.id))} />
          ))}
        </AnimatePresence>
      </div>
    </div>
  )
}
