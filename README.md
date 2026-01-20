# 🚀 ATS System - Applicant Tracking System

A comprehensive, enterprise-grade Applicant Tracking System built with Next.js 15, TypeScript, and Tailwind CSS. Manage candidates, interviews, offers, and joining workflows with role-based access control.

[![Next.js](https://img.shields.io/badge/Next.js-15.5.9-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7.2-blue)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4.1-38bdf8)](https://tailwindcss.com/)

## ✨ Features

### 🔐 Authentication & Authorization
- **Login/Signup System** - Real authentication with localStorage persistence
- **Role-Based Access Control** - Admin, Leader, and Recruiter roles
- **Protected Routes** - Automatic redirects based on authentication status
- **Route Guards** - Prevent unauthorized access to role-specific pages

### 👥 User Management
- **Admin Dashboard** - Complete system overview and user management
- **Leader Dashboard** - Team oversight and job order management
- **Recruiter Dashboard** - Assigned jobs and candidate pipeline

### 🏢 Company Management
- Create and manage client companies
- Track company details and contact information
- View all job orders per company

### 💼 Job Order Management
- Create job requisitions with detailed requirements
- Assign recruiters to job orders
- Track job status and requirements
- View candidate pipeline per job

### 👨‍💼 Candidate Management
- **Add Candidates** - Comprehensive candidate profiles with resume upload
- **Pipeline Tracking** - Track candidates through multiple stages:
  - Sourced → Screening → Interview → Offer → Joined
- **Phase-Based Workflow** - Stage-specific actions and validations
- **Candidate History** - Complete audit trail of all activities

### 📅 Interview Management
- **Multi-Level Interviews** - HR, Technical, Managerial rounds
- **Schedule Interviews** - Date, time, and interviewer assignment
- **Decision-Driven Workflow** - Select, Reject, or Hold after each round
- **Automatic Progression** - Candidates auto-advance based on decisions
- **Interview Timeline** - Visual timeline of all interview rounds

### 💰 Offer Management
- **Create Offers** - Generate detailed offer letters
- **Offer Negotiation** - Track offer status (Pending, Accepted, Rejected)
- **Conditional Offers** - Handle counter-offers and negotiations
- **Offer History** - Track all offer revisions

### 🎯 Joining Workflow
- **Joining Date Management** - Set and track joining dates
- **Pre-Joining Tasks** - Document collection and verification
- **Joining Status** - Track actual joining vs. planned date
- **Post-Joining Tracking** - Record actual join date and status

### 📊 Dashboard & Analytics
- **Real-time Stats** - Job assignments, candidates, interviews
- **Pipeline Metrics** - Conversion rates across stages
- **Upcoming Interviews** - Calendar view of scheduled interviews
- **Activity Feed** - Recent actions and updates

## 🛠️ Tech Stack

- **Framework:** Next.js 15.5.9 (App Router)
- **Language:** TypeScript 5.7.2
- **Styling:** Tailwind CSS 3.4.1
- **Icons:** Lucide React
- **Date Handling:** date-fns
- **State Management:** React Context API
- **Storage:** localStorage (mock persistence)

## 📋 Prerequisites

- **Node.js** 18.0.0 or higher
- **npm** or **yarn** package manager

## 🚀 Getting Started

### 1. Clone the Repository
```bash
git clone https://github.com/braindead21/ATS.git
cd ATS
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Run Development Server
```bash
npm run dev
```

The application will start at **http://localhost:3000**

### 4. Login with Demo Credentials

| Role | Email | Password |
|------|-------|----------|
| **Admin** | admin@ats.com | admin123 |
| **Leader** | leader@ats.com | leader123 |
| **Recruiter** | recruiter1@ats.com | recruiter123 |

## 📁 Project Structure

```
ATS/
├── app/                          # Next.js App Router pages
│   ├── admin/                   # Admin role routes
│   ├── leader/                  # Leader role routes
│   ├── recruiter/               # Recruiter role routes
│   ├── login/                   # Login page
│   ├── signup/                  # Signup page
│   └── page.tsx                 # Landing page
├── components/
│   ├── layout/                  # Header, Sidebar components
│   ├── ui/                      # Reusable UI components
│   └── RouteGuard.tsx          # Route protection wrapper
├── contexts/
│   └── AuthContext.tsx         # Authentication context
├── features/
│   ├── candidates/             # Candidate management
│   ├── companies/              # Company management
│   ├── interviews/             # Interview scheduling
│   ├── job-orders/             # Job order management
│   └── offers/                 # Offer management
├── hooks/
│   └── useAuth.ts              # Auth hook
├── lib/
│   ├── constants/              # Enums, navigation configs
│   ├── mock-data.ts           # Mock data for development
│   └── utils/                  # Utility functions
├── services/                    # API service layer
└── types/                       # TypeScript type definitions

## 🎯 Key Features by Role

### Admin
- Manage all companies and job orders
- View system-wide analytics
- User management (coming soon)
- Full access to all features

### Leader
- Create and manage companies
- Create job orders and assign recruiters
- Review all candidates and interviews
- Approve offers
- Team oversight

### Recruiter
- View assigned job orders
- Add candidates to assigned jobs
- Schedule interviews
- Update candidate status
- Create offer requests

## 🔄 Candidate Lifecycle

```
Sourced → Screening → Interview → Offer → Joined
```

1. **Sourced** - Candidate added to system
2. **Screening** - Initial screening and evaluation
3. **Interview** - Multi-level interview rounds (HR, Technical, Managerial)
4. **Offer** - Offer generation, negotiation, and acceptance
5. **Joined** - Joining date management and post-joining tracking

## 🔐 Authentication Flow

1. User visits landing page (`/`)
2. Clicks Login or Signup
3. Authenticated users redirected to role-based dashboard:
   - Admin → `/admin/dashboard`
   - Leader → `/leader/dashboard`
   - Recruiter → `/recruiter/dashboard`
4. Route guards prevent unauthorized access
5. Logout clears session and redirects to login

## 📦 Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm start        # Start production server
npm run lint     # Run ESLint
```

## 🌟 Future Enhancements

- [ ] Backend API integration (Node.js/Express or NestJS)
- [ ] Database integration (PostgreSQL/MongoDB)
- [ ] Real-time notifications
- [ ] Email integration for interview invites
- [ ] Document management system
- [ ] Advanced analytics and reporting
- [ ] Calendar integration (Google Calendar, Outlook)
- [ ] Resume parsing with AI
- [ ] Bulk candidate import
- [ ] Custom workflow builder

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 👨‍💻 Author

**Saurav Singh** ([@braindead21](https://github.com/braindead21))

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- UI components inspired by [shadcn/ui](https://ui.shadcn.com/)
- Icons by [Lucide](https://lucide.dev/)

---

**⭐ Star this repository if you find it helpful!**
