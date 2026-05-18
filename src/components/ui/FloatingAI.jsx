import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Bot, X, Send, Sparkles, BrainCircuit } from 'lucide-react'
import { askGemini, aiMemoryStore, addContextMemory } from '../../services/gemini'
import { useTypewriter } from '../../hooks/useAnimations'

const QUICK = [
  'What should I prepare tomorrow?',
  'Why were sales low?',
  'Which reels trend should I use?',
]

function AIMessage({ text, isUser }) {
  const { displayed, done } = useTypewriter(isUser ? text : text, isUser ? 0 : 22)
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-[85%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
        isUser
          ? 'bg-emerald-500/20 text-emerald-100 rounded-br-sm'
          : 'glass-sm text-slate-200 rounded-bl-sm'
      }`}>
        {isUser ? text : (
          <>
            {displayed}
            {!done && <span className="animate-blink text-emerald-400 ml-0.5">|</span>}
          </>
        )}
      </div>
    </div>
  )
}

export default function FloatingAI() {
  const [open, setOpen] = useState(false)
  const [msgs, setMsgs] = useState([
    { role: 'ai', text: "Hi! I'm SPICE — your restaurant AI. Tell me about your business context, or ask me for growth strategies." }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [history, setHistory] = useState([])
  const [memories, setMemories] = useState(aiMemoryStore)
  const [showMemoryMode, setShowMemoryMode] = useState(false)

  const send = async (text) => {
    const q = (text || input).trim()
    if (!q || loading) return
    setInput('')

    // Check if user is teaching context
    if(showMemoryMode || q.toLowerCase().includes('tomorrow') || q.toLowerCase().includes('expected') || q.toLowerCase().includes('happening')) {
      addContextMemory(q)
      setMemories([...aiMemoryStore])
      setMsgs(m => [...m, { role: 'user', text: q }])
      setMsgs(m => [...m, { role: 'ai', text: `Got it. I've added "${q}" to my core memory. I will adapt my inventory predictions and sales strategies based on this.` }])
      setShowMemoryMode(false)
      return
    }

    setMsgs(m => [...m, { role: 'user', text: q }])
    setLoading(true)

    const newHistory = [...history, { role: 'user', parts: [{ text: q }] }]
    const reply = await askGemini(q, history)
    setHistory([...newHistory, { role: 'model', parts: [{ text: reply }] }])
    setMsgs(m => [...m, { role: 'ai', text: reply }])
    setLoading(false)
  }

  return (
    <>
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setOpen(o => !o)}
        className="floating-ai-btn"
      >
        <AnimatePresence mode="wait">
          {open
            ? <motion.div key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }}><X size={22} color="white" /></motion.div>
            : <motion.div key="bot" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }}><Sparkles size={22} color="white" /></motion.div>
          }
        </AnimatePresence>
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.92 }}
            transition={{ type: 'spring', stiffness: 350, damping: 30 }}
            className="fixed bottom-24 right-7 z-50 w-[380px] glass flex flex-col overflow-hidden shadow-2xl"
            style={{ height: 560 }}
          >
            {/* Header */}
            <div className="px-5 py-4 border-b flex flex-col gap-3" style={{ borderColor: 'var(--c-border)' }}>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg,#10b981,#059669)' }}>
                  <Bot size={18} color="white" />
                </div>
                <div className="flex-1">
                  <div className="text-white font-semibold text-sm font-head">SPICE AI</div>
                  <div className="flex items-center gap-1.5 text-xs" style={{ color: 'var(--c-text-dim)' }}>
                    <div className="dot-live" /> Always on
                  </div>
                </div>
              </div>
              
              {/* Memory Indicator */}
              {memories.length > 0 && (
                <div className="bg-slate-800/50 rounded-lg p-2 text-xs text-slate-300 border border-slate-700/50 flex flex-col gap-1 max-h-16 overflow-y-auto">
                  <div className="text-[10px] uppercase font-bold text-emerald-400 flex items-center gap-1">
                    <BrainCircuit size={10} /> Active Memory
                  </div>
                  {memories.map((m,i) => <div key={i} className="truncate">• {m}</div>)}
                </div>
              )}
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
              {msgs.map((m, i) => <AIMessage key={i} text={m.text} isUser={m.role === 'user'} />)}
              {loading && (
                <div className="flex gap-1 items-center px-4 py-3 glass-sm w-fit rounded-2xl rounded-bl-sm">
                  {[0,1,2].map(i => (
                    <motion.div key={i} className="w-1.5 h-1.5 rounded-full bg-emerald-400"
                      animate={{ y: [0,-5,0] }} transition={{ repeat:Infinity, duration:0.8, delay:i*0.15 }} />
                  ))}
                </div>
              )}
            </div>

            {/* Quick prompts */}
            <div className="px-4 pb-2 flex gap-2 flex-wrap">
              <button onClick={() => setShowMemoryMode(true)}
                className={`text-xs px-2.5 py-1.5 rounded-lg cursor-pointer transition-all ${showMemoryMode ? 'bg-emerald-500 text-white' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'}`}>
                <BrainCircuit size={12} className="inline mr-1 mb-0.5" /> Teach Context
              </button>
              {QUICK.map(q => (
                <button key={q} onClick={() => send(q)}
                  className="text-xs px-2.5 py-1.5 rounded-lg cursor-pointer transition-all bg-slate-800/50 text-slate-300 hover:text-white border border-slate-700/50 hover:border-slate-500">
                  {q}
                </button>
              ))}
            </div>

            {/* Input */}
            <div className="px-4 pb-4">
              <div className="flex gap-2">
                <input
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && send()}
                  placeholder={showMemoryMode ? "E.g., 'IPL match tomorrow'" : "Ask anything..."}
                  className="flex-1 px-4 py-2.5 rounded-xl text-sm text-white placeholder:text-slate-500 outline-none"
                  style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--c-border)' }}
                />
                <motion.button whileTap={{ scale: 0.9 }} onClick={() => send()}
                  className={`w-10 h-10 rounded-xl flex items-center justify-center cursor-pointer flex-shrink-0 ${showMemoryMode ? 'bg-emerald-500' : 'btn-primary'}`}>
                  <Send size={15} color="white" />
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
