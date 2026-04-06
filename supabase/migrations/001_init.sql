-- Enable pgvector extension for CBT context retrieval
CREATE EXTENSION IF NOT EXISTS vector WITH SCHEMA public;

-- Users table linking to Clerk's user ID
CREATE TABLE IF NOT EXISTS public.users (
  id TEXT PRIMARY KEY, -- Clerk User ID
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Chat messages
CREATE TABLE IF NOT EXISTS public.chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
  content TEXT NOT NULL,
  sentiment_score NUMERIC DEFAULT 0, -- valence from -1 to 1
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Mood logs
CREATE TABLE IF NOT EXISTS public.mood_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  mood_score INTEGER NOT NULL CHECK (mood_score BETWEEN 1 AND 5),
  note TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- CBT chunks for AI retrieval
CREATE TABLE IF NOT EXISTS public.cbt_chunks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content TEXT NOT NULL,
  embedding vector(1536), -- Assuming OpenAI or similar embedding vector size
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Row Level Security (RLS) policies

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mood_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cbt_chunks ENABLE ROW LEVEL SECURITY;

-- Policies for users
CREATE POLICY "Users can view their own profile" ON public.users
  FOR SELECT USING (auth.uid()::text = id);

-- Policies for chat_messages
CREATE POLICY "Users can insert their own messages" ON public.chat_messages
  FOR INSERT WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Users can view their own messages" ON public.chat_messages
  FOR SELECT USING (auth.uid()::text = user_id);

-- Policies for mood_logs
CREATE POLICY "Users can insert their own mood logs" ON public.mood_logs
  FOR INSERT WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Users can view their own mood logs" ON public.mood_logs
  FOR SELECT USING (auth.uid()::text = user_id);

-- Policies for cbt_chunks (public read for AI, restricted write)
CREATE POLICY "Anyone can read cbt_chunks" ON public.cbt_chunks
  FOR SELECT USING (true);

-- Function to match CBT chunks using cosine distance
CREATE OR REPLACE FUNCTION match_cbt_chunks (
  query_embedding vector(1536),
  match_threshold float,
  match_count int
)
RETURNS TABLE (
  id uuid,
  content text,
  similarity float
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    cbt_chunks.id,
    cbt_chunks.content,
    1 - (cbt_chunks.embedding <=> query_embedding) AS similarity
  FROM public.cbt_chunks
  WHERE 1 - (cbt_chunks.embedding <=> query_embedding) > match_threshold
  ORDER BY cbt_chunks.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;
