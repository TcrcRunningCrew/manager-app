// supabaseClient.js
import { createClient } from "@supabase/supabase-js";

// const supabaseUrl = process.env.SUPABASE_URL || '';
// const supabaseKey = process.env.SUPABASE_API_KEY|| '';

const supabaseUrl = 'https://eynjlxtyxihkokeesrlj.supabase.co' || '';
const supabaseKey ='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV5bmpseHR5eGloa29rZWVzcmxqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDU2NzMyNzIsImV4cCI6MjAyMTI0OTI3Mn0.3ZjFnmezUcgt9LxbtgB6Ag4ZGbgb-N-o6VCbja0Kiyc'|| '';
// SUPABASEURL=
// SUPABASEAPIKEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV5bmpseHR5eGloa29rZWVzcmxqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDU2NzMyNzIsImV4cCI6MjAyMTI0OTI3Mn0.3ZjFnmezUcgt9LxbtgB6Ag4ZGbgb-N-o6VCbja0Kiyc



const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
