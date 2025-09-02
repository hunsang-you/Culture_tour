export interface Users {
  id: string;
  email: string;
  nickname?: string | null;
  profile_image?: string | null;
  name?: string | null;
  full_name?: string | null;
  user_name?: string | null;
  preferred_username?: string | null;
  created_at?: string;
}