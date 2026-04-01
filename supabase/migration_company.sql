-- Task 3: Company-specific interview modes
-- Add company column to sessions table

ALTER TABLE public.sessions
  ADD COLUMN IF NOT EXISTS company text;
