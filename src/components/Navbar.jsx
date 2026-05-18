import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Zap, Menu, X } from 'lucide-react'

const NAV_LINKS = ['Platform', 'Features', 'Pricing', 'Docs']

export default function Navbar({ onEnter }) {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 48)
    window.addEventListener('scroll', fn)
    return () => window.removeEventListener('scroll', fn)
  }, [])

  return (
    <motion.nav
      initial={{ y: -80 }} animate={{ y: 0 }}
      transition={{ duration: 0.5, type: 'spring', stiffness: 200 }}
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${scrolled ? 'glass-nav py-3' : 'py-5'}`}
    >
      <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl btn-primary flex items-center justify-center">
            <Zap size={16} color="white" strokeWidth={2.5} />
          </div>
          <span className="font-head font-bold text-lg text-white tracking-tight">
            SELL<span className="g-text">SPICE</span>
            <span className="text-emerald-400 text-[11px] font-semibold ml-1 align-super">AI</span>
          </span>
        </div>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map(l => (
            <button key={l} className="text-sm font-medium cursor-pointer transition-colors"
              style={{ color: 'var(--c-muted)' }}
              onMouseEnter={e => e.target.style.color = '#e2e8f0'}
              onMouseLeave={e => e.target.style.color = 'var(--c-muted)'}>
              {l}
            </button>
          ))}
        </div>

        {/* CTA */}
        <div className="hidden md:flex items-center gap-3">
          <button className="text-sm font-medium cursor-pointer transition-colors"
            style={{ color: 'var(--c-muted)' }}>Sign in</button>
          <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
            onClick={onEnter}
            className="btn btn-primary px-5 py-2.5 text-sm text-white cursor-pointer">
            <Zap size={14} /> Open Dashboard
          </motion.button>
        </div>

        {/* Mobile */}
        <button className="md:hidden cursor-pointer" style={{ color: 'var(--c-muted)' }}
          onClick={() => setMobileOpen(o => !o)}>
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
          className="md:hidden glass-nav border-t mt-2 px-6 py-4 flex flex-col gap-3"
          style={{ borderColor: 'var(--c-border)' }}>
          {NAV_LINKS.map(l => (
            <button key={l} className="text-sm font-medium text-left cursor-pointer"
              style={{ color: 'var(--c-muted)' }}>{l}</button>
          ))}
          <button onClick={onEnter} className="btn btn-primary px-4 py-2.5 text-sm text-white mt-1 cursor-pointer justify-center">
            Open Dashboard
          </button>
        </motion.div>
      )}
    </motion.nav>
  )
}
