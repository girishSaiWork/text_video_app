import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;

// Create a client with the anon key for client-side operations
export const supabase = createClient(
  supabaseUrl,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Create an admin client with the service role key for server-side operations
export const supabaseAdmin = createClient(
  supabaseUrl,
  process.env.SUPABASE_SERVICE_KEY!
);

// Type for the profiles table
export type Profile = {
  user_id: string;
  email: string;
  tier?: string;
  stripe_customer_id?: string;
  stripe_subscription_id?: string;
  created_at?: string;
};

// Helper function to get a user's profile
export async function getProfile(userId: string) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error) throw error;
  return data as Profile;
}

// Helper function to update a user's profile
export async function updateProfile(profile: Partial<Profile> & { user_id: string }) {
  const { data, error } = await supabase
    .from('profiles')
    .upsert(profile)
    .select()
    .single();

  if (error) throw error;
  return data as Profile;
}
