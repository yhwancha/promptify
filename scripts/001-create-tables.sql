-- Create the prompts table to store generated prompts and project history
CREATE TABLE IF NOT EXISTS prompts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  project_idea TEXT NOT NULL,
  detected_stack JSONB NOT NULL,
  recommended_tool VARCHAR(50) NOT NULL,
  generated_prompt TEXT NOT NULL,
  final_prompt TEXT,
  is_finalized BOOLEAN DEFAULT FALSE,
  user_session VARCHAR(255) -- Simple session tracking without auth
);

-- Create an index for faster queries
CREATE INDEX IF NOT EXISTS idx_prompts_user_session ON prompts(user_session);
CREATE INDEX IF NOT EXISTS idx_prompts_created_at ON prompts(created_at DESC);
