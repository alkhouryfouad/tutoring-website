# Meridian Academics — Handoff Guide

## How to update content

All site content lives in `src/data/`. Edit these files to change anything:

- **Tutor profiles:** `src/data/team.ts` — Add/remove/edit tutor objects. Aisha and Marcus are placeholders.
- **Pricing:** `src/data/pricing.ts` — Change rates or add/remove tiers.
- **Courses:** `src/data/courses.ts` — Add or remove courses and grades.
- **Testimonials:** `src/data/testimonials.ts` — Add real testimonials. Set to `[]` to hide the section.
- **FAQ:** `src/data/faq.ts` — Add/remove questions.

## How to set up the contact form

The contact form is already connected to Formspree (endpoint: mdappgoo).
To view submissions, log in at https://formspree.io.
To change the receiving email, update it in your Formspree dashboard.

## How to deploy on Vercel

1. Push the code to a GitHub repository.
2. Go to https://vercel.com and sign in with GitHub.
3. Click "New Project" → Import your repo.
4. Vercel auto-detects Next.js. Click "Deploy."
5. Your site is live at a `.vercel.app` URL.

## How to connect a custom domain

1. Buy a domain (recommend `meridianaacademics.ca` on Namecheap — ~$12/year).
2. In Vercel dashboard → your project → Settings → Domains.
3. Add your domain and follow Vercel's DNS instructions.
4. SSL is automatic.
