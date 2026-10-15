# Mighty Warner content platform database

This schema targets PostgreSQL and makes the site an admin-managed, ordered page-builder while preserving structured models for content that needs filters, relationships, SEO, and submissions.

## Setup

1. Copy `.env.example` to `.env` and supply a PostgreSQL connection string.
2. Install the Prisma CLI (the install could not complete in this workspace because the host disk is full): `npm install -D prisma@6.7.0 tsx`.
3. Run `npx prisma migrate dev --name initial_cms` and `npx prisma generate`.
4. Use `npx prisma studio` for immediate internal data administration while the custom admin UI is built.

## Page-builder section types

Seed `PageSection.type` only from this renderer allow-list: `hero`, `trust`, `ecosystem`, `business_cards`, `persona_selector`, `challenge_selector`, `work_feed`, `before_after`, `method`, `strategy_builder`, `why`, `roi_calculator`, `assessment_promo`, `testimonials`, `people`, `global_offices`, `about_preview`, `insights_preview`, `final_cta`, `page_hero`, `stats`, `timeline`, `service_grid`, `case_study_grid`, `contact_wizard`, `tool_tabs`.

Every section can be hidden or reordered. Store renderer-specific text, CTAs, references, variant, colours, limits, and interaction defaults in `content` / `settings`; do not allow arbitrary raw HTML or arbitrary component names from the admin UI.

## Admin areas

Pages & sections; global settings; navigation/footer; media library; businesses/services; work; insights; testimonials; people; offices; company timeline/values; assessments; Growth Lab options/calculator settings; contact and assessment leads; newsletter subscribers. Use `status` and `publishedAt` to support draft/review/publish workflows.
