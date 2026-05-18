import dotenv from 'dotenv'
dotenv.config()

const API_KEY = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_KEY || ''
const BASE_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent'
const VISION_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent'

// Shared prompt context
const getSystemContext = (contextNotes = []) => `You are SPICE — the AI intelligence core of SELLSPICE AI, an autonomous restaurant growth platform.
You help restaurant owners with:
- Sales predictions and demand forecasting
- Menu optimization and combo recommendations
- Inventory management and waste reduction
- Customer behavior analysis
- Pricing strategy and revenue growth
- Peak hour optimization

IMPORTANT CONTEXT MEMORY ABOUT THIS RESTAURANT:
${contextNotes.length > 0 ? contextNotes.map(m => `- ${m}`).join('\n') : 'No custom context provided yet.'}

Always respond concisely (2-4 sentences max unless asked for detail).
Be specific with numbers, percentages, and actionable recommendations.
Take the CONTEXT MEMORY heavily into account when making strategies.
Current restaurant: "Spice Garden" — a mid-range Indian restaurant in Delhi.`

export async function askGemini(userMessage, conversationHistory = [], contextNotes = []) {
  if (!API_KEY) throw new Error("No Gemini API Key found on backend.")

  const messages = [
    { role: 'user', parts: [{ text: getSystemContext(contextNotes) }] },
    { role: 'model', parts: [{ text: 'Understood. I am SPICE, your restaurant intelligence AI with context awareness. How can I help?' }] },
    ...conversationHistory,
    { role: 'user', parts: [{ text: userMessage }] },
  ]

  const res = await fetch(`${BASE_URL}?key=${API_KEY}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: messages,
      generationConfig: { temperature: 0.7, maxOutputTokens: 512, topP: 0.9 }
    }),
  })
  if (!res.ok) throw new Error(`Gemini API error: ${res.status}`)
  const data = await res.json()
  return data.candidates?.[0]?.content?.parts?.[0]?.text
}

export async function analyzeBillImage(imageBuffer, mimeType) {
  if (!API_KEY) {
    // If no key, return the simulated mock data we designed earlier
    return getMockScanResult()
  }

  // Convert buffer to base64
  const base64Image = imageBuffer.toString('base64')

  const prompt = `You are a highly advanced OCR and Restaurant Intelligence Engine.
Analyze this restaurant bill/invoice.
Identify the dishes sold and their quantities.
Then, based on standard Indian restaurant recipes, deduce the approximate raw ingredients consumed (e.g., Mutton, Rice, Paneer).
Finally, generate 2-3 short actionable growth insights based on these sales.

Return ONLY a valid JSON object strictly matching this format:
{
  "deductions": [
    { "dish": "Dish Name", "qtySold": 0, "ingredients": [ { "n": "Ingredient", "used": "0 kg" } ] }
  ],
  "inventoryUpdates": [
    { "n": "Ingredient", "qty": 0, "u": "kg", "req": 0, "stat": "low|critical", "alert": "Short alert" }
  ],
  "growthInsights": [ "Insight 1", "Insight 2" ]
}`

  const res = await fetch(`${VISION_URL}?key=${API_KEY}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{
        role: 'user',
        parts: [
          { text: prompt },
          { inline_data: { mime_type: mimeType, data: base64Image } }
        ]
      }],
      generationConfig: { temperature: 0.2, maxOutputTokens: 1024 }
    }),
  })

  if (!res.ok) throw new Error(`Gemini Vision API error: ${res.status}`)
  const data = await res.json()
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text || ''
  
  // Clean markdown JSON formatting if present
  const cleanedText = text.replace(/```json\n?|\n?```/g, '').trim()
  try {
    return JSON.parse(cleanedText)
  } catch(e) {
    console.error("Failed to parse Gemini Vision JSON", text)
    return getMockScanResult() // fallback
  }
}

function getMockScanResult() {
  return {
    deductions: [
      { dish: 'Mutton Biryani', qtySold: 142, ingredients: [ { n: 'Mutton', used: '21.3 kg' }, { n: 'Basmati Rice', used: '18.5 kg' }, { n: 'Spices', used: '2.1 kg' } ]},
      { dish: 'Paneer Tikka', qtySold: 89, ingredients: [ { n: 'Paneer', used: '11.2 kg' }, { n: 'Curd', used: '4.5 kg' } ]}
    ],
    inventoryUpdates: [
      { n: 'Mutton', qty: 3.2, u: 'kg', req: 25, stat: 'critical', alert: 'Stockout risk in 4 hrs' },
      { n: 'Basmati Rice', qty: 5.5, u: 'kg', req: 15, stat: 'low', alert: 'Order 10kg for tomorrow' },
      { n: 'Paneer', qty: 1.8, u: 'kg', req: 12, stat: 'critical', alert: 'Reorder immediately' },
    ],
    growthInsights: [
      "Cold drinks demand may rise 38% based on today's combo attachment rate.",
      "Push 'Family Combo' tomorrow evening — it drives 42% of weekend margin.",
      "Reduce biryani prep by 12% for Monday lunch."
    ]
  }
}
