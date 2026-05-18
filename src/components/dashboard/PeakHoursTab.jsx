import { motion } from 'framer-motion'
import { Map, Info } from 'lucide-react'

// Generate realistic looking heatmap data (24 cols for hours, 7 rows for days)
const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
const HOURS = Array.from({length: 24}, (_, i) => i)

const generateHeatmap = () => {
  return DAYS.map(day => {
    return HOURS.map(h => {
      // Create artificial peaks at 1pm and 8pm
      let intensity = Math.random() * 0.3
      if (h >= 12 && h <= 14) intensity += 0.4 + Math.random() * 0.3 // Lunch peak
      if (h >= 19 && h <= 21) intensity += 0.5 + Math.random() * 0.3 // Dinner peak
      if (day === 'Sat' || day === 'Sun') intensity += 0.2 // Weekend boost
      return Math.min(1, Math.max(0.05, intensity))
    })
  })
}

const mapData = generateHeatmap()

export default function PeakHoursTab() {
  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-black font-head text-white flex items-center gap-2">
            <Map className="text-emerald-400" /> Crowd Heatmap
          </h2>
          <p className="text-sm text-slate-400 mt-1">Visualize historical footfall and order volume to optimize staffing</p>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-400 bg-slate-900/50 px-3 py-1.5 rounded-lg border border-slate-800">
          <Info size={14} /> Higher intensity = higher volume
        </div>
      </div>

      <div className="card p-8 overflow-x-auto">
        <div className="min-w-[700px]">
          {/* Header row (Hours) */}
          <div className="flex mb-2 ml-12">
            {HOURS.map(h => (
              <div key={h} className="flex-1 text-[10px] text-slate-500 text-center">
                {h%2===0 ? `${h}:00` : ''}
              </div>
            ))}
          </div>

          {/* Heatmap Grid */}
          <div className="space-y-1.5">
            {DAYS.map((day, dIdx) => (
              <div key={day} className="flex items-center gap-2">
                <div className="w-10 text-xs font-semibold text-slate-400">{day}</div>
                <div className="flex-1 flex gap-1.5">
                  {mapData[dIdx].map((intensity, hIdx) => (
                    <motion.div
                      key={hIdx}
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: (dIdx * 24 + hIdx) * 0.005 }}
                      className="flex-1 aspect-square rounded-[3px] heatmap-cell relative group cursor-crosshair"
                      style={{ 
                        background: `rgba(16,185,129,${intensity})`,
                      }}
                    >
                      {/* Tooltip on hover */}
                      <div className="opacity-0 group-hover:opacity-100 absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-slate-900 border border-slate-700 px-2 py-1 rounded text-[10px] text-white whitespace-nowrap z-10 pointer-events-none transition-opacity">
                        {day} {hIdx}:00 - {Math.round(intensity * 100)}% capacity
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Legend */}
        <div className="mt-8 flex items-center justify-end gap-3 text-xs text-slate-400">
          <span>Low</span>
          <div className="flex gap-1 h-3 w-32 rounded overflow-hidden">
            {[0.1, 0.3, 0.5, 0.7, 0.9].map(i => (
              <div key={i} className="flex-1 h-full" style={{ background: `rgba(16,185,129,${i})` }} />
            ))}
          </div>
          <span>High</span>
        </div>
      </div>
    </div>
  )
}
