# Professional Invoice System

A comprehensive, production-ready invoice management system built with Next.js, TypeScript, and Tailwind CSS. This system provides a complete solution for creating, managing, and tracking invoices with modern design and API integration capabilities.

## 🌟 Features

### Core Features
- **Professional Invoice Template**: Clean, modern black and white design matching the provided mockup
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Print-Friendly Layout**: Optimized for A4 printing with proper styling
- **Dynamic Calculations**: Automatic subtotal, tax, and grand total calculations
- **Real-time Updates**: Live status updates and data synchronization
- **Export Capabilities**: Print and PDF export functionality (ready for integration)

### Management Features
- **Invoice List View**: Complete invoice management dashboard
- **Status Tracking**: Draft, Sent, Paid, and Overdue status management
- **Search & Filter**: Advanced filtering by status and client information
- **Statistics Dashboard**: Financial overview with paid, pending, and overdue amounts
- **API Integration**: Complete REST API with CRUD operations

### Technical Features
- **TypeScript Support**: Full type safety and IntelliSense
- **Component Architecture**: Modular, reusable React components
- **API-First Design**: RESTful API endpoints ready for production
- **Error Handling**: Comprehensive error handling and validation
- **Accessibility**: WCAG compliant with proper ARIA labels and semantic HTML

## 📁 Project Structure

```
app/
├── components/invoice/           # Invoice-specific components
│   ├── InvoiceTemplate.tsx      # Main invoice template
│   ├── InvoiceHeader.tsx        # Header with company/client info
│   ├── InvoiceItemsTable.tsx    # Items table with calculations
│   ├── InvoiceTotals.tsx        # Subtotal, tax, and total display
│   └── InvoiceFooter.tsx        # Payment info, terms, and signature
├── lib/
│   ├── types/invoice.ts         # TypeScript interfaces
│   ├── utils/invoice.ts         # Utility functions
│   └── data/sampleInvoice.ts    # Sample data for testing
├── api/invoices/                # API routes
│   ├── route.ts                 # List, create, bulk operations
│   └── [id]/route.ts           # Individual invoice operations
└── invoice/                     # Invoice pages
    ├── page.tsx                 # Invoice preview page
    └── list/page.tsx           # Invoice management dashboard
```

## 🚀 Quick Start

### 1. View Sample Invoice
Navigate to `/invoice` to see the professional invoice template with sample data:
- **Design Agency Sample**: Creative services invoice
- **Tech Services Sample**: Technology consulting invoice

### 2. Invoice Management
Visit `/invoice/list` to see the complete invoice management system:
- View all invoices in a sortable table
- Filter by status (Draft, Sent, Paid, Overdue)
- Search by client name or invoice number
- Real-time statistics and financial overview

### 3. API Integration
The system includes complete API endpoints for production use:

**Base URL**: `/api/invoices`

#### Endpoints:
- `GET /api/invoices` - List all invoices with pagination and filtering
- `POST /api/invoices` - Create new invoice
- `GET /api/invoices/[id]` - Get specific invoice
- `PUT /api/invoices/[id]` - Update invoice
- `PATCH /api/invoices/[id]` - Update specific fields (e.g., status)
- `DELETE /api/invoices/[id]` - Delete invoice

## 📊 Data Model

### Core Interfaces

```typescript
interface IInvoice {
  id: string;
  invoiceNumber: string;
  issueDate: Date;
  dueDate: Date;
  status: 'draft' | 'sent' | 'paid' | 'overdue';
  client: IClient;
  vendor: IVendor;
  items: IInvoiceItem[];
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  total: number;
  currency: string;
  termsAndConditions: string;
  signature: ISignature;
}
```

### Sample API Requests

#### Create Invoice
```javascript
POST /api/invoices
{
  "client": {
    "name": "Acme Corp",
    "address": "123 Business St",
    "phone": "+1 555-0123"
  },
  "items": [
    {
      "description": "Web Development",
      "unitPrice": 100,
      "quantity": 10
    }
  ],
  "dueDate": "2024-02-15T00:00:00.000Z",
  "taxRate": 10
}
```

#### Update Invoice Status
```javascript
PATCH /api/invoices/inv-001
{
  "status": "paid"
}
```

## 🎨 Design System

### Color Scheme
- **Primary**: `#111827` (Gray-900) - Headers, emphasis
- **Secondary**: `#F3F4F6` (Gray-100) - Backgrounds
- **Text Primary**: `#111827` - Main text
- **Text Secondary**: `#6B7280` - Supporting text
- **Border**: `#E5E7EB` - Dividers and borders
- **Background**: `#FFFFFF` - Main background

