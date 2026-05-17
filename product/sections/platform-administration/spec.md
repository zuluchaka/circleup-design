# Platform Administration

## Overview

The Platform Administration section provides tools for platform operators, compliance officers, and support staff to manage the CircleUp platform. This includes user account management, compliance monitoring, regulatory reporting, customer support, and system health monitoring.

## User Stories

### Epic 1: Compliance & Regulatory (COMP-001 to COMP-006)

#### COMP-001: AML Transaction Monitoring
**As a** compliance officer,
**I want to** monitor transactions for suspicious activity patterns,
**So that** we can detect and prevent money laundering.

**Acceptance Criteria:**
- Real-time transaction monitoring dashboard
- Configurable risk rules and thresholds
- Automatic flagging of high-risk transactions
- Pattern detection for structuring, layering, unusual velocity
- Risk scoring for transactions and users
- Alert queue with priority ranking
- Integration with third-party AML services

#### COMP-002: SAR Filing (Suspicious Activity Reports)
**As a** compliance officer,
**I want to** file Suspicious Activity Reports when required,
**So that** we comply with regulatory requirements.

**Acceptance Criteria:**
- SAR form with all required fields
- Attachment support for supporting documents
- Draft saving and review workflow
- Submission to regulatory authorities
- Filing history and audit trail
- Deadline tracking and reminders
- Case linking to related transactions/users

#### COMP-003: GDPR Data Subject Requests
**As a** compliance officer,
**I want to** process GDPR data subject requests,
**So that** we comply with privacy regulations.

**Acceptance Criteria:**
- Request intake form (access, rectification, erasure, portability)
- Identity verification workflow
- Data export generation (machine-readable format)
- Erasure execution with confirmation
- 30-day deadline tracking
- Request history and audit log
- Automated acknowledgment emails

#### COMP-004: Regulatory Reporting (FINMA)
**As a** compliance officer,
**I want to** generate and submit regulatory reports,
**So that** we maintain our operating license.

**Acceptance Criteria:**
- Scheduled report generation (monthly, quarterly, annual)
- FINMA-compliant report formats
- Data validation before submission
- Submission tracking and confirmation
- Historical report archive
- Report preview and approval workflow
- Automated data aggregation from platform

#### COMP-005: Audit Trail Management
**As a** compliance officer,
**I want to** access comprehensive audit trails,
**So that** we can demonstrate compliance during audits.

**Acceptance Criteria:**
- Immutable audit log for all actions
- Search and filter by user, action type, date range
- Export to standard formats (CSV, JSON)
- Retention policy enforcement (7 years)
- Tamper-evident logging
- Real-time audit log streaming
- Integration with SIEM systems

#### COMP-006: Data Retention & Archival
**As a** compliance officer,
**I want to** manage data retention policies,
**So that** we comply with legal requirements while respecting privacy.

**Acceptance Criteria:**
- Configurable retention periods by data type
- Automated archival of aged data
- Secure deletion with certification
- Legal hold capability
- Retention policy dashboard
- Scheduled retention jobs
- Restoration from archive

### Epic 2: Administrative (ADMIN-001 to ADMIN-005)

#### ADMIN-001: User Account Management (Admin)
**As a** platform admin,
**I want to** manage user accounts across the platform,
**So that** I can resolve issues and maintain platform integrity.

**Acceptance Criteria:**
- User search by name, email, phone, ID
- View complete user profile and activity
- Reset passwords and unlock accounts
- Modify user roles and permissions
- View and manage user's associations/circles
- Add admin notes to user accounts
- Impersonate user for debugging (with audit)

#### ADMIN-002: Circle Override & Manual Intervention
**As a** platform admin,
**I want to** manually intervene in circle operations,
**So that** I can resolve exceptional situations.

**Acceptance Criteria:**
- Override payout schedules
- Manually trigger or skip contributions
- Adjust member balances with justification
- Force circle status changes
- Reassign organizer role
- Extend or shorten circle duration
- All actions logged with admin notes

#### ADMIN-003: Platform Configuration Management
**As a** platform admin,
**I want to** configure platform-wide settings,
**So that** the platform operates according to business requirements.

**Acceptance Criteria:**
- Fee structure configuration
- Default circle settings
- Payment provider configuration
- Notification templates
- Terms of service management
- Rate limiting configuration
- Maintenance mode toggle

#### ADMIN-004: Feature Flag Management
**As a** product manager,
**I want to** manage feature flags,
**So that** we can control feature rollout and A/B testing.

**Acceptance Criteria:**
- Create and edit feature flags
- Target by user segment, association, percentage
- Schedule flag changes
- View flag history
- Emergency kill switch
- Flag dependencies management
- Integration with analytics

#### ADMIN-005: System Health Monitoring Dashboard
**As a** DevOps engineer,
**I want to** monitor system health in real-time,
**So that** I can respond quickly to issues.

