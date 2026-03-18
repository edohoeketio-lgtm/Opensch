# OpenSch Admin Audit

## Purpose of this document

This audit turns the current admin dashboard thinking into an operational review for OpenSch as a cohort-based academy. The goal is to clarify:

- what each admin section should do
- what is already strong
- what is missing
- what should be MVP vs later
- how roles should map to sections
- what the Command Center should really become

The main conclusion is that OpenSch should not behave like a generic LMS admin or SaaS analytics panel. It should behave like a **cohort academy operating system**.

---

## Executive diagnosis

The current section set is directionally strong:

- Command Center
- Course Builder
- Review Queue
- Student Roster
- Faculty / Instructors
- Broadcasts

These sections cover the real core jobs of the platform:

- build curriculum
- review student work
- monitor learners
- manage staff
- communicate with cohorts

The weakness is not the existence of the sections. The weakness is that they are still grouped and framed too much like a generic admin tool.

OpenSch is not just an LMS. It is a **live cohort school**.

That means the admin experience should be optimized around:

- cohort rhythm
- review operations
- at-risk learner intervention
- communications
- staff workload
- content publishing
- admissions and payments
- live session readiness

---

## Structural issue: “Instructor Dashboard” vs actual scope

The current idea of the admin area mixes:

- platform admin
- instructor workflow
- teaching operations
- student success ops
- curriculum design
- staff management

That is too broad for one mental model.

### Recommended conceptual split

#### 1. Instructor Workspace
Used by:
- instructors
- TAs
- graders

Contains:
- Review Queue
- Course Builder
- Student Roster
- Broadcasts
- later: cohort calendar / live session prep

#### 2. Admin Console
Used by:
- super admins
- platform owners
- ops leads

Contains:
- Command Center
- Faculty
- later: admissions, finance, settings, system analytics

This does not necessarily require two separate products, but it does require role-aware information architecture.

---

# Section-by-section audit

## 1. Command Center (`/admin`)

### What it should be
Mission control for **today**, not just a pretty analytics homepage.

### What it currently does
Acts as the pulse and analytics home page with stubs for:
- total students
- active sprints
- completion rates
- recent activity

### Current problem
It is too passive.

It tells the admin things, but it does not help the admin **act**.

### What it should answer
- What needs attention right now?
- Which cohort is drifting?
- Which submissions are overdue?
- Which students are at risk?
- What session or deadline is coming next?
- What needs intervention today?

### What belongs here
Keep:
- live platform pulse
- cohort health summary
- critical activity visibility

Add:
- urgent review backlog
- at-risk students
- premium escalations
- upcoming live session readiness
- draft broadcasts needing publish
- cohort deadline alerts
- payment/admissions issues if relevant

Remove or demote:
- vanity metrics that do not lead to action
- generic SaaS-style revenue widgets like MRR

### Best redesign principle
The top of Command Center should be:

**Today’s Priorities**

Not:

**Topline Numbers**

---

## 2. Course Builder (`/admin/curriculum`)

### What it should be
The central academic authoring system.

### What it currently does
A drag-and-drop curriculum builder using local React state. It supports:
- modules
- lessons
- lesson types
- content editing
- Mux playback IDs
- Markdown/GFM content

### What is strong
This is one of the best sections conceptually. It maps directly to the core job of running a school.

### What is missing
Content operations need to be stronger.

Add:
- versioning
- preview before publish
- scheduled publishing
- lesson dependencies / unlock logic
- duplicate lesson
- duplicate module
- content status filters
- last edited by
- last edited at
- audit trail

### Recommended status model
Not just:
- Draft
- Published
- Archived

Also consider:
- In Review
- Scheduled
- Deprecated

### Important future need
The system must eventually know:
- which cohort is using which lesson version
- whether changes affect live students
- whether attached assessments need revalidation

---

## 3. Review Queue (`/admin/reviews`)

### What it should be
The operational center of academic trust.

