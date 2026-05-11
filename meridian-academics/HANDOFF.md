# Meridian Academics — Handoff Guide

## How to update content

All site content lives in `src/data/`. Edit these files to change anything:

- **Tutor profiles:** `src/data/team.ts` — Add/remove/edit tutor objects. Aisha and Marcus are placeholders.
- **Pricing:** `src/data/pricing.ts` — Change rates or add/remove tiers.
- **Courses:** `src/data/courses.ts` — Add or remove courses and grades.
- **Testimonials:** `src/data/testimonials.ts` — Add real testimonials. Set to `[]` to hide the section.
- **FAQ:** `src/data/faq.ts` — Add/remove questions.

## Forms and admin dashboard

The site has two public forms, both backed by Supabase Postgres:

- **Booking inquiry** (`src/components/sections/Contact.tsx`) — student/parent details, posts to `POST /api/submit`, lands in the `tickets` table.
- **General message** (`src/components/sections/ContactSimple.tsx`) — name/email/message, posts to `POST /api/contact`, lands in the `contact_messages` table.

View and manage all submissions at `/admin`:

1. Visit `https://your-site.com/admin/login`.
2. Enter the password from `ADMIN_PASSWORD`.
3. Switch between **Lesson Inquiries** and **Messages** tabs.
4. Search by name, email, phone, subject, or message text.
5. Each card supports status transitions (New → Contacted/Replied → Completed/Archive) and internal notes.

## Email notifications

When a new ticket or message arrives, an email is sent to `ADMIN_NOTIFICATION_EMAIL` via [Resend](https://resend.com). Setup:

1. Create a free Resend account; verify your sending domain (or use the default `onboarding@resend.dev` sender to test).
2. Generate an API key.
3. Set the env vars:
   - `RESEND_API_KEY` — your Resend API key
   - `ADMIN_NOTIFICATION_EMAIL` — inbox that receives alerts
   - `RESEND_FROM_EMAIL` (optional) — verified sender, e.g. `"Meridian Academics <noreply@meridianaacademics.ca>"`

If either `RESEND_API_KEY` or `ADMIN_NOTIFICATION_EMAIL` is unset, emails are silently skipped (form submissions still save normally).

## Database setup

Run these SQL files in your Supabase SQL editor (Project → SQL Editor → New Query):

1. `supabase/migration.sql` — creates the `tickets` table and `_set_updated_at()` trigger function.
2. `supabase/contact_messages.sql` — creates the `contact_messages` table (depends on the trigger function from step 1).

## How to deploy on Vercel

1. Push the code to a GitHub repository.
2. Go to https://vercel.com and sign in with GitHub.
3. Click "New Project" → Import your repo.
4. Vercel auto-detects Next.js. Click "Deploy."
5. Add the env vars from `.env.example` in Project → Settings → Environment Variables.
6. Your site is live at a `.vercel.app` URL.

## How to connect a custom domain

1. Buy a domain (recommend `meridianaacademics.ca` on Namecheap — ~$12/year).
2. In Vercel dashboard → your project → Settings → Domains.
3. Add your domain and follow Vercel's DNS instructions.
4. SSL is automatic.
