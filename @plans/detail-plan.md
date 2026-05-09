# Detailed Project Plan - Laporan Keuangan

## Project Overview

A web-based financial report application that works entirely offline using browser Local Storage.

## Phase 1: Infrastructure & Auth

- [ ] Create `@web` directory and initial assets (CSS/JS).
- [ ] Implement `storage.js`: CRUD functions for Users and Transactions.
- [ ] Implement `register.html`: Form to create user.
- [ ] Implement `login.html`: Auth check and session creation.
- [ ] Auth Guard: Middleware-like script to redirect unauthenticated users.

## Phase 2: Onboarding & Core UI

- [ ] Implement `limit-setup.html`: Force user to set their first limit if not found in data.
- [ ] Implement `index.html`:
  - Header with "Print Laporan" button.
  - Summary Cards (Total Balance, Income, Expense).
  - Monthly Summary Chart (CSS-based bars).
  - Recent Transactions list.
  - Floating Action Button (FAB) for adding transactions.

## Phase 3: Transaction Features

- [ ] Implement `add-transaction.html` or Modal:
  - Fields: Type (Income/Expense), Amount, Category, Date, Note.
  - Category Selection: Makanan & Minuman, Transportasi, Belanja, Gaji / Pendapatan, Investasi, Temen Ngutang.
- [ ] Implement Budget Monitoring:
  - Logic to check current month's expenses against limit.
  - Toast Alert triggers when reaching 80% or 100% of limit.

## Phase 4: Settings & Reporting

- [ ] Implement `settings.html`:
  - Edit Username.
  - Edit Password.
  - Edit Monthly Limit.
- [ ] Implement Print Functionality:
  - CSS `@media print` rules for a clean report layout.
  - Print trigger button in header.

## Phase 5: Polishing

- [ ] UI refinement following Neo-Brutalist rules.
- [ ] Input validation (no negative amounts, required fields).
- [ ] Empty state handling for transactions.
