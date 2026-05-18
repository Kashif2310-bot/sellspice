// Gemini AI Service
// Add your Gemini API key to .env as VITE_GEMINI_KEY

const API_KEY = import.meta.env.VITE_GEMINI_KEY || ''
const BASE_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent'

// Global Context Memory Array
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
    // Coordinates for New Delhi
    const lat = 28.6139
    const lon = 77.2090
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
      
      return {
        currentTemp,
        currentDesc,
        tomorrowMax,
        tomorrowDesc,
        rawString: weatherString
      }
    }
  } catch (err) {
    console.error("Failed to fetch weather", err)
  }
  return null
}

const getSystemContext = () => `You are SPICE — the AI intelligence core of SELLSPICE AI, an autonomous restaurant growth platform.
You help restaurant owners with:
- Sales predictions and demand forecasting
- Menu optimization and combo recommendations
- Inventory management and waste reduction
- Customer behavior analysis
- Pricing strategy and revenue growth
- Peak hour optimization

IMPORTANT CONTEXT MEMORY ABOUT THIS RESTAURANT:
${aiMemoryStore.length > 0 ? aiMemoryStore.map(m => `- ${m}`).join('\n') : 'No custom context provided yet.'}
${liveWeatherContext ? `LIVE WEATHER DATA: ${liveWeatherContext}` : ''}

Always respond concisely (2-4 sentences max unless asked for detail).
Be specific with numbers, percentages, and actionable recommendations.
Take the CONTEXT MEMORY and LIVE WEATHER heavily into account when making strategies.
Current restaurant: "Spice Garden" — a mid-range Indian restaurant in Delhi.`

export async function askGemini(userMessage, conversationHistory = []) {
  if (!API_KEY) {
    return getDemoResponse(userMessage)
  }

  const messages = [
    { role: 'user', parts: [{ text: getSystemContext() }] },
    { role: 'model', parts: [{ text: 'Understood. I am SPICE, your restaurant intelligence AI with context awareness. How can I help?' }] },
    ...conversationHistory,
    { role: 'user', parts: [{ text: userMessage }] },
  ]

  try {
    const res = await fetch(`${BASE_URL}?key=${API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: messages,
        generationConfig: { temperature: 0.7, maxOutputTokens: 512, topP: 0.9 },
        safetySettings: [
          { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_NONE' },
          { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_NONE' },
        ],
      }),
    })
    if (!res.ok) throw new Error(`API error: ${res.status}`)
    const data = await res.json()
    return data.candidates?.[0]?.content?.parts?.[0]?.text || getDemoResponse(userMessage)
  } catch (err) {
    console.warn('Gemini API error, using demo response:', err)
    return getDemoResponse(userMessage)
  }
}

export async function generateInsights() {
  const prompt = `Generate 5 smart AI business insights for a restaurant right now.
  Format as JSON array: [{"title": "...", "detail": "...", "impact": "...", "priority": "high|medium|low", "icon": "emoji"}]
  Make them specific, data-driven, and actionable. Include real numbers (%, ₹, kg, etc).
  Take this context into account: ${aiMemoryStore.join(', ')}. ${liveWeatherContext ? `Weather context: ${liveWeatherContext}` : ''}`

  if (!API_KEY) return getDemoInsights()

  try {
    const res = await fetch(`${BASE_URL}?key=${API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.8, maxOutputTokens: 1024 },
      }),
    })
    const data = await res.json()
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || ''
    const match = text.match(/\[[\s\S]*\]/)
    if (match) return JSON.parse(match[0])
  } catch (_) {}
  return getDemoInsights()
}

