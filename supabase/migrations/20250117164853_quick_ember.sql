/*
  # Idea Pile Schema

  1. New Tables
    - `idea_items`: Core table for storing ideas
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `title` (text)
      - `content` (text)
      - `type` (text, enum)
      - `status` (text, enum)
      - `category` (text, enum)
      - `source` (text, optional)
      - `metadata` (jsonb)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `idea_tags`: Many-to-many relationship for idea tags
      - `id` (uuid, primary key)
      - `idea_id` (uuid, references idea_items)
      - `tag` (text)
      - `created_at` (timestamptz)
    
    - `idea_references`: Track idea usage in projects
      - `id` (uuid, primary key)
      - `idea_id` (uuid, references idea_items)
      - `project_id` (uuid)
      - `project_name` (text)
      - `usage` (text)
      - `date_used` (timestamptz)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Add policies for user-based access control
    - Ensure cascading deletes for related records

  3. Indexes
    - Add indexes for common query patterns
    - Optimize for search and filtering
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

-- Add indexes for common queries
CREATE INDEX IF NOT EXISTS idea_items_user_id_idx ON idea_items(user_id);
CREATE INDEX IF NOT EXISTS idea_items_type_idx ON idea_items(type);
CREATE INDEX IF NOT EXISTS idea_items_status_idx ON idea_items(status);
CREATE INDEX IF NOT EXISTS idea_items_category_idx ON idea_items(category);
CREATE INDEX IF NOT EXISTS idea_items_created_at_idx ON idea_items(created_at DESC);

-- Add full text search
ALTER TABLE idea_items ADD COLUMN IF NOT EXISTS fts tsvector 
  GENERATED ALWAYS AS (
    setweight(to_tsvector('english', coalesce(title, '')), 'A') ||
    setweight(to_tsvector('english', coalesce(content, '')), 'B')
  ) STORED;

CREATE INDEX IF NOT EXISTS idea_items_fts_idx ON idea_items USING gin(fts);

-- Tags for organizing ideas
CREATE TABLE IF NOT EXISTS idea_tags (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  idea_id uuid NOT NULL REFERENCES idea_items(id) ON DELETE CASCADE,
  tag text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(idea_id, tag)
);

CREATE INDEX IF NOT EXISTS idea_tags_idea_id_idx ON idea_tags(idea_id);
CREATE INDEX IF NOT EXISTS idea_tags_tag_idx ON idea_tags(tag);

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

CREATE INDEX IF NOT EXISTS idea_references_idea_id_idx ON idea_references(idea_id);
CREATE INDEX IF NOT EXISTS idea_references_project_id_idx ON idea_references(project_id);
CREATE INDEX IF NOT EXISTS idea_references_date_used_idx ON idea_references(date_used DESC);

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

-- Functions for managing ideas
CREATE OR REPLACE FUNCTION update_idea_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER idea_items_updated_at
  BEFORE UPDATE ON idea_items
  FOR EACH ROW
  EXECUTE FUNCTION update_idea_updated_at();

-- Function to search ideas with relevance ranking
CREATE OR REPLACE FUNCTION search_ideas(
  search_query text,
  user_id_param uuid,
  category_filter text DEFAULT NULL,
  status_filter text DEFAULT NULL,
  tag_filter text[] DEFAULT NULL
) RETURNS TABLE (
  id uuid,
  title text,
  content text,
  type text,
  status text,
  category text,
  created_at timestamptz,
  rank float4
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    i.id,
    i.title,
    i.content,
    i.type,
    i.status,
    i.category,
    i.created_at,
    ts_rank(i.fts, websearch_to_tsquery('english', search_query)) as rank
  FROM idea_items i
  WHERE i.user_id = user_id_param
    AND (category_filter IS NULL OR i.category = category_filter)
    AND (status_filter IS NULL OR i.status = status_filter)
    AND (tag_filter IS NULL OR EXISTS (
      SELECT 1 FROM idea_tags t
      WHERE t.idea_id = i.id
      AND t.tag = ANY(tag_filter)
    ))
    AND (
      search_query = '' OR
      i.fts @@ websearch_to_tsquery('english', search_query)
    )
  ORDER BY rank DESC, i.created_at DESC;
END;
$$ LANGUAGE plpgsql;