# TCRC Manager App - Development Rules

## Architecture: BFF (Backend For Frontend) with Next.js App Router

### Directory Structure (MUST follow)

```
src/
├── app/                          # App Router pages
│   ├── layout.tsx                # Root layout (SessionProvider, viewport)
│   ├── (auth)/                   # Auth route group
│   │   ├── login/page.tsx
│   │   └── signup/
│   │       ├── page.tsx          # RSC page shell
│   │       ├── actions.ts        # Server Actions (mutations)
│   │       └── _components/      # Page-specific client components
│   ├── (main)/                   # Main route group
│   │   ├── page.tsx              # Home
│   │   ├── checkout/
│   │   │   ├── page.tsx          # RSC page shell
│   │   │   ├── actions.ts        # Server Actions
│   │   │   └── _components/
│   │   ├── checkout-qr/page.tsx
│   │   └── ranking/
│   │       ├── page.tsx          # 종합 랭킹
│   │       ├── actions.ts        # Shared ranking server actions
│   │       ├── _components/
│   │       ├── participation/page.tsx
│   │       └── founder/page.tsx
│   └── api/                      # API routes (minimal)
│       ├── auth/[...nextauth]/route.ts
│       ├── slack/route.ts
│       └── admin/qr-check/route.ts
│
├── lib/
│   ├── utils.ts                  # cn() utility
│   ├── supabase/
│   │   ├── server.ts             # Server-only Supabase client
│   │   └── client.ts             # Browser Supabase client (rare usage)
│   └── domain/                   # Pure business logic (BFF core)
│       ├── user/
│       │   ├── queries.ts        # Read operations
│       │   └── mutations.ts      # Write operations
│       ├── meeting/
│       │   ├── queries.ts
│       │   └── mutations.ts
│       └── slack/
│           └── notifications.ts
│
├── components/                   # Atomic Design
│   ├── atoms/                    # Basic elements (Button, InputField, Card, SelectField)
│   ├── molecules/                # Composed (RankingCard, MonthSelector, ConfirmDialog)
│   ├── organisms/                # Complex sections (PageHeader, RankingList)
│   ├── providers/                # Context providers (SessionProvider)
│   └── icons/                    # Icon components
│
├── types/                        # TypeScript declarations
│   ├── next-auth.d.ts
│   └── global.d.ts
│
└── styles/
    └── globals.css               # Design tokens + global styles
```

## Key Rules

### 1. BFF Pattern
- **Server Actions** (`actions.ts`) handle all data mutations - never call Supabase from client
- **Domain layer** (`lib/domain/`) contains all business logic - no React, no Next.js imports
- **RSC pages** should be thin shells - delegate to server actions and client components
- **API routes** only for external integrations (webhooks, auth handlers)

### 2. Domain Layer Isolation
- `lib/domain/` MUST NOT import from `@/components`, `@/app`, `next/*`, or `react`
- Only imports: `@/lib/supabase/server`, other domain modules, pure packages
- Split into `queries.ts` (reads) and `mutations.ts` (writes)

### 3. Component Rules (Atomic Design)
- **atoms/**: Single-purpose, no business logic, accept props only
- **molecules/**: Compose 2+ atoms, minimal local state
- **organisms/**: Full sections with data fetching awareness, may use hooks
- Use `cn()` from `@/lib/utils` for all conditional classNames
- Use CVA (`class-variance-authority`) for component variants

### 4. Layout Rules
- Root layout uses `mobile-viewport` flex container (100dvh)
- Use `sticky top-0` for headers, NEVER `fixed` (breaks inside scroll container)
- Pages structure: `<div className="flex flex-col min-h-screen bg-tcrc-bg-primary">`
- PageHeader is an organism, not duplicated per page

### 5. Design Tokens
- Use `tcrc-*` CSS variables and Tailwind classes (e.g., `bg-tcrc-bg-primary`, `text-tcrc-text-secondary`)
- Typography: `text-tcrc-hero`, `text-tcrc-title1-3`, `text-tcrc-body`, `text-tcrc-caption`
- Spacing: `gap-tcrc-md`, `p-tcrc-xl`, etc.
- Border radius: `rounded-tcrc-lg`, `rounded-tcrc-full`

### 6. Performance
- No N+1 queries - batch all DB operations
- Use `useMemo`/`useCallback` for expensive computations and callbacks
- Prefer native `<dialog>` over heavy modal libraries
- Dynamic import for heavy client libraries (lottie, QR code)
- `optimizePackageImports` in next.config.js for tree-shaking

### 7. Naming Conventions
- Components: PascalCase files (Button.tsx, PageHeader.tsx)
- Domain/lib: camelCase files (queries.ts, mutations.ts)
- Page-specific components: `_components/` directory
- Server actions: `actions.ts` in the route directory

### 8. Tech Stack
- Next.js 14 (App Router)
- next-auth v4 (Kakao OAuth)
- Supabase (schema: "tcrc")
- Tailwind CSS + tailwindcss-animate
- class-variance-authority + clsx + tailwind-merge
- react-hook-form
- lucide-react (icons)
