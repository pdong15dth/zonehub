-- Create reviews table
CREATE TABLE IF NOT EXISTS game_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  game_id UUID NOT NULL REFERENCES games(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  content TEXT NOT NULL,
  likes INTEGER DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'published' CHECK (status IN ('draft', 'published', 'hidden')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE,
  UNIQUE(game_id, user_id)
);

-- Create RLS policies
ALTER TABLE game_reviews ENABLE ROW LEVEL SECURITY;

-- Allow public read access for published reviews
CREATE POLICY "Allow public read access for published reviews" 
ON game_reviews 
FOR SELECT 
USING (status = 'published');

-- Allow users to see their own reviews regardless of status
CREATE POLICY "Allow users to view their own reviews" 
ON game_reviews 
FOR SELECT 
USING (auth.uid() = user_id);

-- Allow users to create their own reviews
CREATE POLICY "Allow users to create their own reviews" 
ON game_reviews 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Allow users to update their own reviews
CREATE POLICY "Allow users to update their own reviews" 
ON game_reviews 
FOR UPDATE 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Allow users to delete their own reviews
CREATE POLICY "Allow users to delete their own reviews" 
ON game_reviews 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create a function to update game average rating when reviews change
CREATE OR REPLACE FUNCTION update_game_average_rating()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE games
  SET 
    rating = (
      SELECT COALESCE(AVG(rating), 0)
      FROM game_reviews
      WHERE game_id = NEW.game_id
      AND status = 'published'
    ),
    updated_at = now()
  WHERE id = NEW.game_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers to update game rating on review changes
CREATE TRIGGER after_review_insert
AFTER INSERT ON game_reviews
FOR EACH ROW
EXECUTE FUNCTION update_game_average_rating();

CREATE TRIGGER after_review_update
AFTER UPDATE ON game_reviews
FOR EACH ROW
EXECUTE FUNCTION update_game_average_rating();

CREATE TRIGGER after_review_delete
AFTER DELETE ON game_reviews
FOR EACH ROW
EXECUTE FUNCTION update_game_average_rating(); 