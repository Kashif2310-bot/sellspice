import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, Check } from 'lucide-react'
import { generateInsights } from '../../services/gemini'
import { useTypewriter } from '../../hooks/useAnimations'

function InsightCard({ insight, index, onAction }) {
  const [done, setDone] = useState(false)
  const { displayed, done: typeDone } = useTypewriter(insight.detail, 20, index * 300)
  
  const colors = {
    high: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    medium: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
    low: 'text-slate-400 bg-slate-500/10 border-slate-500/20',
  }[insight.priority]

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}
      className={`card p-6 border-l-4 ${insight.priority === 'high' ? 'border-l-emerald-500' : 'border-l-transparent'}`}
    >
      <div className="flex items-start gap-4">
        <div className="text-2xl mt-1 bg-slate-800/50 w-10 h-10 rounded-xl flex items-center justify-center border border-slate-700">
          {insight.icon}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="font-bold text-white text-base">{insight.title}</h3>
            <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded border ${colors}`}>
              {insight.priority} impact
            </span>
          </div>
          
          <p className="text-sm text-slate-300 leading-relaxed mb-4 min-h-[40px]">
            {displayed}
            {!typeDone && <span className="animate-blink text-emerald-400 ml-0.5">|</span>}
          </p>
          
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-800">
            <span className="font-mono text-xs text-emerald-400 font-bold bg-emerald-500/10 px-2 py-1 rounded">
              Est. Impact: {insight.impact}
            </span>
            
            <button 
              onClick={() => { setDone(true); onAction(); }}
              disabled={done || !typeDone}
              className={`btn px-4 py-1.5 text-xs ${done ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'btn-ghost'}`}
            >
              {done ? <><Check size={12}/> Applied</> : 'Apply Recommendation'}
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default function AIInsightsTab({ pushToast }) {
  const [insights, setInsights] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    generateInsights().then(data => {
      setInsights(data)
      setLoading(false)
    })
  }, [])

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-black font-head text-white flex items-center gap-2">
            <Sparkles className="text-emerald-400" /> Smart Feed
          </h2>
          <p className="text-sm text-slate-400 mt-1">Real-time analysis powered by Gemini 1.5 Pro</p>
        </div>
        <div className="badge badge-green animate-pulse">Live Syncing</div>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1,2,3].map(i => (
            <div key={i} className="card p-6 h-32 shimmer border-slate-800/50" />
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {insights.map((ins, i) => (
            <InsightCard key={i} insight={ins} index={i} onAction={() => pushToast('AI Recommendation applied successfully', 'success')} />
          ))}
        </div>
      )}
    </div>
  )
}
