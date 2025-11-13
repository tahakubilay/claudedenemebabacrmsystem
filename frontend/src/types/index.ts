export interface TimeStampedModel {
  created_at: string;
  updated_at: string;
}

export interface Company extends TimeStampedModel {
  id: string;
  title: string;
  tax_number: string;
  email: string;
  iban: string;
  description: string;
  is_active: boolean;
  metadata?: Record<string, any>;
  brand_count: number;
  total_branches: number;
  total_people: number;
}

export interface Brand extends TimeStampedModel {
  id: string;
  name: string;
  tax_number: string;
  phone: string;
  email: string;
  branch_count: number;
  company: Company | string;
  company_name?: string;
  company_id?: string;
  metadata?: Record<string, any>;
}

export interface Branch extends TimeStampedModel {
  id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  sgk_number: string;
  brand: Brand | string;
  brand_name?: string;
  company_name?: string;
  metadata?: Record<string, any>;
  employee_count: number;
}

export interface Role extends TimeStampedModel {
  id: string;
  name: string;
  display_name: string;
  permissions?: Record<string, any>;
  description?: string;
}

export interface Person extends TimeStampedModel {
  id: string;
  full_name: string;
  profile_photo?: string | null; // Backend'den gelen URL'i (veya null) karşılar
  national_id: string;
  address: string;
  phone: string;
  email: string;
  iban: string;
  description: string;
  role: Role | string;
  role_name?: string;
  branch: Branch | string;
  branch_name?: string;
  company_name?: string;
  is_active: boolean;
  masked_national_id?: string;
  masked_iban?: string;
  contracts_count?: number;
  promissory_notes_count?: number;
  financial_records_count?: number;
}

export interface Report extends TimeStampedModel {
  id: string;
  title: string;
  content?: string;
  file?: string;
  report_type: 'daily' | 'weekly' | 'monthly' | 'yearly' | 'custom';
  report_type_display?: string;
  scope: 'company' | 'brand' | 'branch' | 'person';
  scope_display?: string;
  report_date: string;
  company?: Company | string | null;
  brand?: Brand | string | null;
  branch?: Branch | string | null;
  person?: Person | string | null;
  tags?: string[];
  metadata?: Record<string, any>;
  created_by?: any;
  created_by_name?: string;
}

export interface Contract extends TimeStampedModel {
  id: string;
  title: string;
  contract_number: string;
  template_name?: string;
  file: string;
  related_company?: Company | string | null;
  related_brand?: Brand | string | null;
  related_branch?: Branch | string | null;
  related_person?: Person | string | null;
  start_date: string;
  end_date?: string | null;
  status: 'draft' | 'active' | 'expired' | 'terminated';
  status_display?: string;
  related_entity?: string;
  versioning?: Record<string, any>;
  created_by?: any;
  is_active?: boolean;
}

export interface PromissoryNote extends TimeStampedModel {
  id: string;
  title: string;
  note_number: string;
  file?: string;
  amount: number;
  due_date: string;
  payment_status: 'pending' | 'paid' | 'overdue';
  payment_status_display?: string;
  is_overdue?: boolean;
  related_company?: Company | string | null;
  related_brand?: Brand | string | null;
  related_branch?: Branch | string | null;
  related_person?: Person | string | null;
  related_entity?: string;
  metadata?: Record<string, any>;
  created_by?: any;
}

export interface FinancialRecord extends TimeStampedModel {
  id: string;
  title: string;
  type: 'income' | 'expense' | 'turnover' | 'profit_share';
  type_display?: string;
  amount: number;
  currency: 'TRY' | 'USD' | 'EUR' | 'GBP';
  currency_display?: string;
  date: string;
  description?: string;
  related_company?: Company | string | null;
  related_brand?: Brand | string | null;
  related_branch?: Branch | string | null;
  related_person?: Person | string | null;
  attachments?: string;
  metadata?: Record<string, any>;
  created_by?: any;
}

export interface Receipt extends TimeStampedModel {
  id: string;
  title: string;
  description: string;
  amount?: number;
  currency?: string;
  date: string;
  level: 'company' | 'brand' | 'branch' | 'person';
  level_object_id?: string;
  attachments?: any[];
  created_by?: any;
  tags?: string[];
  metadata?: Record<string, any>;
}

export interface Template extends TimeStampedModel {
  id: string;
  title: string;
  template_type: 'contract' | 'promissory_note' | 'report';
  content_html: string;
  placeholders?: string[];
  created_by?: any;
  usage_count: number;
  versioning?: Record<string, any>;
}

export interface CalendarEvent extends TimeStampedModel {
  id: string;
  title: string;
  description?: string;
  start: string;
  end?: string;
  category:
    | 'upcoming_payment'
    | 'overdue_payment'
    | 'new_contract'
    | 'promissory_note'
    | 'report_reminder';
  related_document_type?: string;
  related_document_id?: string;
  related_company?: Company | string | null;
  related_brand?: Brand | string | null;
  related_branch?: Branch | string | null;
  related_person?: Person | string | null;
  created_by?: any;
}


export interface DashboardStats {
  companies_count: number;
  brands_count: number;
  branches_count: number;
  people_count: number;
  reports_count: number;
  contracts_count: number;
  promissory_notes_count: number;
  financial_records_count: number;
  recent_companies?: Company[];
  recent_reports?: Report[];
  overdue_notes?: PromissoryNote[];
}

export interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  is_staff: boolean;
  is_superuser: boolean;
  date_joined?: string;
}

export interface AuthTokens {
  access: string;
  refresh: string;
}