# 📊 Smartistics Dashboard System

A comprehensive, role-based analytics dashboard system built with Next.js, TypeScript, and React. This system provides real-time insights, ROI tracking, and performance analytics for digital marketing campaigns.

## 🚀 Features

### ✅ **Core Dashboard Features**
- **Real-time Analytics** - Live data updates and comprehensive reporting
- **ROI Tracking** - Precise return on investment calculations across platforms
- **AI-Powered Insights** - Machine learning recommendations and pattern discovery
- **Multi-Platform Support** - Facebook, Google, Instagram, TikTok, LinkedIn analytics
- **Role-Based Access Control** - Customized dashboards based on user roles
- **Interactive Charts** - Beautiful, responsive data visualizations
- **Export Functionality** - PDF and CSV export capabilities
- **Mobile Responsive** - Optimized for all devices

### 🎯 **Available Dashboards**
1. **Main Dashboard** (`/dashboard`) - Comprehensive overview with key metrics
2. **ROI Calculator** (`/dashboards/roi-calculator`) - Advanced ROI calculations
3. **Insights** (`/dashboards/insights`) - AI-powered analytics insights
4. **Campaign Performance** (`/dashboards/campaign-performance`) - Campaign tracking
5. **Customer Segmentation** (`/dashboards/customer-segmentation`) - Audience analysis
6. **Payments & Reports** (`/payments`) - Financial transactions and reporting

## 📁 File Structure

```
app/
├── dashboard/                  # Main dashboard
│   ├── page.tsx               # Dashboard homepage
│   └── layout.tsx             # Dashboard layout wrapper
├── dashboards/                 # Individual dashboard pages
│   ├── layout.tsx             # Shared dashboard layout
│   └── roi-calculator/
│       └── page.tsx           # ROI Calculator dashboard
├── payments/                   # Payments & Reports
│   └── page.tsx               # Payments dashboard
├── lib/
│   └── auth/
│       └── roleConfig.ts      # Role-based access configuration
└── components/                 # Reusable dashboard components
    ├── auth/
    │   └── ProtectedRoute.tsx # Route protection
    └── charts/                # Chart components
```

## 🔐 Role-Based Access Control

### **User Roles & Permissions**

| Role | Dashboard Access | Export | User Management | Payments |
|------|-----------------|---------|----------------|----------|
| **Founder** | All Dashboards | ✅ | ✅ | ✅ |
| **Marketer** | Dashboard, ROI, Insights, Campaigns | ✅ | ❌ | ❌ |
| **Analyst** | Dashboard, ROI, Insights, Segmentation | ✅ | ❌ | ❌ |
| **Admin** | Dashboard, Payments & Reports | ✅ | ✅ | ✅ |

### **Dashboard Access Matrix**

```typescript
// Available dashboards per role
Founder: ["Dashboard", "ROI Calculator", "Insights", "Campaign Performance", "Customer Segmentation", "Payments & Reports"]
Marketer: ["Dashboard", "ROI Calculator", "Insights", "Campaign Performance"]
Analyst: ["Dashboard", "ROI Calculator", "Insights", "Customer Segmentation"]
Admin: ["Dashboard", "Payments & Reports"]
```

## 🛠️ Setup & Installation

### **1. Prerequisites**
- Node.js 18+ 
- Next.js 14+
- TypeScript
- Tailwind CSS
- Recharts library

### **2. Dependencies Installation**
```bash
npm install recharts
npm install @types/react @types/node
npm install tailwindcss
```

### **3. Environment Setup**
Create `.env.local` file:
```env
NEXT_PUBLIC_APP_NAME=Smartistics
NEXT_PUBLIC_API_URL=your_api_endpoint
```

## 🎨 Usage Guide

### **Accessing Dashboards**

1. **Login Flow**
   ```
   Landing Page (/) → Login (/login) → Dashboard (/dashboard)
   ```

2. **Navigation**
   - Use sidebar navigation for different dashboards
   - Role-based menu items automatically filtered
   - Mobile-responsive hamburger menu

