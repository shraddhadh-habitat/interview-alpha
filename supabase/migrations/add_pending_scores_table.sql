CREATE TABLE IF NOT EXISTS pending_scores (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  session_token text NOT NULL,
  question_id text,
  question_text text,
  user_answer text,
  score_data jsonb,
  created_at timestamptz DEFAULT now()
);

-- Auto delete after 24 hours
ALTER TABLE pending_scores ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can insert pending scores" ON pending_scores
  FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can read pending scores by token" ON pending_scores
  FOR SELECT USING (true);
