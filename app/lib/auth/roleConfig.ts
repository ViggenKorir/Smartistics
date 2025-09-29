// Role-based access control configuration
// Based on JSON specification for Smartistics Analytics Platform

export type UserRole = "Founder" | "Marketer" | "Analyst" | "Admin";

export type DashboardName =
  | "Dashboard"
  | "ROI Calculator"
  | "Insights"
  | "Campaign Performance"
  | "Customer Segmentation"
  | "Payments & Reports"
  | "Subscription";

export interface RolePermissions {
  dashboards: DashboardName[];
  canExport: boolean;
  canManageUsers: boolean;
  canAccessPayments: boolean;
}

export const ROLE_DEFINITIONS: Record<UserRole, RolePermissions> = {
  Founder: {
    dashboards: [
      "Dashboard",
      "ROI Calculator",
      "Insights",
      "Campaign Performance",
      "Customer Segmentation",
      "Payments & Reports",
      "Subscription",
    ],
    canExport: true,
    canManageUsers: true,
    canAccessPayments: true,
  },
  Marketer: {
    dashboards: [
      "Dashboard",
      "ROI Calculator",
      "Insights",
      "Campaign Performance",
    ],
    canExport: true,
    canManageUsers: false,
    canAccessPayments: false,
  },
  Analyst: {
    dashboards: [
      "Dashboard",
      "ROI Calculator",
      "Insights",
      "Customer Segmentation",
    ],
    canExport: true,
    canManageUsers: false,
    canAccessPayments: false,
  },
  Admin: {
    dashboards: ["Dashboard", "Payments & Reports", "Subscription"],
    canExport: true,
    canManageUsers: true,
    canAccessPayments: true,
  },
};

export const DASHBOARD_ROUTES: Record<DashboardName, string> = {
  Dashboard: "/dashboard",
  "ROI Calculator": "/dashboards/roi-calculator",
  Insights: "/dashboards/insights",
  "Campaign Performance": "/dashboards/campaign-performance",
  "Customer Segmentation": "/dashboards/customer-segmentation",
  "Payments & Reports": "/payments",
  Subscription: "/dashboards/subscription",
};

export const DASHBOARD_ROLES: Record<DashboardName, UserRole[]> = {
  Dashboard: ["Founder", "Marketer", "Analyst", "Admin"],
  "ROI Calculator": ["Founder", "Marketer", "Analyst"],
  Insights: ["Founder", "Marketer", "Analyst"],
  "Campaign Performance": ["Founder", "Marketer"],
  "Customer Segmentation": ["Founder", "Analyst"],
  "Payments & Reports": ["Founder", "Admin"],
  Subscription: ["Founder", "Admin"],
};

// Helper functions
export const hasAccess = (
  userRole: UserRole,
  dashboard: DashboardName,
): boolean => {
  return ROLE_DEFINITIONS[userRole].dashboards.includes(dashboard);
};

export const canExport = (userRole: UserRole): boolean => {
  return ROLE_DEFINITIONS[userRole].canExport;
};

export const canManageUsers = (userRole: UserRole): boolean => {
  return ROLE_DEFINITIONS[userRole].canManageUsers;
};

export const canAccessPayments = (userRole: UserRole): boolean => {
  return ROLE_DEFINITIONS[userRole].canAccessPayments;
};

export const getAvailableDashboards = (userRole: UserRole): DashboardName[] => {
  return ROLE_DEFINITIONS[userRole].dashboards;
};

export const getDashboardRoute = (dashboard: DashboardName): string => {
  return DASHBOARD_ROUTES[dashboard];
};

export const isValidRole = (role: string): role is UserRole => {
  return ["Founder", "Marketer", "Analyst", "Admin"].includes(role);
};