3. **Dashboard Features**
   - **Time Range Selector**: 7d, 30d, 90d options
   - **Interactive Charts**: Click, hover, and zoom functionality
   - **Export Options**: PDF/CSV download buttons
   - **Real-time Updates**: Auto-refreshing data

### **Key Metrics Displayed**

#### **Main Dashboard**
- Total Revenue with growth percentage
- ROI percentage and trends
- Conversion counts and rates
- Ad spend tracking
- Platform performance breakdown
- Recent activity feed
- Monthly goal progress

#### **Charts Available**
- **Area Charts**: Revenue trends over time
- **Pie Charts**: Platform performance distribution
- **Bar Charts**: Conversions and ROI comparisons
- **Progress Circles**: Goal achievement tracking

## 📊 Data Integration

### **Mock Data Structure**
```typescript
interface DashboardMetric {
  title: string;
  value: string;
  change: string;
  changeType: "increase" | "decrease" | "neutral";
  icon: React.ReactNode;
  color: string;
}

interface ChartData {
  name: string;
  revenue: number;
  conversions: number;
  roi: number;
  adSpend: number;
}
```

### **API Integration Points**
Replace mock data with real API calls:

```typescript
// In your dashboard component
useEffect(() => {
  const fetchDashboardData = async () => {
    const response = await fetch('/api/dashboard-metrics');
    const data = await response.json();
    setMetrics(data.metrics);
    setChartData(data.chartData);
  };
  
  fetchDashboardData();
}, [timeRange]);
```

## 🎯 Customization

### **Adding New Dashboard**

1. **Create Dashboard Component**
```typescript
// app/dashboards/new-dashboard/page.tsx
"use client";
import React from 'react';
import ProtectedRoute from '../../components/auth/ProtectedRoute';

const NewDashboard = () => {
  return (
    <ProtectedRoute requiredDashboard="New Dashboard">
      <div>Your dashboard content</div>
    </ProtectedRoute>
  );
};

export default NewDashboard;
```

2. **Update Role Configuration**
```typescript
// app/lib/auth/roleConfig.ts
export type DashboardName = 
  | "Dashboard"
  | "ROI Calculator"
  | "New Dashboard"  // Add here
  // ... other dashboards

export const DASHBOARD_ROUTES: Record<DashboardName, string> = {
  "New Dashboard": "/dashboards/new-dashboard",  // Add route
  // ... other routes
};
```

3. **Add Icon to Layout**
```typescript
// app/dashboards/layout.tsx
case "New Dashboard":
  return <YourIconSVG className="w-5 h-5" />;
```

### **Styling Customization**

#### **Color Scheme**
```css
/* Custom colors in tailwind.config.js */
theme: {
  extend: {
    colors: {
      primary: '#3B82F6',      // Blue
      secondary: '#10B981',    // Green
      accent: '#8B5CF6',       // Purple
      warning: '#F59E0B',      // Orange
    }
  }
}
```

#### **Component Styling**
- All components use Tailwind CSS classes
- Responsive design with `sm:`, `md:`, `lg:` prefixes
- Hover effects with `hover:` prefix
- Transitions with `transition-all` classes

## 🔧 Advanced Configuration

### **Chart Customization**
```typescript
// Custom chart colors and styling
const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#8B5CF6'];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border rounded-lg shadow-lg">
        <p className="font-medium">{label}</p>
        {payload.map((entry, index) => (
          <p key={index} style={{ color: entry.color }}>
            {entry.dataKey}: {entry.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};
```

### **Protected Routes Setup**
```typescript
// Wrap sensitive components
<ProtectedRoute requiredDashboard="Dashboard Name">
  <YourComponent />
</ProtectedRoute>
```

## 📱 Mobile Responsiveness

### **Breakpoints**
- `sm`: 640px and up
- `md`: 768px and up  
- `lg`: 1024px and up
- `xl`: 1280px and up

### **Mobile Features**
- Collapsible sidebar with overlay
- Touch-friendly charts
- Responsive grid layouts
- Mobile-optimized metrics cards

