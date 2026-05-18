import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import { Zap, Brain, TrendingUp, Sparkles, ChevronDown, Check, ArrowRight } from 'lucide-react'
import Navbar from '../components/Navbar'
import AnimatedCounter from '../components/ui/AnimatedCounter'

export default function LandingPage({ onEnter }) {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref })
  const y = useTransform(scrollYProgress, [0, 1], [0, -100])
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0])

  return (
    <div className="relative">
      <Navbar onEnter={onEnter} />

      {/* Ticker */}
      <div className="fixed top-20 inset-x-0 z-40 border-y py-1.5 overflow-hidden"
        style={{ borderColor: 'var(--c-border)', background: 'rgba(4,12,7,0.85)', backdropFilter: 'blur(12px)' }}>
        <motion.div className="flex gap-12 whitespace-nowrap" animate={{ x: ['0%', '-50%'] }} transition={{ duration: 40, ease: 'linear', repeat: Infinity }}>
          {[...Array(2)].fill([
            '🌡️ Shake demand rising 62% tomorrow due to heat wave',
            '🎓 Students prefer combo meals after 1PM — enable promo',
            '📦 Lettuce stock critical — 14h remaining',
            '🍔 Reduce chicken fillet prep by 10% on Mondays',
            '💰 Dynamic pricing opportunity detected for dinner rush'
          ]).flat().map((t, i) => (
            <span key={i} className="text-[11px] font-medium text-emerald-400 flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> {t}
            </span>
          ))}
        </motion.div>
      </div>

      {/* Hero */}
      <section ref={ref} className="min-h-screen flex items-center justify-center pt-20 px-6 relative overflow-hidden grid-bg">
        <div className="orb orb-em w-[600px] h-[600px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-spin-slow" />

        <motion.div style={{ y, opacity }} className="relative z-10 max-w-5xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="badge badge-green mb-8">
            <Sparkles size={12} /> Gemini AI Engine v3.0 Active
          </motion.div>

          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="text-6xl md:text-8xl font-black font-head tracking-tight leading-[1.1] mb-6">
            The autonomous <br />
            <span className="g-text text-glow">growth engine.</span>
          </motion.h1>

          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            SELLSPICE AI connects to your POS, predicts demand, builds combos, and stops food waste before it happens. Pure intelligence.
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button onClick={onEnter} className="btn btn-primary px-8 py-4 text-base w-full sm:w-auto justify-center">
              <Zap size={18} /> Launch AI Dashboard <ArrowRight size={16} />
            </button>
            <button className="btn btn-subtle px-8 py-4 text-base w-full sm:w-auto justify-center">
              Book Demo
            </button>
          </motion.div>
        </motion.div>

        <motion.div animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 2 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 text-emerald-500/40">
          <ChevronDown size={24} />
        </motion.div>
      </section>

      {/* Features */}
      <section className="py-32 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-black font-head mb-4">Zero clutter. <span className="g-text">Pure ROI.</span></h2>
            <p className="text-slate-400 text-lg">We stripped away the noise. Only the features that make you money remain.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: Brain, t: 'Live AI Predictions', d: 'Gemini-powered insights tell you exactly what will sell tomorrow, based on weather, events, and history.' },
              { icon: TrendingUp, t: 'Smart Combos', d: 'AI automatically bundles slow-moving items with bestsellers to maximize margin and clear inventory.' },
              { icon: Zap, t: 'Waste Prevention', d: 'Upload your grocery bills. AI predicts exactly when stock will spoil and adjusts prep quantities.' }
            ].map((f, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i*0.1 }}
                className="card p-8">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-6">
                  <f.icon size={20} className="text-emerald-400" />
                </div>
                <h3 className="text-lg font-bold font-head text-white mb-3">{f.t}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{f.d}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing simple */}
      <section className="py-32 px-6 border-t" style={{ borderColor: 'var(--c-border)' }}>
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-black font-head mb-16">Simple Pricing</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="card-static p-8 text-left border-slate-800">
              <div className="text-sm font-semibold text-slate-400 mb-2">STARTER</div>
              <div className="text-4xl font-bold font-head text-white mb-6">₹2,999<span className="text-lg text-slate-500 font-body font-normal">/mo</span></div>
              <ul className="space-y-4 mb-8">
                {['Basic predictions', '1 Location', 'Email support'].map((l,i) => (
                  <li key={i} className="flex gap-3 text-sm text-slate-300"><Check size={16} className="text-emerald-500" /> {l}</li>
                ))}
              </ul>
              <button className="btn btn-subtle w-full justify-center py-3">Start Free Trial</button>
            </div>
            <div className="card p-8 text-left relative overflow-hidden" style={{ borderColor: 'var(--c-border-hv)' }}>
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 blur-2xl" />
              <div className="badge badge-green mb-2 absolute top-6 right-6">Popular</div>
              <div className="text-sm font-semibold text-emerald-400 mb-2">GROWTH AI</div>
              <div className="text-4xl font-bold font-head text-white mb-6">₹7,999<span className="text-lg text-slate-500 font-body font-normal">/mo</span></div>
              <ul className="space-y-4 mb-8 relative z-10">
                {['Full Gemini AI Engine', 'Smart Combos & Heatmaps', 'Invoice Upload & Parsing', 'Up to 5 Locations', 'Voice AI Assistant'].map((l,i) => (
                  <li key={i} className="flex gap-3 text-sm text-slate-300"><Check size={16} className="text-emerald-400" /> {l}</li>
                ))}
              </ul>
              <button onClick={onEnter} className="btn btn-primary w-full justify-center py-3 relative z-10">Launch Dashboard</button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t text-center text-sm text-slate-500" style={{ borderColor: 'var(--c-border)' }}>
        <p>© 2026 SELLSPICE AI. Built for the future of restaurants.</p>
      </footer>
    </div>
  )
}
