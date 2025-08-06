export interface User {
  id: string;
  email: string;
  full_name: string;
  role: 'admin' | 'trainer' | 'learner';
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

export interface Batch {
  id: string;
  name: string;
  description: string;
  start_date: string;
  end_date: string;
  trainer_id: string;
  trainer?: User;
  status: 'active' | 'completed' | 'upcoming';
  max_learners: number;
  current_learners: number;
  created_at: string;
  updated_at: string;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  duration_hours: number;
  difficulty_level: 'beginner' | 'intermediate' | 'advanced';
  created_at: string;
  updated_at: string;
}

export interface Module {
  id: string;
  course_id: string;
  title: string;
  description: string;
  order_index: number;
  duration_minutes: number;
  is_mandatory: boolean;
  created_at: string;
  updated_at: string;
}

export interface Assignment {
  id: string;
  batch_id: string;
  module_id?: string;
  title: string;
  description: string;
  due_date: string;
  max_score: number;
  file_url?: string;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface Submission {
  id: string;
  assignment_id: string;
  learner_id: string;
  file_url?: string;
  content?: string;
  score?: number;
  feedback?: string;
  submitted_at: string;
  graded_at?: string;
  graded_by?: string;
}

export interface Assessment {
  id: string;
  batch_id: string;
  module_id?: string;
  title: string;
  description: string;
  type: 'pre_test' | 'post_test' | 'quiz' | 'final_exam';
  total_marks: number;
  passing_marks: number;
  duration_minutes: number;
  is_active: boolean;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface Question {
  id: string;
  assessment_id: string;
  question_text: string;
  question_type: 'mcq' | 'true_false' | 'short_answer' | 'essay';
  options?: string[];
  correct_answer: string;
  marks: number;
  order_index: number;
  created_at: string;
  updated_at: string;
}

export interface AttemptResult {
  id: string;
  assessment_id: string;
  learner_id: string;
  score: number;
  total_marks: number;
  percentage: number;
  time_taken_minutes: number;
  is_passed: boolean;
  attempt_number: number;
  started_at: string;
  completed_at: string;
}

export interface Attendance {
  id: string;
  batch_id: string;
  learner_id: string;
  date: string;
  status: 'present' | 'absent' | 'late';
  marked_by: string;
  marked_at: string;
  notes?: string;
}

export interface Progress {
  id: string;
  learner_id: string;
  batch_id: string;
  module_id: string;
  completion_percentage: number;
  last_accessed: string;
  time_spent_minutes: number;
  is_completed: boolean;
  completed_at?: string;
}

export interface Document {
  id: string;
  batch_id: string;
  uploaded_by: string;
  title: string;
  description?: string;
  file_url: string;
  file_type: string;
  file_size: number;
  is_public: boolean;
  created_at: string;
  updated_at: string;
}

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  is_read: boolean;
  created_at: string;
  updated_at: string;
}

export interface Certificate {
  id: string;
  learner_id: string;
  batch_id: string;
  certificate_url: string;
  issued_date: string;
  is_valid: boolean;
  verification_code: string;
  created_at: string;
}

export interface BatchEnrollment {
  id: string;
  batch_id: string;
  learner_id: string;
  enrolled_at: string;
  status: 'active' | 'completed' | 'dropped';
  completion_percentage: number;
  final_grade?: string;
}