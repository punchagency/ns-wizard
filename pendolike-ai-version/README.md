# FlowPilot - Project & Finance Management SaaS

A modern, interactive SaaS web application for project and finance management, built with React, Tailwind CSS, and Framer Motion.

## 🚀 Features

### Marketing Pages
- **Landing Page** - Hero section, features preview, stats, and CTAs
- **Features** - Detailed feature showcase with icons and descriptions
- **Pricing** - Pricing plans with feature comparison and FAQ
- **About** - Company story, values, and team information
- **Contact** - Contact form and company information
- **Demo** - Interactive demo page to test app features

### Application Pages
- **Dashboard** - Overview with KPIs, revenue charts, and activity feed
- **Projects** - Manage projects with status tracking, progress bars, and filters
- **Project Details** - Detailed project view with tasks and activity feed
- **Invoices** - Invoice management with pagination and status filtering
- **Create Invoice** - Form to create new invoices
- **Analytics** - Revenue trends and project status breakdown with charts
- **Team** - Team member management with roles and status toggles
- **Settings** - Profile, company info, and preferences management

## 🛠 Tech Stack

- **React 18** - UI library
- **React Router** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Animation library
- **Recharts** - Chart library
- **Zustand** - State management (optional, currently using React state)
- **Vite** - Build tool and dev server
- **Lucide React** - Icon library

## 📦 Installation

1. Install dependencies:
```bash
npm install
```

2. Start development server:
```bash
npm run dev
```

3. Build for production:
```bash
npm run build
```

## 🏗 Project Structure

```
src/
├── components/
│   ├── layout/
│   │   ├── AppLayout.jsx
│   │   ├── Sidebar.jsx
│   │   └── Topbar.jsx
│   └── ui/
│       ├── Button.jsx
│       ├── Card.jsx
│       ├── Badge.jsx
│       ├── Input.jsx
│       ├── Textarea.jsx
│       ├── Select.jsx
│       ├── Modal.jsx
│       ├── ToastProvider.jsx
│       ├── LoadingSkeleton.jsx
│       └── EmptyState.jsx
├── pages/
│   ├── Dashboard.jsx
│   ├── Projects.jsx
│   ├── ProjectDetails.jsx
│   ├── Invoices.jsx
│   ├── CreateInvoice.jsx
│   ├── Analytics.jsx
│   ├── Team.jsx
│   └── Settings.jsx
├── services/
│   └── api.js
├── data/
│   └── mockData.js
├── App.jsx
├── main.jsx
└── index.css
```

## 🎨 UI Features

- Modern, polished design with soft shadows and rounded corners
- Smooth micro-animations using Framer Motion
- Loading skeletons for better UX
- Toast notifications for user feedback
- Empty states for lists
- Responsive design
- Hover effects and transitions
- Page transitions between routes

## 🔄 Mock API

All API calls are simulated with delays (500-1000ms) to mimic real API behavior. The mock API layer is located in `src/services/api.js` and uses mock data from `src/data/mockData.js`.

## 📝 Notes

- This is a standalone application with no backend
- All data is stored in memory and resets on page refresh
- Perfect for testing AI-powered walkthrough assistants
- No AI chatbot or walkthrough logic included (as requested)

## 🎯 Routes

### Marketing Routes
- `/` - Landing page
- `/features` - Features page
- `/pricing` - Pricing page
- `/about` - About page
- `/contact` - Contact page
- `/demo` - Interactive demo page

### Application Routes
- `/dashboard` - Main dashboard
- `/projects` - Projects list
- `/projects/:id` - Project details
- `/invoices` - Invoices list
- `/invoices/new` - Create invoice
- `/analytics` - Analytics dashboard
- `/team` - Team management
- `/settings` - Settings page

## 📄 License

MIT
