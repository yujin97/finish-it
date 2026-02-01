# AGENTS.md

This file provides guidance for AI coding agents working in the finish-it codebase.

## Project Overview

A task management application built with:

- **Framework**: Next.js 16 (App Router) with React 19
- **Language**: TypeScript (strict mode)
- **Database**: PostgreSQL via Prisma ORM
- **Auth**: Clerk
- **UI**: shadcn/ui components + Tailwind CSS v4
- **Package Manager**: pnpm

## Build/Lint/Test Commands

```bash
# Development server (with Turbopack)
pnpm dev

# Production build (runs prisma migrate, generate, seed, then next build)
pnpm build

# Start production server
pnpm start

# Linting (ESLint via Next.js)
pnpm lint

# Prisma commands
pnpm prisma:generate    # Generate Prisma client (includes typed SQL)
pnpm prisma:migrate     # Deploy database migrations
pnpm prisma:seed        # Seed database with tsx prisma/seed.ts

# Add shadcn/ui components
pnpm shadcn:add
```

**Note**: No test framework is currently configured. There are no test files or test commands.

## Path Aliases

```typescript
"@/*"                -> "./src/*"
"@prisma-generated/*" -> "./generated/prisma/*"
```

## Code Style Guidelines

### Imports

Order imports as follows:

1. External packages (react, next, third-party libraries)
2. Internal modules using path aliases (`@/`, `@prisma-generated/`)
3. Relative imports (co-located files)

```typescript
// External
import { useState } from "react";
import Link from "next/link";
import { auth } from "@clerk/nextjs/server";

// Internal (path aliases)
import { prisma } from "@/utils/prismaClient";
import { Button } from "@/components/ui/button";

// Relative
import { TaskCard } from "./TaskCard";
import { taskSchema, CreateTaskFormData } from "../schemas/createTaskFormData";
```

### TypeScript & Types

- Strict mode is enabled - always provide proper types
- Define component props as `type Props = { ... }`
- Use Zod schemas for form validation, infer types with `z.infer<typeof schema>`
- Unused variables: prefix with `__` to suppress ESLint errors

```typescript
type Props = {
  workspaceId: number;
  taskId: number;
  title: string;
};

export function TaskCard({ workspaceId, taskId, title }: Props) { ... }
```

### Naming Conventions

- **React components**: PascalCase (`TaskCard.tsx`, `WorkspaceView.tsx`)
- **Server actions**: camelCase (`createTask.ts`, `updateTask.ts`)
- **Utilities**: camelCase (`prismaClient.ts`, `utils.ts`)
- **Zod schemas**: camelCase + Schema suffix (`taskSchema`, `workspaceSchema`)

### File Organization

```
src/
├── app/                      # Next.js App Router
│   ├── layout.tsx            # Root layout
│   ├── page.tsx              # Home page
│   └── workspaces/           # Feature: workspaces
│       ├── page.tsx
│       ├── components/       # Feature-specific components
│       ├── db/               # Server actions (database operations)
│       ├── schemas/          # Zod validation schemas
│       └── [workspaceId]/    # Dynamic route
│           ├── components/
│           ├── db/
│           ├── schemas/
│           └── actions/      # Additional server actions
├── components/
│   └── ui/                   # shadcn/ui components
├── lib/
│   └── utils.ts              # Utility functions (cn)
└── utils/
    └── prismaClient.ts       # Prisma singleton
```

### Component Patterns

**Client Components** - Use `"use client"` directive:

```typescript
"use client";
import { useState } from "react";

export function InteractiveComponent() { ... }
```

**Server Components** - Default, no directive needed:

```typescript
import { prisma } from "@/utils/prismaClient";

export default async function Page() {
  const data = await prisma.task.findMany();
  return <div>...</div>;
}
```

**Server Actions** - Use `"use server"` directive:

```typescript
"use server";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function createTask({ data, workspaceId }: Parameters) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized User");
  // ... database operation
  revalidatePath(`/workspaces/${workspaceId}`, "layout");
}
```

### Forms

Use react-hook-form with Zod validation:

```typescript
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { taskSchema, CreateTaskFormData } from "../schemas/createTaskFormData";

const { register, handleSubmit, formState } = useForm({
  resolver: zodResolver(taskSchema),
});
```

### Database (Prisma)

**Multi-file schema**: Models are split across files in `prisma/`:

- `schema.prisma` - Generator and datasource config
- `task.prisma` - Task and Status models
- `workspace.prisma` - Workspace and UserWorkspace models

**Naming conventions**:

- Column names: snake_case with `@map()` decorator
- Table names: plural snake_case with `@@map()` decorator

```prisma
model Task {
    id          Int      @id @default(autoincrement())
    creatorId   String   @map("creator_id")
    workspaceId Int      @map("workspace_id")
    createdAt   DateTime @default(now()) @map("created_at")

    @@map("tasks")
}
```

**Typed SQL**: For complex queries, use `prisma/sql/` directory with `prisma generate --sql`

### Error Handling

- Check authentication at the start of server actions
- Throw errors for unauthorized access
- Use Zod `.parse()` for data validation (throws on invalid data)

```typescript
const { isAuthenticated, userId } = await auth();
if (!isAuthenticated || !userId) throw new Error("Unauthorized User");

const parseData = taskSchema.parse(data);
```

### UI Components

- Use shadcn/ui components from `@/components/ui/`
- Use `cn()` utility from `@/lib/utils` for className merging
- Toast notifications via `sonner` (Toaster in root layout)
- Icons from `lucide-react`

```typescript
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

<div className={cn("base-class", conditional && "conditional-class")} />
```

### Formatting

- Prettier with defaults (no config file)
- ESLint extends: `next/core-web-vitals`, `next/typescript`, `prettier`
- Run `pnpm lint` to check for issues
