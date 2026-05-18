import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { TrendingUp, Play, CheckCircle } from 'lucide-react'

const algorithms = [
  {
    id: 'greedy',
    name: 'Greedy Algorithm',
    use: 'Combo Optimization',
    color: '#10b981',
    complexity: 'O(n log n)',
    description: 'Iteratively selects the locally optimal item at each step to build globally optimal combos.',
    steps: [
      { step: 'Sort 38 menu items by margin/price ratio', result: 'Ranked list ready', time: '12ms' },
      { step: 'Greedily select top-3 items per bundle', result: 'Paneer + Naan + Lassi', time: '4ms' },
      { step: 'Price bundle for 68% average margin', result: 'Bundle: ₹199 (was ₹320)', time: '2ms' },
      { step: 'Project sales lift from combo offer', result: '+28% order volume', time: '8ms' },
    ],
    output: 'Best combo: Paneer Tikka + Butter Naan + Mango Lassi = ₹199 at 68% margin',
  },
  {
    id: 'dp',
    name: 'Dynamic Programming',
    use: 'Inventory Forecasting',
    color: '#34d399',
    complexity: 'O(n·W)',
    description: 'Bottom-up DP table caches subproblem solutions to forecast 72h ingredient requirements.',
    steps: [
      { step: 'Build 3-day demand state matrix (72h × items)', result: '2,592 cells computed', time: '38ms' },
      { step: 'Fill DP table with cached subproblems', result: 'Optimal substructure found', time: '22ms' },
      { step: 'Extract 72h ingredient forecast', result: '12kg chicken, 8kg paneer...', time: '6ms' },
      { step: 'Generate reorder alerts above threshold', result: '3 critical items flagged', time: '3ms' },
    ],
    output: '72h forecast: Chicken 12kg, Paneer 8kg, Onion 20kg, Mango Pulp 8kg — reorder now',
  },
  {
    id: 'dijkstra',
    name: "Dijkstra's Algorithm",
    use: 'Delivery Route Optimization',
    color: '#6ee7b7',
    complexity: 'O(E log V)',
    description: 'Shortest-path graph traversal across delivery zones, weighted by live traffic data.',
    steps: [
      { step: 'Build weighted delivery graph (18 zones)', result: 'Graph: 18 nodes, 42 edges', time: '15ms' },
      { step: 'Initialize priority queue with source', result: 'Queue seeded from restaurant', time: '2ms' },
      { step: 'Relax edges with Dijkstra traversal', result: 'Shortest paths to all zones', time: '28ms' },
      { step: 'Assign orders to optimal routes', result: 'Avg delivery: 22min (was 34min)', time: '5ms' },
    ],
    output: 'Optimal route: Restaurant → Zone A → Zone D → Zone F saves 14 minutes per delivery',
  },
  {
    id: 'knapsack',
    name: '0/1 Knapsack',
    use: 'Profit-Maximized Menu',
    color: '#059669',
    complexity: 'O(n·W)',
    description: 'Select the optimal subset of dishes maximizing total profit within prep time and cost constraints.',
    steps: [
      { step: 'Define 52 menu items with profit/weight values', result: 'Items mapped to DP grid', time: '8ms' },
      { step: 'Set capacity: 8 items max, ₹5,000 ingredient budget', result: 'Constraint matrix built', time: '3ms' },
      { step: 'Fill DP table with optimal selections', result: 'Globally optimal subset found', time: '45ms' },
      { step: 'Backtrack to extract selected items', result: '8-item optimal menu', time: '4ms' },
    ],
    output: 'Optimal 8-item menu projects ₹42,000 daily revenue at 67% average margin',
  },
  {
    id: 'mergesort',
    name: 'Merge Sort',
    use: 'Top-Selling Item Analysis',
    color: '#a7f3d0',
    complexity: 'O(n log n)',
    description: 'Stable divide-and-conquer sorting of all menu items by composite performance score.',
    steps: [
      { step: 'Divide 52 items into sub-arrays recursively', result: 'Depth: log₂(52) = 5.7 levels', time: '6ms' },
      { step: 'Score each item: revenue × margin × frequency', result: 'Composite scores computed', time: '12ms' },
      { step: 'Merge sorted sub-arrays bottom-up', result: '6 merge passes completed', time: '8ms' },
      { step: 'Output ranked performance tiers', result: 'Top 10 items identified', time: '2ms' },
    ],
    output: '#1 Chicken Biryani ₹82K | #2 Paneer Tikka ₹61K | #3 Mango Lassi ₹35K (monthly)',
  },
]

