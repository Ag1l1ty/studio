import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

export const supabase = supabaseUrl && supabaseAnonKey ? createClient(supabaseUrl, supabaseAnonKey) : null

export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          first_name: string
          last_name: string
          email: string
          role: string
          avatar: string
          assigned_project_ids: string[]
          password: string
          temporary_password: boolean
          last_password_change: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          first_name: string
          last_name: string
          email: string
          role: string
          avatar?: string
          assigned_project_ids?: string[]
          password: string
          temporary_password?: boolean
          last_password_change?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          first_name?: string
          last_name?: string
          email?: string
          role?: string
          avatar?: string
          assigned_project_ids?: string[]
          password?: string
          temporary_password?: boolean
          last_password_change?: string
          updated_at?: string
        }
      }
      projects: {
        Row: {
          id: string
          name: string
          description: string
          stage: string
          risk_level: string
          risk_score: number
          budget: number
          budget_spent: number
          projected_deliveries: number
          start_date: string
          end_date: string
          owner_id: string
          owner_name: string
          owner_avatar: string
          metrics: any
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description: string
          stage: string
          risk_level: string
          risk_score?: number
          budget: number
          budget_spent?: number
          projected_deliveries?: number
          start_date: string
          end_date: string
          owner_id: string
          owner_name: string
          owner_avatar: string
          metrics?: any
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string
          stage?: string
          risk_level?: string
          risk_score?: number
          budget?: number
          budget_spent?: number
          projected_deliveries?: number
          start_date?: string
          end_date?: string
          owner_id?: string
          owner_name?: string
          owner_avatar?: string
          metrics?: any
          updated_at?: string
        }
      }
      deliveries: {
        Row: {
          id: string
          project_id: string
          project_name: string
          delivery_number: number
          stage: string
          budget: number
          budget_spent: number
          estimated_date: string
          creation_date: string
          last_budget_update: string
          owner_id: string
          owner_name: string
          owner_avatar: string
          is_archived: boolean
          risk_assessed: boolean
          error_count: number
          error_solution_time: number
          stage_dates: any
          budget_history: any
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          project_id: string
          project_name: string
          delivery_number: number
          stage: string
          budget: number
          budget_spent?: number
          estimated_date: string
          creation_date: string
          last_budget_update?: string
          owner_id: string
          owner_name: string
          owner_avatar: string
          is_archived?: boolean
          risk_assessed?: boolean
          error_count?: number
          error_solution_time?: number
          stage_dates?: any
          budget_history?: any
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          project_id?: string
          project_name?: string
          delivery_number?: number
          stage?: string
          budget?: number
          budget_spent?: number
          estimated_date?: string
          creation_date?: string
          last_budget_update?: string
          owner_id?: string
          owner_name?: string
          owner_avatar?: string
          is_archived?: boolean
          risk_assessed?: boolean
          error_count?: number
          error_solution_time?: number
          stage_dates?: any
          budget_history?: any
          updated_at?: string
        }
      }
      risk_profiles: {
        Row: {
          id: string
          classification: string
          score: string
          deviation: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          classification: string
          score: string
          deviation: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          classification?: string
          score?: string
          deviation?: string
          updated_at?: string
        }
      }
    }
  }
}
