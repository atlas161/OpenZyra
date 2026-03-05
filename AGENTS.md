# AGENTS.md - OpenZyra Developer Guide

## Project Overview

OpenZyra is a React + TypeScript application for analyzing OVH telephone call records. It processes CSV files containing call data and provides statistics, filtering, and PDF report generation.

## Tech Stack

- **Frontend**: React 19, TypeScript 5.8
- **Build Tool**: Vite 6
- **PDF Generation**: @react-pdf/renderer, jspdf, html2canvas
- **Charts**: recharts
- **Icons**: lucide-react

---

## Build & Development Commands

```bash
# Install dependencies
npm install

# Start development server (port 3000)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

**Note**: No lint/test commands are configured in this project. Run `npm run build` to verify TypeScript compilation.

---

## Code Style Guidelines

### TypeScript Configuration

- Target: ES2022
- Module resolution: bundler
- JSX: react-jsx
- Path alias: `@/*` maps to project root

### File Organization

```
/components      - React components
/components/pdf  - PDF generation components
/utils           - Utility functions (csv, formatters, processing, schedule)
```

### Imports

- Use absolute imports with `@/` prefix for internal modules
- Group imports: React → external libs → internal modules → types
- Example:
```typescript
import React, { useState } from 'react';
import { Search, Filter } from 'lucide-react';
import { FilterState } from '../types';
import { processSessions } from '@/utils/processing';
```

### Component Style

- Use functional components with TypeScript interfaces for props
- Export components as named exports: `export const ComponentName`
- Use React.FC<> for typing when needed
- Example:
```typescript
interface FilterBarProps {
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  resultCount: number;
}

export const FilterBar: React.FC<FilterBarProps> = ({ filters, setFilters, resultCount }) => {
  // component code
};
```

### Naming Conventions

- **Files**: PascalCase for components (e.g., `FilterBar.tsx`), camelCase for utilities (e.g., `processing.ts`)
- **Interfaces**: PascalCase (e.g., `SessionRecord`, `FilterState`)
- **Types**: Use `type` for unions, `interface` for object shapes
- **Props**: Use `onXxx` for callback props

### Error Handling

- Validate function inputs at the start
- Return early with defaults for empty/null cases
- Use console.error for logging (see processing.ts:6-9)

### State Management

- Use useState for local state, useEffect for side effects
- Prefer functional updates: `setFilters(prev => ({ ...prev, key: value }))`

### UI/Styling

- Use Tailwind CSS classes
- Follow existing color scheme: violet primary, slate for neutrals
- Include hover/focus states for interactive elements

### Date/Time Handling

- Use native JavaScript Date objects
- Avoid UTC shifts - use local date string construction (see processing.ts:125-130)

### Type Definitions (types.ts)

- Define all shared types in `types.ts`
- Use optional fields with `?` for backward compatibility

---

## Common Tasks

### Adding a New Filter
1. Add field to `FilterState` in `types.ts`
2. Update `FilterBar.tsx`
3. Update filtering logic in main component

### Adding a New Statistic
1. Add field to `Stats` in `types.ts`
2. Calculate in processing/utility functions
3. Display in StatsCards or ChartsSection

### PDF Report Generation
- Components in `components/pdf/`
- Uses @react-pdf/renderer
- Styles in `ReportStyles.ts`