export default function DAAEngineTab() {
  const [active, setActive] = useState('greedy')
  const [running, setRunning] = useState(false)
  const [completedSteps, setCompletedSteps] = useState([])

  const algo = algorithms.find(a => a.id === active)

  const runAlgorithm = () => {
    setCompletedSteps([])
    setRunning(true)
    algo.steps.forEach((_, i) => {
      setTimeout(() => {
        setCompletedSteps(prev => [...prev, i])
        if (i === algo.steps.length - 1) setRunning(false)
      }, (i + 1) * 700)
    })
  }

  const switchAlgo = (id) => {
    setActive(id)
    setCompletedSteps([])
    setRunning(false)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/25 flex items-center justify-center">
          <TrendingUp size={20} className="text-emerald-400" />
        </div>
        <div>
          <h2 className="text-white font-bold" style={{ fontFamily: 'Space Grotesk' }}>DAA Algorithm Engine</h2>
          <p className="text-slate-500 text-xs">Live algorithm visualization — Design & Analysis of Algorithms</p>
        </div>
      </div>

      {/* Algorithm selector */}
      <div className="flex gap-2 flex-wrap">
        {algorithms.map(a => (
          <motion.button
            key={a.id}
            whileTap={{ scale: 0.96 }}
            onClick={() => switchAlgo(a.id)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer border ${
              active === a.id
                ? 'text-white border-opacity-40'
                : 'text-slate-500 border-slate-800 hover:text-slate-300'
            }`}
            style={active === a.id ? {
              background: `${a.color}15`,
              borderColor: `${a.color}40`,
              color: a.color,
            } : {}}
          >
            {a.name}
          </motion.button>
        ))}
      </div>

      {/* Algorithm detail */}
      <AnimatePresence mode="wait">
        <motion.div
          key={active}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -16 }}
          transition={{ duration: 0.3 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        >
          {/* Info panel */}
          <div className="glass rounded-2xl p-6 space-y-5">
            <div className="flex items-start justify-between">
              <div>
                <div className="text-xs font-mono px-2 py-1 rounded border mb-3 inline-block"
                  style={{ color: algo.color, borderColor: `${algo.color}30`, background: `${algo.color}10` }}>
                  {algo.complexity}
                </div>
                <h3 className="text-xl font-bold mb-1" style={{ color: algo.color, fontFamily: 'Space Grotesk' }}>
                  {algo.name}
                </h3>
                <div className="text-slate-500 text-xs font-semibold uppercase tracking-wider">{algo.use}</div>
              </div>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed">{algo.description}</p>

            <div className="rounded-xl p-4 border-l-2" style={{ background: `${algo.color}06`, borderColor: `${algo.color}40` }}>
              <div className="text-xs font-semibold mb-1" style={{ color: algo.color }}>AI Output</div>
              <p className="text-slate-300 text-xs leading-relaxed font-mono">{algo.output}</p>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={runAlgorithm}
              disabled={running}
              className="w-full py-3 rounded-xl font-bold text-white text-sm flex items-center justify-center gap-2 cursor-pointer btn-primary disabled:opacity-60"
            >
              <Play size={15} />
              {running ? 'Running Algorithm...' : 'Run Live Simulation'}
            </motion.button>
          </div>

          {/* Steps visualization */}
          <div className="glass rounded-2xl p-6">
            <h3 className="text-white font-semibold text-sm mb-5">Execution Steps</h3>
            <div className="space-y-3">
              {algo.steps.map((step, i) => {
                const done = completedSteps.includes(i)
                const active_step = running && completedSteps.length === i
                return (
                  <motion.div
                    key={i}
                    animate={active_step ? { scale: [1, 1.02, 1] } : {}}
                    transition={{ duration: 0.4 }}
                    className={`rounded-xl p-4 border transition-all duration-500 ${
                      done
                        ? 'border-opacity-30 bg-opacity-10'
                        : 'border-slate-800 bg-slate-900/30 opacity-40'
                    }`}
                    style={done ? {
                      borderColor: `${algo.color}30`,
                      background: `${algo.color}08`,
                    } : {}}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold mt-0.5 ${
                        done ? '' : 'bg-slate-800 text-slate-600'
                      }`}
                        style={done ? { background: `${algo.color}20`, color: algo.color } : {}}>
                        {done ? <CheckCircle size={14} /> : i + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm text-white font-medium mb-1">{step.step}</div>
                        {done && (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="flex items-center justify-between"
                          >
                            <span className="text-xs" style={{ color: algo.color }}>→ {step.result}</span>
                            <span className="text-xs text-slate-600 font-mono">{step.time}</span>
                          </motion.div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
