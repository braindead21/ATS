# ATS Project Structure

## Overview
Enterprise-grade Next.js App Router application with role-based access control and domain-driven design.

## Directory Structure

```
ATS/
├── app/                          # Next.js App Router
│   ├── (auth)/                   # Authentication routes (public)
│   │   └── login/
│   ├── (admin)/                  # Admin role routes (protected)
│   │   ├── dashboard/
│   │   ├── companies/
│   │   ├── analytics/
│   │   └── users/
│   ├── (leader)/                 # Leader role routes (protected)
│   │   ├── dashboard/
│   │   ├── companies/
│   │   ├── job-orders/
│   │   └── candidates/
│   ├── (recruiter)/              # Recruiter role routes (protected)
│   │   ├── dashboard/
│   │   ├── job-orders/
│   │   └── candidates/
│   └── api/                      # API routes (mock for now)
│       ├── auth/
│       ├── companies/
│       ├── job-orders/
│       ├── candidates/
│       ├── interviews/
│       └── analytics/
│
├── components/                   # Reusable UI components
│   ├── ui/                       # shadcn/ui components
│   ├── layout/                   # Layout components (Header, Sidebar, etc.)
│   ├── forms/                    # Generic form components
│   └── tables/                   # Data table components
│
├── features/                     # Domain-specific modules
│   ├── companies/
│   │   ├── components/           # Company-specific components
│   │   ├── hooks/                # Company-specific hooks
│   │   ├── services/             # Company API services
│   │   └── types/                # Company types/interfaces
│   ├── job-orders/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── services/
│   │   └── types/
│   ├── candidates/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── services/
│   │   └── types/
│   ├── interviews/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── services/
│   │   └── types/
│   └── analytics/
│       ├── components/
│       ├── hooks/
│       ├── services/
│       └── types/
│
├── lib/                          # Core utilities & helpers
│   ├── permissions/              # Role-based access control
│   ├── constants/                # App-wide constants & enums
│   ├── utils/                    # Helper functions
│   └── validations/              # Zod/validation schemas
│
├── types/                        # Global TypeScript types
│   ├── index.ts                  # Common types
│   ├── api.ts                    # API response types
│   └── models.ts                 # Core data models
│
├── hooks/                        # Global custom React hooks
│   ├── useAuth.ts
│   ├── usePermissions.ts
│   └── useToast.ts
│
├── services/                     # Global API service layer
│   ├── api-client.ts             # Base API client
│   └── auth.service.ts           # Authentication service
│
└── public/                       # Static assets
    ├── images/
    └── icons/
```

## Architecture Principles

### 1. **Route Groups (Role-Based)**
- `(auth)` - Public authentication routes
- `(admin)` - Admin-only protected routes
- `(leader)` - Leader-only protected routes
- `(recruiter)` - Recruiter-only protected routes

### 2. **Domain-Driven Features**
Each feature module contains:
- **components/**: UI specific to that domain
- **hooks/**: Business logic and state management
- **services/**: API communication
- **types/**: Domain-specific TypeScript definitions

### 3. **Separation of Concerns**
- **components/**: Pure presentational components
- **features/**: Domain logic with components
- **lib/**: Business rules, permissions, utilities
- **types/**: Type definitions
- **services/**: Data fetching layer

### 4. **Scalability**
- Easy to add new features as modules
- Clear boundaries between domains
- Backend migration path via services layer
- Testable architecture

## Key Files to Create

### Global Types (`types/`)
- **index.ts**: Common types (Role, User, Pagination, etc.)
- **models.ts**: Core data models (Company, JobOrder, Candidate, etc.)
- **api.ts**: API request/response types

### Constants (`lib/constants/`)
- **roles.ts**: User role definitions
- **statuses.ts**: All status enums (Candidate, Interview, etc.)
- **permissions.ts**: Permission matrices

### Core Utilities (`lib/`)
- **permissions/rbac.ts**: Role-based access control logic
- **utils/cn.ts**: Class name utilities
- **validations/schemas.ts**: Form validation schemas

## Development Flow

1. Define types in `types/` and `lib/constants/`
2. Create API services in `features/*/services/`
3. Build feature-specific components in `features/*/components/`
4. Create custom hooks in `features/*/hooks/`
5. Compose pages in `app/(role)/*/page.tsx`

## Migration Path

When adding a real backend:
1. Replace mock data in `app/api/` with real implementations
2. Update service layer in `services/` and `features/*/services/`
3. No changes needed in components or UI layer

## Notes

- Use **absolute imports** via TypeScript paths
- Follow **shadcn/ui** component patterns
- Enforce **role-based access** at route and component level
- Use **enums** for statuses, not strings
- Keep **business rules** in lib/permissions and lib/validations
