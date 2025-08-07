# ElNaizak Admin Panel

A comprehensive admin dashboard for managing the ElNaizak multi-service platform.

## Features

### 🏠 Dashboard
- **Overview Statistics**: Real-time stats for customers, captains, vendors, and orders
- **Quick Actions**: Direct access to key management functions
- **Recent Activity**: Latest platform activities and updates
- **Revenue Tracking**: Visual charts and growth metrics

### 👥 User Management

#### Customers
- **List View**: View all customers with filtering and pagination
- **Add New**: Register new customers
- **Status Management**: Activate/deactivate customer accounts
- **Statistics**: Active vs deactivated customer counts

#### Captains (Drivers)
- **List View**: Manage all captains with detailed information
- **Add New**: Register new captains with vehicle information
- **Pending Captains**: Review and approve captain applications
- **Status Management**: Approve, reject, or deactivate captains
- **Vehicle Information**: Track captain vehicle details

#### Vendors
- **List View**: Manage all vendors and their shops
- **Add New**: Register new vendors
- **Pending Vendors**: Review and approve vendor applications
- **Shop Management**: Track shop information and products
- **Status Management**: Approve, reject, or deactivate vendors

### 📦 Order Management
- **Order List**: View all orders with filtering by status
- **Order Details**: Track order progress and items
- **Status Updates**: Update order status (pending, confirmed, completed, cancelled)
- **Statistics**: Order counts by status
- **Customer & Vendor Info**: Link orders to customers and vendors

### 💬 Support System
- **Chat Support**: Real-time messaging with customers, vendors, and captains
- **Chat Management**: View and respond to support requests
- **Status Tracking**: Track chat status (open, pending, closed)
- **Search & Filter**: Find specific conversations quickly

### ⚙️ Settings
- **General Settings**: Site configuration, contact information, timezone
- **Notification Settings**: Email, SMS, and push notification preferences
- **Security Settings**: Session timeout, 2FA, password policies
- **Appearance Settings**: Theme, colors, sidebar preferences
- **System Information**: Backend status and quick actions

### 📊 Analytics
- **Revenue Analytics**: Track revenue growth and trends
- **Top Performers**: Best vendors and products
- **Platform Metrics**: Customer retention, satisfaction scores
- **Service Distribution**: Breakdown by service type
- **Export & Reports**: Generate detailed reports

## Technology Stack

- **Frontend**: Next.js 15, React 19, Tailwind CSS
- **Icons**: React Icons
- **HTTP Client**: Axios
- **Styling**: Custom CSS with Tailwind utilities

## Getting Started

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Environment Variables**:
   Create a `.env.local` file:
   ```
   NEXT_PUBLIC_BACKEND_URL=http://localhost:5000
   ```

3. **Run Development Server**:
```bash
npm run dev
   ```

4. **Build for Production**:
   ```bash
   npm run build
   npm start
   ```

## API Integration

The admin panel integrates with the ElNaizak backend API:

### Endpoints Used
- `/api/customers/*` - Customer management
- `/api/captain/*` - Captain management  
- `/api/vendor/*` - Vendor management
- `/api/orders/*` - Order management
- `/api/chat/*` - Support chat system
- `/api/analytics/*` - Analytics data

### Authentication
- JWT token-based authentication
- Role-based access control
- Session management

## File Structure

```
admin-panel/
├── app/
│   ├── page.js                 # Dashboard
│   ├── customers/              # Customer management
│   ├── captains/               # Captain management
│   ├── vendors/                # Vendor management
│   ├── orders/                 # Order management
│   ├── support/                # Support system
│   ├── analytics/              # Analytics dashboard
│   └── settings/               # System settings
├── components/
│   └── navigation/             # Navigation components
├── public/                     # Static assets
└── styles/                     # Global styles
```

## Key Features

### Responsive Design
- Mobile-friendly interface
- Responsive tables and charts
- Adaptive navigation

### Real-time Updates
- Live chat functionality
- Real-time statistics
- Instant status updates

### Data Management
- Pagination for large datasets
- Search and filtering
- Export capabilities
- Bulk operations

### Security
- Input validation
- XSS protection
- CSRF protection
- Secure API communication

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is part of the ElNaizak platform.
