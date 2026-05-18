import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { CalendarClock, TrendingUp, CloudRain, Sun, Users, RefreshCw } from 'lucide-react'
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import AnimatedCounter from '../ui/AnimatedCounter'
import { fetchLiveWeather } from '../../services/gemini'

const data = [
  { time: '8AM', rev: 1200 }, { time: '10AM', rev: 4500 }, { time: '12PM', rev: 18000 },
  { time: '2PM', rev: 22000 }, { time: '4PM', rev: 8000 }, { time: '6PM', rev: 15000 },
  { time: '8PM', rev: 28000 }, { time: '10PM', rev: 12000 }, { time: '12AM', rev: 2000 },
]

export default function ForecastTab() {
  const [weather, setWeather] = useState(null)
  const [loadingWeather, setLoadingWeather] = useState(true)

  useEffect(() => {
    fetchLiveWeather().then(res => {
      if (res) setWeather(res)
      setLoadingWeather(false)
    })
  }, [])

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div>
        <h2 className="text-2xl font-black font-head text-white flex items-center gap-2">
          <CalendarClock className="text-emerald-400" /> Future Forecast
        </h2>
        <p className="text-sm text-slate-400 mt-1">Tomorrow's AI projection based on historical data, weather, and local events</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main Forecast */}
        <div className="lg:col-span-2 card p-6">
          <div className="flex justify-between items-end mb-8">
            <div>
              <div className="text-sm text-slate-400 font-semibold uppercase tracking-wider mb-2">Tomorrow's Revenue</div>
              <div className="text-5xl font-black font-head text-white">
                <AnimatedCounter value={92400} prefix="₹" />
              </div>
            </div>
            <div className="text-right">
              <div className="badge badge-green text-sm px-3 py-1.5"><TrendingUp size={14}/> +12% vs avg</div>
            </div>
          </div>

          <div className="h-64 -ml-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="c" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="time" stroke="#475569" tick={{fontSize: 10}} axisLine={false} tickLine={false} />
                <Tooltip 
                  contentStyle={{background:'rgba(4,12,7,0.9)', border:'1px solid rgba(16,185,129,0.3)', borderRadius:8}}
                  itemStyle={{color:'#34d399', fontWeight:'bold'}}
                  formatter={(val) => [`₹${val}`, 'Projected']}
                />
                <Area type="monotone" dataKey="rev" stroke="#10b981" strokeWidth={3} fill="url(#c)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Factors */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wide">Prediction Factors</h3>
          
          <div className={`card p-5 border-l-4 ${weather && weather.tomorrowDesc.toLowerCase().includes('rain') ? 'border-l-blue-400' : 'border-l-yellow-400'}`}>
            <div className="flex gap-3 items-start relative">
              <div className="absolute top-0 right-0 text-[10px] uppercase text-emerald-400 font-bold bg-emerald-500/10 px-1.5 py-0.5 rounded flex items-center gap-1">
                {loadingWeather ? <RefreshCw size={10} className="animate-spin" /> : <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />} Live
              </div>
              <div className={`p-2 rounded mt-1 ${weather && weather.tomorrowDesc.toLowerCase().includes('rain') ? 'bg-blue-500/10 text-blue-400' : 'bg-yellow-500/10 text-yellow-400'}`}>
                {weather && weather.tomorrowDesc.toLowerCase().includes('rain') ? <CloudRain size={18} /> : <Sun size={18} />}
              </div>
              <div className="flex-1 pr-16 space-y-1">
                <div className="text-xs text-slate-400">
                  Current: {loadingWeather ? 'Syncing...' : (weather ? `${weather.currentDesc}, ${weather.currentTemp}°C` : 'Clear, 32°C')}
                </div>
                <div className="text-sm font-bold text-white">
                  Tomorrow: {loadingWeather ? 'Syncing forecast...' : (weather ? `${weather.tomorrowDesc}, ${weather.tomorrowMax}°C` : 'Clear, 34°C')}
                </div>
                <div className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 inline-block px-2 py-1 rounded mt-2 border border-emerald-500/20">
                  {weather && weather.tomorrowDesc.toLowerCase().includes('rain') 
                    ? '🌧️ +18% Delivery orders expected'
                    : '☀️ AI: +14% Shake demand tomorrow'}
                </div>
              </div>
            </div>
          </div>

          <div className="card p-5 border-l-4 border-l-purple-400">
            <div className="flex gap-3 items-center mb-2">
              <div className="p-2 bg-purple-500/10 rounded"><Users size={18} className="text-purple-400" /></div>
              <div>
                <div className="text-sm font-bold text-white">Local Event: Tech Conf</div>
                <div className="text-xs text-slate-400">+22% Lunch hour walk-ins</div>
              </div>
            </div>
          </div>

          <div className="card p-5">
            <h4 className="text-xs text-slate-400 font-bold uppercase mb-3">Trending Dishes Tomorrow</h4>
            <div className="space-y-3">
              {['Ferrero Rocher Shake', 'Classic Fries', 'Chicken Steak'].map((d,i) => (
                <div key={d} className="flex justify-between items-center text-sm">
                  <span className="text-slate-300">{d}</span>
                  <span className="text-emerald-400 font-bold">+{30 - i*5}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
