/*
  # Idea Pile Schema

  1. New Tables
    - `idea_items`
      - Core table for storing ideas and notes
      - Supports rich content types (text, images, links)
      - Includes metadata and organization fields
    - `idea_tags`
      - Tag management for ideas
    - `idea_references`
      - Cross-references between ideas and projects
  
  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Core idea items table
CREATE TABLE IF NOT EXISTS idea_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id),
  title text NOT NULL,
  content text NOT NULL,
  type text NOT NULL CHECK (type IN ('note', 'image', 'voice', 'link', 'reference')),
  status text NOT NULL DEFAULT 'unprocessed' CHECK (status IN ('unprocessed', 'inuse', 'archived')),
  category text NOT NULL CHECK (category IN ('capture', 'inspiration', 'reference')),
  source text,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Tags for organizing ideas
CREATE TABLE IF NOT EXISTS idea_tags (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  idea_id uuid NOT NULL REFERENCES idea_items(id) ON DELETE CASCADE,
  tag text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(idea_id, tag)
);

-- Project references/usage tracking
CREATE TABLE IF NOT EXISTS idea_references (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  idea_id uuid NOT NULL REFERENCES idea_items(id) ON DELETE CASCADE,
  project_id uuid NOT NULL,
  project_name text NOT NULL,
  usage text NOT NULL,
  date_used timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE idea_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE idea_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE idea_references ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can manage their own ideas"
  ON idea_items
  FOR ALL
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage tags for their ideas"
  ON idea_tags
  FOR ALL
  USING (EXISTS (
    SELECT 1 FROM idea_items
    WHERE idea_items.id = idea_tags.idea_id
    AND idea_items.user_id = auth.uid()
  ));

CREATE POLICY "Users can manage references for their ideas"
  ON idea_references
  FOR ALL
  USING (EXISTS (
    SELECT 1 FROM idea_items
    WHERE idea_items.id = idea_references.idea_id
    AND idea_items.user_id = auth.uid()
  ));