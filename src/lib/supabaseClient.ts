import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ffehaxetotjvhgqlincr.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZmZWhheGV0b3RqdmhncWxpbmNyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg0MjM5MDAsImV4cCI6MjA2Mzk5OTkwMH0.R8t8Rt7CRZ2IYkpkFYZlm1EZ9yxmj5o-6squQTaM5YM';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
