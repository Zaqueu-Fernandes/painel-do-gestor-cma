import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://stsqjnincxsjqkrfpvod.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN0c3FqbmluY3hzanFrcmZwdm9kIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA1ODg1OTMsImV4cCI6MjA4NjE2NDU5M30.vQr9CGpUy3N8PidOiNNrBtBeY5i-B7PZy1V7KtrApss'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
