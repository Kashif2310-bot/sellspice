import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'

const algorithms = [
  {
    name: 'Greedy Algorithm',
    use: 'Combo Optimization',
    desc: 'Iteratively selects highest-margin items to build optimal combo bundles in O(n log n) time.',
    example: 'Paneer Tikka + Naan + Lassi → ₹349 combo at 62% margin',
    color: '#10b981',
    complexity: 'O(n log n)',
    steps: ['Sort items by margin/price ratio', 'Select top items greedily', 'Bundle into combos', 'Price for max profit'],
  },
  {
    name: 'Dynamic Programming',
    use: 'Inventory Forecasting',
    desc: 'Bottom-up DP table forecasts ingredient requirements across 72-hour rolling window with 97% accuracy.',
    example: '72h forecast: 12kg chicken, 8kg paneer, 200 rotis needed',
    color: '#34d399',
    complexity: 'O(n·W)',
    steps: ['Build demand state table', 'Cache subproblem solutions', 'Forecast optimal stock', 'Alert reorder points'],
  },
  {
    name: "Dijkstra's Algorithm",
    use: 'Delivery Route Optimization',
    desc: 'Shortest-path routing across delivery zones to minimize delivery time and fuel costs.',
    example: 'Route A→D saves 14 min vs Route A→B→C→D',
    color: '#6ee7b7',
    complexity: 'O(E log V)',
    steps: ['Map delivery graph', 'Weight edges by traffic', 'Find shortest paths', 'Optimize assignments'],
  },
  {
    name: '0/1 Knapsack',
    use: 'Profit-Maximized Menu',
    desc: 'Select optimal subset of menu items that maximizes profit given prep time and ingredient constraints.',
    example: 'Best 8-item menu: ₹42,000 projected daily revenue',
    color: '#059669',
    complexity: 'O(n·W)',
    steps: ['Define item values/weights', 'Set capacity constraints', 'DP table fill', 'Backtrack optimal set'],
  },
  {
    name: 'Merge Sort',
    use: 'Top-Selling Item Analysis',
    desc: 'Divide-and-conquer sorting of 500+ menu items by multi-dimensional performance metrics.',
    example: 'Ranked: Biryani #1 (₹8.2L), Paneer #2 (₹6.1L), Lassi #3',
    color: '#a7f3d0',
    complexity: 'O(n log n)',
    steps: ['Divide item dataset', 'Score by revenue+margin', 'Merge sorted halves', 'Rank performance tiers'],
  },
]

export default function DAASection() {
  return (
    <section className="py-32 px-6 relative">
      <div className="absolute inset-0 grid-bg opacity-30" />
      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-emerald-500/20 mb-6">
            <span className="text-emerald-400 text-sm font-mono">{'{ DAA Engine }'}</span>
          </div>
          <h2 className="text-4xl md:text-6xl font-black text-white mb-6" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
            Algorithms that
            <br />
            <span className="gradient-text">print money.</span>
          </h2>
          <p className="text-slate-400 text-xl max-w-2xl mx-auto">
            Classic computer science algorithms, reimagined as restaurant profit engines.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {algorithms.map((algo, i) => (
            <motion.div
              key={algo.name}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              whileHover={{ y: -6 }}
              className={`glass rounded-2xl p-7 card-hover relative overflow-hidden ${i === 2 ? 'md:col-span-2 lg:col-span-1' : ''}`}
            >
              <div className="absolute top-0 right-0 w-40 h-40 rounded-full opacity-5 blur-2xl"
                style={{ background: algo.color }} />

              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="text-xs font-mono px-2 py-1 rounded border mb-2"
                    style={{ color: algo.color, borderColor: `${algo.color}30`, background: `${algo.color}10` }}>
                    {algo.complexity}
                  </div>
                  <div className="text-xs text-slate-500 uppercase tracking-widest font-semibold">{algo.use}</div>
                </div>
              </div>

              <h3 className="text-white font-bold text-xl mb-3" style={{ fontFamily: 'Space Grotesk, sans-serif', color: algo.color }}>
                {algo.name}
              </h3>
              <p className="text-slate-400 text-sm leading-relaxed mb-4">{algo.desc}</p>

              <div className="rounded-lg p-3 mb-4 text-xs font-mono"
                style={{ background: `${algo.color}08`, borderLeft: `2px solid ${algo.color}40` }}>
                <span style={{ color: algo.color }}>→ </span>
                <span className="text-slate-300">{algo.example}</span>
              </div>

              <div className="space-y-1.5">
                {algo.steps.map((step, si) => (
                  <div key={si} className="flex items-center gap-2 text-xs text-slate-500">
                    <span className="w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0"
                      style={{ background: `${algo.color}15`, color: algo.color }}>
                      {si + 1}
                    </span>
                    {step}
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
