import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Use placeholder values if environment variables are not set
const defaultUrl = 'https://placeholder.supabase.co';
const defaultKey = 'placeholder-key';

export const supabase = createClient(
  supabaseUrl || defaultUrl,
  supabaseAnonKey || defaultKey
);

// Auth helpers
export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  return { data, error };
};

export const signUp = async (email: string, password: string, fullName: string, role: string) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
        role: role,
      },
    },
  });
  return { data, error };
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  return { error };
};

export const getCurrentUser = async () => {
  const { data: { user }, error } = await supabase.auth.getUser();
  return { user, error };
};

// Database helpers
export const getUserProfile = async (userId: string) => {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single();
  return { data, error };
};

export const getBatches = async (userId?: string, role?: string) => {
  let query = supabase
    .from('batches')
    .select(`
      *,
      trainer:users!batches_trainer_id_fkey(id, full_name, email)
    `);

  if (role === 'trainer' && userId) {
    query = query.eq('trainer_id', userId);
  }

  const { data, error } = await query.order('created_at', { ascending: false });
  return { data, error };
};

export const getEnrolledBatches = async (learnerId: string) => {
  const { data, error } = await supabase
    .from('batch_enrollments')
    .select(`
      *,
      batch:batches(
        *,
        trainer:users!batches_trainer_id_fkey(id, full_name, email)
      )
    `)
    .eq('learner_id', learnerId)
    .eq('status', 'active');
  return { data, error };
};

export const getAssignments = async (batchId: string) => {
  const { data, error } = await supabase
    .from('assignments')
    .select('*')
    .eq('batch_id', batchId)
    .order('due_date', { ascending: true });
  return { data, error };
};

export const getAttendance = async (batchId: string, date?: string) => {
  let query = supabase
    .from('attendance')
    .select(`
      *,
      learner:users!attendance_learner_id_fkey(id, full_name, email)
    `)
    .eq('batch_id', batchId);

  if (date) {
    query = query.eq('date', date);
  }

  const { data, error } = await query.order('date', { ascending: false });
  return { data, error };
};