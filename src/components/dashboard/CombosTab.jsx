import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Layers, Plus, Zap, RefreshCw, Check } from 'lucide-react'
import { generateCombos } from '../../services/gemini'

const MENU = ['Chicken Biryani', 'Paneer Tikka', 'Mango Lassi', 'Butter Naan', 'Dal Makhani', 'Gulab Jamun']

export default function CombosTab({ pushToast }) {
  const [selected, setSelected] = useState(['Chicken Biryani', 'Mango Lassi'])
  const [generating, setGenerating] = useState(false)
  const [aiCombos, setAiCombos] = useState([])

  const toggle = item => setSelected(s => s.includes(item) ? s.filter(x => x !== item) : [...s, item])

  const handleGenerate = async () => {
    if(selected.length < 2) return pushToast('Select at least 2 items', 'warning')
    setGenerating(true)
    const res = await generateCombos(selected)
    setAiCombos(res)
    setGenerating(false)
    pushToast('Generated AI Combos based on current demand', 'success')
  }

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div>
        <h2 className="text-2xl font-black font-head text-white flex items-center gap-2">
          <Layers className="text-emerald-400" /> Smart Combo Builder
        </h2>
        <p className="text-sm text-slate-400 mt-1">Select items and let AI build the most profitable bundle</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Builder */}
        <div className="card p-6 lg:col-span-1 space-y-6">
          <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wide">1. Select Base Items</h3>
          <div className="flex flex-wrap gap-2">
            {MENU.map(item => (
              <button key={item} onClick={() => toggle(item)}
                className={`px-3 py-2 rounded-xl text-sm transition-all border ${
                  selected.includes(item) 
                    ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300' 
                    : 'bg-slate-900/50 border-slate-800 text-slate-400 hover:border-slate-600'
                }`}>
                {item}
              </button>
            ))}
          </div>

          <button onClick={handleGenerate} disabled={generating || selected.length < 2}
            className="btn btn-primary w-full py-3 justify-center text-sm disabled:opacity-50">
            {generating ? <><RefreshCw size={16} className="animate-spin" /> AI Analyzing...</> : <><Zap size={16} /> Generate Combos</>}
          </button>
        </div>

        {/* Results */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wide mb-2">2. AI Recommendations</h3>
          
          {aiCombos.length === 0 && !generating && (
            <div className="card p-12 flex flex-col items-center justify-center text-center border-dashed border-slate-700">
              <SparklesIcon className="w-12 h-12 text-slate-600 mb-4" />
              <p className="text-slate-400">Select items and click generate to see AI bundles</p>
            </div>
          )}

          <AnimatePresence>
            {aiCombos.map((combo, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}
                className="card p-6 flex flex-col sm:flex-row gap-6 items-center border-emerald-500/20 relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 blur-xl" />
                
                <div className="flex-1 w-full">
                  <h4 className="text-lg font-bold text-white mb-2 font-head">{combo.name}</h4>
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {combo.items.map(it => (
                      <span key={it} className="bg-slate-800/80 text-slate-300 text-xs px-2 py-1 rounded border border-slate-700">{it}</span>
                    ))}
                  </div>
                  <p className="text-sm text-emerald-400/90 leading-snug">{combo.reason}</p>
                </div>

                <div className="flex sm:flex-col items-center sm:items-end gap-4 sm:gap-2 w-full sm:w-auto border-t sm:border-t-0 sm:border-l border-slate-800 pt-4 sm:pt-0 sm:pl-6 shrink-0">
                  <div className="text-right flex-1 sm:flex-none">
                    <div className="text-3xl font-black text-white font-head mb-0.5">₹{combo.price}</div>
                    <div className="text-xs text-slate-500 line-through">₹{combo.price + combo.savings}</div>
                  </div>
                  <div className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded">
                    {combo.margin} Margin
                  </div>
                  <button className="btn btn-ghost px-4 py-1.5 text-xs mt-1" onClick={() => pushToast(`${combo.name} activated on POS`, 'success')}>
                    Activate
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}

function SparklesIcon(props) {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>
}
