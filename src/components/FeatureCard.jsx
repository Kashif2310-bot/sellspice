import { motion } from 'framer-motion'

export default function FeatureCard({ icon: Icon, title, desc, tag, color, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.5 }}
      whileHover={{ y: -6 }}
      className="glass rounded-2xl p-7 card-hover group cursor-default relative overflow-hidden"
    >
      {/* BG accent */}
      <div
        className="absolute -top-10 -right-10 w-32 h-32 rounded-full opacity-5 group-hover:opacity-10 transition-opacity duration-500 blur-2xl"
        style={{ background: color }}
      />
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 border"
        style={{ background: `${color}15`, borderColor: `${color}30` }}
      >
        <Icon size={22} style={{ color }} />
      </div>
      <div className="inline-block px-2.5 py-1 rounded-md text-xs font-semibold mb-3"
        style={{ background: `${color}15`, color }}>
        {tag}
      </div>
      <h3 className="text-white font-bold text-lg mb-3" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
        {title}
      </h3>
      <p className="text-slate-400 text-sm leading-relaxed">{desc}</p>
      <div className="mt-5 flex items-center gap-2 text-xs font-medium"
        style={{ color }}>
        <span>Learn more</span>
        <span className="group-hover:translate-x-1 transition-transform">→</span>
      </div>
    </motion.div>
  )
}
