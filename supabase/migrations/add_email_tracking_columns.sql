-- Add email tracking columns to profiles table
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS email_day1_sent BOOLEAN DEFAULT FALSE;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS email_day3_sent BOOLEAN DEFAULT FALSE;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS email_day5_sent BOOLEAN DEFAULT FALSE;

-- Verify columns added:
-- SELECT column_name FROM information_schema.columns
-- WHERE table_name = 'profiles'
-- AND column_name IN ('email_day1_sent', 'email_day3_sent', 'email_day5_sent');
