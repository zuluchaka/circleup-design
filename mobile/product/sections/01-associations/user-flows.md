# Section 1 — User Flows

## Flow A · Organiser checks the hub on the morning of a payout

1. Opens app. Lands on authenticated home (Inbox); taps association switcher in the AppHeader.
2. Routes to `dashboard` for *Diaspora Circle Geneva*.
3. Sees the stat strip: 184 Members, 3 Circles, Trust 712, CHF 12,420 in funds.
4. Scrolls to **Recent activity**: spots that 3 contributions arrived overnight.
5. Taps the Treasury quick-action chip → routes to Section 4 `overview`.

## Flow B · Founder creates a brand-new association from scratch

1. Lands on `dashboard` (empty state if no association yet); taps **Create association**.
2. Step 1 (Details): types name *Lausanne Cultural Circle*, picks country *Switzerland*, primary language *FR*, currency *CHF*.
3. Step 2 (Governance): chooses governance model **Committee-led**, sets monthly contribution baseline *CHF 100*.
4. Step 3 (Cultural terminology): picks preset **Tontine** → labels auto-update across the app preview.
5. Taps **Create**. Spinner ~2s. Snackbar "Association created. Next: add your founding members." with **Add members** action.
6. Routes to `dashboard` for the new association.

## Flow C · Organiser migrates a legacy association from spreadsheets

1. From `dashboard`, taps **Create association**, picks **Import existing** at step 1.
2. Routes to `migration`. Step 1 (Upload): selects CSV with 142 members.
3. Step 2 (Parse): app auto-detects columns; user maps 2 ambiguous ones (Nickname → Display name, Old ID → External ID).
4. Step 3 (Validate): 138 valid, 3 warnings (duplicate emails), 1 error (missing phone). User resolves inline.
5. Step 4 (Review): summary of what will import (138 members, 2 ROSCA circles, 24 months of payment history). Trust Scores will bootstrap from history.
6. Step 5 (Go-live): user taps **Go live**. Progress bar runs ~4–6 minutes (push notification when done).
7. Banner on `dashboard` once live: **Migration complete · 138 members imported.**

## Flow D · Treasurer changes Emergency Fund % from 1% to 1.5%

1. From `dashboard`, taps the gear icon → routes to `settings`.
2. Opens **Fees & Emergency Fund** card.
3. Reads the explainer banner: changing fees affects future contributions only.
4. Increments slider to 1.5%, taps **Save**.
5. Snackbar: "Emergency Fund rate updated. Next cycle uses 1.5%." with **Undo** action (6s).

## Error / Edge states

- **Migration CSV upload fails halfway** (network drop): wizard resumes from last persisted step on next entry.
- **Duplicate association name** in the same country: inline validation blocks Step 1 advance.
- **No permissions**: non-organiser members see `dashboard` in read-only mode (no quick actions, no gear).
- **Archived association**: `dashboard` is read-only with a banner offering **Reactivate**.
