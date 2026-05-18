import { motion } from 'framer-motion'
import { Check, Zap, Star } from 'lucide-react'

const plans = [
  {
    name: 'Starter',
    price: '₹2,999',
    period: '/mo',
    desc: 'Perfect for single-outlet restaurants getting started with AI.',
    features: [
      'AI Sales Prediction',
      'Basic Combo Optimizer',
      'Inventory Alerts',
      'Weekly Reports',
      '1 Restaurant Location',
      'Email Support',
    ],
    cta: 'Start Free Trial',
    highlight: false,
  },
  {
    name: 'Growth',
    price: '₹7,999',
    period: '/mo',
    desc: 'Full AI suite for fast-growing restaurants serious about scaling.',
    features: [
      'Everything in Starter',
      'DAA Algorithm Engine',
      'Real-time Demand Heatmaps',
      'Smart Pricing Engine',
      'Customer Behavior AI',
      'Waste Reduction AI',
      'Peak Hour Analysis',
      'Up to 5 Locations',
      'Priority Support',
    ],
    cta: 'Launch Dashboard',
    highlight: true,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    period: '',
    desc: 'White-glove AI deployment for restaurant chains and QSR brands.',
    features: [
      'Everything in Growth',
      'Custom ML Models',
      'API Access',
      'Dedicated AI Analyst',
      'Unlimited Locations',
      'White-label Option',
      'SLA Guarantee',
    ],
    cta: 'Contact Sales',
    highlight: false,
  },
]

export default function PricingSection({ onEnterDashboard }) {
  return (
    <section className="py-32 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-black text-white mb-4" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
            Simple, transparent <span className="gradient-text">pricing.</span>
          </h2>
          <p className="text-slate-400 text-lg">Start free. Scale without limits.</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -6 }}
              className={`relative rounded-2xl p-8 card-hover ${
                plan.highlight
                  ? 'bg-gradient-to-b from-emerald-950/80 to-emerald-900/30 border border-emerald-500/40 glow-green'
                  : 'glass'
              }`}
            >
              {plan.highlight && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <div className="flex items-center gap-1 px-4 py-1.5 rounded-full bg-emerald-500 text-white text-xs font-bold">
                    <Star size={10} fill="white" />
                    Most Popular
                  </div>
                </div>
              )}
              <div className="mb-6">
                <h3 className="text-slate-400 text-sm font-semibold uppercase tracking-wider mb-2">{plan.name}</h3>
                <div className="flex items-baseline gap-1 mb-2">
                  <span className="text-4xl font-black text-white" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                    {plan.price}
                  </span>
                  <span className="text-slate-500">{plan.period}</span>
                </div>
                <p className="text-slate-400 text-sm">{plan.desc}</p>
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((f, fi) => (
                  <li key={fi} className="flex items-center gap-3 text-sm text-slate-300">
                    <div className="w-5 h-5 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center flex-shrink-0">
                      <Check size={10} className="text-emerald-400" />
                    </div>
                    {f}
                  </li>
                ))}
              </ul>

              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={plan.highlight ? onEnterDashboard : undefined}
                className={`w-full py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 cursor-pointer ${
                  plan.highlight ? 'btn-primary text-white' : 'btn-ghost text-emerald-400'
                }`}
              >
                {plan.highlight && <Zap size={14} />}
                {plan.cta}
              </motion.button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
