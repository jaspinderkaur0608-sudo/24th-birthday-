-- Birthday Letter Museum: Chapter 24 - Supabase Database Schema
-- Execute this SQL script in your Supabase SQL Editor (https://app.supabase.com -> SQL Editor)

-- 1. Create the 'letters' table
CREATE TABLE IF NOT EXISTS public.letters (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  location TEXT NOT NULL,
  lat DOUBLE PRECISION,
  lng DOUBLE PRECISION,
  country TEXT,
  category TEXT NOT NULL,
  content TEXT NOT NULL,
  archive_number INT NOT NULL,
  rarity TEXT NOT NULL DEFAULT 'standard',
  date_created TEXT NOT NULL,
  is_capsule_letter BOOLEAN DEFAULT FALSE,
  wax_color TEXT,
  seal_symbol TEXT,
  paper_style TEXT
);

-- 2. Enable Row Level Security (RLS)
ALTER TABLE public.letters ENABLE ROW LEVEL SECURITY;

-- 3. Policy: Allow anyone (anonymous visitors) to read letters
CREATE POLICY "Allow public read access to letters" 
ON public.letters FOR SELECT 
USING (true);

-- 4. Policy: Allow anyone to submit/insert letters
CREATE POLICY "Allow public insert access to letters" 
ON public.letters FOR INSERT 
WITH CHECK (true);
