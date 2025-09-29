// Type definitions for Smartistics Analytics Platform
// Based on JSON specification

import { UserRole, DashboardName } from '../auth/roleConfig';

// Base types
export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  createdAt: Date;
  lastLogin?: Date;
}

export interface Dashboard {
  name: DashboardName;
  rolesAllowed: UserRole[];
  dataSource: string[];
  uiComponents: UIComponent[];
  interactions: string[];
}

// UI Component types
export type ComponentType =
  | 'InputForm'
  | 'KPI'
  | 'Chart'
  | 'Table'
  | 'Card'
  | 'ExportButton'
  | 'Filter';

export type ChartType =
  | 'BarChart'
  | 'LineChart'
  | 'PieChart'
  | 'StackedBar';

export type ChartLibrary = 'Chart.js' | 'Recharts';

export type ExportFormat = 'CSV' | 'PDF';

export interface UIComponent {
  type: ComponentType;
  fields?: string[];
  metrics?: string[];
  chartType?: ChartType;
  library?: ChartLibrary;
  format?: ExportFormat[];
  columns?: string[];
  content?: string;
}

// Data types for different dashboards
export interface ROICalculatorData {
  adSpend: number;
  conversions: number;
  revenue: number;
  roi: number;
  cpa: number;
  roas: number;
}

export interface CampaignData {
  id: string;
  name: string;
  platform: 'Google' | 'Meta' | 'TikTok' | 'LinkedIn';
  impressions: number;
  clicks: number;
  spend: number;
  conversions: number;
  ctr: number;
  cpc: number;
  conversionRate: number;
  startDate: Date;
  endDate: Date;
  status: 'Active' | 'Paused' | 'Completed';
}

export interface InsightData {
  id: string;
  type: 'recommendation' | 'alert' | 'trend';
  title: string;
  description: string;
  platform: string;
  impact: 'high' | 'medium' | 'low';
  createdAt: Date;
  metadata?: Record<string, any>;
}

export interface CustomerSegment {
  id: string;
  name: string;
  size: number;
  avgRoi: number;
  engagementScore: number;
  demographics: {
    ageRange: string;
    gender: string;
    location: string;
  };
  spendBehavior: {
    avgOrderValue: number;
    frequency: number;
    seasonality: string[];
  };
}

export interface PaymentTransaction {
  id: string;
  date: Date;
  amount: number;
  currency: string;
  status: 'completed' | 'pending' | 'failed' | 'refunded';
  type: 'payment' | 'refund' | 'subscription';
  description: string;
  customerId?: string;
  paymentMethod: string;
}

// Chart data types
export interface ChartDataPoint {
  x: string | number;
  y: number;
  label?: string;
  color?: string;
}

export interface LineChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    borderColor: string;
    backgroundColor: string;
    fill?: boolean;
  }[];
}

export interface BarChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor: string;
    borderColor?: string;
  }[];
}

export interface PieChartData {
  labels: string[];
  data: number[];
  backgroundColor: string[];
  borderColor?: string[];
}

// Filter types
export interface FilterConfig {
  field: string;
  type: 'select' | 'dateRange' | 'multiSelect' | 'range';
  label: string;
  options?: { value: string; label: string }[];
  defaultValue?: any;
}

export interface FilterState {
  [key: string]: any;
}

// API response types
export interface APIResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  sort?: string;
  order?: 'asc' | 'desc';
}

// KPI types
export interface KPIMetric {
  label: string;
  value: number | string;
  format: 'currency' | 'percentage' | 'number' | 'decimal';
  change?: {
    value: number;
    type: 'increase' | 'decrease';
    period: string;
  };
  target?: number;
  status?: 'good' | 'warning' | 'critical';
}

// Export types
export interface ExportConfig {
  format: ExportFormat;
  filename?: string;
  data: any[];
  columns?: string[];
  title?: string;
}

// Form types
export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'number' | 'email' | 'select' | 'date' | 'textarea';
  required: boolean;
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
    message?: string;
  };
  options?: { value: string; label: string }[];
}

export interface FormData {
  [key: string]: any;
}

// Navigation types
export interface NavItem {
  name: string;
  href: string;
  icon?: string;
  badge?: string | number;
  roles: UserRole[];
}

// State management types
export interface AppState {
  user: User | null;
  isAuthenticated: boolean;
  dashboards: Dashboard[];
  currentDashboard?: DashboardName;
  filters: FilterState;
  loading: boolean;
  error: string | null;
}

// Hook return types
export interface UseAuthReturn {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
  error: string | null;
}

export interface UseDataReturn<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  mutate: (newData: T) => void;
}

// Component prop types
export interface BaseComponentProps {
  className?: string;
  children?: React.ReactNode;
}

export interface ChartProps extends BaseComponentProps {
  data: any;
  width?: number;
  height?: number;
  responsive?: boolean;
  options?: any;
}

export interface TableProps extends BaseComponentProps {
  data: any[];
  columns: string[];
  sortable?: boolean;
  pagination?: boolean;
  pageSize?: number;
  onRowClick?: (row: any) => void;
}

export interface KPICardProps extends BaseComponentProps {
  metric: KPIMetric;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'compact';
}

export interface FilterPanelProps extends BaseComponentProps {
  filters: FilterConfig[];
  values: FilterState;
  onChange: (values: FilterState) => void;
  onReset?: () => void;
}

export interface ExportButtonProps extends BaseComponentProps {
  config: ExportConfig;
  variant?: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
}
