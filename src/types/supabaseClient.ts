import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://cgemjooqrwlusdxxzaya.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNnZW1qb29xcndsdXNkeHh6YXlhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkzMjQyMjEsImV4cCI6MjA2NDkwMDIyMX0.JazqfyX8mwtsY3u_bQl_yBKvsISDgts189vipQqD5WE';
export const supabase = createClient(supabaseUrl, supabaseKey);