### What it currently does
Allows instructors and graders to:
- review sprint submissions
- assess code/repository links
- grade manually
- leave structured feedback

### What is strong
This is mission-critical and correctly positioned.

### What is missing
Queue intelligence and operational workflow depth.

Add:
- filter by cohort
- filter by sprint
- filter by age
- filter by priority
- premium vs basic
- assigned reviewer
- oldest outstanding item
- SLA timer
- risk level
- second-review flag
- revision requested flag
- resubmission tracking

### AI auto-grader recommendation
The AI grader should not just generate generic feedback.

It should produce:
- draft score
- rubric-by-rubric reasoning
- confidence level
- ambiguity/suspicion flag
- recommended instructor action

### Better status model
- Pending Review
- AI Drafted
- In Manual Review
- Passed
- Revisions Requested
- Resubmitted
- Escalated
- Closed

That better reflects real operational flow.

---

## 4. Student Roster (`/admin/roster`)

### What it should be
A student operations and intervention console, not just a directory.

### What it currently does
Provides:
- filtering by cohort/name/email
- telemetry canvas
- faculty notes
- impersonation
- future algorithmic risk tagging

### What is strong
Potentially one of the most valuable sections in the entire platform.

### What is missing
A clearer split between:
- directory view
- student record
- intervention workflow

### Add
- cohort-relative progress comparison
- missing deliverables
- live session attendance history
- support request history
- intervention log
- last faculty touchpoint
- risk reason breakdown
- recommended next action
- review history
- communication history

### Important caution
Telemetry can become overbuilt quickly.

Keep only telemetry that leads to action, for example:
- skipped critical lesson
- missed two deadlines
- failed multiple assessments
- inactive for X days
- repeated “ask instructor” events

If telemetry is interesting but not actionable, demote it.

### Recommended reframing
The student view should become a **student record + intervention surface**.

---

## 5. Faculty / Instructors (`/admin/instructors`)

### What it should be
A staff identity, permissions, and workload management system.

### What it currently does
Supports:
- invites
- access revocation
- permission changes

### What is good
Good baseline for access control.

### What is missing
It should not only manage permissions. It should manage **teaching operations**.

Add:
- role type
- active cohorts assigned
- review load
- pending reviews
- office hour ownership
- average response time
- invitation status
- active / suspended state
- permissions summary

### Key recommendation
Treat faculty as operational actors, not only auth roles.

You need both:
- access management
- responsibility / workload visibility

---

## 6. Broadcasts (`/admin/broadcasts`)

### What it should be
A communications control center.

### What it currently does
Allows:
- rich-text announcements
- audience targeting
- secure broadcast deployment
- future cross-posting to Campus Feed + email webhook

### What is strong
Very good direction for a cohort school.

### What is missing
More communications operations depth.

Add:
- draft / scheduled / sent / failed states
- audience templates
- office hour reminder templates
- inactivity nudges
- review return notifications
- publish preview
- delivery analytics
- resend logic
- pinned feed injection controls

### Future recommendation
This should eventually unify:
- email
- Campus Feed announcements
- in-app notifications
- possibly lesson-level announcements

That makes it the true communications layer.

---

# What is missing across the admin system

## 1. Admissions / Enrollments
This is the most obvious structural gap.

Given the OpenSch model already includes:
- applications
- acceptance
- waitlist
- payments
- seat limits
- financial aid

you will eventually need a dedicated section for:
- applicants
- accepted students
- paid students
- waitlisted students
- payment pending
- financial aid allocations
- transfers
- refunds

This should eventually become its own section, not just live in Command Center.

---

## 2. Live Ops / Calendar
OpenSch is a live cohort academy, so eventually you need a section for:
- live classes
- office hours
- demo day
- calendar ownership
- reminder workflows
- session notes

This could start folded into Broadcasts, but later deserves a dedicated surface.

---

## 3. Certificates / Completion
Later-stage need:
- completion verification
- certificate approval
- graduation state
- alumni transition

---

