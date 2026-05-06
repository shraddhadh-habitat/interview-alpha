-- Migration: add phone_number to profiles table
-- Run this in the Supabase SQL editor or via supabase db push

ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS phone_number text;

CREATE INDEX IF NOT EXISTS idx_profiles_phone_number ON public.profiles(phone_number);