export async function generateCombos(items) {
  const prompt = `Given these menu items: ${items.join(', ')}, suggest 3 profitable meal combo bundles.
  Format as JSON: [{"name":"...","items":["..."],"price":000,"savings":000,"margin":"xx%","reason":"..."}]`

  if (!API_KEY) return getDemoCombos()

  try {
    const res = await fetch(`${BASE_URL}?key=${API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.7, maxOutputTokens: 512 },
      }),
    })
    const data = await res.json()
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || ''
    const match = text.match(/\[[\s\S]*\]/)
    if (match) return JSON.parse(match[0])
  } catch (_) {}
  return getDemoCombos()
}

// ─── Demo responses (when no API key) ────────────────────────

function getDemoResponse(msg) {
  const m = msg.toLowerCase()
  const hasMemory = aiMemoryStore.length > 0
  const memStr = aiMemoryStore.join(' and ')

  if (m.includes('prepare') || m.includes('tomorrow')) {
    if(hasMemory) {
      return `Taking into account that: "${memStr}". I suggest preparing 20% more quick-serve items like Shawarma and Rolls. Also, prep 15% extra cold beverages based on the ${liveWeatherContext ? 'live weather forecast' : 'expected weather'}. Your 2PM-6PM window will be extremely busy.`
    }
    return `Tomorrow's forecast: ₹92,000 projected revenue. Biryani demand will be moderate — prep 15% less. Cold beverages will spike due to ${liveWeatherContext ? 'the forecasted heat' : '41°C forecast'}. Peak rush expected 1–2PM and 8–9PM.`
  }
  
  if (m.includes('reel') || m.includes('trend')) {
    return "The 'ASMR Sizzling Food' trend is going viral locally. Record a 7-second high-quality close-up of your Tandoori Chicken sizzling on the grill with natural sound, overlay 'POV: Dinner at Spice Garden'. Use trending audio."
  }

  if (m.includes('sales') || m.includes('why') || m.includes('low')) {
    return "Sales dipped 14% last Tuesday due to heavy rainfall reducing walk-ins. Your delivery orders compensated by 8%, but the net was still -6%. I recommend setting up automated WhatsApp push-promos on rainy days."
  }
  
  return `Great question. Based on current data${hasMemory ? ` and knowing that ${memStr}` : ''}, I recommend focusing on dynamic combo pricing. Your Paneer Tikka + Naan combo yields 68% margin. Push this on Zomato during the 7-9PM dinner rush.`
}

function getDemoInsights() {
  const hasMemory = aiMemoryStore.length > 0
  return [
    hasMemory 
      ? { title: 'Contextual Action Needed', detail: `Based on your note: "${aiMemoryStore[0]}", expect a 38% surge in footfall. Increase prep for fast-moving items by 20%.`, impact: 'Capture +₹12K', priority: 'high', icon: '🧠' }
      : { title: 'Cold beverage spike', detail: `Based on live weather, prepare 80 extra cold beverage servings for tomorrow to meet demand.`, impact: '+₹4,800 revenue', priority: 'high', icon: '🌡️' },
    { title: 'Push Family Combo tonight', detail: 'Friday night data shows high family walk-ins. Pushing the Biryani Family Pack yields higher average order value.', impact: '+₹18,000/week', priority: 'high', icon: '👨‍👩‍👧‍👦' },
    { title: 'Reduce biryani prep by 12%', detail: 'Monday demand model shows consistent 12% lower orders. Over-prep this week cost ₹3,200 in waste.', impact: '-₹3,200 waste', priority: 'medium', icon: '🍛' },
    { title: 'Students likely to order more', detail: 'College fest detected nearby. Students prefer combo meals after 1PM. Launch a ₹149 Student Promo.', impact: '+₹9,200 revenue', priority: 'medium', icon: '🎓' },
    { title: 'Onion stock critical', detail: 'Current: 4.2kg. Daily usage: 6.8kg. Stockout risk in 14 hours, causing 23% menu unavailability.', impact: 'Prevent ₹8,500 loss', priority: 'high', icon: '📦' },
  ]
}

function getDemoCombos() {
  return [
    { name: 'Student Power Combo', items: ['Dal Makhani', 'Butter Naan x2', 'Mango Lassi'], price: 199, savings: 61, margin: '68%', reason: 'Targets 1–4PM student rush with 68% margin.' },
    { name: 'Weekend Feast', items: ['Chicken Biryani', 'Paneer Tikka', 'Raita', 'Gulab Jamun'], price: 449, savings: 111, margin: '64%', reason: 'High-value bundle for weekend families.' },
    { name: 'Express Lunch Box', items: ['Dal Makhani', 'Butter Naan', 'Raita'], price: 159, savings: 71, margin: '72%', reason: 'Fastest prep time, highest margin in lunch slot.' },
  ]
}
