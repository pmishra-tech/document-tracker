import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface DRNStatus {
  id?: string;
  document_title: string;
  outstanding_numbers: number;
  deadline_date: string;
  status: string;
  comments_raised: number;
  comment_rejected: number;
  notes_comments: string;
  created_at?: string;
  updated_at?: string;
}

export interface UCMStatus {
  id?: string;
  document_id: string;
  title: string;
  deadline_date: string;
  owner: string;
  status: string;
  reviewer: string;
  reviewer_status: string;
  approver: string;
  approver_status: string;
  external: boolean;
  created_at?: string;
  updated_at?: string;
}