**Acceptance Criteria:**
- Service status overview (API, payments, notifications)
- Error rate and latency metrics
- Active user count and transaction volume
- Database and queue health
- Third-party service status
- Alert configuration and history
- Incident timeline

### Epic 3: Customer Support (SUPP-001 to SUPP-006)

#### SUPP-001: Support Ticket Creation & Routing
**As a** support agent,
**I want to** receive and route support tickets efficiently,
**So that** users get timely help.

**Acceptance Criteria:**
- Ticket creation from multiple channels (app, email, chat)
- Automatic categorization by AI
- Priority assignment based on issue type
- Skill-based routing to agents
- SLA tracking and escalation
- Ticket templates for common issues
- User context automatically attached

#### SUPP-002: Dispute Resolution
**As a** support manager,
**I want to** manage payment and payout disputes,
**So that** we can resolve conflicts fairly.

**Acceptance Criteria:**
- Dispute intake with evidence upload
- Both party communication thread
- Evidence review interface
- Decision recording with rationale
- Refund or adjustment execution
- Appeal process
- Dispute analytics and patterns

#### SUPP-003: Payment Exception Handling
**As a** support agent,
**I want to** handle payment exceptions,
**So that** users can complete their transactions.

**Acceptance Criteria:**
- Failed payment queue
- Retry payment with different method
- Manual payment recording
- Refund processing
- Payment method update assistance
- Communication templates
- Exception categorization and reporting

#### SUPP-004: Escalation Management
**As a** support manager,
**I want to** manage escalated tickets,
**So that** complex issues are resolved appropriately.

**Acceptance Criteria:**
- Escalation triggers (time, sentiment, VIP)
- Manager queue and assignment
- Escalation history and notes
- Resolution authority levels
- Customer recovery actions
- Escalation prevention analysis
- Cross-team handoff

#### SUPP-005: Knowledge Base Management
**As a** support manager,
**I want to** maintain a knowledge base,
**So that** agents and users can find answers quickly.

**Acceptance Criteria:**
- Article creation and editing
- Category and tag organization
- Search functionality
- Version history
- Internal vs. public articles
- Usage analytics
- Suggested articles based on ticket content

#### SUPP-006: Customer Satisfaction Survey
**As a** product manager,
**I want to** collect customer satisfaction feedback,
**So that** we can improve the support experience.

**Acceptance Criteria:**
- Automated survey after ticket resolution
- CSAT, NPS, and CES metrics
- Agent-level satisfaction scores
- Trend analysis over time
- Verbatim feedback collection
- Survey response rate optimization
- Integration with agent performance

### Epic 4: RBAC — Role-Based Access Control (RBAC-001 to RBAC-048)

> **Two-Dimensional Permission Model:** Permissions are controlled by two axes — **Access Roles** (Admin, Standard User, Invitee) that set ceiling permissions, and **Contextual Roles** (Federation President, Association Admin, Treasurer, Organizer, Member, etc.) that grant feature-level access within that ceiling. Effective permission = `min(Access Role ceiling, Contextual Role permission, User override)`. Four access modes: **No Access**, **Read**, **Write**, **Read & Write**.

#### Sub-Epic E-RBAC-001: Core Permission Engine

##### RBAC-001: Permission Data Model
**As a** platform architect,
**I want to** define a structured permission data model,
**So that** the system can evaluate access decisions consistently.

**Acceptance Criteria:**
- Define AccessRole entity (Admin, Standard User, Invitee) with ceiling permissions
- Define ContextualRole entity with scope (federation, association, circle)
- Define Permission entity linking roles to features with access modes (none, read, write, read_write)
- Define Feature entity with hierarchical sub-features
- Support user-level permission overrides
- Store permission evaluation order: Access Role → Contextual Role → User Override

##### RBAC-002: Permission Evaluation Service
**As a** platform developer,
**I want to** evaluate permissions in real-time,
**So that** access decisions are fast and consistent.

**Acceptance Criteria:**
- Evaluate effective permission as min(Access Role ceiling, Contextual Role, User Override)
- Support hierarchical feature resolution (parent feature grants child access)
- Cache permission evaluations with configurable TTL
- Return denial reasons for debugging
- Support bulk permission checks for UI rendering
- Sub-50ms evaluation time for cached results

##### RBAC-003: Feature Registry
**As a** platform admin,
**I want to** maintain a registry of all platform features,
**So that** permissions can be configured granularly.

**Acceptance Criteria:**
- Register features organized by scope: Federation, Association, Circle
- Support hierarchical sub-features (e.g., Treasury → View Balance, Make Transfer, Approve Transfer)
- Feature metadata: name, description, scope, parent, default access mode
- Feature categories for grouping in the UI
- Enable/disable individual features independently of permissions

##### RBAC-004: Permission Templates
**As a** platform admin,
**I want to** create and manage permission templates,
**So that** common permission configurations can be reused.

**Acceptance Criteria:**
- Create named templates with pre-configured permission sets
- Templates for common patterns: "Full Admin", "Read-Only Auditor", "Treasurer", "Member"
- Apply template to a role or user with one action
- Compare template vs current permissions
- Version templates with change history

