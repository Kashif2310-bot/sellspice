import { motion } from 'framer-motion'
import { Zap } from 'lucide-react'

export default function FooterSection() {
  return (
    <footer className="border-t border-emerald-500/10 py-16 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-10 mb-16">
          <div className="col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-lg btn-primary flex items-center justify-center">
                <Zap size={18} className="text-white" />
              </div>
              <span className="text-white font-black text-xl" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                SELL<span className="gradient-text">SPICE</span>
                <span className="text-emerald-400 text-xs font-medium ml-1">AI</span>
              </span>
            </div>
            <p className="text-slate-500 text-sm leading-relaxed max-w-xs">
              The AI-powered restaurant growth engine trusted by 2,400+ restaurants across India.
            </p>
            <div className="flex items-center gap-2 mt-4">
              <div className="status-dot" />
              <span className="text-emerald-400 text-xs">All systems operational</span>
            </div>
          </div>
          {[
            { title: 'Product', links: ['Features', 'DAA Engine', 'Integrations', 'Changelog'] },
            { title: 'Company', links: ['About', 'Blog', 'Careers', 'Press'] },
            { title: 'Support', links: ['Documentation', 'API Reference', 'Contact', 'Status'] },
          ].map(col => (
            <div key={col.title}>
              <h4 className="text-white font-semibold text-sm mb-4">{col.title}</h4>
              <ul className="space-y-2.5">
                {col.links.map(link => (
                  <li key={link}>
                    <button className="text-slate-500 hover:text-emerald-400 text-sm transition-colors cursor-pointer">
                      {link}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="border-t border-emerald-500/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-slate-600 text-sm">© 2026 SellSpice AI. All rights reserved.</p>
          <p className="text-slate-600 text-sm">
            Built with <span className="text-emerald-500">DAA + AI</span> • Made in India 🇮🇳
          </p>
        </div>
      </div>
    </footer>
  )
}
