# Section 7 — User Flows

## Flow A · Member looks up the bylaws

1. From hub, taps **Documents** (or in-app deep link).
2. Routes to `library` → category Governance.
3. Taps **Bylaws · v3.2** → `viewer` opens. Scrolls. Pinches to zoom.

## Flow B · Secretary uploads new minutes

1. From `library`, taps **+ Upload**.
2. Selects PDF, types title, picks category Minutes, marks visibility Member-visible.
3. Snackbar confirms; activity feeds Section 1 hub.

## Flow C · Auditor reviews version history

1. Opens **Annual audit · 2025** in `viewer`.
2. Taps **Versions** chip → timeline expands, 4 versions shown with diffs metadata.
3. Taps v2 → opens read-only.

## Edge states

- **Permission denied**: `viewer` shows redacted state with request-access CTA.
- **Large file (>20MB)**: viewer offers download-and-open path.
