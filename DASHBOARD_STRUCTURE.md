# Smartistics Analytics Platform - Project Structure

## Overview
This document outlines the complete file structure for the Smartistics Analytics Platform, a comprehensive dashboard system with role-based access control.

## Tech Stack
- **Frontend**: Next.js 15+ with TypeScript and React 19+
- **Styling**: TailwindCSS 4+
- **Charts**: Chart.js and Recharts
- **State Management**: React Context API
- **Authentication**: Role-based access control
- **Data Fetching**: Custom hooks with mock APIs

## File Structure

```
Smartistics/
├── app/
│   ├── globals.css
│   ├── layout.tsx
│   ├── page.tsx
│   ├── loading.tsx
│   ├── not-found.tsx
│   │
│   ├── dashboards/
│   │   ├── layout.tsx                          # Dashboard wrapper with navigation
│   │   ├── roi-calculator/
│   │   │   └── page.tsx                        # ROI Calculator Dashboard
│   │   ├── insights/
│   │   │   └── page.tsx                        # Insights Dashboard
│   │   ├── campaign-performance/
│   │   │   └── page.tsx                        # Campaign Performance Dashboard
│   │   ├── customer-segmentation/
│   │   │   └── page.tsx                        # Customer Segmentation Dashboard
│   │   └── payments-reports/
│   │       └── page.tsx                        # Payments & Reports Dashboard
│   │
│   ├── api/
│   │   ├── auth/
│   │   │   └── route.ts                        # Authentication API
│   │   ├── campaigns/
│   │   │   └── route.ts                        # Campaign data API
│   │   ├── customers/
│   │   │   └── route.ts                        # Customer segmentation API
│   │   ├── insights/
│   │   │   └── route.ts                        # AI insights API
│   │   ├── payments/
│   │   │   └── route.ts                        # Payments data API
│   │   └── roi/
│   │       └── route.ts                        # ROI calculation API
│   │
│   └── components/
│       ├── auth/
│       │   ├── ProtectedRoute.tsx              # Role-based route protection
│       │   ├── RoleGuard.tsx                   # Component-level role protection
│       │   └── LoginForm.tsx                   # Authentication form
│       │
│       ├── charts/
│       │   ├── BarChart.tsx                    # Recharts Bar Chart wrapper
│       │   ├── LineChart.tsx                   # Chart.js Line Chart wrapper
│       │   ├── PieChart.tsx                    # Recharts Pie Chart wrapper
│       │   ├── StackedBarChart.tsx             # Recharts Stacked Bar Chart
│       │   └── ChartWrapper.tsx                # Common chart container
│       │
│       ├── common/
│       │   ├── KPICard.tsx                     # Reusable KPI display card
│       │   ├── DataTable.tsx                   # Generic data table component
│       │   ├── ExportButton.tsx                # CSV/PDF export functionality
│       │   ├── FilterPanel.tsx                 # Generic filter component
│       │   ├── LoadingSpinner.tsx              # Loading state component
│       │   ├── ErrorBoundary.tsx               # Error handling component
│       │   └── PageHeader.tsx                  # Common page header
│       │
│       ├── forms/
│       │   ├── ROICalculatorForm.tsx           # ROI input form
│       │   ├── FilterForm.tsx                  # Generic filter form
│       │   └── FormField.tsx                   # Reusable form field
│       │
│       ├── layout/
│       │   ├── Sidebar.tsx                     # Main navigation sidebar
│       │   ├── Header.tsx                      # Top navigation header
│       │   ├── DashboardLayout.tsx             # Dashboard page wrapper
│       │   └── Navigation.tsx                  # Navigation components
│       │
│       └── ui/
│           ├── Button.tsx                      # Button component variants
│           ├── Card.tsx                        # Card container component
│           ├── Modal.tsx                       # Modal dialog component
│           ├── Toast.tsx                       # Notification component
│           └── Badge.tsx                       # Status badge component
│
├── lib/
│   ├── auth/
│   │   ├── AuthContext.tsx                     # Authentication context provider
│   │   ├── AuthProvider.tsx                    # Auth wrapper component
│   │   ├── useAuth.ts                          # Authentication hook
│   │   └── roleConfig.ts                       # Role definitions and permissions
│   │
│   ├── api/
│   │   ├── client.ts                           # API client configuration
│   │   ├── endpoints.ts                        # API endpoint definitions
│   │   └── types.ts                            # API response type definitions
│   │
│   ├── hooks/
│   │   ├── useROICalculator.ts                 # ROI calculation logic hook
│   │   ├── useCampaignData.ts                  # Campaign data fetching hook
│   │   ├── useInsights.ts                      # Insights data hook
│   │   ├── useCustomerSegmentation.ts          # Customer data hook
│   │   ├── usePayments.ts                      # Payments data hook
│   │   ├── useExport.ts                        # Export functionality hook
│   │   └── useFilters.ts                       # Filter state management hook
│   │
│   ├── data/
│   │   ├── mockData.ts                         # Mock data for development
│   │   ├── campaignData.ts                     # Sample campaign data
│   │   ├── customerData.ts                     # Sample customer data
│   │   ├── insightsData.ts                     # Sample insights data
│   │   └── paymentsData.ts                     # Sample payments data
│   │
│   ├── utils/
│   │   ├── calculations.ts                     # ROI and metric calculations
│   │   ├── formatters.ts                       # Data formatting utilities
│   │   ├── validators.ts                       # Input validation functions
│   │   ├── exportHelpers.ts                    # CSV/PDF export utilities
│   │   └── chartHelpers.ts                     # Chart configuration helpers
│   │
│   └── types/
│       ├── dashboard.ts                        # Dashboard-related types
│       ├── auth.ts                             # Authentication types
│       ├── campaign.ts                         # Campaign data types
│       ├── customer.ts                         # Customer data types
│       ├── payment.ts                          # Payment data types
│       └── chart.ts                            # Chart configuration types
│
├── middleware.ts                               # Next.js middleware for auth
├── tailwind.config.ts                         # TailwindCSS configuration
├── tsconfig.json                               # TypeScript configuration
├── next.config.ts                              # Next.js configuration
├── package.json                                # Project dependencies
└── README.md                                   # Project documentation
```

