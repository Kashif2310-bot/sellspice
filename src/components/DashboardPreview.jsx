import { motion } from 'framer-motion'
import { BarChart3, TrendingUp, Brain, Zap, ArrowRight } from 'lucide-react'

export default function DashboardPreview({ onEnterDashboard }) {
  return (
    <section className="py-24 px-6 relative overflow-hidden">
      <div className="absolute inset-0 grid-bg opacity-20" />
      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-black text-white mb-4" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
            One dashboard. <span className="gradient-text">Total control.</span>
          </h2>
          <p className="text-slate-400 text-lg max-w-xl mx-auto">
            Your entire restaurant intelligence, live in one place.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 60, scale: 0.95 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative rounded-3xl overflow-hidden border border-emerald-500/20 glow-green"
        >
          {/* Fake dashboard preview */}
          <div className="bg-[#050d07] p-6 min-h-[480px]">
            {/* Top bar */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-red-500/70" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
                <div className="w-3 h-3 rounded-full bg-emerald-500/70" />
                <span className="text-slate-500 text-xs ml-2 font-mono">sellspice.ai/dashboard</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="status-dot" />
                <span className="text-emerald-400 text-xs">Live AI Active</span>
              </div>
            </div>

            {/* Dashboard grid */}
            <div className="grid grid-cols-3 md:grid-cols-4 gap-4">
              {/* Left sidebar (hidden on mobile) */}
              <div className="hidden md:flex flex-col gap-2">
                {['Overview', 'AI Insights', 'Combos', 'Inventory', 'Analytics', 'DAA Engine'].map((item, i) => (
                  <div key={item}
                    className={`px-3 py-2 rounded-lg text-xs font-medium cursor-pointer transition-all ${
                      i === 0
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : 'text-slate-500 hover:text-slate-300'
                    }`}>
                    {item}
                  </div>
                ))}
              </div>

              {/* Main content */}
              <div className="col-span-3 grid grid-cols-3 gap-4">
                {/* Stats row */}
                {[
                  { label: 'Today Revenue', val: '₹84,200', change: '+18%', color: '#10b981' },
                  { label: 'AI Accuracy', val: '97.2%', change: '+2.1%', color: '#34d399' },
                  { label: 'Waste Saved', val: '₹12,400', change: '-34%', color: '#059669' },
                ].map(stat => (
                  <div key={stat.label} className="glass rounded-xl p-4">
                    <div className="text-slate-500 text-xs mb-1">{stat.label}</div>
                    <div className="text-white font-bold text-xl" style={{ fontFamily: 'Space Grotesk' }}>{stat.val}</div>
                    <div className="text-xs font-medium mt-1" style={{ color: stat.color }}>{stat.change} vs yesterday</div>
                  </div>
                ))}

                {/* Chart area */}
                <div className="col-span-2 glass rounded-xl p-4">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-white font-semibold text-sm">Revenue Trend</span>
                    <span className="text-emerald-400 text-xs">7 days</span>
                  </div>
                  <div className="h-28 flex items-end gap-1.5">
                    {[55, 70, 62, 88, 75, 92, 84].map((h, i) => (
                      <motion.div
                        key={i}
                        initial={{ height: 0 }}
                        whileInView={{ height: `${h}%` }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.1, duration: 0.6 }}
                        className="flex-1 rounded-t-md"
                        style={{
                          background: i === 6
                            ? 'linear-gradient(to top, #10b981, #34d399)'
                            : 'rgba(16,185,129,0.25)'
                        }}
                      />
                    ))}
                  </div>
                  <div className="flex justify-between text-xs text-slate-600 mt-1">
                    {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map(d => <span key={d}>{d}</span>)}
                  </div>
                </div>

                {/* AI Insight card */}
                <div className="glass rounded-xl p-4 border border-emerald-500/20">
                  <div className="flex items-center gap-2 mb-3">
                    <Brain size={14} className="text-emerald-400" />
                    <span className="text-emerald-400 text-xs font-semibold">AI Insight</span>
                  </div>
                  <div className="space-y-2">
                    {[
                      '🌡️ Lassi +63% today',
                      '🎓 Student combo 1–4PM',
                      '📦 Reorder onions now',
                    ].map(ins => (
                      <div key={ins} className="text-xs text-slate-300 bg-emerald-500/5 rounded-md px-2 py-1.5 border border-emerald-500/10">
                        {ins}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Heatmap preview */}
                <div className="col-span-3 glass rounded-xl p-4">
                  <div className="text-white font-semibold text-sm mb-3">Peak Hour Heatmap</div>
                  <div className="grid grid-cols-12 gap-1">
                    {Array.from({ length: 84 }, (_, i) => {
                      const intensity = Math.random()
                      return (
                        <div key={i}
                          className="h-5 rounded-sm"
                          style={{
                            background: intensity > 0.7
                              ? `rgba(16,185,129,${intensity})`
                              : intensity > 0.4
                              ? `rgba(16,185,129,${intensity * 0.5})`
                              : `rgba(16,185,129,0.05)`
                          }}
                        />
                      )
                    })}
                  </div>
                  <div className="flex justify-between text-xs text-slate-600 mt-2">
                    <span>9 AM</span><span>12 PM</span><span>3 PM</span><span>6 PM</span><span>9 PM</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Overlay CTA */}
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-t from-[#030a06] via-transparent to-transparent">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              onClick={onEnterDashboard}
              className="btn-primary px-8 py-4 rounded-xl font-bold text-white text-lg flex items-center gap-3 shadow-2xl cursor-pointer mt-32"
            >
              <Zap size={20} />
              Open Live Dashboard
              <ArrowRight size={18} />
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
