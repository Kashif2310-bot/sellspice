import { motion } from 'framer-motion'
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer,
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  PieChart, Pie, Cell, Legend
} from 'recharts'
import { BarChart3 } from 'lucide-react'

const monthlyRevenue = [
  { month: 'Dec', revenue: 520000 },
  { month: 'Jan', revenue: 610000 },
  { month: 'Feb', revenue: 580000 },
  { month: 'Mar', revenue: 720000 },
  { month: 'Apr', revenue: 695000 },
  { month: 'May', revenue: 840000 },
]

const categoryPie = [
  { name: 'Main Course', value: 42, color: '#10b981' },
  { name: 'Starters', value: 24, color: '#34d399' },
  { name: 'Beverages', value: 18, color: '#6ee7b7' },
  { name: 'Desserts', value: 10, color: '#059669' },
  { name: 'Breads', value: 6, color: '#047857' },
]

const radarData = [
  { metric: 'Revenue', score: 88 },
  { metric: 'Efficiency', score: 92 },
  { metric: 'Waste Mgmt', score: 76 },
  { metric: 'Customer Sat', score: 94 },
  { metric: 'Staff Perf', score: 81 },
  { metric: 'AI Score', score: 97 },
]

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload?.length) {
    return (
      <div className="glass rounded-xl px-4 py-3 border border-emerald-500/20 text-xs">
        <p className="text-slate-400 mb-1">{label}</p>
        {payload.map(p => (
          <p key={p.name} style={{ color: p.color || '#10b981' }} className="font-bold">
            {typeof p.value === 'number' && p.value > 1000 ? `₹${p.value.toLocaleString()}` : p.value}
          </p>
        ))}
      </div>
    )
  }
  return null
}

export default function AnalyticsTab() {
  const healthScore = 94

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/25 flex items-center justify-center">
          <BarChart3 size={20} className="text-emerald-400" />
        </div>
        <div>
          <h2 className="text-white font-bold" style={{ fontFamily: 'Space Grotesk' }}>Growth Analytics</h2>
          <p className="text-slate-500 text-xs">6-month performance overview</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Health score */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass rounded-2xl p-6 text-center flex flex-col items-center justify-center"
        >
          <div className="text-slate-400 text-sm mb-4">Restaurant Health Score</div>
          <div className="relative w-36 h-36 mb-4">
            <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
              <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(16,185,129,0.1)" strokeWidth="8" />
              <motion.circle
                cx="50" cy="50" r="42" fill="none"
                stroke="url(#scoreGrad)" strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 42}`}
                initial={{ strokeDashoffset: 2 * Math.PI * 42 }}
                animate={{ strokeDashoffset: 2 * Math.PI * 42 * (1 - healthScore / 100) }}
                transition={{ duration: 1.5, ease: 'easeOut' }}
              />
              <defs>
                <linearGradient id="scoreGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#34d399" />
                  <stop offset="100%" stopColor="#10b981" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-4xl font-black gradient-text" style={{ fontFamily: 'Space Grotesk' }}>{healthScore}</span>
              <span className="text-slate-400 text-xs">/ 100</span>
            </div>
          </div>
          <div className="text-emerald-400 font-semibold text-sm">Excellent Performance</div>
          <div className="text-slate-500 text-xs mt-1">Top 5% of restaurants</div>
        </motion.div>

        {/* Revenue line chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-2 glass rounded-2xl p-6"
        >
          <h3 className="text-white font-semibold text-sm mb-4">Monthly Revenue Growth</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={monthlyRevenue}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(16,185,129,0.07)" />
              <XAxis dataKey="month" stroke="#475569" tick={{ fontSize: 11 }} />
              <YAxis stroke="#475569" tick={{ fontSize: 10 }} tickFormatter={v => `₹${(v/100000).toFixed(1)}L`} />
              <Tooltip content={<CustomTooltip />} />
              <Line type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={2.5}
                dot={{ fill: '#10b981', strokeWidth: 0, r: 4 }}
                activeDot={{ r: 6, fill: '#34d399' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category pie */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass rounded-2xl p-6"
        >
          <h3 className="text-white font-semibold text-sm mb-4">Sales by Category</h3>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={categoryPie} cx="50%" cy="50%"
                outerRadius={85} innerRadius={50}
                dataKey="value" paddingAngle={3}
              >
                {categoryPie.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(val) => [`${val}%`, '']} contentStyle={{ background: 'rgba(6,15,10,0.95)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: 8 }} />
              <Legend formatter={val => <span style={{ color: '#94a3b8', fontSize: 12 }}>{val}</span>} />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Radar chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass rounded-2xl p-6"
        >
          <h3 className="text-white font-semibold text-sm mb-4">Restaurant Performance Radar</h3>
          <ResponsiveContainer width="100%" height={220}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="rgba(16,185,129,0.15)" />
              <PolarAngleAxis dataKey="metric" tick={{ fill: '#64748b', fontSize: 10 }} />
              <Radar name="Score" dataKey="score" stroke="#10b981" fill="#10b981" fillOpacity={0.15} strokeWidth={2} />
            </RadarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>
    </div>
  )
}