## 🐛 Troubleshooting

### **Common Issues**

#### **Dashboard Not Loading**
```bash
# Check if layout files exist
ls app/dashboard/layout.tsx
ls app/dashboards/layout.tsx

# Verify role configuration
console.log(getAvailableDashboards(userRole));
```

#### **Charts Not Rendering**
```bash
# Install recharts if missing
npm install recharts

# Check data structure
console.log('Chart data:', chartData);
```

#### **Permission Denied**
```typescript
// Debug role access
console.log('User role:', user?.role);
console.log('Available dashboards:', getAvailableDashboards(user?.role));
console.log('Has access:', hasAccess(user?.role, 'Dashboard Name'));
```

#### **Styling Issues**
```bash
# Rebuild Tailwind CSS
npm run build:css

# Check Tailwind config
npx tailwindcss init --full
```

## 🚀 Performance Optimization

### **Lazy Loading**
```typescript
// Lazy load dashboard components
const ROICalculator = lazy(() => import('./dashboards/roi-calculator/page'));

// Use Suspense wrapper
<Suspense fallback={<LoadingSpinner />}>
  <ROICalculator />
</Suspense>
```

### **Data Caching**
```typescript
// Use SWR or React Query for data fetching
import useSWR from 'swr';

const { data, error } = useSWR('/api/dashboard-data', fetcher, {
  refreshInterval: 30000 // Refresh every 30 seconds
});
```

## 📈 Analytics & Monitoring

### **User Interaction Tracking**
```typescript
// Track dashboard views
useEffect(() => {
  analytics.track('Dashboard Viewed', {
    dashboard: 'Main Dashboard',
    userRole: user?.role,
    timestamp: new Date()
  });
}, []);
```

### **Performance Metrics**
- Page load times
- Chart render times
- API response times
- User engagement metrics

## 🔗 API Integration

### **Expected API Endpoints**
```typescript
// Dashboard data
GET /api/dashboard-metrics?timeRange=30d
GET /api/revenue-data?timeRange=30d
GET /api/platform-performance
GET /api/recent-activities

// Payments
GET /api/payments/transactions
GET /api/payments/summary

// ROI Calculator
POST /api/roi-calculator
GET /api/roi-history
```

### **Response Formats**
```typescript
// Dashboard metrics response
{
  metrics: [
    {
      title: "Total Revenue",
      value: "$124,563",
      change: "+12.5%",
      changeType: "increase"
    }
  ],
  chartData: [
    { name: "Jan", revenue: 45000, conversions: 124 }
  ]
}
```

## 🛡️ Security Considerations

### **Route Protection**
- All dashboard routes protected with authentication
- Role-based access control enforced
- JWT token validation on each request

### **Data Sanitization**
- Input validation on all forms
- XSS protection with proper escaping
- CSRF protection enabled

## 📞 Support & Maintenance

### **For Developers**
- Follow TypeScript strict mode
- Use ESLint and Prettier for code formatting
- Write unit tests for critical components
- Document any new features added

### **For Business Users**
- Dashboard loads automatically after login
- Use time range selectors for different periods
- Export data using the export buttons
- Contact support for access level changes

## 🎉 Future Enhancements

### **Planned Features**
- [ ] Real-time WebSocket connections
- [ ] Advanced filtering options
- [ ] Custom dashboard builder
- [ ] Email report scheduling
- [ ] A/B testing insights
- [ ] Predictive analytics
- [ ] Multi-language support
- [ ] Dark mode toggle

### **Integration Roadmap**
- [ ] Stripe payment integration
- [ ] Google Analytics API
- [ ] Facebook Marketing API
- [ ] Slack notifications
- [ ] Zapier webhooks

---

## 📄 License & Credits

**Built with:**
- Next.js 14+ & TypeScript
- Tailwind CSS for styling  
- Recharts for data visualization
- React Context for state management

**Created by:** Smartistics Development Team  
**Last Updated:** January 2025  
**Version:** 2.0.0

For technical support, contact: dev@smartistics.com