##### RBAC-005: Permission Cache Management
**As a** platform admin,
**I want to** manage the permission cache,
**So that** permission changes take effect promptly.

**Acceptance Criteria:**
- View cache status and hit rates
- Manually invalidate cache for specific users or roles
- Configure cache TTL per scope
- Automatic cache invalidation on permission changes
- Cache warming for frequently accessed users

##### RBAC-006: Pundit/Policy Integration
**As a** platform developer,
**I want to** integrate RBAC with the authorization framework,
**So that** permissions are enforced at the application layer.

**Acceptance Criteria:**
- Generate policy classes from permission configuration
- Scope-aware authorization (federation, association, circle context)
- Support for action-level checks (index, show, create, update, destroy)
- Integration with controller before_action hooks
- Test helpers for permission-based testing

#### Sub-Epic E-RBAC-002: Access Role Management

##### RBAC-007: Access Role Configuration
**As a** platform admin,
**I want to** configure the three access roles and their ceiling permissions,
**So that** each role tier has appropriate maximum access.

**Acceptance Criteria:**
- Configure Admin role: full platform access ceiling
- Configure Standard User role: normal user feature ceiling
- Configure Invitee role: minimal preview-only ceiling (read-only on selected features)
- Visual matrix showing ceiling permissions per role across all features
- Compare access roles side-by-side

##### RBAC-008: Bulk Access Role Assignment
**As a** platform admin,
**I want to** assign or change access roles for multiple users at once,
**So that** I can efficiently manage large user populations.

**Acceptance Criteria:**
- Select multiple users via search, filter, or CSV upload
- Assign access role (Admin, Standard User, Invitee) in bulk
- Preview changes before applying
- Confirmation dialog showing affected user count
- Audit log entry for each change
- Progress indicator for large batches

##### RBAC-009: Access Role Transitions
**As a** platform admin,
**I want to** manage access role transitions with safety checks,
**So that** role changes don't accidentally remove critical access.

**Acceptance Criteria:**
- Show impact analysis before role downgrade (features that will be lost)
- Require confirmation for admin → standard user demotions
- Grace period option for role transitions
- Automatic notification to affected users
- Rollback capability within grace period

##### RBAC-010: Invitee Access Configuration
**As a** platform admin,
**I want to** configure what Invitees (no login) can see,
**So that** potential users get a preview without full access.

**Acceptance Criteria:**
- Configure which features are visible to Invitees
- Set all Invitee features to read-only maximum
- Preview the Invitee experience from admin panel
- Configure Invitee landing pages per scope
- Track Invitee-to-User conversion metrics

#### Sub-Epic E-RBAC-003: Federation Feature Access Configuration

##### RBAC-011: Federation Permission Matrix
**As a** federation admin,
**I want to** configure permissions for federation-level features,
**So that** federation roles have appropriate access.

**Acceptance Criteria:**
- Visual permission matrix: rows = contextual roles, columns = federation features
- Federation features: Dashboard, Member Associations, Financial Overview, Governance Policies, Elections, Events, Reports, Compliance
- Set access mode per cell: No Access, Read, Write, Read & Write
- Color-coded matrix for quick visual scanning
- Export/import matrix configuration

##### RBAC-012: Federation Sub-Feature Permissions
**As a** federation admin,
**I want to** configure granular sub-feature permissions,
**So that** roles can have partial access to feature areas.

**Acceptance Criteria:**
- Expand features to show sub-features (e.g., Financial → View Balances, Create Transfers, Approve Budgets)
- Inherit parent permission by default
- Override sub-feature independently
- Visual indicator for inherited vs overridden permissions
- Collapse/expand sub-feature groups

##### RBAC-013: Cascading Federation Permissions
**As a** federation admin,
**I want to** cascade permission changes to child associations,
**So that** federation-wide policies are consistently applied.

**Acceptance Criteria:**
- Option to cascade permission changes to all child associations
- Preview which associations will be affected
- Allow individual associations to opt out (with federation admin override)
- Track cascade status across associations
- Audit trail for cascaded changes

##### RBAC-014: Cross-Association Visibility
**As a** federation admin,
**I want to** control which association data is visible across the federation,
**So that** privacy between associations is maintained appropriately.

**Acceptance Criteria:**
- Configure cross-association data visibility rules
- Per-feature visibility settings (e.g., show member counts but not names)
- Allow associations to control their own visibility preferences
- Aggregated-only mode for sensitive data
- Audit access to cross-association data

#### Sub-Epic E-RBAC-004: Association Feature Access Configuration

##### RBAC-015: Association Permission Matrix
**As an** association admin,
**I want to** configure permissions for all 12 association feature categories,
**So that** each contextual role has appropriate access.

