import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config()

const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_ANON_KEY

// Create a real client if keys exist, otherwise return a mock client for prototype
export const supabase = (supabaseUrl && supabaseKey) 
  ? createClient(supabaseUrl, supabaseKey)
  : {
      isMock: true,
      from: (table) => ({
        select: async () => {
          console.warn(`Mock Supabase: SELECT from ${table}`)
          return { data: [], error: null }
        },
        insert: async (data) => {
          console.warn(`Mock Supabase: INSERT into ${table}`, data)
          return { data, error: null }
        }
      })
    }
