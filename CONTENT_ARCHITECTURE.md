# Mighty Warner content and route inventory

## Current implementation

- Framework: Next.js 14 App Router, React 18, TypeScript, Tailwind, Framer Motion.
- Current content: hard-coded TS modules under `src/data/`, `src/config/site.ts`, and component-local arrays. The API client defaults to mock mode and there are no API route handlers, admin screens, authentication, persistence, upload service, or database migrations.
- Global chrome is rendered in `src/app/layout.tsx`: navigation/mega-menu/mobile menu, footer, mobile sticky CTA, and Ctrl/Cmd+K Growth Terminal. These appear beyond the numbered home-page sections and must be admin-configurable.

## Live-site comparison: material scope gap

The deployed `mightywarner.com` is currently a legacy PHP-style site, not the Next.js experience in this repository. Its sitemap endpoint returns 404, so a fully exhaustive automated URL inventory is unavailable. The live homepage and linked service pages show a larger migration scope: ICT/web, business solutions, mobile apps, SEO, Google Ads, social media, integrated marketing, content-writing subservices, contingent staffing, direct hire, SOW, industries, portfolio, careers/blog, contact, disclaimer/refund/privacy/terms. Service detail pages also have their own hero, interactive/lead form, rich editorial sections, feature/process cards, testimonials, FAQ accordions, repeated CTAs and footer.

Treat the existing repository route list below as the **new-app implementation inventory**, and create one CMS `Page` per retained or migrated legacy URL. The page-builder and `FormDefinition` models support those legacy pages; add `Redirect` records for their replaced `.php` URLs. The source pages checked include the [live homepage](https://mightywarner.com/), [service index](https://mightywarner.com/services), [web-development service](https://mightywarner.com/web-development-company.php), and [contingent-staffing service](https://mightywarner.com/contingent-staffing-service.php).

## Public routes

| Route | Current page composition |
| --- | --- |
| `/` | 20 homepage sections in the ordered page builder plus global chrome |
| `/businesses` | Header; vertical overview cards with services, audiences, outcomes, image; final CTA |
| `/businesses/digital-growth` | Vertical hero/CTA; outcome metrics; services; related case studies; final CTA |
| `/businesses/technology` | Vertical hero/CTA; outcome metrics; services; related case studies; final CTA |
| `/businesses/talent-solutions` | Vertical hero/CTAs; employer/candidate journey cards; services; related case studies; final CTA |
| `/work` | Header; case-study grid; final CTA |
| `/work/[slug]` | Breadcrumb/hero; hero image; metrics; challenge/objectives; strategy/solution/technologies; optional gallery; optional testimonial; related work; final CTA |
| `/insights` | Header; article cards; final CTA |
| `/insights/[slug]` | Breadcrumb/header/author; cover; takeaways; rich article body; tags; related articles; final CTA |
| `/approach` | Header; interactive method; detailed five-stage breakdown; values; final CTA |
| `/about` | Header; company stats; timeline; people; office globe; values; final CTA |
| `/contact` | Header; contact wizard; contact-channel/sidebar content; office globe |
| `/assessment` | Assessment header/trust signals; assessment wizard/result |
| `/growth-lab` | Header; tabbed diagnostic, strategy, ROI, before/after, persona tools; final CTA |
| `/robots.txt`, `/sitemap.xml` | Generated SEO routes; sitemap is presently derived from static arrays |

## Home page sections

The supplied list is accurate. Each of these needs an approved renderer and one `PageSection` record on the `Page` with slug `/`; `sortOrder`, `isVisible`, `content`, and `settings` make it individually manageable.

1. Hero – local `pillars` array in `HeroSection.tsx`.
2. Trust – local metrics and industry logo/chip list in `TrustSection.tsx`.
3. Ecosystem – formula, result CTA, three synergy cards local to `EcosystemSection.tsx`.
4. Business cards – `businessesData`.
5. Persona selector – local personas in `PersonaSelector.tsx`.
6. Challenge selector – local options in `ChallengeSelector.tsx`.
7. Work feed – `projectsData`, local vertical filters and display limit.
8. Before/after showcase – local comparison records in `BeforeAfterSlider.tsx`.
9. Method – `methodSteps` from `company.ts`.
10. Strategy builder – `strategyEngine.ts` options and currently hard-coded generation rules/copy.
11. Why – `coreValues` from `company.ts`.
12. ROI calculator – defaults, presets, lift assumptions, labels local to `RoiCalculator.tsx`.
13. Assessment promo – component-local copy and wizard display state.
14. Testimonials – `testimonialsData`.
15. People – `leadershipTeam` from `company.ts`.
16. Global offices – `MIGHTY_OFFICES` and `GLOBAL_NETWORK_STATS` from `offices.ts`.
17. About preview – `companyMilestones`.
18. Insights preview – `insightsData` and local selected-item behaviour.
19. Final CTA – all copy, CTAs, SLA note local to `FinalCtaSection.tsx`.
20. Navbar/footer – `navigation.ts`, `site.ts`, plus social links/contact data.

## Additional dynamic surface omitted from the initial list

- Global sticky mobile CTA (two CTAs and scroll threshold).
- Global Growth Terminal / command palette: action labels, descriptions, shortcuts, destinations, grouping.
- Navbar mega-menu and mobile navigation; footer column headings/link ordering; site identity, SEO defaults, contact details, social links, organization JSON-LD.
- Page-specific headers, hero/intro panels, badges, direct-channel sidebar, detailed about/approach content, business-page audience cards, case-study detail layouts, article detail layout and related-content rules.
- Interactive configurations: assessment questions/options/scoring/result templates; strategy choice sets and blueprint templates; ROI bounds/presets/assumptions; before-after items; persona/challenge options; Growth Lab tabs/default tab.
- Operational data: contact leads, assessment submissions and answers, newsletter subscriptions. These must remain separate from editorial content and receive role-restricted admin access.

## Prisma model strategy

`prisma/schema.prisma` supplies two layers:

1. `Page` + ordered `PageSection` is the reusable, safe page builder. It controls display order and visibility without allowing arbitrary admin-authored React or HTML.
2. Normalized domain models preserve relationships: verticals/services, work/case studies, insights/authors/tags, people, offices, testimonials, company content, assessment data, interactive settings, leads, media, navigation, and global settings.

Use a PostgreSQL service such as Neon, Supabase, AWS RDS, or Railway. PostgreSQL + Prisma is a strong choice here: JSON supports section-specific fields while relational records make content reuse, filtering, publishing, and lead workflows reliable.

## Recommended delivery order

1. Provision PostgreSQL, run the initial Prisma migration, then import the existing TS data once as published records.
2. Build authenticated admin CRUD with a transactional `reorder sections` endpoint and media upload integration.
3. Replace each data-module import with server-side Prisma query functions and pass typed DTOs into the presentational components.
4. Add draft/preview/publish and on-demand route revalidation; regenerate sitemap from published records.
5. Move calculation/scoring rules to versioned configuration/services and store submissions with consent, spam protection, retention rules, and CRM/email notification integration.
