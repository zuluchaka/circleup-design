import puppeteer from 'puppeteer';
import { writeFileSync, readFileSync, readdirSync, existsSync } from 'fs';
import { join } from 'path';

const ROOT = '/Users/lunang/Documents/Projects/circleup-design';

// ── 1. Parse markdown stories ──────────────────────────────
const md = readFileSync(join(ROOT, 'product/features-epics-stories.md'), 'utf-8');
const lines = md.split('\n');
const sections = [];
let curSec = null, curEpic = null;

for (const line of lines) {
  const sm = line.match(/^## (\d+)\. (.+)$/);
  if (sm) { curSec = { num: +sm[1], title: sm[2], desc: '', epics: [] }; sections.push(curSec); continue; }
  if (curSec && line.startsWith('**Feature:**')) { curSec.desc = line.replace('**Feature:**', '').trim(); continue; }
  const em = line.match(/^### (Epic [\d.]+: .+)$/);
  if (em && curSec) { curEpic = { title: em[1], stories: [] }; curSec.epics.push(curEpic); continue; }
  const stm = line.match(/^\| ([\d.]+) \| (.+?) \| (P[012](?:\/P[012])?) \|$/);
  if (stm && curEpic) {
    const text = stm[2].trim();
    const rm = text.match(/^As (?:a |an )(.+?),/);
    const role = rm ? rm[1].charAt(0).toUpperCase() + rm[1].slice(1) : 'User';
    let tm = text.match(/I want (?:to )?(.+?)(?:\s+so\s|$)/);
    let title = tm ? tm[1].trim() : text.substring(0, 60);
    title = title.charAt(0).toUpperCase() + title.slice(1);
    if (title.length > 70) title = title.substring(0, 67) + '...';
    title = title.replace(/\s+so\s*$/, '');
    curEpic.stories.push({ id: stm[1], title, p: stm[3], role, story: text });
  }
}

// ── 2. Load spec files for context ─────────────────────────
const specDir = join(ROOT, 'product/sections');
const specMap = {};
if (existsSync(specDir)) {
  for (const dir of readdirSync(specDir)) {
    const sp = join(specDir, dir, 'spec.md');
    if (existsSync(sp)) specMap[dir] = readFileSync(sp, 'utf-8');
  }
}
const shellSpec = existsSync(join(ROOT, 'product/shell/spec.md'))
  ? readFileSync(join(ROOT, 'product/shell/spec.md'), 'utf-8') : '';
const overview = existsSync(join(ROOT, 'product/product-overview.md'))
  ? readFileSync(join(ROOT, 'product/product-overview.md'), 'utf-8') : '';

// ── 2b. Load epic-to-screenshot mapping ─────────────────────
const epicScreenshotMap = JSON.parse(readFileSync(join(ROOT, 'scripts/epic-screenshot-map.json'), 'utf-8'));
const screenshotBase64 = {};
let screenshotCount = 0;
for (const [epicId, relPath] of Object.entries(epicScreenshotMap)) {
  if (epicId.startsWith('_')) continue; // skip comments
  const absPath = join(ROOT, 'product/sections', relPath);
  if (existsSync(absPath) && !screenshotBase64[relPath]) {
    screenshotBase64[relPath] = readFileSync(absPath).toString('base64');
    screenshotCount++;
  }
}
console.log(`Loaded ${screenshotCount} unique screenshots for ${Object.keys(epicScreenshotMap).length - 1} epics`);

// ── 3. Generate descriptions & acceptance criteria ─────────

const secDirMap = {
  1: 'homepage', 2: 'login', 3: 'associations', 4: 'members-and-trust',
  5: 'rosca-circles', 6: 'treasury-and-funds', 7: 'credit-and-lending',
  8: 'multi-share', 9: 'governance-and-voting', 10: 'communication-and-events',
  11: 'documents', 12: 'projects-and-fundraising', 13: 'community-and-social',
  14: 'analytics-and-reporting', 15: 'ai-insights', 16: 'federations',
  17: 'platform-administration'
};

// Extract ALL acceptance criteria blocks from specs into a searchable index
function buildSpecIndex() {
  const index = []; // { keywords: string[], ac: string[], desc: string, section: string }
  for (const [dir, spec] of Object.entries(specMap)) {
    const lines = spec.split('\n');
    for (let i = 0; i < lines.length; i++) {
      // Find "I want" patterns in specs
      if (lines[i].includes('I want') || lines[i].includes('**I want')) {
        const storyLine = lines[i].replace(/\*\*/g, '').trim();
        const kw = storyLine.toLowerCase().split(/\s+/).filter(w => w.length > 3);
        // Look forward for AC
        let acLines = [];
        let descLines = [];
        for (let j = i + 1; j < Math.min(i + 40, lines.length); j++) {
          const l = lines[j].trim();
          if (l.toLowerCase().includes('acceptance criteria')) {
            for (let k = j + 1; k < Math.min(j + 20, lines.length); k++) {
              const al = lines[k].trim();
              if (al.startsWith('- ') || al.startsWith('* ')) {
                acLines.push(al.replace(/^[-*]\s*/, '').trim());
              } else if ((al.startsWith('#') || al.startsWith('**As')) && acLines.length > 0) break;
              else if (al === '' && acLines.length > 0) break;
            }
            break;
          }
          if (!l.startsWith('#') && !l.startsWith('|') && l.length > 20 && !l.startsWith('**')) {
            descLines.push(l);
          }
        }
        if (acLines.length >= 2) {
          index.push({ keywords: kw, ac: acLines, desc: descLines.join(' ').substring(0, 300), section: dir });
        }
      }
    }
  }
  return index;
}

const specIndex = buildSpecIndex();

function findBestSpecMatch(storyText, sectionNum) {
  const dir = secDirMap[sectionNum];
  const storyKw = storyText.toLowerCase().split(/\s+/).filter(w => w.length > 3);
  let best = null, bestScore = 0;
  for (const entry of specIndex) {
    // Prefer same section
    const sectionBonus = entry.section === dir ? 2 : 0;
    const score = storyKw.filter(k => entry.keywords.includes(k)).length + sectionBonus;
    if (score > bestScore) { bestScore = score; best = entry; }
  }
  return bestScore >= 5 ? best : null;
}

// ── Detailed description generator ─────────────────────────
function generateDescription(story, sectionNum) {
  const t = story.story;
  const tl = t.toLowerCase();

  // Extract the "want" portion for context
  const wm = t.match(/I want (?:to )?(.+?)(?:\s+so\s|$)/);
  const want = wm ? wm[1].toLowerCase() : '';

  const parts = []; // Additional description sentences

  // ─── Section-specific context ───
  if (sectionNum === 1) { // Homepage
    if (want.includes('hero')) parts.push('The hero section features a full-width gradient background (indigo to violet) with the headline "Modern Tools for Traditional Savings." The primary CTA leads to registration; the secondary opens a 2-minute product video modal. Trust badges (AES-256, 2FA, PCI-DSS, FINMA) display below.');
    else if (want.includes('trust badge')) parts.push('Badges are displayed in a horizontal row with professional iconography. Each badge has a hover tooltip explaining the certification. Links to relevant compliance documentation are provided.');
    else if (want.includes('how it works')) parts.push('Presented as a 3-step horizontal process with numbered icons and animations triggered on scroll. A "Learn More" link opens the interactive circle lifecycle guide.');
    else if (want.includes('calculator') || want.includes('savings goal')) parts.push('Interactive calculator with sliders for monthly contribution (CHF 50–5,000), circle size (5–20), and duration (3–24 months). Shows projected total savings with a visual timeline comparing ROSCA vs solo savings.');
    else if (want.includes('live activity')) parts.push('A ticker-style feed showing anonymized recent events: payouts, new circles, contribution milestones. Updates every 30 seconds from real platform data. Subtle entrance animations cycle through the 20 most recent events.');
    else if (want.includes('statistics') || want.includes('counters')) parts.push('Four counters animate from zero on scroll: Total Saved, Families Helped, Circles Completed, Active Communities. Numbers use locale-appropriate formatting and refresh daily.');
    else if (want.includes('cultural') && want.includes('name')) parts.push('Displays a section titled "Known by Many Names, Trusted by Millions" with a world map/grid: Tontine, Chit Fund, Tandas, Susu, Paluwagan, Gameya, Hui, Stokvel. Auto-highlights terms matching the visitor\'s detected language.');
    else if (want.includes('lifecycle guide')) parts.push('Multi-step interactive walkthrough: Formation → Active Cycles → Payout Rotation → Completion. Each step has animated diagrams, example amounts, and FAQ links. Users click through or watch auto-play.');
    else if (want.includes('comparison table')) parts.push('Two-column comparison: Traditional ROSCA vs CircleUp across 7 dimensions (record keeping, payments, trust, default protection, transparency, multi-language, accessibility). CircleUp advantages highlighted with checkmarks.');
    else if (want.includes('community showcase')) parts.push('Carousel of cultural community profiles with photos, savings terms, typical circle configurations, and member testimonials. Cycles through 5–8 profiles with smooth transitions.');
    else if (want.includes('member') && want.includes('organizer') && want.includes('path')) parts.push('Split-screen section: "I Want to Save" (left) and "I Want to Organize" (right) with tailored benefits. A "Not Sure? Take Our Quiz" option in center. Path selection personalizes remaining content.');
    else if (want.includes('planner')) parts.push('Users enter savings goal, monthly budget, and timeline. The tool recommends optimal circle configurations and shows a visual timeline comparing solo vs ROSCA savings.');
    else if (want.includes('size calculator')) parts.push('Inputs: target payout amount, contribution frequency, community size. Outputs: optimal member count, individual contribution, total duration, fees, Emergency Fund accumulation.');
    else if (want.includes('sandbox')) parts.push('Embedded interactive demo with simulated data: sample associations, mock circles, simulated dashboards. Labeled "Demo Mode." Data resets per session. No registration required.');
    else if (want.includes('quiz') && want.includes('member readiness')) parts.push('10 scenario-based questions testing financial discipline, obligations understanding, and commitment. Each answer scored. Progress bar shows completion. Example: "How would you handle a tight month?"');
    else if (want.includes('quiz') && want.includes('organizer readiness')) parts.push('10 questions on leadership: conflict resolution, payment collection, member screening, communication. Tests understanding of organizer responsibilities including default handling and transparency.');
    else if (want.includes('feedback') && want.includes('quiz')) parts.push('After each answer, shows brief explanation of best approach. Final results: "ROSCA Pro" (85–100%), "Ready to Join" (65–84%), "Learning Mode" (<65%). Each rating includes specific recommendations and next-step CTAs.');
    else if (want.includes('share') && want.includes('quiz')) parts.push('Social sharing buttons (WhatsApp, Facebook, Twitter, copy link). Pre-formatted message with score. "Retake Quiz" and "Challenge a Friend" options with referral tracking.');
    else if (want.includes('pricing')) parts.push('Four-column table: Free (1 circle, 10 members), Basic CHF 29/mo (unlimited circles, 50 members), Pro CHF 99/mo (unlimited + AI + credit), Enterprise (custom). Annual discount: 20%. Recommended tier highlighted.');
    else if (want.includes('fee breakdown')) parts.push('Tabular breakdown: Subscription Fee, Platform Transaction Fee (~1.5%), Late Payment Fee (max 5%), Emergency Fund (1%), Stripe processing. Tooltips explain each. "No hidden fees" comparison to banking alternatives.');
    else if (want.includes('cost calculator')) parts.push('Inputs: contribution amount, circle size, frequency, duration. Outputs: total fees, Emergency Fund allocation, Stripe fees, net contribution. Recommends most cost-effective pricing tier.');
    else if (want.includes('live chat')) parts.push('Floating widget bottom-right on all pages. AI-powered first response with escalation to human agent. Shows wait time. Supports detected language. Outside hours: takes message with 24h email follow-up.');
    else if (want.includes('contact form')) parts.push('Fields: Name, Email, Subject (dropdown), Message, optional phone. Inline validation, auto-acknowledgment with ticket number. Routed by subject. Anti-spam via honeypot (no CAPTCHA).');
    else if (want.includes('demo') && want.includes('calendar')) parts.push('Embedded scheduling widget with 30-min slots. Collects name, email, org name, member count. Confirmation includes calendar invite with video link. Pre-demo questionnaire on current practices.');
    else if (want.includes('newsletter')) parts.push('Email input with frequency options (Weekly/Monthly). GDPR-compliant with explicit consent. Double opt-in. Welcome email with key resources.');
    else if (want.includes('sticky cta')) parts.push('Fixed bottom bar on mobile after scrolling past hero. "Get Started Free" button. Semi-transparent, doesn\'t obscure content. Dismissible for the session.');
    else if (want.includes('streamlined registration')) parts.push('Minimum fields: Name, Email, Password with strength indicator. Google/Apple buttons above with separator. Pre-fills referral code from URL. Detects existing accounts inline.');
    else if (want.includes('exit-intent')) parts.push('Triggers on mouse toward close button (desktop) or 30s inactivity (mobile). Shows compelling stat + two options: Register or Subscribe to newsletter. Once per session, never for returning users.');
    else if (want.includes('social proof')) parts.push('Near registration form: active member count, daily signups, 2–3 testimonials with photos, app store ratings, trust badge. Data updates dynamically from platform stats.');
    else if (want.includes('language selector')) parts.push('Globe icon in header opens dropdown: EN, FR, DE, IT, PT. Auto-detects browser language. Persists via cookie. All content fully translated including dynamic elements. URL includes language prefix.');
    else if (want.includes('accessible') || want.includes('accessibility')) parts.push('WCAG 2.1 AA compliant: alt text, keyboard navigation, visible focus, 4.5:1 contrast, skip nav, prefers-reduced-motion, captions, ARIA live regions for dynamic content.');
    else if (want.includes('page loads') || want.includes('lcp')) parts.push('Optimized for Core Web Vitals: next-gen image formats, lazy loading, code splitting, font-display:swap, SSR, CDN delivery. Bundle budget: <200KB gzipped initial load.');
    else if (want.includes('app store')) parts.push('Official App Store and Google Play badges with QR codes for cross-device scanning. On mobile, badges link directly to stores. Phone mockup shows mobile UI. Download count displayed.');
    else if (want.includes('mobile features')) parts.push('Feature list: Push Notifications, Biometric Login (Face ID/fingerprint), Offline Access, Mobile Payments (2-tap), QR Check-in. Each with icon and one-line description.');
    else parts.push('This element is part of the public landing experience. It should render without authentication and follow the platform\'s conversion-optimized design patterns.');
  }
  else if (sectionNum === 2) { // Auth
    if (want.includes('register with email')) parts.push('Split-layout page: form left, hero illustration right (stacks on mobile). Social buttons above email form. Submit creates account and redirects to verification pending page. Real-time format validation on email field.');
    else if (want.includes('password strength')) parts.push('Visual progress bar below password field updating in real-time: Weak (red), Fair (orange), Good (yellow), Strong (green). Requirements with checkmarks: 8+ chars, 1 uppercase, 1 number. Common/breached passwords rejected.');
    else if (want.includes('terms of service')) parts.push('Mandatory checkbox with linked ToS and Privacy Policy (open in new tab). Version recorded with account. Separate optional marketing checkbox for GDPR. Consent timestamps stored in audit trail.');
    else if (want.includes('referral code')) parts.push('Collapsible "Have a referral code?" field. Pre-fills from URL with referrer name shown. Valid codes: green checkmark; invalid: error. Referral relationship tracked for multi-level earnings.');
    else if (want.includes('verification email')) parts.push('Transactional email via SendGrid/Postmark within 30 seconds. Contains branded template, "Verify Email" button with unique token (24h validity), fallback text link. Sent in user\'s language. SPF/DKIM/DMARC for deliverability.');
    else if (want.includes('trust score') && want.includes('650')) parts.push('System assigns 650/1000 on account creation. Score visible immediately in profile. Tooltip explains: "Improves with profile completion, verification, and on-time payments." Factor weights displayed.');
    else if (want.includes('google oauth')) parts.push('OAuth 2.0 Authorization Code flow with PKCE. Requests email and profile scopes. Creates account from Google profile (name, email, photo). Handles existing email match with link/create option. Graceful cancellation handling.');
    else if (want.includes('apple sign')) parts.push('Sign In with Apple authorization code flow. Supports "Hide My Email" relay. Stores Apple user ID for future auth. Works on web (JS SDK) and native (iOS).');
    else if (want.includes('auto-verified')) parts.push('OAuth provider emails are automatically marked verified, bypassing the email verification step. Verification source (google/apple) recorded in audit trail. User proceeds directly to onboarding.');
    else if (want.includes('missing profile')) parts.push('Post-auth check for required fields. Shows short form for only truly missing data (pre-filled from provider). Progress indicator. No redundant questions.');
    else if (want.includes('unlinked account')) parts.push('When social email matches existing account: "Link to Existing Account" (requires password) or "Create New Account" (needs different email). Clear explanation of each option. Audit trail recorded.');
    else if (want.includes('log in with email')) parts.push('Same split layout as registration. Fields: Email, Password. Social buttons above. "Forgot password?" link. Generic "Invalid email or password" error. Login events logged with IP and device.');
    else if (want.includes('remember me')) parts.push('Checkbox sets 30-day session cookie (sliding window). Sessions viewable/revocable from Security Settings. Invalidated on password change. Device fingerprinted for security monitoring.');
    else if (want.includes('lockout')) parts.push('After 5 consecutive failed attempts: 15-minute lockout with countdown. "Reset Password" link available. Tracked per email (not IP). Resets after successful login. Security team notified after 10+ attempts.');
    else if (want.includes('prompted to verify')) parts.push('Correct credentials + unverified: shows "Please verify your email" with resend button (rate-limited 3/hour). Shows masked email. "Change Email" option for typos. No platform access until verified.');
    else if (want.includes('password reset link')) parts.push('"Forgot Password" page: single email field. Reset email with branded template, unique token link, and "If you didn\'t request this" warning. Cryptographically random 256-bit token, stored hashed.');
    else if (want.includes('reset link') && want.includes('1 hour')) parts.push('Tokens expire after 60 minutes. Expired link shows clear message with "Request New Link" button. Only most recent token valid. Server-side enforcement with client-side countdown.');
    else if (want.includes('same confirmation') && want.includes('enumeration')) parts.push('Always shows: "If an account exists, we\'ve sent a reset link." Consistent response time (no timing side-channel). Rate limited: 3/email/hour, 10/IP/hour. All requests audit logged.');
    else if (want.includes('invalidate all') && want.includes('session')) parts.push('New password invalidates all sessions across all devices including "Remember me" and API tokens. New session created on current device. Notification email sent. Audit trail with device/IP.');
    else if (want.includes('verify my email') && want.includes('clicking')) parts.push('Unique single-use token link valid 24 hours. Click verifies email, updates status, redirects to onboarding wizard. Success animation shown. Invalid/used tokens show error with resend option.');
    else if (want.includes('resend') && want.includes('verification')) parts.push('"Resend Email" button on verification pending page. Rate limited 3/hour with countdown. Shows troubleshooting tips: check spam, add to contacts, verify email correct. "Change Email" option available.');
    else if (want.includes('expired') && want.includes('verification')) parts.push('Expired link shows: "This link has expired. We can send you a new one." One-click resend generates new 24-hour token, invalidates previous tokens. Confirms new email sent.');
    else if (want.includes('onboarding wizard')) parts.push('5-step wizard: Photo (crop/resize or avatar library) → Phone (country picker + SMS verify) → Bio (optional, 200 chars) → Location (country/city) → Languages (EN/FR/DE/IT/PT). Progress bar. Each step a dedicated card.');
    else if (want.includes('trust score improvement') && want.includes('step')) parts.push('Preview widget during onboarding shows score increases: Photo +10, Phone +25, Bio +5, Location +5, Language +5. Animates upward per step. Summary at end shows new score with encouragement message.');
    else if (want.includes('skip') && want.includes('onboarding')) parts.push('"Skip for now" link on each step. After wizard: main app with persistent banner "Complete your profile to improve Trust Score" linking back. Reappears after 7 days if incomplete. Badge on avatar.');
    else if (want.includes('language selector') && want.includes('authentication')) parts.push('Globe icon with dropdown on every auth page: EN, FR, DE, IT, PT. Immediate page translation. Saved to localStorage. Stored in profile on registration. Auto-detects browser language.');
    else parts.push('This is part of the authentication flow ensuring secure access while maintaining a smooth user experience across all supported languages and devices.');
  }
  else if (sectionNum === 3) { // Associations
    if (want.includes('association') && want.includes('profile') && want.includes('identity')) parts.push('Organizer enters association name, description (rich-text, 2,000 chars), type (cultural/religious/professional/savings/social/family), primary and secondary languages, and uploads a logo with auto-crop to 400×400px. Association is created in "Importing" status (not public, not searchable). Duplicate name warning is shown. Profile completeness indicator tracks required vs optional fields.');
    else if (want.includes('governance') && want.includes('role')) parts.push('Pre-configured role templates are offered by association type (e.g. Cultural: President, Vice-President, Treasurer, Secretary, Advisor, Member). Organizer can customize up to 10 roles with granular permissions, add committees with chair/vice-chair, and configure membership approval workflow (Auto-Approve, Admin Approval, Committee Vote, Invitation Only). Dues amount, frequency, and grace period are set here.');
    else if (want.includes('rules') && want.includes('bylaws')) parts.push('Supports PDF and DOCX upload (max 25MB) with automatic text extraction for searchability, or manual entry via a rich-text editor with template sections. Documents are categorized: Bylaws, Constitution, Code of Conduct, Financial Policy, Other. Uploaded files are archived with SHA-256 hash for integrity verification.');
    else if (want.includes('privacy') && want.includes('visibility')) parts.push('Three preset cards with visual explanations: Public (listed in directory, open events), Semi-Private (listed but requires approval, members-only events), Private (unlisted, invitation-only). Advanced toggles for member directory visibility, financial data access, and event visibility. GDPR/FADP compliance settings are enforced (data retention periods, consent tracking, right-to-deletion).');
    else if (want.includes('communication') && want.includes('preferences')) parts.push('Configure default notification channels (in-app, email, SMS, push) per event type. Set announcement permissions (all members, admins + moderators, admins only). Define recurring meeting schedule with day, frequency, time, and week — auto-generates calendar events with reminder notifications.');
    else if (want.includes('upload') && want.includes('parse') && want.includes('member')) parts.push('Drag-and-drop file upload zone accepting CSV, XLSX, and XLS up to 10MB (warning at 500+ rows). System auto-detects columns with confidence indicators (high/medium/low). Preview shows first 10 rows with parsed data. Handles merged cells, multi-header rows, and non-Latin Unicode scripts. Flags duplicate rows with merge/skip/keep-both options. Manual column re-mapping available.');
    else if (want.includes('map') && want.includes('field') && want.includes('validate')) parts.push('Visual two-column mapping interface: source column on left, CircleUp target field on right, with sample values displayed. Validation icons per row: green (valid), yellow (warning, e.g. phone format), red (error, e.g. missing required field). Inline editing allows immediate corrections. Auto-formats phone numbers to E.164 standard. Filter by validation status. Mapping is locked with a summary confirmation before proceeding.');
    else if (want.includes('role') && want.includes('assign') && want.includes('import')) parts.push('Source role column values (e.g. "Président", "Trésorier") are auto-mapped to CircleUp roles using AI-assisted multilingual matching with confidence scores (0-100%). Organizer can override individual mappings or bulk-assign. Role distribution summary shows how many members are assigned to each role. Supports French, English, German, Italian, and Portuguese role names.');
    else if (want.includes('bulk') && want.includes('invitation')) parts.push('Multi-channel invitation system: Email only, Email + SMS, or Invitation Code (for members without email). Customizable invitation template with organizer\'s personal message and association branding. Batch sending by subgroup or role. Real-time delivery dashboard tracks: Sent → Delivered → Opened → Clicked → Registered. 6-character alphanumeric invitation codes generated for code-based invitations. Branded landing page for recipients.');
    else if (want.includes('manual') && want.includes('add') && want.includes('member')) parts.push('Quick-add form with minimal required fields (first name, last name) and optional fields (email, phone, role). New members integrate seamlessly with file-imported list. System detects existing CircleUp users by email to prevent duplicates and enable account linking.');
    else if (want.includes('track') && want.includes('import') && want.includes('progress')) parts.push('Visual adoption funnel showing progression: Imported → Invited → Delivered → Registered → Profile Complete → Active. Follow-up tools for non-respondents: resend invitation, switch channel (email→SMS→code), generate personal invitation code. Exportable status report in CSV/XLSX. "Migration Complete" badge when 100% of members are onboarded.');
    else if (want.includes('circle') && want.includes('configuration') && want.includes('parameters')) parts.push('Circle configuration wizard with: name, contribution amount (multi-currency: CHF, EUR, USD, XAF, GBP), frequency (weekly/bi-weekly/monthly), positions (3-50), payout method (Fixed/Random/Bidding/Trust Score). Mid-cycle toggle reveals current cycle number and next payment date fields. Auto-calculates total circle value, payout per cycle, and Emergency Fund per member. Late payment rules: grace period (days), fee type (none/fixed/percentage), fee amount, suspension threshold. Up to 5 custom free-text rules.');
    else if (want.includes('circle') && want.includes('member') && want.includes('payout order')) parts.push('Select members from the association roster via checkboxes. Drag-and-drop interface assigns numbered payout positions (1 to N). Positions already completed can be marked as "Already Paid Out" with date, amount, and notes. Alternative CSV/XLSX import for payout order mapping. Rotation order is locked on confirmation to prevent accidental changes.');
    else if (want.includes('mid-cycle') && want.includes('outstanding')) parts.push('Member × Cycle payment matrix grid with per-cell status (Paid/Late/Missed/Partial) and actual amount entry. Tracks outstanding debts and partial payments per member. Emergency Fund balance input with plausibility validation (expected vs actual, with discrepancy reason). Circle Financial Summary displays: total collected, total paid out, outstanding per member, Emergency Fund balance, next payment date. Requires explicit organizer confirmation.');
    else if (want.includes('multiple') && want.includes('circle')) parts.push('Repeat the circle import wizard for each circle, with the association member roster pre-loaded. Members assigned to multiple circles display a multi-circle badge. Card dashboard shows all imported circles with status (Draft/Validated/Active), contribution amount, frequency, and cycle progress. Bulk finalization generates a combined financial summary across all circles.');
    else if (want.includes('circle') && want.includes('validation') && want.includes('consistency')) parts.push('Automated validation checks: member count matches position count, contribution totals reconcile with expected amounts, all positions are assigned, payout amounts match circle parameters, Emergency Fund balance is within expected range. Errors categorized as Blocking (must fix before proceeding) or Warning (can acknowledge with reason). Audit trail records all acknowledged warnings with timestamp, actor, and justification. Green "Validation Complete" badge with full reconciliation table.');
    else if (want.includes('contribution') && want.includes('history')) parts.push('Upload contribution records via CSV/XLSX with a downloadable template. System auto-maps dates to cycle numbers based on circle frequency. Supports both row-per-payment and matrix format (members × months). Flags amount discrepancies: over-payments, under-payments, and missing records. All imported records tagged as "Imported" to distinguish from platform-processed contributions. Source file archived with SHA-256 hash.');
    else if (want.includes('payout') && want.includes('history')) parts.push('Enter exact date, actual amount, and payment method for each completed payout position. System validates that dates fall within expected cycle periods. Significant amount discrepancies (>5% from expected) require a reason. Reconciliation summary shows total payouts vs total contributions vs Emergency Fund balance, highlighting any discrepancies.');
    else if (want.includes('dues') && want.includes('fee') && want.includes('history')) parts.push('Upload dues history file or manually set current standing per member: Paid Up (through date), Partially Paid (amount owed), Overdue (amount owed, since date), or No History. Auto-detects payment patterns from uploaded data. Members with no history are flagged as "No Dues History" (neutral) rather than "Delinquent" (negative). Quick-path option: "Set Current Standing Only" for organizers transitioning from paper records.');
    else if (want.includes('trust score') && want.includes('bootstrap')) parts.push('Auto-calculates initial Trust Score (0-1000) from imported data using four factors: payment punctuality (40% weight), circle completion rate (25%), tenure/membership duration (15%), and dues payment consistency (20%). Scores capped at 750 for imported data, displayed with a "Bootstrapped" badge. After 3 months of on-platform activity, badge upgrades to "Verified". Members with no imported history receive a default score of 500 with "New Member" badge. Organizers can dispute scores with evidence submission.');
    else if (want.includes('archive') && want.includes('audit') && want.includes('trail')) parts.push('Immutable archive stores all uploaded files with timestamp, uploader identity, and SHA-256 hash for integrity verification. Each imported record is linked to its source file and row number with a transformation log showing what was changed. Chronological import audit trail viewable in Settings. Comprehensive audit PDF report generation for Swiss financial transparency compliance (FINMA regulations).');
    else if (want.includes('pre-go-live') && want.includes('validation')) parts.push('Multi-section validation covering Association Config, Members, Circles, and Permissions. Each section shows checks with pass/warning/error status. Blocking errors (red, displayed first) must be resolved before go-live. Warnings (yellow) can be acknowledged with a reason. Report updates in real-time as fixes are applied. "Go Live" button enabled only when all blocking issues are resolved. Readiness summary shows: registered members, active circles, total monthly contributions, estimated first automated payment date.');
    else if (want.includes('self-verification') && want.includes('wizard')) parts.push('On first login, imported members see a "Verify Your Information" wizard stepping through: profile data (name, email, phone) → assigned role → circle positions and rotation order → contribution history summary. Each section can be confirmed or disputed with free-text explanation. Completing verification grants a +25 Trust Score boost. The organizer receives real-time dispute notifications with an accept/reject workflow including resolution notes.');
    else if (want.includes('go-live') && want.includes('activation')) parts.push('Two activation modes: Immediate (one-click) or Scheduled (date/time picker with countdown timer). At activation: association status changes to "Active", all circles begin their next cycle, member notifications are sent. 7-day Emergency Pause safety net allows reverting to "Importing" status and pausing all automation. After 7 days: import is finalized, migration dashboard becomes a read-only "Migration Archive".');
    else if (want.includes('post-migration') && want.includes('support')) parts.push('Post-Migration Checklist widget tracks: first cycle payment status, member registration completion rate, dispute resolution progress, and upcoming key dates. Detailed First Cycle Report compares successful/failed payments against expected values. Migration-tagged support requests are escalated to a dedicated support queue. 30-day Migration Success Report shows: activation rate, payment success rate, disputes filed and resolved, and Trust Score distribution across imported members.');
    else parts.push('Associations are the core organizational unit in CircleUp. Each association has a type (cultural/religious/professional/savings/social/family), visibility setting, and manages its own members, circles, governance, and guided migration of existing associations onto the platform.');
  }
  else if (sectionNum === 4) { // Members & Trust
    if (want.includes('trust score') && (want.includes('gauge') || want.includes('circular'))) parts.push('Prominent circular gauge with gradient fill (red→amber→green). Numeric score centered. Below: qualitative label, last update date, 30-day trend arrow (+/- points). Info icon opens Trust Score explainer.');
    else if (want.includes('factor breakdown')) parts.push('Six horizontal progress bars: Payment History (40%), Verification (20%), Tenure (15%), Engagement (10%), Network (10%), External (5%). Each shows factor name, weight, current score, max possible. Color-coded by performance.');
    else if (want.includes('at-risk') || want.includes('flagged')) parts.push('Organizer panel showing members with >50pt Trust Score drop, 2+ missed payments, decreased logins, or engagement drop. Cards show risk level (High/Medium/Low), specific indicators, last active date. Real-time AI updates.');
    else parts.push('The Members & Trust system is central to CircleUp\'s value proposition. Trust Scores (0-1000) quantify reliability through payment history, verification, tenure, engagement, network effects, and external data.');
  }
  else if (sectionNum === 5) { // ROSCA Circles
    if (want.includes('create') && want.includes('wizard')) parts.push('6-step wizard: Basics (name, description, type) → Schedule (frequency, start date, duration) → Allocation (fixed/random/bidding/trust_score payout method) → Penalties (late fees, grace period) → Invite (members) → Review. AI configuration suggestions available.');
    else if (want.includes('contribution') && want.includes('payment')) parts.push('Contribution flow: view current amount/cycle/due date → select saved payment method or add new (card/bank/SEPA) → confirm with fee breakdown → Stripe processes → confirmation screen with transaction ID and receipt download.');
    else if (want.includes('auto-pay')) parts.push('Standing order configuration with primary and backup payment methods. Auto-charges on due date. Fallback to backup method on failure. Email notification of each auto-payment. Easily cancellable from payment settings.');
    else if (want.includes('payout') && want.includes('schedule')) parts.push('Visual calendar showing all payout dates with member names. User\'s own payout highlighted with countdown timer. Calendar export (iCal) available. Schedule adjusts dynamically for position swaps or circle changes.');
    else if (want.includes('emergency fund')) parts.push('1% of every contribution automatically allocated. Balance shown as gauge with utilization rate. Intervention history lists covered defaults. Member repayment progress bars show recovery status. Fund protects all members from defaults.');
    else if (want.includes('bidding')) parts.push('Bidding window opens per cycle. Members submit bid amounts (premium they\'ll pay for early payout). Countdown timer shows remaining time. Winner: highest bidder. Premium distributed to remaining members or added to pool.');
    else parts.push('ROSCA Circles are the core financial product — rotating savings groups with automated payments, AI-powered risk management, and Emergency Fund protection. Lifecycle: Forming → Active → Completed/Cancelled.');
  }
  else if (sectionNum === 6) { // Treasury
    parts.push('The treasury system provides multi-fund accounting with segregated circle funds, daily automated reconciliation via Stripe, Emergency Fund management with member voting, and FINMA-compliant audit reporting.');
  }
  else if (sectionNum === 7) { // Credit
    if (want.includes('credit score')) parts.push('CircleUp credit score (0-1000) built from ROSCA participation. Factors: payment consistency, circle completion rate, contribution amounts, tenure, and Trust Score. Displayed as circular gauge with factor breakdown and trend history.');
    else if (want.includes('advance')) parts.push('Payout advances allow members to receive funds before their scheduled payout date. Eligibility based on contribution history and Trust Score. Automatic repayment deducted from the eventual payout. Clear fee/interest disclosure.');
    else parts.push('Credit & Lending bridges informal ROSCA savings to formal financial services. Products include payout advances (short-term), personal loans (medium-term), and collective lending (group-backed). All credit decisions factor in ROSCA participation history.');
  }
  else if (sectionNum === 8) { // Multi-Share
    parts.push('Multi-Share allows members to hold 1-10 shares of the base contribution, proportionally increasing both their contributions and payouts. Requires Trust Score thresholds (1-2 shares: 500+, 3-4: 650+, 5+: 750+). Emergency Fund covers full default amounts.');
  }
  else if (sectionNum === 9) { // Governance
    if (want.includes('election')) parts.push('Elections support multiple voting models: Simple Majority, Supermajority (2/3), Consensus, Weighted. Secret ballot with encrypted storage. Automatic tallying with tie-breaking (runoff or tiebreaker rules). Tamper-proof audit trail.');
    else if (want.includes('proposal')) parts.push('Proposals follow a lifecycle: Draft → Under Review → Voting → Passed/Rejected → Implemented. Discussion threads allow member input. Amendments can be submitted. Voting progress bar shows real-time results (if configured as visible).');
    else if (want.includes('committee')) parts.push('Committees have designated chair/vice-chair, meeting schedules, and document repositories. Members can request to join (chair approval required). Committee activity feeds into governance health indicators.');
    else parts.push('Governance & Voting enables democratic decision-making with configurable voting models, quorum requirements, and cultural presets (Parliamentary, Consensus-based, Elder Council). All votes are encrypted and auditable.');
  }
  else if (sectionNum === 10) { // Communication
    parts.push('Multi-channel communication supporting in-app, push, email, SMS, WhatsApp, and USSD. Payment reminders at 7/3/1 days before due date with escalating urgency. All announcements available in EN/FR/DE/IT/PT with automatic translation.');
  }
  else if (sectionNum === 11) { // Documents
    parts.push('Document management for association records with folder organization, full-text search, version tracking, and access controls. Auto-generates contribution receipts and payout confirmations. Supports digital agreement signing.');
  }
  else if (sectionNum === 12) { // Projects & Fundraising
    if (want.includes('campaign') && want.includes('create')) parts.push('5-step campaign wizard: Basic Info → Goal & Timeline → Media (cover + gallery) → Settings (visibility, min donation, anonymous toggle) → Preview & Launch. Categories: emergency, project, community, education.');
    else if (want.includes('donate') || want.includes('donation')) parts.push('Donation flow: preset or custom amount → anonymous toggle → personal message → payment via Stripe → confirmation receipt. One-time or recurring options. Min CHF 5, max CHF 50,000 (AML threshold). 14-day refund window.');
    else parts.push('Community fundraising for specific projects, emergencies, or initiatives. Campaigns track progress toward goals with milestone celebrations. Donor management includes tiers (Bronze/Silver/Gold/Platinum) and automated thank-you messages.');
  }
  else if (sectionNum === 13) { // Community & Social
    parts.push('Social engagement features: referral program with multi-level earnings, achievement badges for savings milestones, opt-in leaderboards, savings challenges, peer mentorship matching, and community impact dashboards.');
  }
  else if (sectionNum === 14) { // Analytics
    parts.push('Analytics spans four levels: Personal (savings across circles), Circle (collection rates, engagement), Association (aggregate metrics, top circles), Federation (cross-association comparison). Supports PDF/CSV export and scheduled report delivery.');
  }
  else if (sectionNum === 15) { // AI Insights
    parts.push('AI-powered intelligence: member circle recommendations, financial health chat assistant, predictive cash flow alerts, organizer default risk scores, circle health scoring, platform fraud detection, and smart notification timing.');
  }
  else if (sectionNum === 16) { // Federations
    parts.push('Federations coordinate multiple associations with shared governance policies (Mandatory/Recommended/Optional enforcement), consolidated financial dashboards, federation-level elections, dues collection, and compliance monitoring.');
  }
  else if (sectionNum === 17) { // Platform Admin
    if (want.includes('aml') || want.includes('transaction monitoring')) parts.push('Real-time AML monitoring with configurable risk rules. Pattern detection: structuring (split transactions), layering (circular flows), velocity (unusual frequency). Third-party AML service integration. Auto-flagging with severity levels.');
    else if (want.includes('sar') || want.includes('suspicious activity')) parts.push('SAR filing form with attachment support, draft/review workflow, and regulator submission tracking. 30-day filing deadline from detection. Templates for common scenarios. Filing history maintained.');
    else if (want.includes('gdpr')) parts.push('GDPR DSR handling: intake for access/rectification/erasure/portability. Identity verification step. 30-day deadline tracker with automated acknowledgments. Generates compliant data exports. Legal hold capability.');
    else if (want.includes('rbac') || want.includes('permission')) parts.push('Two-dimensional RBAC: Access Roles (Admin/Standard/Invitee) set ceiling × Contextual Roles (President/Treasurer/Organizer/Member) grant feature access. Effective permission = min(ceiling, contextual, override). <50ms cached evaluation.');
    else if (want.includes('support') || want.includes('ticket')) parts.push('Multi-channel support intake (app/email/chat). AI categorization and priority routing. SLAs: Urgent 1hr, High 4hrs, Medium 24hrs, Low 48hrs. Escalation chain with authority levels. CSAT surveys post-resolution.');
    else if (want.includes('feature flag')) parts.push('Feature flags with targeting rules: user segment, association, percentage rollout. Schedule flag changes. Flag history and dependency tracking. Emergency kill switch for instant rollback.');
    else if (want.includes('system health')) parts.push('Real-time monitoring: API response times, error rates, payment processing status, notification delivery, database health, queue depth. Third-party service status. Alert configuration with incident timeline.');
    else parts.push('Platform Administration provides tools for operators, compliance officers, and support staff. Includes AML monitoring, FINMA reporting, GDPR compliance, RBAC management, and customer support with SLA tracking.');
  }

  // Check for spec match to add more context
  const specMatch = findBestSpecMatch(t, sectionNum);
  if (specMatch && specMatch.desc) {
    parts.push(specMatch.desc);
  }

  return parts.length > 0 ? parts.slice(0, 2).join(' ') : '';
}

// ── Acceptance criteria generator ──────────────────────────
function generateAC(story, sectionNum) {
  // First try spec match
  const specMatch = findBestSpecMatch(story.story, sectionNum);
  if (specMatch && specMatch.ac.length >= 3) return specMatch.ac.slice(0, 8);

  const t = story.story.toLowerCase();
  const ac = [];

  // Extract nouns and key terms from the "want" portion
  const wm = t.match(/i want (?:to )?(.+?)(?:\s+so\s|$)/);
  const want = wm ? wm[1] : '';

  // Extract explicit values from story text
  const vals = t.match(/\d+[\w%/-]*/g) || [];
  const hasParens = t.match(/\(([^)]+)\)/g) || [];
  // Extract items in parentheses as AC material
  for (const p of hasParens) {
    const inner = p.replace(/[()]/g, '').trim();
    if (inner.includes('/') || inner.includes(',')) {
      const items = inner.split(/[/,]/).map(s => s.trim()).filter(s => s.length > 1);
      if (items.length >= 2 && items.length <= 8) {
        ac.push(`Supports all specified options: ${items.join(', ')}`);
      }
    }
  }

  // ─── Story-specific AC based on key verbs/nouns ───
  if (want.includes('see') || want.includes('view')) {
    ac.push('Content is visible and correctly formatted on page load');
    ac.push('Data reflects the current state (no stale data older than 60 seconds)');
  }
  if (want.includes('create') || want.includes('submit') || want.includes('file')) {
    ac.push('All required fields have validation with inline error messages');
    ac.push('Successful submission shows confirmation with unique reference ID');
    ac.push('Incomplete submissions can be saved as drafts');
  }
  if (want.includes('search') || want.includes('browse') || want.includes('discover')) {
    ac.push('Search returns results within 500ms with relevance ranking');
    ac.push('Empty state shows helpful message when no results match');
    ac.push('Filters persist during the session and can be cleared with one click');
  }
  if (want.includes('edit') || want.includes('manage') || want.includes('configure') || want.includes('set')) {
    ac.push('Changes require explicit save action (no auto-save for critical settings)');
    ac.push('Confirmation dialog shown before destructive changes');
    ac.push('Previous values can be restored if change was made in error');
  }
  if (want.includes('invite') || want.includes('send')) {
    ac.push('Delivery status is tracked and shown to the sender');
    ac.push('Rate limiting prevents abuse (clear message when limit reached)');
    ac.push('Recipient receives the invitation within 60 seconds');
  }
  if (want.includes('pay') || want.includes('contribut') || want.includes('donat')) {
    ac.push('Amount and all fees are displayed before final confirmation');
    ac.push('Payment processed via Stripe with PCI-DSS compliance');
    ac.push('Transaction receipt generated and available for download (PDF)');
    ac.push('Failed transaction shows specific error with retry option');
  }
  if (want.includes('track') || want.includes('monitor') || want.includes('progress')) {
    ac.push('Status updates reflect in real-time without page refresh');
    ac.push('Historical data is preserved and viewable in timeline format');
    ac.push('Visual indicators (badges, progress bars) clearly show current state');
  }
  if (want.includes('report') || want.includes('export') || want.includes('generate')) {
    ac.push('Export available in PDF (branded) and CSV formats');
    ac.push('Report respects user\'s permission scope (only authorized data)');
    ac.push('Large reports generate asynchronously with download notification');
  }
  if (want.includes('vote') || want.includes('ballot') || want.includes('election')) {
    ac.push('Vote is encrypted and stored securely (cannot be tampered with)');
    ac.push('Voter receives anonymized confirmation receipt');
    ac.push('Results only visible after voting period closes (if configured)');
    ac.push('System enforces quorum requirements before tallying');
  }
  if (want.includes('approve') || want.includes('reject') || want.includes('review')) {
    ac.push('Approver sees full context including requestor profile and history');
    ac.push('Decision is recorded with timestamp in immutable audit trail');
    ac.push('Requestor is notified of decision within 30 seconds');
  }
  if (want.includes('score') || want.includes('gauge') || want.includes('rating')) {
    ac.push('Score displays with correct color coding per defined ranges');
    ac.push('Factor breakdown shows individual contributions to total');
    ac.push('Trend indicator shows change over last 30 days');
  }
  if (want.includes('notification') || want.includes('alert') || want.includes('reminder')) {
    ac.push('Delivered via user\'s preferred channel (in-app/push/email/SMS/WhatsApp)');
    ac.push('Notification content is translated to user\'s language preference');
    ac.push('Delivery is logged with timestamp and channel');
  }
  if (want.includes('chart') || want.includes('graph') || want.includes('dashboard') || want.includes('metric')) {
    ac.push('Visualizations render correctly on mobile (320px) through desktop (1920px)');
    ac.push('Tooltips/labels show exact values on hover or tap');
    ac.push('Date range selector allows filtering (7d, 30d, 90d, 1y, custom)');
  }
  if (want.includes('upload') || want.includes('document') || want.includes('file')) {
    ac.push('Supports drag-and-drop and file picker upload methods');
    ac.push('File type and size limits clearly displayed (validation on select)');
    ac.push('Upload progress indicator shown for files > 500KB');
  }
  if (want.includes('role') || want.includes('permission') || want.includes('access')) {
    ac.push('Changes take effect immediately without requiring re-login');
    ac.push('UI dynamically adapts to show/hide elements per new permissions');
    ac.push('Change is logged in RBAC audit trail with justification');
  }
  if (want.includes('compliance') || want.includes('audit') || want.includes('regulatory') || want.includes('finma')) {
    ac.push('All actions recorded in immutable audit log (7-year retention)');
    ac.push('Reports generated in regulator-specified formats');
    ac.push('Deadline tracking with automated escalation on approaching expiry');
  }
  if (want.includes('schedule') || want.includes('calendar') || want.includes('recurring')) {
    ac.push('All times display in user\'s local time zone');
    ac.push('Calendar export available (iCal/Google Calendar)');
    ac.push('Recurring items support individual occurrence modification');
  }

  // Extract quantitative constraints
  for (const v of vals) {
    if (v.match(/^\d+%$/)) ac.push(`${v} threshold is accurately calculated and enforced`);
    else if (v.match(/^\d+$/)) {
      const num = parseInt(v);
      if (num > 0 && num < 1000 && t.includes(v)) {
        const ctx = t.substring(Math.max(0, t.indexOf(v) - 30), t.indexOf(v) + v.length + 30);
        if (ctx.includes('attempt') || ctx.includes('fail')) ac.push(`Limit of ${v} attempts is enforced with clear feedback`);
        else if (ctx.includes('hour') || ctx.includes('minute') || ctx.includes('day')) ac.push(`${v}-time constraint is enforced by the system`);
        else if (ctx.includes('member') || ctx.includes('share')) ac.push(`Capacity limit of ${v} is enforced with waitlist when exceeded`);
      }
    }
  }

  // Ensure minimum 5 AC
  if (ac.length < 5) {
    const fillers = [
      'Feature is accessible in both light and dark mode',
      'Loading states are shown during data fetches (skeleton or spinner)',
      'Error states display actionable messages with recovery options',
      'Feature is keyboard-navigable and screen-reader accessible',
      'All user-facing text supports i18n (EN, FR, DE, IT, PT)',
      'Action is recorded in the platform audit trail',
      'Mobile-responsive layout adapts from 320px to 1920px viewports'
    ];
    for (const f of fillers) {
      if (ac.length >= 6) break;
      if (!ac.includes(f)) ac.push(f);
    }
  }

  return [...new Set(ac)].slice(0, 8);
}

// Enrich all stories
for (const sec of sections) {
  for (const ep of sec.epics) {
    for (const st of ep.stories) {
      st.description = generateDescription(st, sec.num);
      st.ac = generateAC(st, sec.num);
    }
  }
}

// ── 4. Generate HTML ───────────────────────────────────────
function esc(s) { return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
function pCls(p) { return `priority-${p.toLowerCase().replace(/\/.*/, '')}`; }

function cardHtml(s) {
  const acHtml = s.ac.map(a => `<li>${esc(a)}</li>`).join('');
  return `<div class="sc">
<div class="sh"><span class="sid">${s.id}</span><span class="st">${esc(s.title)}</span><span class="p ${pCls(s.p)}">${s.p}</span></div>
<div class="story">${esc(s.story)}</div>
<div class="sd">${esc(s.description.replace(s.story, '').trim())}</div>
<div class="ac-section">
  <div class="ac-title">Acceptance Criteria</div>
  <ul class="ac-list">${acHtml}</ul>
</div>
<div class="sm"><b>Role:</b> ${esc(s.role)}</div>
</div>`;
}

function epicHtml(e) {
  // Extract epic number (e.g., "Epic 3.6: ..." → "3.6")
  const epicNumMatch = e.title.match(/Epic ([\d.]+):/);
  const epicNum = epicNumMatch ? epicNumMatch[1] : null;
  const relPath = epicNum ? epicScreenshotMap[epicNum] : null;
  const b64 = relPath ? screenshotBase64[relPath] : null;
  const imgHtml = b64
    ? `<div class="epic-screenshot"><img src="data:image/png;base64,${b64}" /></div>`
    : '';
  return `<div class="eb"><div class="et">${esc(e.title)}</div>\n${imgHtml}${e.stories.map(cardHtml).join('\n')}</div>`;
}

function sectionHtml(sec) {
  return `<div class="fs">
<div class="fh"><h2>${sec.num}. ${esc(sec.title)}</h2><div class="fd">${esc(sec.desc)}</div></div>
${sec.epics.map(epicHtml).join('\n')}
</div>`;
}

function tocLine(sec) {
  const sc = sec.epics.reduce((a, e) => a + e.stories.length, 0);
  return `<div class="ti"><span><span class="tn">${sec.num}</span>${esc(sec.title)}</span><span class="tc">${sec.epics.length} epics · ${sc} stories</span></div>`;
}

function sumRow(sec) {
  const st = sec.epics.flatMap(e => e.stories);
  return `<tr><td>${sec.num}. ${esc(sec.title)}</td><td class="c">${sec.epics.length}</td><td class="c">${st.length}</td><td class="c">${st.filter(s=>s.p==='P0').length}</td><td class="c">${st.filter(s=>s.p==='P1').length}</td><td class="c">${st.filter(s=>s.p==='P2').length}</td></tr>`;
}

const allS = sections.flatMap(s => s.epics.flatMap(e => e.stories));
const tE = sections.reduce((a, s) => a + s.epics.length, 0);
const tS = allS.length;

const html = `<!DOCTYPE html><html><head><meta charset="UTF-8">
<link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500&display=swap" rel="stylesheet">
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:'DM Sans',sans-serif;font-size:9pt;line-height:1.45;color:#1f2937}

/* Cover */
.cover{page-break-after:always;display:flex;flex-direction:column;justify-content:center;align-items:center;min-height:100vh;background:linear-gradient(135deg,#4f46e5 0%,#7c3aed 50%,#6d28d9 100%);color:#fff;text-align:center;padding:60px}
.cover h1{font-size:44pt;font-weight:700;letter-spacing:-1.5px;margin-bottom:6px}
.cover .sub{font-size:16pt;font-weight:400;opacity:.9;margin-bottom:44px}
.cover .stats{display:flex;gap:52px}
.cover .sb{text-align:center}
.cover .sn{font-size:36pt;font-weight:700}
.cover .sl{font-size:8.5pt;opacity:.7;text-transform:uppercase;letter-spacing:1.5px;margin-top:2px}
.cover .meta{font-size:9.5pt;opacity:.55;margin-top:56px;line-height:1.6}

/* TOC */
.toc{page-break-after:always;padding:44px 52px}
.toc h2{font-size:20pt;font-weight:700;color:#4f46e5;margin-bottom:20px;padding-bottom:10px;border-bottom:2.5px solid #4f46e5}
.ti{display:flex;justify-content:space-between;align-items:baseline;padding:7px 0;border-bottom:1px dotted #d1d5db;font-size:10.5pt}
.tn{font-weight:600;color:#4f46e5;margin-right:6px;min-width:22px;display:inline-block}
.tc{color:#6b7280;font-size:8.5pt;font-family:'IBM Plex Mono',monospace}
.pl{display:flex;gap:22px;margin-top:28px;font-size:8.5pt;align-items:center}
.pl > span{display:flex;align-items:center;gap:5px}

/* Content */
.content{padding:0 52px 40px}
.fs{page-break-before:always}
.fh{background:linear-gradient(135deg,#eef2ff,#f5f3ff);border-left:4px solid #4f46e5;padding:16px 20px;margin-bottom:20px;border-radius:0 6px 6px 0}
.fh h2{font-size:16pt;font-weight:700;color:#4f46e5;margin-bottom:3px}
.fd{color:#6b7280;font-size:9pt;line-height:1.4}

/* Epics */
.eb{margin-bottom:18px}
.et{font-size:10.5pt;font-weight:700;padding:6px 10px;background:#f9fafb;border:1px solid #e5e7eb;border-radius:4px;margin-bottom:8px}
.epic-screenshot{margin-bottom:10px;break-inside:avoid}
.epic-screenshot img{width:100%;border:1px solid #e5e7eb;border-radius:6px;box-shadow:0 1px 3px rgba(0,0,0,.08)}

/* Story Cards */
.sc{border:1px solid #e5e7eb;border-radius:5px;padding:10px 13px;margin-bottom:7px;break-inside:avoid;background:#fff}
.sh{display:flex;justify-content:space-between;align-items:flex-start;gap:8px;margin-bottom:3px}
.sid{font-family:'IBM Plex Mono',monospace;font-size:7.5pt;font-weight:500;color:#4f46e5;background:#eef2ff;padding:1px 5px;border-radius:3px;white-space:nowrap;flex-shrink:0}
.st{font-weight:600;font-size:9pt;flex:1;color:#111827}
.p{font-family:'IBM Plex Mono',monospace;font-size:7pt;font-weight:600;padding:1px 7px;border-radius:10px;white-space:nowrap;flex-shrink:0}
.priority-p0{background:#fef2f2;color:#dc2626}
.priority-p1{background:#fffbeb;color:#d97706}
.priority-p2{background:#eff6ff;color:#2563eb}

.story{font-size:8.5pt;color:#374151;line-height:1.45;font-style:italic;margin-bottom:3px}
.sd{font-size:8pt;color:#6b7280;line-height:1.4;margin-bottom:4px}

/* Acceptance Criteria */
.ac-section{background:#f9fafb;border:1px solid #f3f4f6;border-radius:4px;padding:6px 10px;margin-top:4px}
.ac-title{font-size:7.5pt;font-weight:700;text-transform:uppercase;letter-spacing:.5px;color:#4f46e5;margin-bottom:3px}
.ac-list{margin:0;padding-left:14px;font-size:7.5pt;color:#4b5563;line-height:1.45}
.ac-list li{margin-bottom:1px}
.ac-list li::marker{color:#4f46e5}

.sm{font-size:7pt;color:#9ca3af;margin-top:3px}
.sm b{text-transform:uppercase;letter-spacing:.4px;font-size:6.5pt}

/* Summary */
.sp{page-break-before:always;padding:44px 52px}
.sp h2{font-size:16pt;font-weight:700;color:#4f46e5;margin-bottom:20px}
table.sum{width:100%;border-collapse:collapse;font-size:8.5pt}
table.sum th{background:#4f46e5;color:#fff;padding:7px 12px;text-align:left;font-weight:600;font-size:8pt}
table.sum td{padding:6px 12px;border-bottom:1px solid #e5e7eb}
table.sum tr:nth-child(even) td{background:#f9fafb}
table.sum .total td{font-weight:700;background:#eef2ff;border-top:2px solid #4f46e5}
.c{text-align:center!important}

.legend{margin-top:24px;padding:16px;background:#f9fafb;border:1px solid #e5e7eb;border-radius:6px}
.legend h3{font-size:10pt;margin-bottom:8px;color:#374151}
</style></head><body>

<!-- Cover -->
<div class="cover">
<h1>CircleUp</h1>
<div class="sub">Features, Epics & User Stories</div>
<div class="stats">
<div class="sb"><div class="sn">${sections.length}</div><div class="sl">Features</div></div>
<div class="sb"><div class="sn">${tE}</div><div class="sl">Epics</div></div>
<div class="sb"><div class="sn">${tS}</div><div class="sl">User Stories</div></div>
<div class="sb"><div class="sn">${screenshotCount}</div><div class="sl">Screen Designs</div></div>
</div>
<div class="meta">Complete Product Backlog with Acceptance Criteria<br>AI-Powered Association Management & ROSCA Platform<br>February 24, 2026 · v3.1</div>
</div>

<!-- TOC -->
<div class="toc">
<h2>Table of Contents</h2>
${sections.map(tocLine).join('\n')}
<div class="pl">
<span><span class="p priority-p0">P0</span> Must-have (launch blocker)</span>
<span><span class="p priority-p1">P1</span> Should-have (high value)</span>
<span><span class="p priority-p2">P2</span> Nice-to-have (future phase)</span>
</div>
</div>

<!-- Content -->
<div class="content">
${sections.map(sectionHtml).join('\n')}
</div>

<!-- Summary -->
<div class="sp">
<h2>Summary</h2>
<table class="sum">
<thead><tr><th>Feature Area</th><th class="c">Epics</th><th class="c">Stories</th><th class="c">P0</th><th class="c">P1</th><th class="c">P2</th></tr></thead>
<tbody>
${sections.map(sumRow).join('\n')}
<tr class="total"><td><strong>TOTAL</strong></td><td class="c"><strong>${tE}</strong></td><td class="c"><strong>${tS}</strong></td><td class="c"><strong>${allS.filter(s=>s.p==='P0').length}</strong></td><td class="c"><strong>${allS.filter(s=>s.p==='P1').length}</strong></td><td class="c"><strong>${allS.filter(s=>s.p==='P2').length}</strong></td></tr>
</tbody></table>

<div class="legend">
<h3>Priority Distribution</h3>
<div class="pl">
<span><span class="p priority-p0">P0</span> ${allS.filter(s=>s.p==='P0').length} stories (${Math.round(allS.filter(s=>s.p==='P0').length/tS*100)}%) — Must-have for launch</span>
<span><span class="p priority-p1">P1</span> ${allS.filter(s=>s.p==='P1').length} stories (${Math.round(allS.filter(s=>s.p==='P1').length/tS*100)}%) — High value, post-launch</span>
<span><span class="p priority-p2">P2</span> ${allS.filter(s=>s.p==='P2').length} stories (${Math.round(allS.filter(s=>s.p==='P2').length/tS*100)}%) — Future phases</span>
</div>
</div>

<div style="margin-top:28px;font-size:7pt;color:#9ca3af;text-align:center">
CircleUp — Features, Epics & User Stories with Acceptance Criteria · v3.1 · February 24, 2026<br>
Generated from product specifications · ${tS} stories across ${tE} epics in ${sections.length} feature areas
</div>
</div>

</body></html>`;

const outHtml = join(ROOT, 'product/features-epics-stories.html');
const outPdf = join(ROOT, 'product/features-epics-stories.pdf');

writeFileSync(outHtml, html);
console.log(`HTML: ${sections.length} sections, ${tE} epics, ${tS} stories`);

// Generate PDF — use file URL to handle large HTML with embedded images
const browser = await puppeteer.launch({ headless: 'shell', protocolTimeout: 300000, timeout: 120000, args: ['--disable-dev-shm-usage'] });
const page = await browser.newPage();
await page.goto(`file://${outHtml}`, { waitUntil: 'networkidle0', timeout: 120000 });
await page.pdf({
  path: outPdf,
  format: 'A4',
  printBackground: true,
  margin: { top: '14mm', bottom: '14mm', left: '0', right: '0' },
  displayHeaderFooter: true,
  headerTemplate: '<div></div>',
  footerTemplate: '<div style="font-size:7px;color:#9ca3af;text-align:center;width:100%;font-family:sans-serif;padding:0 40px;">CircleUp — Features, Epics & User Stories · Page <span class="pageNumber"></span> of <span class="totalPages"></span></div>',
});
await browser.close();

console.log(`PDF saved: ${outPdf}`);