## Dashboard Components Overview

### 1. ROI Calculator Dashboard
- **Location**: `app/dashboards/roi-calculator/page.tsx`
- **Components**: Input form, KPI cards, bar chart, export buttons
- **Roles**: Founder, Marketer, Analyst
- **Features**: Real-time ROI calculation, data export

### 2. Insights Dashboard
- **Location**: `app/dashboards/insights/page.tsx`
- **Components**: Line chart, data table, AI recommendation cards
- **Roles**: Founder, Marketer, Analyst
- **Features**: Platform filtering, AI recommendations, drill-down views

### 3. Campaign Performance Dashboard
- **Location**: `app/dashboards/campaign-performance/page.tsx`
- **Components**: Stacked bar chart, KPI cards, performance table
- **Roles**: Founder, Marketer
- **Features**: Campaign comparison, date filtering, performance alerts

### 4. Customer Segmentation Dashboard
- **Location**: `app/dashboards/customer-segmentation/page.tsx`
- **Components**: Pie chart, segmentation table, demographic filters
- **Roles**: Founder, Analyst
- **Features**: Segment analysis, ROI contribution, AI suggestions

### 5. Payments & Reports Dashboard
- **Location**: `app/dashboards/payments-reports/page.tsx`
- **Components**: Transaction table, revenue line chart, export functionality
- **Roles**: Founder, Admin
- **Features**: Payment history, financial reports, data export

## Role-Based Access Control

### Role Definitions
- **Founder**: Full access to all dashboards
- **Marketer**: Access to ROI Calculator, Insights, Campaign Performance
- **Analyst**: Access to ROI Calculator, Insights, Customer Segmentation
- **Admin**: Access to Payments & Reports, User Management

### Implementation
- **Route Protection**: Middleware-based access control
- **Component Guards**: Role-based component rendering
- **Context Provider**: Centralized authentication state management

## Key Features

### Charts & Visualizations
- **Chart.js**: Line charts for trends and time series
- **Recharts**: Bar charts, pie charts, stacked charts for categorical data
- **Responsive Design**: All charts adapt to screen size
- **Interactive**: Hover states, click events, drill-down capabilities

### Data Export
- **CSV Export**: Raw data export for spreadsheet analysis
- **PDF Export**: Formatted reports for presentations
- **Custom Formats**: Role-based export permissions

### State Management
- **React Context**: Authentication and user state
- **Custom Hooks**: Data fetching and business logic
- **Local State**: Component-specific form and filter states

### Responsive Design
- **Mobile-First**: TailwindCSS responsive utilities
- **Grid Layouts**: Flexible component arrangements
- **Touch-Friendly**: Mobile-optimized interactions

## Development Guidelines

### Code Organization
- One component per file with clear naming conventions
- Shared logic in custom hooks
- Type definitions in dedicated files
- Mock data separate from production code

### Performance
- Lazy loading for dashboard routes
- Memoization for expensive calculations
- Optimized chart rendering
- Efficient state updates

### Testing Strategy
- Unit tests for calculation utilities
- Component tests for UI interactions
- Integration tests for role-based access
- E2E tests for complete user flows

### Accessibility
- ARIA labels for screen readers
- Keyboard navigation support
- Color contrast compliance
- Focus management for modals

This structure ensures maintainability, scalability, and follows Next.js best practices while implementing all requirements from the JSON specification.