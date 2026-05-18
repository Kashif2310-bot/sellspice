import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard, Brain, Layers, Package, CalendarClock,
  Map, ArrowLeft, Zap, PlaySquare
} from 'lucide-react'
import OverviewTab from '../components/dashboard/OverviewTab'
import AIInsightsTab from '../components/dashboard/AIInsightsTab'
import CombosTab from '../components/dashboard/CombosTab'
import InventoryTab from '../components/dashboard/InventoryTab'
import ForecastTab from '../components/dashboard/ForecastTab'
import PeakHoursTab from '../components/dashboard/PeakHoursTab'
import GrowthFeedTab from '../components/dashboard/GrowthFeedTab'

const NAV = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'insights', label: 'AI Feed', icon: Brain },
  { id: 'combos', label: 'Combos', icon: Layers },
  { id: 'inventory', label: 'Inventory', icon: Package },
  { id: 'forecast', label: 'Forecast', icon: CalendarClock },
  { id: 'peak', label: 'Heatmap', icon: Map },
  { id: 'growth', label: 'Growth Feed', icon: PlaySquare },
]

export default function Dashboard({ onBack, pushToast }) {
  const [active, setActive] = useState('overview')

  const TABS = {
    overview: <OverviewTab pushToast={pushToast} />,
    insights: <AIInsightsTab pushToast={pushToast} />,
    combos: <CombosTab pushToast={pushToast} />,
    inventory: <InventoryTab pushToast={pushToast} />,
    forecast: <ForecastTab />,
    peak: <PeakHoursTab />,
    growth: <GrowthFeedTab pushToast={pushToast} />,
  }

  return (
    <div className="flex h-screen overflow-hidden bg-[var(--c-bg)]">
      {/* Sidebar */}
      <motion.aside initial={{ x: -260 }} animate={{ x: 0 }} transition={{ type: 'spring', damping: 24 }}
        className="w-64 border-r flex flex-col flex-shrink-0 z-20"
        style={{ borderColor: 'var(--c-border)', background: 'var(--c-surface)' }}>
        
        {/* Logo area */}
        <div className="p-6 border-b" style={{ borderColor: 'var(--c-border)' }}>
          <div className="flex items-center gap-2.5 mb-6">
            <div className="w-8 h-8 rounded-xl btn-primary flex items-center justify-center shadow-glow">
              <Zap size={16} color="white" strokeWidth={2.5} />
            </div>
            <span className="font-head font-bold text-lg text-white tracking-tight">SELLSPICE</span>
          </div>
          
          <div className="glass-sm p-3 border-emerald-500/20 bg-emerald-500/5">
            <div className="flex items-center gap-2 mb-1">
              <div className="dot-live" />
              <span className="text-[10px] uppercase tracking-wider font-bold text-emerald-400">Live Sync</span>
            </div>
            <div className="text-sm font-semibold text-white">Truffles, 80 Ft Road, BLR</div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {NAV.map(n => {
            const isActive = active === n.id
            return (
              <button key={n.id} onClick={() => setActive(n.id)}
                className={`nav-item w-full ${isActive ? 'active' : ''}`}>
                <n.icon size={16} strokeWidth={isActive ? 2.5 : 2} />
                {n.label}
              </button>
            )
          })}
        </nav>

        {/* Bottom */}
        <div className="p-4 border-t" style={{ borderColor: 'var(--c-border)' }}>
          <button onClick={onBack} className="nav-item w-full text-slate-500 hover:text-slate-300">
            <ArrowLeft size={16} /> Exit App
          </button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col relative overflow-hidden grid-bg">
        {/* Top Header */}
        <header className="h-16 border-b flex items-center justify-between px-8 flex-shrink-0 glass-nav z-10"
          style={{ borderColor: 'var(--c-border)' }}>
          <h1 className="font-head font-bold text-xl text-white">
            {NAV.find(n => n.id === active)?.label}
          </h1>
          <div className="flex items-center gap-4">
            <div className="badge badge-green"><Zap size={12} /> Gemini Active</div>
            <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-xs font-bold text-slate-300 border border-slate-700">
              TR
            </div>
          </div>
        </header>

        {/* Scrollable Tab Area */}
        <div className="flex-1 overflow-y-auto p-8 relative">
          <div className="max-w-6xl mx-auto h-full">
            <AnimatePresence mode="wait">
              <motion.div key={active}
                initial={{ opacity: 0, y: 10, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.98 }}
                transition={{ duration: 0.25 }}
                className={active === 'growth' ? 'h-full' : ''}
              >
                {TABS[active]}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </main>
    </div>
  )
}
