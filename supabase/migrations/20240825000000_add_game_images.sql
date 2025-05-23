-- Add images array column to games table
ALTER TABLE games 
ADD COLUMN images TEXT[] DEFAULT ARRAY[]::TEXT[];

-- Update existing games to move the current image to the images array
UPDATE games
SET images = ARRAY[image]
WHERE image IS NOT NULL AND (images IS NULL OR array_length(images, 1) IS NULL);

-- Add comment explaining the migration
COMMENT ON TABLE games IS 'Stores game information with support for multiple images via the images array'; 