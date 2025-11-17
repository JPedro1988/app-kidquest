import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Tipos do banco de dados
export type User = {
  id: string
  email: string
  password_hash: string
  name: string
  profile: 'parent' | 'child'
  family_code: string | null
  parent_id: string | null
  age: number | null
  created_at: string
  updated_at: string
}

export type Child = {
  id: string
  parent_id: string
  child_id: string
  name: string
  age: number | null
  created_at: string
}

export type Task = {
  id: string
  child_id: string
  parent_id: string
  title: string
  description: string | null
  points: number
  completed: boolean
  completed_at: string | null
  created_at: string
  updated_at: string
}

export type Reward = {
  id: string
  child_id: string
  parent_id: string
  title: string
  description: string | null
  points_required: number
  redeemed: boolean
  redeemed_at: string | null
  created_at: string
  updated_at: string
}
