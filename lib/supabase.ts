import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Database = {
  public: {
    Tables: {
      prompts: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          project_idea: string
          detected_stack: any
          recommended_tool: string
          generated_prompt: string
          final_prompt: string | null
          is_finalized: boolean
          user_session: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          project_idea: string
          detected_stack: any
          recommended_tool: string
          generated_prompt: string
          final_prompt?: string | null
          is_finalized?: boolean
          user_session?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          project_idea?: string
          detected_stack?: any
          recommended_tool?: string
          generated_prompt?: string
          final_prompt?: string | null
          is_finalized?: boolean
          user_session?: string | null
        }
      }
    }
  }
}
