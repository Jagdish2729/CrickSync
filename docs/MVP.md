# CrickSync MVP

## Core problem

A player accepts one match and later accidentally accepts another match at the same time because the commitments are scattered across calls and messages.

## Core rule

Before accepting a match invitation, the API checks all confirmed commitments for that player.

An interval overlaps another interval when:

`newStart < existingEnd && newEnd > existingStart`

A match ending exactly when another begins is not a conflict.

## Account model

One account can be a Player, Captain, or both. Selecting a role must never create a duplicate account.

## Milestones

### M1 — Foundation
- Expo mobile app
- TypeScript API
- PostgreSQL + Prisma
- Shared types
- Environment configuration
- Health check

### M2 — Authentication
- Email/password
- Secure password hashing
- Sessions/JWT
- Player/Captain onboarding

### M3 — Scheduling
- Calendar
- Matches
- Match details
- Conflict detection

### M4 — Teams
- Create team
- Invite players
- Accept/reject
- Team membership

### M5 — Notifications and location
- Push notifications
- One-hour reminders
- Venue coordinates
- Maps

### M6 — Communication
- Direct chat
- Team chat

## Later
Tournament engine, statistics, cricket reels, payments, subscriptions, ads, WhatsApp and AI are intentionally outside the first MVP.