## 4. Settings / Policies
Not urgent for MVP, but likely necessary later:
- grading policy
- review SLAs
- notification defaults
- system settings
- academy policy controls

---

# What the Command Center should really contain

This is the most important change.

## Command Center should contain 5 core layers

### 1. Today’s Priorities
Examples:
- pending reviews older than SLA
- at-risk students requiring intervention
- premium escalations waiting
- session starts in X time
- payment/admissions issue
- unpublished broadcast draft

### 2. Active Cohorts
For each live cohort, show:
- current week or sprint
- submission completion
- review backlog
- attendance signal
- risk count
- next milestone

Each cohort row/card should allow:
- open cohort
- message cohort
- broadcast to cohort
- open review queue
- view at-risk students

### 3. Review Operations
Show:
- pending reviews
- oldest pending
- assigned vs unassigned
- AI drafted vs human reviewed
- review SLA health

### 4. Student Risk
Show:
- flagged students
- risk reason
- last active
- recommended action

Actions:
- message student
- assign follow-up
- open record
- flag mentor / TA

### 5. Academy Business Pulse
Do **not** use MRR.

For OpenSch, show:
- current cohort revenue
- seats filled
- pending payment confirmations
- waitlist size
- financial aid seats used
- active cohorts count

Everything else is secondary.

---

# Recommended role model

## Super Admin
Can:
- manage all cohorts
- manage staff
- manage payments/admissions
- manage settings
- publish broadcasts
- access everything

## Instructor
Can:
- manage assigned curriculum
- review assigned work
- view cohort roster
- publish to assigned cohorts
- see cohort-level analytics

## TA / Grader
Can:
- access review queue
- leave feedback
- view assigned student context
- limited roster access

## Student Success / Ops
Can:
- view roster
- add faculty/internal notes
- manage interventions
- send cohort nudges
- limited review visibility depending on policy

The IA will become messy if all users see all sections without boundaries.

---

# MVP vs later

## MVP now
Keep and refine:
- Command Center
- Course Builder
- Review Queue
- Student Roster
- Faculty / Instructors
- Broadcasts

But correct their purpose and operational logic.

## Next after MVP
Add:
- Admissions / Enrollments
- Live Ops / Calendar
- Certificates / Completion

## Later
Add:
- deeper analytics
- faculty workload balancing
- content version intelligence
- advanced intervention automation
- richer communications orchestration

---

# What to remove or demote

## Demote
- raw vanity metrics
- generic activity stream without direct actions
- “active students” without cohort context

## Remove
- MRR / recurring revenue framing
- business-model mismatched metrics
- generic dashboard filler that does not support action

---

# The correct mental model

The admin system should feel less like:

**an LMS admin homepage**

and more like:

**mission control for running a live cohort academy**

That is the core shift.

---

# Recommended admin information architecture

## Top level
- Command Center
- Course Builder
- Review Queue
- Student Roster
- Broadcasts
- Faculty

## Near-future additions
- Admissions
- Live Ops
- Certificates

## Role-aware presentation
The left nav and visible modules should adapt by role:
- Super Admin sees all
- Instructor sees teaching surfaces
- TA sees review + limited roster
- Student Success sees roster + communications + interventions

---

# Final conclusions

## Biggest changes needed
- Command Center becomes action-first
- Review Queue becomes SLA- and workflow-aware
- Student Roster becomes intervention-first
- Faculty becomes workload + permissions, not just invitations
- Broadcasts becomes a true communications ops layer
- Admissions eventually gets its own section

## Biggest mistake to avoid
Do not continue designing the admin area like a generic analytics dashboard.

OpenSch is a cohort academy.
Its admin must prioritize:
- people
- reviews
- deadlines
- interventions
- live operations
- communications
- curriculum changes

That is the real operating model.

---

## Recommended next step with AG

Use this audit to decide:
1. the corrected purpose of each current admin section
2. which sections are MVP now
3. what Command Center should become
4. which missing sections should be planned next
5. how role-based access should shape the admin IA
