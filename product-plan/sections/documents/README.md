# Documents

## Overview

Document management for association records with folder organization, version tracking, and digital signatures.

## User Flows

1. Browse document library
2. Upload a document
3. View document preview
4. Sign membership agreement
5. Use document template

## Visual Reference

See the `.png` screenshot files in this directory for the target UI design.

## Components Provided

- `DocumentLibrary`
- `CircleDocuments`
- `DocumentViewer`
- `DocumentUpload`
- `DocumentTemplates`
- `AgreementSigning`

## Data Used

See `types.ts` for complete TypeScript interface definitions.
See `sample-data.json` for example data.

## Integration Notes

- All components are props-based — they accept data and callbacks via props
- No internal state management or API calls — you provide everything
- Components support dark mode via Tailwind `dark:` variants
- Responsive design with Tailwind breakpoints (`sm:`, `md:`, `lg:`, `xl:`)
