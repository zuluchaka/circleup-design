# Members & Trust Specification

## Overview

The Members & Trust section provides a comprehensive member directory with profiles, roles, and engagement tracking. The centerpiece is the AI Trust Score (0-1000) that calculates member reliability based on payment history, verification level, tenure, engagement, network connections, and external factors—with full transparency into how each factor contributes to the score.

## User Flows

- View Member Directory — Browse/search all members with trust scores, roles, payment status, and join dates
- View Member Profile — See detailed profile with participation history, trust score breakdown, references, and engagement metrics
- View My Trust Score — See personal trust score with factor breakdown and improvement recommendations
- Give/Request References — Submit references for trusted members or request references from circle organizers
- View At-Risk Members — Organizers see flagged members with declining engagement or payment issues
- Submit Member Feedback — Rate circle experience and provide feedback on organizers/members
- File/Manage Disputes — Submit disputes with evidence, track resolution status

## UI Requirements

- Member Directory: Searchable/filterable table with avatar, name, trust score badge (color-coded), role, status, join date
- Trust Score Card: Circular gauge (0-1000) with color gradient, factor breakdown bars (payment 40%, verification 20%, tenure 15%, engagement 10%, network 10%, external 5%)
- Member Profile: Header with avatar/name/score, tabs for History, References, Engagement, Settings
- References Section: List of given/received references with reviewer name, relationship, date, and text
- At-Risk Alert Panel: Cards showing flagged members with risk indicators, trend arrows, recommended actions
- Dispute Workflow: Multi-step form with evidence upload, timeline view of dispute status

## Configuration

- shell: true
