import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import multer from 'multer'
import { supabase } from './supabase/client.js'
import { askGemini, analyzeBillImage } from './services/ai.js'

dotenv.config()

const app = express()
app.use(cors())
app.use(express.json())

const upload = multer({ storage: multer.memoryStorage() })

// --- AI Chat & Context ---
app.post('/api/ai/chat', async (req, res) => {
  try {
    const { message, history, context } = req.body
    const reply = await askGemini(message, history, context)
    res.json({ reply })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// --- Bill Scanning Engine ---
app.post('/api/scan-bill', upload.single('bill'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No image uploaded' })
    
    // 1. Send image to Gemini Vision API
    const analysis = await analyzeBillImage(req.file.buffer, req.file.mimetype)
    
    // 2. Save scanned result to DB (mocked if no keys)
    await supabase.from('scanned_bills').insert({
      restaurant_id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', // Default demo ID
      parsed_data_json: analysis
    })

    // 3. (In real app) Calculate inventory deduction via SQL join on recipes table here
    // For prototype, we return the AI generated deductions directly
    
    res.json(analysis)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Bill scanning failed' })
  }
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`SELLSPICE Backend running on port ${PORT}`)
  if (supabase.isMock) console.log(`⚠️ Running with MOCK Database (Add Supabase keys to .env)`)
})