### Typography
- **Headers**: Bold, proper hierarchy (H1-H3)
- **Body Text**: Regular weight, optimal line height
- **Labels**: Uppercase, tracked spacing for form labels
- **Numbers**: Tabular figures for consistent alignment

### Layout
- **Max Width**: `max-w-4xl` (896px) for optimal readability
- **Grid System**: CSS Grid with responsive breakpoints
- **Spacing**: Consistent 8px grid system
- **Print Layout**: A4 optimized with proper margins

## 🔧 Customization

### Branding
1. **Company Logo**: Replace logo URL in vendor data
2. **Company Colors**: Update color scheme in components
3. **Typography**: Modify font families in Tailwind config
4. **Layout**: Adjust grid systems and spacing

### Business Logic
1. **Tax Calculation**: Modify `calculateTax` function
2. **Currency Format**: Update `formatCurrency` with locale settings
3. **Invoice Numbering**: Customize `generateInvoiceNumber` pattern
4. **Date Formats**: Adjust `formatDate` function for regional preferences

### Integration Points
1. **Database**: Replace mock data with real database connections
2. **Payment Processing**: Add payment gateway integration
3. **Email**: Integrate email service for invoice delivery
4. **PDF Generation**: Add PDF generation library (jsPDF, Puppeteer)
5. **Authentication**: Add user authentication and permissions

## 📱 Responsive Features

### Mobile Optimizations
- **Stacked Layout**: Single-column layout on small screens
- **Touch-Friendly**: Large tap targets and proper spacing
- **Simplified Tables**: Card-based layout for mobile devices
- **Essential Information**: Key details prominently displayed

### Print Optimizations
- **A4 Format**: Optimized for standard paper size
- **Print Styles**: Hide non-essential elements
- **Page Breaks**: Proper content flow across pages
- **High Contrast**: Optimized for black and white printing

## 🔒 Security & Validation

### Input Validation
- **Required Fields**: Client information and items validation
- **Number Formats**: Proper validation for prices and quantities
- **Email Format**: Valid email address validation
- **Phone Format**: International phone number support

### API Security
- **Error Handling**: Comprehensive error responses
- **Data Validation**: Server-side validation for all inputs
- **Type Safety**: Full TypeScript coverage
- **Sanitization**: Input sanitization and XSS protection

## 🧪 Testing Data

The system includes comprehensive sample data for testing:

### Sample Invoice 1 - Design Agency
- **Client**: Real Estate Agency
- **Services**: Logo Design, Flyer Design, Business Cards
- **Total**: $545.00
- **Status**: Sent

### Sample Invoice 2 - Tech Services
- **Client**: Tech Startup Inc.
- **Services**: Website Design, Mobile App, Branding
- **Total**: $5,533.50
- **Status**: Draft

## 🚀 Production Deployment

### Environment Setup
1. **Database**: Configure your preferred database (PostgreSQL, MongoDB, etc.)
2. **Environment Variables**: Set up production environment variables
3. **API Keys**: Configure any external service API keys
4. **CORS**: Set up proper CORS policies for your domain

### Performance Optimizations
- **Image Optimization**: Use Next.js Image component for logos and signatures
- **Caching**: Implement proper caching strategies for API responses
- **Bundle Size**: Tree-shaking and code splitting are already configured
- **Database Queries**: Optimize queries with proper indexing

## 📚 Dependencies

### Required
- **Next.js 15+**: React framework with App Router
- **React 19+**: User interface library
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first CSS framework

### Optional (for enhanced features)
- **react-to-print**: Enhanced printing capabilities
- **jsPDF**: PDF generation
- **html2canvas**: HTML to image conversion
- **date-fns**: Advanced date formatting
- **react-hook-form**: Form management
- **zod**: Schema validation

## 🤝 Contributing

When extending the invoice system:

1. **Type Safety**: Maintain TypeScript coverage
2. **Component Structure**: Keep components focused and reusable
3. **API Consistency**: Follow REST conventions
4. **Accessibility**: Maintain WCAG compliance
5. **Testing**: Add tests for new functionality
6. **Documentation**: Update this README with new features

## 📄 License

This invoice system is part of the Smartistics project and follows the project's licensing terms.

---

**Built with ❤️ using Next.js, TypeScript, and Tailwind CSS**

For support or questions about the invoice system, please refer to the main project documentation or create an issue in the project repository.