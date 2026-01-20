# ATS System - Phase 1 Setup Guide

## Prerequisites
- Node.js 18+ installed
- npm or yarn package manager

## Installation Steps

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Development Server
```bash
npm run dev
```

The application will start at `http://localhost:3000`

## Testing Different Roles

To test different user roles, edit the mock user in:
**File:** `hooks/useAuth.ts`

Change the `role` property:
```typescript
const mockUser: User = {
  id: "1",
  email: "admin@ats.com",
  name: "Admin User",
  role: UserRole.ADMIN,  // Change to: ADMIN, LEADER, or RECRUITER
  createdAt: new Date(),
  updatedAt: new Date(),
};
```

## Available Routes

### Admin Routes
- `/admin/dashboard` - Admin overview
- `/admin/companies` - (placeholder)
- `/admin/analytics` - (placeholder)
- `/admin/users` - (placeholder)

### Leader Routes
- `/leader/dashboard` - Leader overview
- `/leader/companies` - (placeholder)
- `/leader/job-orders` - (placeholder)
- `/leader/candidates` - (placeholder)

### Recruiter Routes
- `/recruiter/dashboard` - Recruiter overview
- `/recruiter/job-orders` - (placeholder)
- `/recruiter/candidates` - (placeholder)

## Project Structure

```
ATS/
├── app/                        # Next.js App Router
│   ├── (admin)/               # Admin routes
│   ├── (leader)/              # Leader routes
│   ├── (recruiter)/           # Recruiter routes
│   ├── layout.tsx             # Root layout
│   └── globals.css            # Global styles
├── components/
│   ├── layout/                # Sidebar, Header
│   └── ui/                    # Reusable UI components
├── features/                  # Feature modules (empty in Phase 1)
├── lib/
│   ├── constants/             # Enums, navigation config
│   └── utils/                 # Helper functions
├── types/                     # TypeScript definitions
└── hooks/                     # Custom React hooks
```

## What's Included in Phase 1

✅ Next.js App Router setup
✅ Role-based routing (Admin, Leader, Recruiter)
✅ Sidebar navigation with role-specific menus
✅ TypeScript types and enums foundation
✅ Tailwind CSS styling
✅ Mock authentication
✅ Dashboard pages for all roles
✅ Enterprise-grade UI structure

## What's NOT Included (Future Phases)

❌ Real authentication
❌ Backend APIs
❌ Database connection
❌ Business logic (workflows, validations)
❌ Interview management
❌ Status transitions
❌ Data persistence

## Development Tips

1. **Hot Reload**: Changes auto-reload in dev mode
2. **Type Safety**: TypeScript will catch errors at compile time
3. **Styling**: Use Tailwind utility classes
4. **Icons**: Import from `lucide-react`

## Next Steps (Phase 2)

After Phase 1 is running:
- Add form components
- Implement CRUD operations (frontend only)
- Add mock data for companies, job orders, candidates
- Build table components for data display
- Add filters and search functionality

## Troubleshooting

### Port Already in Use
```bash
# Kill process on port 3000
npx kill-port 3000
# Or use a different port
npm run dev -- -p 3001
```

### Build Errors
```bash
# Clear Next.js cache
rm -rf .next
npm run dev
```

### Type Errors
Make sure all imports use the correct paths configured in `tsconfig.json`

## Support

This is Phase 1 (Foundation) - a working skeleton with no business logic.
All features will be implemented in subsequent phases.
