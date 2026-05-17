# Milestone 9: Documents

> **Provide alongside:** `product-overview.md`
> **Prerequisites:** Milestone 1 (Foundation) complete

---

## About These Instructions

**What you're receiving:**
- Finished UI designs (React components with full styling)
- Data model definitions (TypeScript types and sample data)
- UI/UX specifications (user flows, requirements, screenshots)
- Design system tokens (colors, typography, spacing)
- Test-writing instructions for each section (for TDD approach)

**What you need to build:**
- Backend API endpoints and database schema
- Authentication and authorization
- Data fetching and state management
- Business logic and validation
- Integration of the provided UI components with real data

**Important guidelines:**
- **DO NOT** redesign or restyle the provided components — use them as-is
- **DO** wire up the callback props to your routing and API calls
- **DO** replace sample data with real data from your backend
- **DO** implement proper error handling and loading states
- **DO** implement empty states when no records exist
- **DO** use test-driven development — write tests first using `tests.md` instructions
- The components are props-based and ready to integrate — focus on the backend and data layer

---

## Goal

Implement the Documents feature.

## Overview

Document management for association records including meeting minutes, financial reports, member agreements, and circle policies. Documents organized by circle with automatic generation of key financial records and digital signature support.

**Key Functionality:**
- Browse document library with folder navigation
- Upload documents with metadata and permissions
- Preview documents in-app
- Sign membership agreements digitally
- Use document templates

## Recommended Approach: Test-Driven Development

Before implementing this section, **write tests first** based on the test specifications provided.

See `product-plan/sections/documents/tests.md` for detailed test-writing instructions including:
- Key user flows to test (success and failure paths)
- Specific UI elements, button labels, and interactions to verify
- Expected behaviors and assertions

**TDD Workflow:**
1. Read `tests.md` and write failing tests for the key user flows
2. Implement the feature to make tests pass
3. Refactor while keeping tests green

## What to Implement

### Components

Copy the section components from `product-plan/sections/documents/components/`:

DocumentLibrary, CircleDocuments, DocumentViewer, DocumentUpload, DocumentTemplates, AgreementSigning

### Data Layer

The components expect data shapes defined in `product-plan/sections/documents/types.ts`. You'll need to:
- Create API endpoints for CRUD operations
- Implement data fetching and state management
- Connect real data to the component props

### Callbacks

Wire up all callback props defined in the component interfaces. Each `on*` prop should be connected to your routing, API calls, or state management. Review `types.ts` for the complete list of callback props and their signatures.

### Empty States

Implement empty state UI for when no records exist yet:
- **No data yet:** Show a helpful message and call-to-action when the primary list/collection is empty
- **No related records:** Handle cases where associated records don't exist
- **First-time user experience:** Guide users to create their first item with clear CTAs
- **Filtered results empty:** Show "No results found" with filter reset option

## Files to Reference

- `product-plan/sections/documents/README.md` — Feature overview and design intent
- `product-plan/sections/documents/tests.md` — Test-writing instructions (use for TDD)
- `product-plan/sections/documents/components/` — React components
- `product-plan/sections/documents/types.ts` — TypeScript interfaces
- `product-plan/sections/documents/sample-data.json` — Test data
- `product-plan/sections/documents/*.png` — Visual references

## Done When

- [ ] Tests written for key user flows (success and failure paths)
- [ ] All tests pass
- [ ] Components render with real data from backend
- [ ] Empty states display properly when no records exist
- [ ] All callback props wired to routing and API calls
- [ ] User can complete all expected flows end-to-end
- [ ] Matches the visual design in screenshots
- [ ] Responsive on mobile
- [ ] Dark mode support
