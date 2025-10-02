import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://cssxzvaecygmpxwyrqlo.supabase.co";
const supabasePublishableKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNzc3h6dmFlY3lnbXB4d3lycWxvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkzMjQxMDUsImV4cCI6MjA3NDkwMDEwNX0.qEOOA3mhluRs0daTOJJWbv1F7k_HlDbzwW2jHNvo_rc";

export const supabase = createClient(supabaseUrl, supabasePublishableKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
