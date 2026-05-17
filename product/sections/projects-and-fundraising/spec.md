# Projects & Fundraising

## Overview

The Projects & Fundraising section enables associations to create and manage fundraising campaigns for specific projects, emergencies, or community initiatives. Members can contribute donations, track campaign progress, and see the impact of their contributions.

## User Stories

### Epic 1: Campaign Management

#### PROJ-001: Fundraising Campaign Creation
**As an** association admin,
**I want to** create and configure fundraising campaigns,
**So that** we can raise funds for specific projects or initiatives.

**Acceptance Criteria:**
- Can create campaign with title, description, and goal amount
- Can set campaign start and end dates
- Can add cover image and media gallery
- Can categorize campaign (emergency, project, community, education, etc.)
- Can set minimum and suggested donation amounts
- Can enable/disable anonymous donations
- Can set visibility (public, members-only, invited)

#### PROJ-002: Donation Collection & Processing
**As a** member or supporter,
**I want to** make donations to campaigns,
**So that** I can contribute to causes I care about.

**Acceptance Criteria:**
- Can select donation amount (preset or custom)
- Can choose one-time or recurring donation
- Can opt for anonymous donation
- Can add a personal message with donation
- Receives confirmation receipt via email
- Payment processed through standard payment methods
- Tax receipt generated where applicable

#### PROJ-003: Campaign Progress Tracking
**As a** campaign viewer,
**I want to** see real-time progress toward the fundraising goal,
**So that** I can understand how the campaign is performing.

**Acceptance Criteria:**
- Progress bar shows percentage of goal reached
- Total raised amount displayed prominently
- Number of donors shown
- Time remaining countdown for time-limited campaigns
- Recent donations feed (with anonymity respected)
- Milestone celebrations at 25%, 50%, 75%, 100%

### Epic 2: Donor Management

#### PROJ-004: Donor Management & Recognition
**As an** association admin,
**I want to** manage donors and recognize their contributions,
**So that** we can build lasting relationships with supporters.

**Acceptance Criteria:**
- Donor list with contact information and history
- Donor tiers based on contribution levels (Bronze, Silver, Gold, Platinum)
- Automated thank-you messages by tier
- Donor recognition wall (opt-in)
- Export donor list for tax reporting
- Track recurring vs one-time donors
- Donor retention metrics

#### PROJ-005: Project Reporting & Impact
**As a** donor,
**I want to** see how my contributions are being used,
**So that** I can trust the organization and feel good about giving.

**Acceptance Criteria:**
- Campaign updates posted by admins
- Photos and videos of project progress
- Financial breakdown of fund usage
- Impact metrics (people helped, items purchased, etc.)
- Final report when campaign closes
- Notification to donors when updates posted

### Epic 3: Advanced Campaigns

#### PROJ-006: Impact Stories & Updates
**As an** association admin,
**I want to** share impact stories and campaign updates,
**So that** donors stay engaged and informed.

**Acceptance Criteria:**
- Rich text editor for updates
- Photo and video upload support
- Schedule updates for future posting
- Email notification to donors when update posted
- Social sharing integration
- Pin important updates to top
- Comments/reactions on updates (optional)

#### PROJ-007: Matching Campaign Management
**As an** association admin,
**I want to** create matching campaigns where donations are matched,
**So that** we can incentivize giving and maximize impact.

**Acceptance Criteria:**
- Set matching ratio (1:1, 2:1, etc.)
- Set matching cap (max amount to be matched)
- Identify matching sponsor (individual or organization)
- Real-time display of matched amounts
- Automatic calculation of effective donation
- Matching deadline separate from campaign deadline
- Thank matching sponsor in communications

## Screen Designs

### Primary Screens

1. **Campaign List** - Browse all active and past campaigns
   - Filter by status (active, completed, upcoming)
   - Filter by category
   - Search campaigns
   - Grid or list view

2. **Campaign Detail** - Full campaign page
   - Hero image and description
   - Progress bar and stats
   - Donate button (prominent)
   - Recent donors feed
   - Updates timeline
   - Share buttons

3. **Donation Flow** - Multi-step donation process
   - Amount selection
   - Personal info (or anonymous)
   - Payment method
   - Confirmation and receipt

4. **Campaign Creator** - Admin campaign setup
   - Basic info step
   - Goal and timeline step
   - Media upload step
   - Settings and visibility step
   - Preview and launch

5. **Campaign Dashboard** - Admin analytics view
   - Donation trends chart
   - Donor demographics
   - Top donors table
   - Recent activity feed
   - Export options

6. **Donor Management** - Admin donor CRM
   - Donor list with filters
   - Individual donor profile
   - Communication history
   - Tier management

## Data Model

### Campaign
- `id`: Unique identifier
- `associationId`: Parent association
- `title`: Campaign name
- `description`: Rich text description
- `coverImage`: Hero image URL
- `mediaGallery`: Array of media items
- `category`: Campaign type enum
- `goalAmount`: Target amount
- `raisedAmount`: Current total
- `currency`: CHF, EUR, etc.
- `startDate`: Campaign start
- `endDate`: Campaign end (optional)
- `status`: draft, active, paused, completed, cancelled
- `visibility`: public, members, invited
- `allowAnonymous`: Boolean
- `minDonation`: Minimum amount
- `suggestedAmounts`: Array of preset amounts
- `donorCount`: Number of unique donors
- `createdAt`: Timestamp
- `createdBy`: Admin user ID

### Donation
- `id`: Unique identifier
- `campaignId`: Parent campaign
- `donorId`: User ID (null if anonymous)
- `donorName`: Display name
- `donorEmail`: Contact email
- `amount`: Donation amount
- `currency`: Payment currency
- `isAnonymous`: Boolean
- `isRecurring`: Boolean
- `recurringFrequency`: monthly, weekly (if recurring)
- `message`: Personal note
- `status`: pending, completed, refunded, failed
- `paymentMethod`: Card, bank transfer, etc.
- `transactionId`: Payment processor reference
- `matchedAmount`: If matched campaign
- `createdAt`: Timestamp

### CampaignUpdate
- `id`: Unique identifier
- `campaignId`: Parent campaign
- `title`: Update title
- `content`: Rich text content
- `media`: Array of images/videos
- `isPinned`: Boolean
- `publishedAt`: Timestamp
- `authorId`: Admin user ID

### MatchingConfig
- `id`: Unique identifier
- `campaignId`: Parent campaign
- `sponsorName`: Matching sponsor
- `sponsorLogo`: Optional logo
- `matchRatio`: 1.0 = 1:1, 2.0 = 2:1
- `matchCap`: Maximum match amount
- `matchedSoFar`: Current matched total
- `startDate`: Matching period start
- `endDate`: Matching period end
- `isActive`: Boolean

## Business Rules

1. **Campaign Lifecycle**
   - Draft campaigns not visible to public
   - Active campaigns accept donations
   - Paused campaigns visible but not accepting donations
   - Completed campaigns show final results
   - Funds released to association after campaign completion

2. **Donation Processing**
   - Minimum donation amount: CHF 5
   - Maximum single donation: CHF 50,000 (AML threshold)
   - Recurring donations can be cancelled anytime
   - Refunds available within 14 days

3. **Matching Rules**
   - Matching applies only during matching period
   - Matched amount cannot exceed match cap
   - Matching calculated in real-time
   - Sponsor notified when cap reached

4. **Privacy**
   - Anonymous donors not shown in public feed
   - Admins can see anonymous donor info for receipts
   - Donor list export requires admin permission
