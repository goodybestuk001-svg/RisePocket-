export interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  referral_code: string;
  is_activated: boolean;
  activation_plan_id?: number;
  profile_photo_path?: string;
  status: 'active' | 'suspended' | 'banned';
  created_at: string;
}

export interface ActivationPlan {
  id: number;
  name: string;
  slug: string;
  activation_fee: number;
  daily_tasks: number;
  reward_per_task: number;
  description?: string;
  benefits?: string[];
}

export interface Wallet {
  id: number;
  user_id: number;
  total_balance: number;
  available_balance: number;
  pending_balance: number;
  withdrawn_amount: number;
  referral_earnings: number;
  affiliate_earnings: number;
  task_earnings: number;
}

export interface DailyTask {
  id: number;
  user_id: number;
  title: string;
  description: string;
  instructions: string;
  proof_required: boolean;
  reward_amount: number;
  assigned_date: string;
  due_date: string;
  status: 'pending' | 'submitted' | 'approved' | 'rejected';
  completion_count: number;
}

export interface TaskSubmission {
  id: number;
  user_id: number;
  daily_task_id: number;
  submission_text?: string;
  proof_image?: string;
  proof_video?: string;
  proof_url?: string;
  status: 'pending' | 'approved' | 'rejected';
  submitted_at?: string;
  approved_at?: string;
  rejection_reason?: string;
  dailyTask?: DailyTask;
}

export interface Referral {
  id: number;
  referrer_id: number;
  referred_user_id: number;
  referral_code: string;
  status: 'pending' | 'qualified' | 'rewarded';
  reward_amount: number;
  qualified_at?: string;
  rewarded_at?: string;
}

export interface Affiliate {
  id: number;
  user_id: number;
  affiliate_code: string;
  total_registrations: number;
  qualified_registrations: number;
  reward_amount: number;
  reward_thresholds: Record<string, number>;
  is_active: boolean;
  status: 'pending' | 'active' | 'suspended';
}

export interface Withdrawal {
  id: number;
  user_id: number;
  amount: number;
  bank_name: string;
  account_number: string;
  account_name: string;
  status: 'pending' | 'approved' | 'rejected' | 'processed';
  requested_at?: string;
  approved_at?: string;
  rejection_reason?: string;
}

export interface Notification {
  id: number;
  user_id: number;
  title: string;
  message: string;
  type: string;
  read_at?: string;
  created_at: string;
}

export interface WalletTransaction {
  id: number;
  type: 'credit' | 'debit';
  amount: number;
  transaction_type: string;
  description?: string;
  created_at: string;
}
