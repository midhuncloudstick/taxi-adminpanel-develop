
import { createClient } from '@supabase/supabase-js';

export const getGoogleMapsKey = async (supabaseClient: any) => {
  const { data, error } = await supabaseClient.functions.invoke('get-google-maps-key');
  if (error) throw error;
  return data.key;
};
