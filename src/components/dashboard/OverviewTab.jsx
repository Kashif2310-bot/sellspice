import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown, DollarSign, Activity } from 'lucide-react'
import AnimatedCounter from '../ui/AnimatedCounter'

export default function OverviewTab() {
  const healthScore = 94

  return (
    <div className="space-y-6">
      {/* Top section: Health Score + Big Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Health Score */}
        <motion.div className="card p-6 flex flex-col items-center justify-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 blur-2xl" />
          <h3 className="text-sm font-semibold text-slate-400 mb-6 w-full text-left">Restaurant Health Score</h3>
          
          <div className="relative w-40 h-40 mb-4 score-ring">
            <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
              <circle cx="50" cy="50" r="44" fill="none" stroke="rgba(16,185,129,0.1)" strokeWidth="6" />
              <motion.circle cx="50" cy="50" r="44" fill="none"
                stroke="url(#scoreG)" strokeWidth="6" strokeLinecap="round"
                strokeDasharray={2 * Math.PI * 44}
                initial={{ strokeDashoffset: 2 * Math.PI * 44 }}
                animate={{ strokeDashoffset: 2 * Math.PI * 44 * (1 - healthScore/100) }}
                transition={{ duration: 1.5, ease: "easeOut" }} />
              <defs>
                <linearGradient id="scoreG" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#34d399" />
                  <stop offset="100%" stopColor="#10b981" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-4xl font-black font-head text-white">
                <AnimatedCounter value={healthScore} />
              </span>
              <span className="text-xs text-slate-400 font-medium tracking-wide uppercase">Excellent</span>
            </div>
          </div>
          <div className="text-sm text-emerald-400 font-medium bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
            Top 5% Growth Momentum
          </div>
        </motion.div>

        {/* Big Metrics Grid */}
        <div className="lg:col-span-2 grid grid-cols-2 gap-4">
          {[
            { l: 'Today Revenue', v: 84200, prefix: '₹', c: '+18.2%', up: true, icon: DollarSign },
            { l: 'Waste Control', v: 34, suffix: '%', c: 'optimized', up: true, icon: Activity },
            { l: 'Combo Sales', v: 142, c: '+24%', up: true, icon: TrendingUp },
            { l: 'Avg Prep Time', v: 12, suffix: 'm', c: '-2m', up: false, icon: TrendingDown },
          ].map((m, i) => (
            <motion.div key={i} className="card p-6 flex flex-col justify-between">
              <div className="flex items-start justify-between mb-4">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                  <m.icon size={16} />
                </div>
                <div className={`badge ${m.up ? 'badge-green' : 'badge-red'} font-mono`}>
                  {m.c}
                </div>
              </div>
              <div>
                <div className="text-3xl font-black font-head text-white mb-1">
                  <AnimatedCounter value={m.v} prefix={m.prefix} suffix={m.suffix} delay={i*100} />
                </div>
                <div className="text-sm font-medium text-slate-400">{m.l}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* AI Daily Brief */}
      <motion.div className="card p-6 border-emerald-500/30" style={{ background: 'linear-gradient(145deg, rgba(8,18,11,0.9) 0%, rgba(16,185,129,0.05) 100%)' }}>
        <h3 className="text-sm font-semibold text-emerald-400 mb-4 flex items-center gap-2">
          <TrendingUp size={16} /> SPICE AI Daily Summary
        </h3>
        <p className="text-slate-300 leading-relaxed text-sm">
          Revenue is tracking 18% above your 30-day average, primarily driven by strong Combo Sales (+24%). 
          Waste control algorithms successfully reduced burger bun over-prep yesterday, saving ₹1,200. 
          Expect a minor demand dip around 4PM today; recommend enabling dynamic pricing on shakes to maintain momentum.
        </p>
      </motion.div>
    </div>
  )
}
