# Documents Specification

## Overview

Documents is the **shared file & agreement** layer of CircleUp's V1.9 MVP — every association, circle, and federation gets a structured document space for charters, bylaws, KYC files, contracts, receipts, statements, and signed agreements. V1.9 adds in-app document signing (e-signature with audit trail), a per-association documents view distinct from per-circle, document templates for common artefacts, and a unified library across the user's memberships.

## User Flows

- **Document Library** — User's unified library of documents across all memberships: filter by association / circle / type / shared-with-me; search by name and content.
- **Document Templates** — Browse and instantiate templates (membership form, dues receipt, circle charter, payout receipt, association bylaws, KYC declaration).
- **Document Upload** — Upload file (drag-drop or picker), categorise, set visibility (private / circle / association / federation), tag, attach to entity.
- **Document Viewer** — In-app viewer for PDF / image / docx with annotations, download, share, version history.
- **Agreement Signing** — E-signature flow for contracts: review document → consent → typed/drawn signature → confirmation → immutable signed copy with audit metadata.
- **Circle Documents** — Per-circle document space (charter, member agreements, cycle receipts, EF intervention records).
- **Association Documents View** — Per-association document space (bylaws, governance docs, compliance artefacts, financial statements).

## UI Requirements

- Adopts Associations stacked-card layout pattern.
- **Document Library**: filter chips (scope / type / shared), grid or list toggle, file-type icons, search-by-content; bulk actions (download, archive, share).
- **Document Templates**: gallery of template cards with category, preview thumbnail, "Use template" CTA → opens editor.
- **Document Upload**: drag-drop zone, file-list with status, categorisation form (type, visibility, tags, attach-to).
- **Document Viewer**: full-screen viewer with sidebar (metadata / annotations / versions), download / share / sign actions in toolbar; native share on Capacitor.
- **Agreement Signing**: three-step flow (Review → Consent → Sign), signature pad (touch or trackpad), confirmation page with audit-trail download.
- **Circle Documents / Association Documents View**: scope-pinned library with create-from-template shortcut.

### Mobile & platform
- Capacitor: native file picker on upload, native share on download, native file-save for compliance PDFs, fingerprint/Face ID to confirm signature.
- Mobile viewer is full-screen with bottom-pinned action bar.

## Configuration

- shell: true
