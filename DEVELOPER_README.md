# Smartistics - Developer Documentation

**PRIVATE - FOR DEVELOPMENT TEAM USE ONLY**

## Project Structure

```
app/
├── api/            # API routes and handlers
├── components/     # Reusable components
├── lib/           # Utilities, hooks, and types
└── **/            # Page routes
```

## 🛣️ Route Structure

### Public Routes
- `/` - Landing page
- `/about` - About page
- `/login` - Authentication page

### Protected Routes

#### Dashboard Section
```
/dashboard                  # Main dashboard
/dashboard-new             # New dashboard implementation
/dashboards/
├── roi-calculator        # ROI calculation tools
└── subscription         # Subscription management
```

#### Invoice Management
```
/invoice
├── /                    # View/Create invoice
├── /list               # Invoice listing
├── /[id]              # Single invoice view
└── /test              # Invoice testing page
```

#### API Endpoints
```
/api/
├── invoices/
│   ├── /              # GET: List, POST: Create, DELETE: Batch delete
│   ├── [id]/          # GET: Read, PUT: Update, DELETE: Remove
│   └── [id]/history   # GET: Invoice history
├── mailing/           # Mailing list operations
└── subscription/
    ├── [userId]       # User subscription management
    └── upgrade        # Subscription upgrade handler
```

#### Payment & Subscription
```
/payment               # Payment processing
/payments             # Payment history
/subscription         # Subscription management
/subscription/upgrade # Upgrade flow
```

## 🔒 Authentication

- Using Clerk for authentication
- Protected routes require valid session
- Middleware at `/app/middleware.ts` handles auth checks
- `ProtectedRoute` component wraps secured pages

## 🔧 Development Setup

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
cp .env.example .env.local
```

Required variables:
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
- `CLERK_SECRET_KEY`
- `DATABASE_URL`

3. Run development server:
```bash
npm run dev
```

## 🏗️ Component Architecture

### Shared Components
- `/components/common/` - Base components
- `/components/charts/` - Data visualization
- `/components/auth/` - Authentication UI

### Feature Components
- `/components/invoice/` - Invoice generation/management
- `/components/payment/` - Payment processing
- `/components/dashboard/` - Dashboard widgets

## 🗄️ Data Management

### State Management
- React Query for server state
- React Context for auth/subscription state
- Local state with useState/useReducer

### API Response Types
```typescript
interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}
```

### Database Schema (JSON)
Located in `db.json`:
- Invoices
- Users
- Subscriptions
- Payments

## 🧪 Testing

```bash
# Run unit tests
npm test

# Run e2e tests
npm run test:e2e

# Run specific test file
npm test -- [filename]
```

## 🚀 Deployment

1. Build production:
```bash
npm run build
```

2. Environment checks:
```bash
npm run verify-env
```

3. Database migrations:
```bash
npm run migrate
```

## ⚠️ Common Issues & Solutions

1. Authentication Errors
   - Check Clerk key validity
   - Verify middleware configuration
   - Clear browser cookies/cache

2. API 500 Errors
   - Check database connectivity
   - Verify environment variables
   - Check JSON schema validation

3. Build Failures
   - Clear `.next` cache
   - Verify TypeScript types
   - Check for circular dependencies

## 🔍 Debugging

### VSCode Launch Configurations
```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Debug Next.js",
      "program": "${workspaceFolder}/node_modules/next/dist/bin/next",
      "args": ["dev"],
      "cwd": "${workspaceFolder}"
    }
  ]
}
```

### Browser DevTools
- Network tab for API calls
- React DevTools for component debugging
- Application tab for auth state

## 📊 Monitoring & Analytics

- Performance metrics in `/app/lib/utils/analytics.ts`
- Error tracking setup in `/app/lib/utils/errorTracking.ts`
- User behavior tracking in dashboard

## 🔐 Security Considerations

1. API Security
   - All routes use CSRF protection
   - Rate limiting on auth endpoints
   - Input validation with Zod

2. Data Protection
   - PII encryption in transit/rest
   - Sensitive data masking
   - Audit logging for changes

3. Access Control
   - Role-based access control
   - Resource-level permissions
   - Session management

## 🚥 CI/CD Pipeline

```yaml
stages:
  - lint
  - test
  - build
  - deploy
```

### Branch Strategy
- `main` - Production
- `staging` - Pre-production
- `develop` - Development
- Feature branches: `feature/*`
- Hotfixes: `hotfix/*`

## 📝 Code Style Guide

1. TypeScript
   - Strict mode enabled
   - Interface over type
   - Explicit return types

2. React
   - Functional components
   - Custom hooks for logic
   - Prop type validation

3. API
   - RESTful conventions
   - Consistent error format
   - Request validation

## 🎯 Performance Optimization

1. Code Splitting
   - Dynamic imports
   - Route-based splitting
   - Component lazy loading

2. Caching Strategy
   - API response caching
   - Static page generation
   - Browser caching headers

3. Bundle Optimization
   - Tree shaking enabled
   - Image optimization
   - Third-party script defer

## 📚 Additional Resources

- [Project Wiki](internal-link)
- [API Documentation](internal-link)
- [Design System](internal-link)
- [Architecture Diagrams](internal-link)

## 🔄 Update Process

1. Dependency Updates
   ```bash
   npm update
   npm audit fix
   ```

2. Schema Migrations
   ```bash
   npm run migrate:generate
   npm run migrate:up
   ```

3. Cache Clear
   ```bash
   npm run clean
   ```

## ⚡ Quick Commands

```bash
# Development
npm run dev           # Start dev server
npm run lint         # Run linter
npm run type-check   # Check types

# Testing
npm test            # Run all tests
npm run test:watch  # Watch mode
npm run test:coverage # Coverage report

# Building
npm run build      # Production build
npm run analyze    # Bundle analysis

# Maintenance
npm run clean      # Clear caches
npm run validate   # Full validation
```

## 🚨 Emergency Procedures

1. Rollback Process
   ```bash
   git reset --hard [commit]
   npm run deploy:rollback
   ```

2. Data Recovery
   ```bash
   npm run backup:restore [date]
   ```

3. Emergency Contacts
   - Lead Developer: [Contact]
   - DevOps: [Contact]
   - Security: [Contact]

---

**Note**: This documentation should be updated as the project evolves. Last updated: September 24, 2025