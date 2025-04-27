export interface UserProfile {
  id: string;
  created_at: string;
  updated_at?: string;
  username?: string | null;
  email?: string | null;
  full_name: string | null;
  avatar_url: string | null;
  role: 'admin' | 'member' | 'editor';
} 