**Acceptance Criteria:**
- Permission matrix covering 12 categories: Members & Trust, ROSCA Circles, Treasury & Funds, Credit & Lending, Communication & Events, Governance & Voting, Analytics & Reporting, AI Insights, Documents, Projects & Fundraising, Community & Social, Multi-Share
- Contextual roles: Association Admin, Treasurer, Secretary, Organizer, Member, Observer
- Access modes: No Access, Read, Write, Read & Write
- Respect Access Role ceiling (Standard User can't exceed their ceiling even with Admin contextual role)

##### RBAC-016: Member & Financial Permission Granularity
**As an** association admin,
**I want to** set fine-grained permissions for member and financial features,
**So that** sensitive data is appropriately protected.

**Acceptance Criteria:**
- Members & Trust sub-features: View Directory, Edit Profiles, Manage Trust Scores, View Sensitive Data (phone, email)
- Treasury sub-features: View Balances, Create Transactions, Approve Transfers, Configure Accounts, View Audit Trail
- Credit sub-features: View Applications, Approve Loans, Set Terms, View Repayment History
- Separate read and write permissions for each sub-feature

##### RBAC-017: Communication & Analytics Permissions
**As an** association admin,
**I want to** control who can communicate and view analytics,
**So that** these capabilities are role-appropriate.

**Acceptance Criteria:**
- Communication sub-features: Send Announcements, Create Events, Moderate Discussions, Send Direct Messages
- Analytics sub-features: View Dashboard, Export Reports, View Member Analytics, Configure Alerts
- AI Insights sub-features: View Predictions, Configure Models, View Risk Analysis
- Documents sub-features: Upload, Download, Delete, Share, Create Templates

##### RBAC-018: Governance & Projects Permissions
**As an** association admin,
**I want to** manage permissions for governance and project features,
**So that** democratic processes and fundraising are properly controlled.

**Acceptance Criteria:**
- Governance sub-features: Create Proposals, Cast Votes, View Results, Configure Voting Rules, Manage Elections
- Projects sub-features: Create Projects, Manage Fundraising, Approve Disbursements, View Contributors
- Community sub-features: Create Groups, Moderate Content, Manage Events, View Analytics
- Multi-Share sub-features: Configure Shares, View Allocations, Manage Payouts

#### Sub-Epic E-RBAC-005: Circle Feature Access Configuration

##### RBAC-019: Circle Permission Matrix
**As an** association admin or circle organizer,
**I want to** configure permissions for circle-level features,
**So that** circle participants have appropriate access based on their role.

**Acceptance Criteria:**
- Circle contextual roles: Organizer, Treasurer, Member, Observer, Invitee
- Circle features: Dashboard, Contributions, Payouts, Member List, Financial Summary, Settings
- Access mode configuration per role-feature combination
- Inherit from association defaults with override capability

##### RBAC-020: Circle Lifecycle Permissions
**As a** circle organizer,
**I want to** control who can manage circle lifecycle actions,
**So that** critical operations are properly authorized.

**Acceptance Criteria:**
- Lifecycle actions: Create Circle, Start Contributions, Pause Circle, Resume Circle, Close Circle, Archive
- Configure which roles can trigger each lifecycle action
- Require multi-party approval for critical actions (close, archive)
- Lock permissions during active contribution periods

##### RBAC-021: Contribution & Payout Permissions
**As a** circle organizer,
**I want to** control contribution and payout management access,
**So that** financial operations are secure.

**Acceptance Criteria:**
- Contribution sub-features: View Schedule, Make Payment, Record Manual Payment, Adjust Amount, Mark Exception
- Payout sub-features: View Schedule, Trigger Payout, Modify Order, Approve Exception, View History
- Separate permissions for viewing vs managing
- Organizer and Treasurer distinct permission sets

##### RBAC-022: Circle Dispute & Exception Permissions
**As a** circle organizer,
**I want to** manage who can handle disputes and exceptions,
**So that** conflict resolution follows proper authorization.

**Acceptance Criteria:**
- Dispute features: File Dispute, View Disputes, Mediate, Resolve, Escalate
- Exception features: Mark Late Payment, Apply Penalty, Grant Extension, Modify Terms
- Role-based escalation paths
- Audit trail for all dispute/exception actions

##### RBAC-023: Invitee Circle Preview
**As a** potential member (Invitee),
**I want to** preview circle information before joining,
**So that** I can make an informed decision.

**Acceptance Criteria:**
- Configure which circle data Invitees can see (description, member count, contribution amount, schedule)
- Hide sensitive data (member names, financial details, payout history)
- Show join CTA with required steps
- Track preview-to-join conversion

#### Sub-Epic E-RBAC-006: Individual User Permission Configuration

##### RBAC-024: User Permission Profile
**As a** platform admin,
**I want to** view and manage individual user permission profiles,
**So that** I can handle special access needs.

**Acceptance Criteria:**
- View user's effective permissions across all scopes (federation, association, circle)
- Show permission sources: Access Role, Contextual Role, Override
- Highlight conflicts or unusual configurations
- Permission history timeline
- Quick comparison with role defaults

##### RBAC-025: User Permission Overrides
**As a** platform admin,
**I want to** grant or restrict individual user permissions,
**So that** exceptions to role-based rules can be handled.

**Acceptance Criteria:**
- Grant additional permissions beyond contextual role (up to Access Role ceiling)
- Restrict permissions below contextual role level
- Require justification for each override
- Set expiration date for temporary overrides
- Visual indicator showing overridden permissions

##### RBAC-026: Temporary Permission Grants
**As a** platform admin,
**I want to** grant temporary elevated permissions,
**So that** users can perform one-time tasks without permanent role changes.

**Acceptance Criteria:**
- Set start and end dates for temporary grants
- Automatic revocation at expiration
- Notification before expiration (24h, 1h)
- Extension request workflow
- Audit log for all temporary grants

##### RBAC-027: Permission Conflict Detection
**As a** platform admin,
**I want to** detect and resolve permission conflicts,
**So that** users don't have contradictory access settings.

**Acceptance Criteria:**
- Detect when override conflicts with Access Role ceiling
- Detect when multiple contextual roles grant conflicting access
- Highlight separation-of-duty violations (e.g., can both create and approve transfers)
- Suggest resolution for each conflict
- Batch conflict resolution tools

##### RBAC-028: Delegation & Proxy Access
**As a** platform user,
**I want to** delegate my permissions to another user temporarily,
**So that** operations continue during my absence.

**Acceptance Criteria:**
- Delegate specific permissions to named user
- Set delegation period with automatic revocation
- Delegator retains access (non-exclusive)
- Delegatee actions logged under their identity with delegation reference
- Revoke delegation early if needed

#### Sub-Epic E-RBAC-007: Audit, Compliance & Safety

##### RBAC-029: RBAC Audit Trail
**As a** compliance officer,
**I want to** audit all permission-related changes,
**So that** we can demonstrate proper access governance.

**Acceptance Criteria:**
- Log all permission changes: role assignments, overrides, template applications, matrix changes
- Capture who, what, when, why for each change
- Searchable by user, action type, date range, scope
- Export audit reports (CSV, PDF)
- Retention aligned with compliance requirements (7 years)

##### RBAC-030: Periodic Access Reviews
**As a** compliance officer,
**I want to** conduct periodic access reviews,
**So that** permissions remain appropriate over time.

**Acceptance Criteria:**
- Schedule quarterly access review campaigns
- Generate review list of users with elevated permissions
- Reviewer workflow: confirm, modify, or revoke each permission
- Track review completion percentage
- Escalate overdue reviews
- Generate review completion reports

##### RBAC-031: Separation of Duties Enforcement
**As a** compliance officer,
**I want to** enforce separation of duties policies,
**So that** no single user can perform conflicting actions.

**Acceptance Criteria:**
- Define SoD rules (e.g., "create transfer" and "approve transfer" cannot be same user)
- Real-time SoD check on permission assignments
- Block violating assignments with explanation
- Exception process with multi-party approval
- SoD violation report

##### RBAC-032: Permission Safety Controls
**As a** platform admin,
**I want to** have safety controls for permission changes,
**So that** accidental or malicious changes are prevented.

**Acceptance Criteria:**
- Require multi-admin approval for critical permission changes (admin role grants, global overrides)
- Cool-down period for bulk changes
- Maximum permission change rate limiting
- Emergency lockdown: freeze all permission changes
- Rollback capability for recent changes

##### RBAC-033: GDPR & Data Privacy Compliance
**As a** compliance officer,
**I want to** ensure RBAC respects data privacy regulations,
**So that** personal data access is properly controlled and auditable.

**Acceptance Criteria:**
- Track which permissions grant access to personal data
- Data access consent integration
- Right-to-know: show users what data others can access about them
- Right-to-restrict: allow users to request access restrictions
- Data access reports for GDPR audits

##### RBAC-034: Permission Anomaly Detection
**As a** platform admin,
**I want to** detect unusual permission patterns,
**So that** potential security issues are flagged early.

**Acceptance Criteria:**
- Detect permission accumulation (user with unusually many permissions)
- Detect dormant elevated permissions (unused high-level access)
- Detect rapid permission changes (possible compromise)
- Alert on permission patterns matching known attack vectors
- Weekly anomaly summary report

#### Sub-Epic E-RBAC-008: UI/UX & Admin Console

##### RBAC-035: RBAC Admin Dashboard
**As a** platform admin,
**I want to** see an overview of the RBAC system status,
**So that** I can quickly assess access governance health.

**Acceptance Criteria:**
- Summary metrics: total roles, active overrides, pending reviews, recent changes
- Permission distribution charts (users per access role, contextual role distribution)
- Recent permission change activity feed
- Alert badges for anomalies, conflicts, expiring grants
- Quick links to common RBAC tasks

##### RBAC-036: Interactive Permission Matrix UI
**As a** platform admin,
**I want to** use an interactive permission matrix to configure access,
**So that** I can visually manage complex permission configurations.

**Acceptance Criteria:**
- Matrix grid: contextual roles (rows) × features (columns)
- Click to cycle through access modes (No Access → Read → Write → Read & Write)
- Color coding: green (read & write), blue (read), amber (write), red (no access)
- Expandable sub-features within columns
- Filter by scope (federation, association, circle)
- Unsaved changes indicator with save/discard

##### RBAC-037: Dynamic UI Adaptation
**As a** platform user,
**I want to** see a UI that adapts to my permissions,
**So that** I only see actions I'm authorized to perform.

**Acceptance Criteria:**
- Hide features user has no access to
- Show read-only view for read-only permissions
- Disable action buttons for unauthorized actions
- Show "Request Access" option for visible but inaccessible features
- Tooltip explaining why an action is disabled

##### RBAC-038: Permission Metadata Display
**As a** platform user,
**I want to** understand my current permissions,
**So that** I know what I can and cannot do.

**Acceptance Criteria:**
- "My Permissions" page showing effective permissions by scope
- Permission source breakdown (which role grants which access)
- Active overrides and their expiration
- Recent permission changes affecting the user
- Request access workflow for additional permissions

##### RBAC-039: Access Request Workflow
**As a** platform user,
**I want to** request additional access,
**So that** I can perform tasks that require elevated permissions.

**Acceptance Criteria:**
- Browse available features and their current access level
- Submit access request with justification
- Request routed to appropriate approver (scope-aware)
- Approval/denial with comments
- Temporary or permanent grant options
- Request status tracking

##### RBAC-040: Permission Simulation Tool
**As a** platform admin,
**I want to** simulate permission changes before applying them,
**So that** I can verify the impact of changes safely.

**Acceptance Criteria:**
- Select user and proposed permission changes
- Show before/after comparison of effective permissions
- Highlight features that would be gained or lost
- Test specific actions against simulated permissions
- Apply simulation as real changes if satisfactory

##### RBAC-041: Role Comparison View
**As a** platform admin,
**I want to** compare permissions between roles or users,
**So that** I can ensure consistency and identify discrepancies.

**Acceptance Criteria:**
- Side-by-side comparison of two roles or users
- Highlight differences in permissions
- Show common permissions
- Suggest alignment actions
- Export comparison report

##### RBAC-042: Bulk Permission Editor
**As a** platform admin,
**I want to** make permission changes across multiple roles or users,
**So that** large-scale updates are efficient.

**Acceptance Criteria:**
- Select multiple roles or users
- Apply permission changes in batch
- Preview all affected permissions before applying
- Progress indicator for large batches
- Rollback batch changes

#### Additional RBAC Stories (Value-Add)

##### RBAC-043: Role Hierarchy Visualization
**As a** platform admin,
**I want to** visualize the role hierarchy,
**So that** I understand how permissions cascade.

**Acceptance Criteria:**
- Tree diagram showing Access Roles → Contextual Roles → Users
- Expand/collapse nodes
- Click to view role details
- Show permission inheritance path
- Filter by scope

##### RBAC-044: Permission Analytics Dashboard
**As a** platform admin,
**I want to** analyze permission usage patterns,
**So that** I can optimize the permission model.

**Acceptance Criteria:**
- Most/least used permissions
- Users with most overrides
- Permission change frequency trends
- Access denial rates by feature
- Recommendations for permission model simplification

##### RBAC-045: Emergency Access Protocols
**As a** platform admin,
**I want to** define emergency access protocols,
**So that** critical access can be granted quickly in emergencies.

**Acceptance Criteria:**
- Pre-defined emergency access profiles
- One-click activation with mandatory justification
- Automatic time-limited grant (4h, 8h, 24h)
- Mandatory post-incident review
- Automatic revocation and audit

##### RBAC-046: Contextual Role Builder
**As a** platform admin,
**I want to** create custom contextual roles,
**So that** the permission model can adapt to organizational needs.

**Acceptance Criteria:**
- Create new contextual roles with custom names and descriptions
- Assign to specific scope (federation, association, circle)
- Configure permissions using the matrix UI
- Set role as assignable by scope admins
- Template from existing roles

##### RBAC-047: Permission Export & Import
**As a** platform admin,
**I want to** export and import permission configurations,
**So that** configurations can be shared across environments.

**Acceptance Criteria:**
- Export full RBAC configuration as JSON
- Import configuration with validation
- Diff view before import
- Selective import (roles only, matrix only, overrides only)
- Version tagged exports

##### RBAC-048: User Onboarding Permission Flow
**As a** new user,
**I want to** be guided through my available permissions on first login,
**So that** I understand what I can do on the platform.

**Acceptance Criteria:**
- Permission welcome screen on first login
- Scope-aware permission summary
- Interactive tour of key features accessible to user
- "Request Access" prompts for commonly needed features
- Dismissible with option to revisit

## Screen Designs

### Primary Screens

1. **Admin Dashboard** - Overview for platform administrators
   - Key metrics (active users, transactions, support tickets)
   - System health status
   - Recent alerts and issues
   - Quick actions

2. **User Management** - Search and manage users
   - Advanced search filters
   - User detail view
   - Action buttons (reset, suspend, etc.)
   - Activity timeline

3. **Compliance Dashboard** - AML and regulatory overview
   - Risk alerts queue
   - Pending SAR filings
   - GDPR requests status
   - Report schedule

4. **Transaction Monitor** - Real-time transaction monitoring
   - Transaction feed with risk indicators
   - Filter by risk level, amount, type
   - Alert configuration
   - Investigation workflow

5. **Support Inbox** - Ticket management interface
   - Ticket list with filters
   - Ticket detail with context
   - Response composer
   - Canned responses

6. **Dispute Center** - Dispute resolution workspace
   - Active disputes list
   - Evidence viewer
   - Decision form
   - Communication thread

7. **System Health** - Infrastructure monitoring
   - Service status grid
   - Metrics charts
   - Alert history
   - Incident management

8. **Configuration Panel** - Platform settings
   - Settings categories
   - Feature flags
   - Notification templates
   - Fee configuration

9. **RBAC Dashboard** - Role-based access control overview
   - Permission system health metrics (total roles, overrides, pending reviews)
   - Permission distribution charts
   - Recent permission change activity feed
   - Anomaly alerts and conflict warnings
   - Quick actions (create role, review access, simulate changes)

10. **Permission Matrix** - Interactive permission configuration
    - Scope selector (Federation, Association, Circle)
    - Contextual roles as rows, features as columns
    - Click-to-cycle access modes with color coding
    - Expandable sub-features
    - Unsaved changes indicator, save/discard
    - Template application and comparison

11. **Role Manager** - Access role and contextual role management
    - Access role configuration (Admin, Standard User, Invitee) with ceiling permissions
    - Contextual role list with scope indicators
    - Role builder for custom contextual roles
    - Role hierarchy visualization (tree diagram)
    - Bulk role assignment tools
    - Role comparison side-by-side view

12. **User Permissions** - Individual user permission management
    - User search and selection
    - Effective permissions view across all scopes
    - Permission source breakdown (Access Role + Contextual Role + Override)
    - Override editor with justification and expiration
    - Temporary grant manager
    - Conflict detection alerts
    - Permission history timeline

13. **RBAC Audit Trail** - Permission change audit log
    - Searchable log of all RBAC changes
    - Filter by user, action, scope, date range
    - Detail view with before/after comparison
    - Export to CSV/PDF
    - Periodic review campaign management
    - SoD violation tracking

14. **Access Requests** - Permission request workflow
    - Pending requests queue for approvers
    - Request form with feature browser and justification
    - Approval/denial with comments
    - Request status tracking
    - Auto-routing to scope-appropriate approver

15. **Permission Simulator** - What-if analysis tool
    - Select user and proposed changes
    - Before/after effective permission comparison
    - Highlight gained/lost features
    - Test specific actions against simulated permissions
    - Apply simulation as real changes

## Data Model

### SupportTicket
- `id`: Unique identifier
- `userId`: Affected user
- `category`: Issue category
- `priority`: low, medium, high, urgent
- `status`: open, in_progress, pending, resolved, closed
- `subject`: Brief description
- `description`: Full issue details
- `channel`: app, email, chat, phone
- `assignedTo`: Agent user ID
- `slaDeadline`: Response/resolution deadline
- `createdAt`: Timestamp
- `resolvedAt`: Resolution timestamp

### Dispute
- `id`: Unique identifier
- `ticketId`: Related support ticket
- `type`: payment, payout, membership, other
- `amount`: Disputed amount
- `parties`: Array of user IDs involved
- `status`: open, investigating, awaiting_response, resolved, appealed
- `decision`: favor_requester, favor_respondent, split, dismissed
- `resolution`: Description of outcome
- `evidence`: Array of document references

### AuditLog
- `id`: Unique identifier
- `userId`: Actor
- `action`: Action type enum
- `resourceType`: User, Circle, Payment, etc.
- `resourceId`: Affected resource ID
- `changes`: JSON of before/after values
- `ipAddress`: Source IP
- `userAgent`: Browser/client info
- `timestamp`: When action occurred

### ComplianceAlert
- `id`: Unique identifier
- `type`: aml, fraud, velocity, pattern
- `severity`: low, medium, high, critical
- `status`: open, investigating, resolved, false_positive
- `userId`: Related user (if applicable)
- `transactionId`: Related transaction (if applicable)
- `description`: Alert details
- `riskScore`: Numeric risk assessment
- `assignedTo`: Compliance officer
- `resolution`: How alert was resolved

### RegulatoryReport
- `id`: Unique identifier
- `type`: monthly, quarterly, annual, ad_hoc
- `reportingPeriod`: Date range
- `status`: draft, pending_review, submitted, accepted, rejected
- `submittedAt`: Submission timestamp
- `submittedBy`: User who submitted
- `fileUrl`: Generated report file
- `regulatorResponse`: Any feedback received

### FeatureFlag
- `id`: Unique identifier
- `name`: Flag name (snake_case)
- `description`: What the flag controls
- `enabled`: Global on/off
- `targeting`: Rules for targeted rollout
- `rolloutPercentage`: Percentage of users
- `createdBy`: Who created
- `updatedAt`: Last modification

### AccessRole
- `id`: Unique identifier
- `name`: Role name (Admin, Standard User, Invitee)
- `description`: Role purpose
- `ceilingPermissions`: Map of feature → max access mode
- `userCount`: Number of users with this role
- `isSystem`: Whether this is a built-in role

### ContextualRole
- `id`: Unique identifier
- `name`: Role name (e.g., Federation President, Treasurer, Member)
- `description`: Role purpose
- `scope`: federation | association | circle
- `permissions`: Map of feature → access mode
- `isCustom`: Whether this was user-created
- `createdBy`: Creator admin ID

### Feature
- `id`: Unique identifier
- `name`: Feature display name
- `slug`: Feature key (e.g., treasury.view_balance)
- `scope`: federation | association | circle
- `category`: Feature grouping
- `parentId`: Parent feature for sub-features (null for top-level)
- `description`: What this feature controls
- `defaultMode`: Default access mode for new roles
- `containsPersonalData`: Whether access involves personal data

### PermissionOverride
- `id`: Unique identifier
- `userId`: Affected user
- `featureId`: Target feature
- `scopeType`: federation | association | circle
- `scopeId`: Specific entity ID
- `accessMode`: Overridden access mode
- `reason`: Justification
- `grantedBy`: Admin who created override
- `expiresAt`: Expiration (null for permanent)
- `isTemporary`: Whether grant is time-limited
- `createdAt`: When created

### PermissionTemplate
- `id`: Unique identifier
- `name`: Template name
- `description`: Template purpose
- `scope`: federation | association | circle
- `permissions`: Map of feature → access mode
- `version`: Template version number
- `createdBy`: Creator admin
- `usageCount`: Times applied

### AccessRequest
- `id`: Unique identifier
- `requesterId`: User requesting access
- `featureId`: Requested feature
- `scopeType`: federation | association | circle
- `scopeId`: Specific entity ID
- `requestedMode`: Desired access mode
- `justification`: Why access is needed
- `status`: pending | approved | denied | expired
- `reviewerId`: Approving/denying admin
- `reviewerComment`: Response comment
- `isTemporary`: Whether request is for temporary access
- `expiresAt`: Requested expiration
- `createdAt`: When submitted
- `reviewedAt`: When decided

### RBACauditEntry
- `id`: Unique identifier
- `actorId`: Who made the change
- `actionType`: role_assigned | permission_changed | override_created | template_applied | access_requested | review_completed
- `targetType`: user | role | feature | template
- `targetId`: Affected entity ID
- `changes`: Before/after values
- `reason`: Justification
- `scope`: federation | association | circle
- `scopeId`: Specific entity ID
- `timestamp`: When action occurred

### PeriodicReview
- `id`: Unique identifier
- `name`: Review campaign name
- `scope`: federation | association | circle
- `status`: scheduled | in_progress | completed | overdue
- `startDate`: Review start
- `dueDate`: Review deadline
- `reviewerId`: Assigned reviewer
- `totalItems`: Number of permissions to review
- `completedItems`: Number reviewed
- `findings`: Array of review actions taken

## Business Rules

1. **Access Control**
   - Platform admins have full access
   - Compliance officers limited to compliance functions
   - Support agents limited to support functions
   - All access logged

2. **Audit Requirements**
   - All admin actions logged with before/after state
   - Logs immutable after creation
   - 7-year retention minimum
   - Quarterly audit reviews

3. **Support SLAs**
   - Urgent: 1 hour first response
   - High: 4 hours first response
   - Medium: 24 hours first response
   - Low: 48 hours first response

4. **Compliance Deadlines**
   - GDPR requests: 30 days
   - SAR filing: 30 days from detection
   - FINMA reports: Per regulatory schedule

5. **RBAC Permission Evaluation**
   - Effective permission = min(Access Role ceiling, Contextual Role permission, User override)
   - Access Role ceiling always takes precedence (Invitee can never exceed read-only)
   - User overrides can only grant up to Access Role ceiling
   - User overrides can restrict below Contextual Role level
   - Temporary grants auto-expire and are logged

6. **Separation of Duties**
   - Users cannot both create and approve the same resource type
   - Admin role changes require multi-admin approval
   - Permission changes to own account require secondary approval
   - Emergency access requires mandatory post-incident review

7. **Permission Review Cadence**
   - Quarterly access review for all elevated permissions
   - Monthly review for temporary grants
   - Immediate review triggered by anomaly detection
   - Annual full RBAC configuration audit
