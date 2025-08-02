import dotenv from 'dotenv';//todo:esto debes agregarlo
dotenv.config();//todo:esto debes agregarlo
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://uvsmckucvuragveeiyrx.supabase.co' 
const supabaseKey = process.env.SUPABASE_KEY //!🚩👀 Secreto
export const supabase = createClient(supabaseUrl, supabaseKey)