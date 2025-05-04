-- Update articles table with new fields
ALTER TABLE articles 
  -- Add author tracking fields if they don't exist
  ADD COLUMN IF NOT EXISTS author_id UUID REFERENCES auth.users(id) NULL,
  ADD COLUMN IF NOT EXISTS updated_by UUID REFERENCES auth.users(id) NULL,
  
  -- Add timestamps if they don't exist
  ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  
  -- Add other metadata fields
  ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT FALSE NOT NULL,
  ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'draft' NOT NULL,
  
  -- Handle possible naming conflicts by checking for both names
  ADD COLUMN IF NOT EXISTS publish_date TIMESTAMPTZ NULL;

-- Create a function to update the updated_at timestamp automatically
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create a trigger to call the function on update
DROP TRIGGER IF EXISTS set_timestamp ON articles;
CREATE TRIGGER set_timestamp
BEFORE UPDATE ON articles
FOR EACH ROW
EXECUTE FUNCTION update_modified_column();

-- Add appropriate indexes for performance
CREATE INDEX IF NOT EXISTS idx_articles_status ON articles(status);
CREATE INDEX IF NOT EXISTS idx_articles_author_id ON articles(author_id);
CREATE INDEX IF NOT EXISTS idx_articles_is_featured ON articles(is_featured);

-- Add COMMENT to describe table
COMMENT ON TABLE articles IS 'Stores news articles and blog posts'; 