export interface AffiliateRegistration {
  id: number;
  affiliate_id: number;
  user_id: number;
  status: 'pending' | 'qualified';
  qualified_at?: string;
  user?: {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
  };
  created_at: string;
  updated_at: string;
}
