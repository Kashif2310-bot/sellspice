import { motion } from 'framer-motion'

export default function HeroMetricCard({ label, value, sub, icon: Icon, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.6 }}
      whileHover={{ y: -4, scale: 1.02 }}
      className="glass rounded-2xl p-6 text-center card-hover cursor-default"
    >
      <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto mb-3">
        <Icon size={18} className="text-emerald-400" />
      </div>
      <div className="text-3xl font-black gradient-text mb-1" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
        {value}
      </div>
      <div className="text-white text-sm font-semibold mb-1">{label}</div>
      <div className="text-slate-500 text-xs">{sub}</div>
    </motion.div>
  )
}
