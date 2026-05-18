import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FileText, ScanLine, BrainCircuit, Activity, LineChart, Package, CheckCircle } from 'lucide-react'
import { scanBillUpload } from '../../services/gemini'

const INITIAL_STOCKS = [
  { n: 'Chicken Fillet', qty: 12.4, u: 'kg', req: 18, stat: 'low' },
  { n: 'Burger Buns', qty: 24, u: 'pkts', req: 15, stat: 'good' },
  { n: 'Cheese Slices', qty: 8, u: 'pkts', req: 10, stat: 'low' },
]

export default function InventoryTab({ pushToast }) {
  const [scanState, setScanState] = useState('idle') // idle, scanning, complete
  const [uploadedImage, setUploadedImage] = useState(null)
  const [results, setResults] = useState(null)
  const fileInputRef = useRef(null)

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    const imageUrl = URL.createObjectURL(file)
    setUploadedImage(imageUrl)
    
    setScanState('scanning')
    try {
      const data = await scanBillUpload(file)
      setResults(data)
      setScanState('complete')
      pushToast('AI Bill Scanning Complete. Insights Generated.', 'success')
    } catch (err) {
      pushToast('Scanning failed', 'error')
      setScanState('idle')
    }
  }

  const handleDrop = async (e) => {
    e.preventDefault()
    const file = e.dataTransfer.files?.[0]
    if (file && file.type.startsWith('image/')) {
      const imageUrl = URL.createObjectURL(file)
      setUploadedImage(imageUrl)
      
      setScanState('scanning')
      try {
        const data = await scanBillUpload(file)
        setResults(data)
        setScanState('complete')
        pushToast('AI Bill Scanning Complete. Insights Generated.', 'success')
      } catch (err) {
        pushToast('Scanning failed', 'error')
        setScanState('idle')
      }
    } else {
      pushToast('Please upload an image file (JPG, PNG)', 'error')
    }
  }

  const handleDragOver = (e) => e.preventDefault()

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div>
        <h2 className="text-2xl font-black font-head text-white flex items-center gap-2">
          <ScanLine className="text-emerald-400" /> Smart Bill Scanning
        </h2>
        <p className="text-sm text-slate-400 mt-1">Upload daily bills/invoices. Backend AI automatically calculates ingredient consumption via Supabase recipes.</p>
      </div>

      <AnimatePresence mode="wait">
        {scanState === 'idle' && (
          <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wide">Manual Upload</h3>
              <div 
                className="upload-zone p-12 flex flex-col items-center justify-center text-center cursor-pointer h-72 border-2 border-dashed border-emerald-500/30 hover:border-emerald-400 bg-emerald-500/5 transition-all rounded-2xl"
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                <input 
                  type="file" ref={fileInputRef} className="hidden" 
                  accept="image/png, image/jpeg, image/webp" onChange={handleFileChange}
                />
                <FileText size={48} className="text-emerald-500 mb-4" />
                <p className="text-xl text-white font-bold mb-2 font-head">Upload Image of Bill</p>
                <p className="text-sm text-slate-500 mb-6 max-w-sm">Drag & drop JPG/PNG. Sent securely to backend OCR Engine.</p>
                <div className="btn btn-primary px-6 py-2.5">Select Image</div>
              </div>

              <div className="card p-4 flex items-center justify-between border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded bg-slate-800 flex items-center justify-center text-xs text-white font-bold">Z</div>
                  <div>
                    <div className="text-sm text-white font-medium">Zomato Hyperpure (Auto-Fetch)</div>
                    <div className="text-xs text-emerald-400">Connected • Last sync 2h ago</div>
                  </div>
                </div>
                <div className="badge badge-green px-2 py-1"><CheckCircle size={10} /></div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wide">Current Raw Stock (Supabase DB)</h3>
              <div className="card divide-y divide-slate-800/50">
                {INITIAL_STOCKS.map((s, i) => (
                  <div key={i} className="p-4 flex justify-between items-center hover:bg-slate-800/30 transition-colors">
                    <div>
                      <div className="text-white font-bold">{s.n}</div>
                      <div className="text-xs text-slate-500">{s.qty}{s.u} remaining</div>
                    </div>
                    <div className="text-right">
                      <div className={`text-xs px-2 py-1 rounded font-bold uppercase ${s.stat === 'low' ? 'bg-yellow-500/10 text-yellow-500' : 'bg-emerald-500/10 text-emerald-500'}`}>
                        {s.stat}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {scanState === 'scanning' && (
          <motion.div key="scanning" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} 
            className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center h-[500px]">
            <div className="relative w-full h-full max-h-[500px] rounded-2xl overflow-hidden border border-emerald-500/30 bg-slate-900 flex items-center justify-center shadow-[0_0_40px_rgba(16,185,129,0.1)]">
              {uploadedImage ? (
                <img src={uploadedImage} alt="Uploaded Bill" className="w-full h-full object-contain opacity-70" />
              ) : (
                <div className="text-slate-500 flex flex-col items-center"><FileText size={48} className="mb-2"/> Processing document...</div>
              )}
              <div className="absolute inset-0 bg-emerald-500/10 mix-blend-color-dodge" />
              <motion.div 
                animate={{ y: ['0%', '100%', '0%'] }} 
                transition={{ repeat: Infinity, duration: 2.5, ease: 'linear' }}
                className="absolute top-0 w-full h-1 bg-emerald-400 shadow-[0_0_20px_#34d399,0_0_40px_#10b981] z-10"
              />
            </div>

            <div className="card h-full p-8 flex flex-col items-center justify-center relative overflow-hidden bg-slate-900/80">
              <BrainCircuit size={48} className="text-emerald-400 mb-6 animate-pulse" />
              <h3 className="text-2xl font-bold text-white font-head mb-4 text-center">Backend AI OCR Engine Active</h3>
              <div className="text-slate-400 h-20 overflow-hidden w-full max-w-xs relative text-center">
                <motion.div animate={{ y: [0, -28, -56, -84, -112] }} transition={{ repeat: Infinity, duration: 3.5, ease: 'steps(5)' }} className="flex flex-col text-sm font-mono text-emerald-500/80 leading-7">
                  <span>Uploading to server...</span>
                  <span>Gemini Vision analyzing image...</span>
                  <span>Fetching Supabase recipes...</span>
                  <span>Calculating ingredient depletion...</span>
                  <span>Saving scanned data to DB...</span>
                  <span>Uploading to server...</span>
                </motion.div>
                <div className="absolute inset-0 bg-gradient-to-b from-slate-900/80 via-transparent to-slate-900/80 pointer-events-none" />
              </div>
            </div>
          </motion.div>
        )}

        {scanState === 'complete' && results && (
          <motion.div key="complete" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-emerald-400">
                  <Package size={18} />
                  <h3 className="text-sm font-bold uppercase tracking-wide">Output 1: Inventory Intelligence</h3>
                </div>
                
                <div className="card p-5 space-y-4 border-emerald-500/20">
                  <h4 className="text-xs font-bold text-slate-500 uppercase">Recipe Deduction</h4>
                  {results.deductions.map(d => (
                    <div key={d.dish} className="bg-slate-900/50 p-3 rounded-xl border border-slate-800">
                      <div className="text-sm font-bold text-white mb-2">{d.qtySold}x {d.dish} sold</div>
                      <div className="flex flex-wrap gap-3">
                        {d.ingredients.map(ing => (
                          <div key={ing.n} className="text-xs text-slate-400 bg-slate-800 px-2 py-1 rounded">
                            <span className="text-red-400 font-bold">-{ing.used}</span> {ing.n}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                  
                  <h4 className="text-xs font-bold text-slate-500 uppercase mt-6 pt-4 border-t border-slate-800">Predicted Depletion</h4>
                  <div className="space-y-3">
                    {results.inventoryUpdates.map(s => (
                      <div key={s.n} className="flex items-center justify-between p-2 hover:bg-slate-800/30 rounded-lg transition-colors">
                        <div>
                          <div className="text-white text-sm font-medium">{s.n}</div>
                          <div className="text-xs text-red-400 font-bold">{s.alert}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-white font-mono">{s.qty}{s.u} <span className="text-slate-600 text-xs">left</span></div>
                          <button className="text-[10px] uppercase font-bold text-emerald-400 hover:text-emerald-300 bg-emerald-500/10 px-2 py-1 rounded mt-1">Auto-Restock</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-2 text-emerald-400">
                  <LineChart size={18} />
                  <h3 className="text-sm font-bold uppercase tracking-wide">Output 2: Sales & Growth Analysis</h3>
                </div>

                <div className="card p-5 space-y-4 border-emerald-500/20" style={{ background: 'linear-gradient(180deg, var(--c-card) 0%, rgba(16,185,129,0.03) 100%)' }}>
                  <div className="flex items-center gap-3 bg-emerald-500/10 p-4 rounded-xl border border-emerald-500/20 mb-4">
                    <Activity className="text-emerald-400 shrink-0" />
                    <div>
                      <div className="text-white text-sm font-bold font-head">AI Growth Suggestions</div>
                      <div className="text-xs text-slate-400">Based on uploaded bill analysis</div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {results.growthInsights.map((g, i) => (
                      <div key={i} className="flex gap-3 text-sm text-slate-300 bg-slate-900/50 p-3 rounded-lg border border-slate-800">
                        <CheckCircle size={16} className="text-emerald-500 shrink-0 mt-0.5" />
                        <span className="leading-snug">{g}</span>
                      </div>
                    ))}
                  </div>

                  <button 
                    onClick={() => {
                      setScanState('idle')
                      setUploadedImage(null)
                      if(fileInputRef.current) fileInputRef.current.value = ''
                    }}
                    className="btn btn-subtle w-full justify-center py-2.5 mt-4 text-xs"
                  >
                    Scan Another Bill
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
