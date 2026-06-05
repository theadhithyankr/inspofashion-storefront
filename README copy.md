# Direct-to-WhatsApp E-Commerce Platform

A complete e-commerce solution for clothing stores that sell through WhatsApp. This project consists of two applications:

## 🎯 Applications

### 1. Admin Dashboard (`/admin`)

Internal tool for store owners to manage their product catalog:

- Secure login with Supabase authentication
- Add, edit, delete products
- Upload product images
- Toggle product visibility (Active/Inactive)
- Manage pricing, sizes, descriptions

### 2. Customer Storefront (`/storefront`)

Public-facing mobile-first e-commerce website:

- Browse product catalog
- Filter by category
- View product details
- Add items to cart (with size selection)
- Checkout via WhatsApp redirect

## 🛠️ Tech Stack

- **Frontend**: React 18 + Vite
- **Styling**: Tailwind CSS
- **Icons**: lucide-react
- **Backend**: Supabase (PostgreSQL + Storage + Auth)
- **State Management**: React Context API
- **Routing**: React Router (Admin only)

## 📋 Getting Started

### Prerequisites

- Node.js 18+ and npm
- Supabase account
- Supabase CLI (optional but recommended)
- Git (optional)

### 1. Supabase Setup

**Choose one method:**

#### Method A: Automated CLI Setup (⚡ Recommended)

Much faster! One command sets up everything:

- Follow **`SUPABASE_CLI_SETUP.md`** for automated setup using Supabase CLI
- Creates database, policies, storage bucket with one command
- Version controlled migrations

#### Method B: Manual Dashboard Setup

Traditional approach:

- Follow **`SUPABASE_SETUP.md`** for step-by-step manual setup
- Click through dashboard to configure everything
- Good for understanding how things work

### 2. Admin Dashboard Setup

```bash
cd admin
npm install

# Create environment file
cp .env.example .env.local

# Add your Supabase credentials to .env.local
# VITE_SUPABASE_URL=your_supabase_project_url
# VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Start development server
npm run dev
```

The admin dashboard will be available at `http://localhost:5173`

### 3. Customer Storefront Setup

```bash
cd storefront
npm install

# Create environment file
cp .env.example .env.local

# Add your Supabase credentials and WhatsApp number to .env.local
# VITE_SUPABASE_URL=your_supabase_project_url
# VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
# VITE_WHATSAPP_PHONE=919876543210  # Your WhatsApp number with country code

# Start development server
npm run dev
```

The storefront will be available at `http://localhost:5174`

## 🚀 Deployment

### Build for Production

```bash
# Admin Dashboard
cd admin
npm run build

# Customer Storefront
cd storefront
npm run build
```

### Deploy to Vercel/Netlify

Both applications can be deployed independently:

**Vercel:**

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy admin
cd admin
vercel

# Deploy storefront
cd storefront
vercel
```

**Netlify:**

- Connect your GitHub repository to Netlify
- Set build command: `npm run build`
- Set publish directory: `dist`
- Add environment variables in Netlify dashboard

Remember to add your production URLs to Supabase "Allowed Redirect URLs" in the Authentication settings.

## 📁 Project Structure

```
newspofashions/
├── admin/                 # Admin Dashboard Application
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── contexts/      # Auth context
│   │   ├── hooks/         # Custom hooks
│   │   ├── lib/           # Supabase client
│   │   ├── pages/         # Page components
│   │   ├── services/      # API services
│   │   └── utils/         # Utility functions
│   └── package.json
│
├── storefront/            # Customer Storefront Application
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── contexts/      # Cart context
│   │   ├── hooks/         # Custom hooks
│   │   ├── lib/           # Supabase client
│   │   ├── pages/         # Page components
│   │   ├── services/      # API services
│   │   └── utils/         # Utility functions
│   └── package.json
│
├── README.md              # This file
├── TASK.md               # Progress tracking
└── SUPABASE_SETUP.md     # Supabase configuration guide
```

## 🔒 Security

- Admin dashboard protected by Supabase Email/Password authentication
- Row Level Security (RLS) policies ensure:
  - Authenticated admins have full CRUD access
  - Public users can only read active products
- Environment variables for sensitive credentials
- Image uploads validated client-side before storage

## 📱 Features

### Admin Dashboard

- ✅ Secure authentication
- ✅ Product CRUD operations
- ✅ Image upload to Supabase Storage
- ✅ Toggle product visibility (Active/Inactive)
- ✅ Responsive design (mobile/tablet/desktop)
- ✅ Real-time product management

### Customer Storefront

- ✅ Browse active products
- ✅ Filter by category (client-side)
- ✅ Product detail view with size selection
- ✅ Shopping cart with localStorage persistence
- ✅ Quantity management
- ✅ WhatsApp checkout (no payment gateway)
- ✅ Mobile-first responsive design

## 🤝 How It Works

1. **Admin** logs into the dashboard and adds products (images, prices, descriptions, sizes)
2. **Admin** toggles products as "Active" to make them visible on the storefront
3. **Customers** browse the storefront, add items to cart with size selection
4. **Customers** click "Checkout via WhatsApp" to send order details to store's WhatsApp
5. **Store owner** receives WhatsApp message with order and completes sale offline

## 📄 License

This project is created for internal business .
