-- This function updates the users table with data from auth.users
CREATE OR REPLACE FUNCTION sync_user_metadata()
RETURNS TRIGGER AS $$
BEGIN
    -- When a user is updated in auth.users, update the corresponding record in users
    UPDATE users
    SET 
        email = NEW.email,
        full_name = (NEW.raw_user_meta_data->>'full_name'),
        avatar_url = (NEW.raw_user_meta_data->>'avatar_url'),
        updated_at = NOW()
    WHERE id = NEW.id;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a trigger on auth.users to sync data to users table
DROP TRIGGER IF EXISTS sync_user_metadata ON auth.users;
CREATE TRIGGER sync_user_metadata
AFTER UPDATE ON auth.users
FOR EACH ROW
EXECUTE FUNCTION sync_user_metadata();

-- Perform an initial sync of all users
UPDATE users
SET 
    email = auth.email,
    full_name = (auth.raw_user_meta_data->>'full_name'),
    avatar_url = (auth.raw_user_meta_data->>'avatar_url'),
    updated_at = NOW()
FROM auth.users auth
WHERE users.id = auth.id; 