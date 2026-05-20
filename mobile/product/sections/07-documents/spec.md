# Section 7 — Documents

## Overview

Shared document storage for an association: bylaws, minutes, audits, forms, member agreements. Permission-aware — some documents are restricted to organisers, others are member-visible. Versioning is first-class so audits can trace any change.

## Screens

| Slug | Purpose |
| --- | --- |
| `library` | Folder/category list with search and recent files. |
| `viewer` | In-app document viewer with version timeline. |
| `share` | Per-document permissions and share-link controls. |

## UI Requirements

- **Library** uses a category strip (Governance / Finance / Minutes / Forms / Other) plus a recent files list.
- **Viewer** for PDFs uses a single-page-fit view with pinch-zoom; version timeline collapses by default.
- **Share** shows current viewers, role-based access toggles, and a copy-link with expiry option.

## Data Shape

`Document { id, title, category, version, updated, size, visibility, owners }`. See `data.json` and `types.ts`.

## Integration

- Documents can be attached as evidence in **Section 4: Treasury & Funds** welfare requests.
- Meeting minutes link to **Section 5: Governance & Voting** proposals/elections.
- All documents are auditable from **Section 14: Platform Administration**.
