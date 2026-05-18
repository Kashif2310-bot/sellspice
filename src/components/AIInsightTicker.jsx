import { motion } from 'framer-motion'

export default function AIInsightTicker({ insights }) {
  const doubled = [...insights, ...insights]
  return (
    <div className="fixed top-[64px] left-0 right-0 z-40 overflow-hidden border-y border-emerald-500/10 bg-emerald-950/30 backdrop-blur-sm py-2">
      <motion.div
        animate={{ x: ['0%', '-50%'] }}
        transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
        className="flex gap-12 whitespace-nowrap"
      >
        {doubled.map((insight, i) => (
          <span key={i} className="text-emerald-400/80 text-xs font-medium flex-shrink-0 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block animate-pulse" />
            {insight}
          </span>
        ))}
      </motion.div>
    </div>
  )
}
