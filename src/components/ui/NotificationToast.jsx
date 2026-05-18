import { motion, AnimatePresence } from 'framer-motion'
import { X, TrendingUp, AlertTriangle, Info, CheckCircle } from 'lucide-react'

const icons = {
  success: CheckCircle,
  warning: AlertTriangle,
  error: AlertTriangle,
  info: Info,
  ai: TrendingUp,
}
const colors = {
  success: '#10b981',
  warning: '#f59e0b',
  error: '#ef4444',
  info: '#6366f1',
  ai: '#34d399',
}

export default function NotificationToast({ msg, type = 'info', onDismiss }) {
  const Icon = icons[type] || Info
  const color = colors[type] || '#6366f1'
  return (
    <motion.div
      initial={{ opacity: 0, x: 40, scale: 0.9 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 40, scale: 0.9 }}
      transition={{ type: 'spring', stiffness: 300, damping: 28 }}
      className="glass-sm flex items-start gap-3 px-4 py-3 pr-10 relative max-w-sm"
      style={{ borderColor: `${color}25` }}
    >
      <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
        style={{ background: `${color}15` }}>
        <Icon size={14} style={{ color }} />
      </div>
      <p className="text-sm text-slate-300 leading-snug">{msg}</p>
      <button onClick={onDismiss}
        className="absolute top-3 right-3 text-slate-600 hover:text-slate-400 transition-colors cursor-pointer">
        <X size={14} />
      </button>
    </motion.div>
  )
}
