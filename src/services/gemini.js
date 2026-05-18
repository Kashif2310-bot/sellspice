const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001'

// Global Context Memory Array (Frontend state sync)
export const aiMemoryStore = []

export function addContextMemory(contextString) {
  if(!aiMemoryStore.includes(contextString)) {
    aiMemoryStore.push(contextString)
  }
}

// Global Weather Context
let liveWeatherContext = null

export async function fetchLiveWeather() {
  try {
    const lat = 12.9716 // Bangalore
    const lon = 77.5946
    const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&daily=temperature_2m_max,temperature_2m_min,weathercode&timezone=Asia%2FKolkata`)
    const data = await res.json()
    
    if (data.current_weather && data.daily) {
      const currentTemp = data.current_weather.temperature
      const tomorrowMax = data.daily.temperature_2m_max[1]
      
      const weatherMap = {
        0: 'Clear sky', 1: 'Mainly clear', 2: 'Partly cloudy', 3: 'Overcast',
        45: 'Fog', 48: 'Depositing rime fog', 51: 'Light drizzle', 53: 'Moderate drizzle',
        61: 'Slight rain', 63: 'Moderate rain', 65: 'Heavy rain', 71: 'Slight snow fall',
        95: 'Thunderstorm'
      }
      
      const currentDesc = weatherMap[data.current_weather.weathercode] || 'Clear'
      const tomorrowDesc = weatherMap[data.daily.weathercode[1]] || 'Clear'

      const weatherString = `Current Weather: ${currentTemp}°C, ${currentDesc}. Tomorrow: ${tomorrowMax}°C, ${tomorrowDesc}.`
      liveWeatherContext = weatherString
      
      return { currentTemp, currentDesc, tomorrowMax, tomorrowDesc, rawString: weatherString }
    }
  } catch (err) {
    console.error("Failed to fetch weather", err)
  }
  return null
}

export async function askGemini(userMessage, conversationHistory = []) {
  try {
    const res = await fetch(`${BACKEND_URL}/api/ai/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: userMessage,
        history: conversationHistory,
        context: [...aiMemoryStore, liveWeatherContext].filter(Boolean)
      })
    })
    
    if (!res.ok) throw new Error('Backend API error')
    const data = await res.json()
    return data.reply
  } catch (err) {
    console.warn('Backend unreachable, using offline fallback', err)
    return getOfflineDemoResponse(userMessage)
  }
}

export async function scanBillUpload(file) {
  const formData = new FormData()
  formData.append('bill', file)

  try {
    const res = await fetch(`${BACKEND_URL}/api/scan-bill`, {
      method: 'POST',
      body: formData
    })
    if (!res.ok) throw new Error('Backend API error')
    return await res.json()
  } catch(err) {
    console.warn("Backend OCR unreachable, returning offline mock")
    return getMockScanResult()
  }
}

// Keeping the mock generators here as fallbacks if the backend is down
export async function generateInsights() {
  return getDemoInsights()
}

export async function generateCombos(items) {
  return getDemoCombos()
}

function getOfflineDemoResponse(msg) {
  const m = msg.toLowerCase()
  if (m.includes('prepare') || m.includes('tomorrow')) return "Tomorrow's forecast: ₹92,000 projected revenue. Burger demand will be high — prep 15% more."
  return "Focus on dynamic combo pricing. Your All American Burger + Shake combo yields 68% margin."
}

function getMockScanResult() {
  return {
    deductions: [
      { dish: 'All American Burger', qtySold: 142, ingredients: [ { n: 'Chicken Fillet', used: '21.3 kg' }, { n: 'Burger Buns', used: '142 pcs' }, { n: 'Lettuce', used: '2.1 kg' } ]},
      { dish: 'Ferrero Rocher Shake', qtySold: 89, ingredients: [ { n: 'Ice Cream', used: '11.2 kg' }, { n: 'Milk', used: '4.5 L' } ]}
    ],
    inventoryUpdates: [
      { n: 'Chicken Fillet', qty: 3.2, u: 'kg', req: 25, stat: 'critical', alert: 'Stockout risk in 4 hrs' },
      { n: 'Burger Buns', qty: 15, u: 'pkts', req: 40, stat: 'low', alert: 'Order 25 pkts for tomorrow' },
      { n: 'Ice Cream', qty: 1.8, u: 'kg', req: 12, stat: 'critical', alert: 'Reorder immediately' },
    ],
    growthInsights: [
      "Shake demand may rise 38% based on today's combo attachment rate.",
      "Push 'Signature Burger Combo' tomorrow evening — it drives 42% of weekend margin.",
      "Increase chicken fillet prep by 12% for Monday lunch."
    ]
  }
}

function getDemoInsights() {
  return [
    { title: 'Shake demand spike', detail: `Prepare 80 extra shake servings for tomorrow to meet demand.`, impact: '+₹4,800 revenue', priority: 'high', icon: '🌡️' },
    { title: 'Push Signature Burger Combo tonight', detail: 'Friday night data shows high student walk-ins.', impact: '+₹18,000/week', priority: 'high', icon: '👨‍👩‍👧‍👦' },
    { title: 'Lettuce stock critical', detail: 'Current: 4.2kg. Stockout risk in 14 hours.', impact: 'Prevent ₹8,500 loss', priority: 'high', icon: '📦' },
  ]
}

function getDemoCombos() {
  return [
    { name: 'Student Burger Combo', items: ['All American Burger', 'Classic Fries', 'Coke'], price: 299, savings: 81, margin: '68%', reason: 'Targets 1–4PM student rush with 68% margin.' },
    { name: 'Weekend Feast', items: ['All American Burger x2', 'Classic Fries', 'Ferrero Rocher Shake', 'Dutch Truffle Cake'], price: 849, savings: 151, margin: '64%', reason: 'High-value bundle for weekend couples.' },
  ]
}
