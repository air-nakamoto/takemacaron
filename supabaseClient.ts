import { createClient } from '@supabase/supabase-js'

const supabaseUrl = (import.meta as any).env.VITE_SUPABASE_URL
const supabaseAnonKey = (import.meta as any).env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('Supabase URL or Anon Key is missing. Running in offline mode.')
}

export const supabase = createClient(
    supabaseUrl || 'https://placeholder.supabase.co',
    supabaseAnonKey || 'placeholder-key'
)

export type Database = {
    public: {
        Tables: {
            budget_settings: {
                Row: {
                    id: string
                    user_id: string
                    total: number
                    start_date: string
                    end_date: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    total: number
                    start_date: string
                    end_date: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string
                    total?: number
                    start_date?: string
                    end_date?: string
                    updated_at?: string
                }
            }
            fixed_costs: {
                Row: {
                    id: string
                    user_id: string
                    title: string
                    amount: number
                    payment_date: string
                    memo: string
                    created_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    title: string
                    amount: number
                    payment_date: string
                    memo: string
                    created_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string
                    title?: string
                    amount?: number
                    payment_date?: string
                    memo?: string
                    created_at?: string
                }
            }
            expenses: {
                Row: {
                    id: string
                    user_id: string
                    date: string
                    category: string
                    amount: number
                    memo: string
                    created_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    date: string
                    category: string
                    amount: number
                    memo: string
                    created_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string
                    date?: string
                    category?: string
                    amount?: number
                    memo?: string
                    created_at?: string
                }
            }
            archives: {
                Row: {
                    id: string
                    user_id: string
                    start_date: string
                    end_date: string
                    total_budget: number
                    spent: number
                    remaining: number
                    created_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    start_date: string
                    end_date: string
                    total_budget: number
                    spent: number
                    remaining: number
                    created_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string
                    start_date?: string
                    end_date?: string
                    total_budget?: number
                    spent?: number
                    remaining?: number
                    created_at?: string
                }
            }
        }
    }
}
