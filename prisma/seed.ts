import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

import { siteConfig } from '../src/config/site';
import { businessesData } from '../src/data/businesses';
import { projectsData } from '../src/data/projects';
import { testimonialsData } from '../src/data/testimonials';
import { leadershipTeam, companyMilestones, methodSteps, coreValues } from '../src/data/company';
import { MIGHTY_OFFICES, GLOBAL_NETWORK_STATS } from '../src/data/offices';
import { insightsData } from '../src/data/insights';
import { navItems, footerLinks } from '../src/data/navigation';
import { assessmentQuestions } from '../src/data/assessment';
import { goalOptions, industryOptions, bottleneckOptions } from '../src/data/strategyEngine';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting full database seed for Mighty Warner platform...');

  // 1. Seed Super Admin User
  const defaultAdminEmail = process.env.ADMIN_INITIAL_EMAIL || 'admin@mightywarner.com';
  const defaultAdminPass = process.env.ADMIN_INITIAL_PASSWORD || 'AdminPassword2026!';
  const passwordHash = await bcrypt.hash(defaultAdminPass, 10);

  const admin = await prisma.adminUser.upsert({
    where: { email: defaultAdminEmail },
    update: {
      name: 'Mighty SuperAdmin',
      role: 'SUPERADMIN',
      isActive: true,
    },
    create: {
      email: defaultAdminEmail,
      name: 'Mighty SuperAdmin',
      passwordHash,
      role: 'SUPERADMIN',
      isActive: true,
    },
  });
  console.log(`✅ AdminUser created: ${admin.email}`);

  // 2. Seed Global Site Settings
  await prisma.siteSetting.upsert({
    where: { id: 'global' },
    update: {
      siteName: siteConfig.name,
      siteUrl: siteConfig.url,
      description: siteConfig.description,
      email: siteConfig.contact.email,
      phone: siteConfig.contact.phone,
      headquarters: siteConfig.contact.headquarters,
      socialLinks: siteConfig.links,
      stats: siteConfig.stats,
      stickyCta: {
        showMobile: true,
        cta1Text: 'Diagnostic',
        cta1Link: '/assessment',
        cta2Text: 'Start Conversation',
        cta2Link: '/contact',
      },
      growthTerminal: {
        enabled: true,
        quickActions: [
          { label: 'Growth Diagnostic (3-min)', href: '/assessment', category: 'tools' },
          { label: '90-Day Strategy Blueprint', href: '/#strategy-builder', category: 'tools' },
          { label: 'ROI Revenue Simulator', href: '/#roi-calculator', category: 'tools' },
          { label: 'Digital & Growth Solutions', href: '/businesses/digital-growth', category: 'businesses' },
          { label: 'Software & Technology', href: '/businesses/technology', category: 'businesses' },
          { label: 'Talent Solutions & SOW Pods', href: '/businesses/talent-solutions', category: 'businesses' },
          { label: 'Direct Client Inquiries', href: '/contact', category: 'company' },
        ],
      },
      seoMeta: {
        defaultTitle: 'Mighty Warner | Strategy • Technology • Talent Solutions',
        defaultDescription: siteConfig.description,
        ogImage: siteConfig.ogImage,
      },
    },
    create: {
      id: 'global',
      siteName: siteConfig.name,
      siteUrl: siteConfig.url,
      tagline: 'One Company. Multiple Ways to Move Your Business Forward.',
      description: siteConfig.description,
      email: siteConfig.contact.email,
      phone: siteConfig.contact.phone,
      headquarters: siteConfig.contact.headquarters,
      socialLinks: siteConfig.links,
      stats: siteConfig.stats,
      stickyCta: {
        showMobile: true,
        cta1Text: 'Diagnostic',
        cta1Link: '/assessment',
        cta2Text: 'Start Conversation',
        cta2Link: '/contact',
      },
      growthTerminal: {
        enabled: true,
        quickActions: [
          { label: 'Growth Diagnostic (3-min)', href: '/assessment', category: 'tools' },
          { label: '90-Day Strategy Blueprint', href: '/#strategy-builder', category: 'tools' },
          { label: 'ROI Revenue Simulator', href: '/#roi-calculator', category: 'tools' },
          { label: 'Digital & Growth Solutions', href: '/businesses/digital-growth', category: 'businesses' },
          { label: 'Software & Technology', href: '/businesses/technology', category: 'businesses' },
          { label: 'Talent Solutions & SOW Pods', href: '/businesses/talent-solutions', category: 'businesses' },
          { label: 'Direct Client Inquiries', href: '/contact', category: 'company' },
        ],
      },
      seoMeta: {
        defaultTitle: 'Mighty Warner | Strategy • Technology • Talent Solutions',
        defaultDescription: siteConfig.description,
        ogImage: siteConfig.ogImage,
      },
    },
  });
  console.log('✅ Global SiteSetting seeded');

  // 3. Seed Business Verticals (Section 4 & /businesses/*)
  for (let i = 0; i < businessesData.length; i++) {
    const v = businessesData[i];
    await prisma.businessVertical.upsert({
      where: { id: v.id },
      update: {
        slug: v.slug,
        name: v.name,
        pillarHeadline: v.pillarHeadline,
        tagline: v.tagline,
        headline: v.headline,
        subheadline: v.subheadline,
        description: v.description,
        themeColor: v.themeColor,
        accentHex: v.accentHex,
        gradient: v.gradient,
        bgGradient: v.bgGradient,
        heroImage: v.heroImage,
        audiences: v.audiences as any,
        services: v.services as any,
        outcomes: v.outcomes as any,
        featuredProjectSlugs: v.featuredProjectSlugs as any,
        coreCapabilities: v.coreCapabilities as any,
        order: i,
        isActive: true,
        metaTitle: `${v.name} | Solutions & Capabilities | Mighty Warner`,
        metaDescription: v.description,
        metaKeywords: v.coreCapabilities.join(', '),
        canonicalUrl: `/businesses/${v.slug}`,
      },
      create: {
        id: v.id,
        slug: v.slug,
        name: v.name,
        pillarHeadline: v.pillarHeadline,
        tagline: v.tagline,
        headline: v.headline,
        subheadline: v.subheadline,
        description: v.description,
        themeColor: v.themeColor,
        accentHex: v.accentHex,
        gradient: v.gradient,
        bgGradient: v.bgGradient,
        heroImage: v.heroImage,
        audiences: v.audiences as any,
        services: v.services as any,
        outcomes: v.outcomes as any,
        featuredProjectSlugs: v.featuredProjectSlugs as any,
        coreCapabilities: v.coreCapabilities as any,
        order: i,
        isActive: true,
        metaTitle: `${v.name} | Solutions & Capabilities | Mighty Warner`,
        metaDescription: v.description,
        metaKeywords: v.coreCapabilities.join(', '),
        canonicalUrl: `/businesses/${v.slug}`,
      },
    });
  }
  console.log(`✅ Seeded ${businessesData.length} Business Verticals`);

  // 4. Projects: Managed dynamically via Admin Panel (no static seed data)
  console.log('✅ Projects: Managed solely via Admin Panel');

  // 5. Seed Testimonials (Section 14)
  for (let i = 0; i < testimonialsData.length; i++) {
    const t = testimonialsData[i];
    await prisma.testimonial.upsert({
      where: { id: t.id },
      update: {
        clientName: t.clientName,
        role: t.role,
        company: t.company,
        industry: t.industry,
        quote: t.quote,
        fullQuote: t.fullQuote,
        verticalId: t.verticalId,
        relatedProjectSlug: t.relatedProjectSlug,
        relatedProjectTitle: t.relatedProjectTitle,
        rating: t.rating,
        highlightedPhrase: t.highlightedPhrase || '',
        avatarUrl: t.avatarUrl,
        featured: true,
        order: i,
      },
      create: {
        id: t.id,
        clientName: t.clientName,
        role: t.role,
        company: t.company,
        industry: t.industry,
        quote: t.quote,
        fullQuote: t.fullQuote,
        verticalId: t.verticalId,
        relatedProjectSlug: t.relatedProjectSlug,
        relatedProjectTitle: t.relatedProjectTitle,
        rating: t.rating,
        highlightedPhrase: t.highlightedPhrase || '',
        avatarUrl: t.avatarUrl,
        featured: true,
        order: i,
      },
    });
  }
  console.log(`✅ Seeded ${testimonialsData.length} Testimonials`);

  // 6. Seed Team Members / Leadership (Section 15)
  for (let i = 0; i < leadershipTeam.length; i++) {
    const tm = leadershipTeam[i];
    const memberId = `member-${i + 1}`;
    await prisma.teamMember.upsert({
      where: { id: memberId },
      update: {
        name: tm.name,
        role: tm.role,
        specialty: tm.specialty,
        bio: tm.bio,
        image: tm.avatarUrl,
        department: 'Leadership',
        linkedin: tm.linkedinUrl,
        order: i,
        featured: true,
      },
      create: {
        id: memberId,
        name: tm.name,
        role: tm.role,
        specialty: tm.specialty,
        bio: tm.bio,
        image: tm.avatarUrl,
        department: 'Leadership',
        linkedin: tm.linkedinUrl,
        order: i,
        featured: true,
      },
    });
  }
  console.log(`✅ Seeded ${leadershipTeam.length} Team Members`);

  // 7. Seed Global Offices (Section 16 & /contact)
  for (let i = 0; i < MIGHTY_OFFICES.length; i++) {
    const off = MIGHTY_OFFICES[i];
    await prisma.office.upsert({
      where: { id: off.id },
      update: {
        city: off.city,
        country: off.country,
        countryCode: off.countryCode,
        flag: off.flag,
        role: off.role,
        description: off.description,
        address: off.address,
        fullAddress: off.fullAddress,
        coordinatesLat: off.coordinates.lat,
        coordinatesLng: off.coordinates.lng,
        cobeLocation: off.cobeLocation as any,
        timezone: off.timezone,
        timezoneLabel: off.timezoneLabel,
        utcOffset: off.utcOffset,
        phoneNumbers: off.phoneNumbers as any,
        whatsapp: off.whatsapp as any,
        email: off.email,
        specialties: off.specialties as any,
        teamSizeBadge: off.teamSizeBadge,
        established: off.established,
        isHeadquarters: off.id === 'dubai',
        order: i,
      },
      create: {
        id: off.id,
        city: off.city,
        country: off.country,
        countryCode: off.countryCode,
        flag: off.flag,
        role: off.role,
        description: off.description,
        address: off.address,
        fullAddress: off.fullAddress,
        coordinatesLat: off.coordinates.lat,
        coordinatesLng: off.coordinates.lng,
        cobeLocation: off.cobeLocation as any,
        timezone: off.timezone,
        timezoneLabel: off.timezoneLabel,
        utcOffset: off.utcOffset,
        phoneNumbers: off.phoneNumbers as any,
        whatsapp: off.whatsapp as any,
        email: off.email,
        specialties: off.specialties as any,
        teamSizeBadge: off.teamSizeBadge,
        established: off.established,
        isHeadquarters: off.id === 'dubai',
        order: i,
      },
    });
  }
  console.log(`✅ Seeded ${MIGHTY_OFFICES.length} Global Offices`);

  // 8. Seed Insights / Articles (Section 18)
  for (let i = 0; i < insightsData.length; i++) {
    const ins = insightsData[i];
    await prisma.insight.upsert({
      where: { slug: ins.slug },
      update: {
        title: ins.title,
        subtitle: ins.subtitle,
        category: ins.category,
        verticalId: ins.verticalId,
        readTime: ins.readTime,
        publishedAt: new Date(ins.publishedAt),
        authorName: ins.author.name,
        authorRole: ins.author.role,
        authorAvatar: ins.author.avatarUrl,
        coverImage: ins.coverImage,
        excerpt: ins.excerpt,
        content: ins.content as any,
        keyTakeaways: ins.keyTakeaways as any,
        tags: ins.tags as any,
        featured: ins.featured,
        metaTitle: `${ins.title} | Mighty Warner Insights`,
        metaDescription: ins.excerpt,
        metaKeywords: ins.tags.join(', '),
        canonicalUrl: `/insights/${ins.slug}`,
      },
      create: {
        slug: ins.slug,
        title: ins.title,
        subtitle: ins.subtitle,
        category: ins.category,
        verticalId: ins.verticalId,
        readTime: ins.readTime,
        publishedAt: new Date(ins.publishedAt),
        authorName: ins.author.name,
        authorRole: ins.author.role,
        authorAvatar: ins.author.avatarUrl,
        coverImage: ins.coverImage,
        excerpt: ins.excerpt,
        content: ins.content as any,
        keyTakeaways: ins.keyTakeaways as any,
        tags: ins.tags as any,
        featured: ins.featured,
        metaTitle: `${ins.title} | Mighty Warner Insights`,
        metaDescription: ins.excerpt,
        metaKeywords: ins.tags.join(', '),
        canonicalUrl: `/insights/${ins.slug}`,
      },
    });
  }
  console.log(`✅ Seeded ${insightsData.length} Insights`);

  // 9. Seed Assessment Questions (Section 13 & /assessment)
  for (let i = 0; i < assessmentQuestions.length; i++) {
    const q = assessmentQuestions[i];
    await prisma.assessmentQuestion.upsert({
      where: { id: q.id },
      update: {
        step: q.number,
        question: q.question,
        subtitle: q.subtext,
        category: q.category,
        order: i,
        options: q.options as any,
      },
      create: {
        id: q.id,
        step: q.number,
        question: q.question,
        subtitle: q.subtext,
        category: q.category,
        order: i,
        options: q.options as any,
      },
    });
  }
  console.log(`✅ Seeded ${assessmentQuestions.length} Assessment Questions`);

  // 10. Seed Navigation Items (Section 0 & 20)
  // Delete existing navigation to prevent duplication during re-seeds
  await prisma.navigationItem.deleteMany({});

  // Header Nav Items
  for (let i = 0; i < navItems.length; i++) {
    const item = navItems[i];
    const parent = await prisma.navigationItem.create({
      data: {
        label: item.name,
        href: item.href,
        order: i,
        location: 'HEADER',
        isDropdown: !!item.isDropdown,
      },
    });

    if (item.dropdownItems && item.dropdownItems.length > 0) {
      for (let j = 0; j < item.dropdownItems.length; j++) {
        const sub = item.dropdownItems[j];
        await prisma.navigationItem.create({
          data: {
            parentId: parent.id,
            label: sub.name,
            href: sub.href,
            tagline: sub.tagline,
            description: sub.description,
            accentColor: sub.color,
            subItems: sub.subItems as any,
            location: 'HEADER',
            order: j,
          },
        });
      }
    }
  }

  // Footer Nav Items
  const footerCategories = Object.keys(footerLinks) as (keyof typeof footerLinks)[];
  for (let c = 0; c < footerCategories.length; c++) {
    const cat = footerCategories[c];
    const links = footerLinks[cat];
    for (let l = 0; l < links.length; l++) {
      const link = links[l];
      await prisma.navigationItem.create({
        data: {
          label: link.name,
          href: link.href,
          group: cat,
          location: 'FOOTER',
          order: c * 10 + l,
        },
      });
    }
  }
  console.log('✅ Seeded Navigation Items (Header & Footer)');

  // 11. Seed Universal Site Sections for Home Page (Sections 1-3, 5-13, 17, 19)
  const sectionsToSeed = [
    {
      pageSlug: 'home',
      sectionKey: 'hero',
      name: 'Hero Section (Pillars Narrative)',
      title: 'What are you building?',
      subtitle: 'A brand. A product. A team. Mighty Warner brings together the strategy, technology, and talent businesses need to move forward.',
      badge: 'ONE CONNECTED ECOSYSTEM • EST. 2013',
      ctaText: 'Explore Ecosystem',
      ctaLink: '/businesses',
      order: 1,
      content: {
        eyebrowMono: 'Strategy • Software • Talent',
        pillars: [
          {
            id: 'digital-growth',
            actionPrompt: 'BUILD A BRAND',
            verticalName: 'Digital & Growth',
            subtitle: 'Make your business impossible to ignore through high-impact branding, SEO dominance & conversion-driven web design.',
            badge: 'Growth Engine',
            theme: 'growth',
            accentHex: '#FF5E3A',
            glowColor: 'rgba(255, 94, 58, 0.25)',
            borderColor: 'border-orange-500/30 hover:border-orange-500/60',
            href: '/businesses/digital-growth',
            bgImageUrl: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=1600&q=80',
            tags: ['Brand Strategy', 'Web Design & Dev', 'SEO', 'Paid Performance'],
          },
          {
            id: 'technology',
            actionPrompt: 'BUILD A PRODUCT',
            verticalName: 'Technology',
            subtitle: 'Engineer scalable web applications, custom platforms, and automation systems tailored around your business requirements.',
            badge: 'Software Architecture',
            theme: 'tech',
            accentHex: '#3B82F6',
            glowColor: 'rgba(59, 130, 246, 0.25)',
            borderColor: 'border-blue-500/30 hover:border-blue-500/60',
            href: '/businesses/technology',
            bgImageUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1600&q=80',
            tags: ['Web Applications', 'Microservices', 'Custom Software', 'APIs'],
          },
          {
            id: 'talent-solutions',
            actionPrompt: 'BUILD A TEAM',
            verticalName: 'Talent Solutions',
            subtitle: 'Deploy dedicated senior engineering pods, contingent specialists, and executive hires to accelerate your roadmap.',
            badge: 'Talent Network',
            theme: 'talent',
            accentHex: '#10B981',
            glowColor: 'rgba(16, 185, 129, 0.25)',
            borderColor: 'border-emerald-500/30 hover:border-emerald-500/60',
            href: '/businesses/talent-solutions',
            bgImageUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1600&q=80',
            tags: ['SOW Dedicated Pods', 'Staff Augmentation', 'Direct Hire', 'Tech Leads'],
          },
        ],
      },
    },
    {
      pageSlug: 'home',
      sectionKey: 'trust',
      name: 'Trust Section (Since 2013)',
      title: 'Building businesses since 2013.',
      subtitle: 'Verified institutional track record across enterprise software delivery, high-velocity brand growth, and talent scaling.',
      badge: 'PROVEN TRACK RECORD',
      order: 2,
      content: {
        stats: [
          { value: '13+', label: 'Years in Business', subtext: 'Continuous innovation since 2013' },
          { value: '450+', label: 'Projects Delivered', subtext: 'Web apps, platforms & growth engines' },
          { value: '25+', label: 'Global Markets', subtext: 'North America, EMEA & APAC' },
          { value: '180+', label: 'Vetted Specialists', subtext: 'Engineers, strategists & designers' },
          { value: '98%', label: 'Satisfaction Rating', subtext: 'Measured on long-term retainers' },
        ],
        industries: [
          'Fintech & Payments',
          'Enterprise SaaS',
          'Healthcare & MedTech',
          'Supply Chain & Freight',
          'Wealth Management',
          'Digital Commerce',
        ],
      },
    },
    {
      pageSlug: 'home',
      sectionKey: 'ecosystem',
      name: 'Ecosystem Advantage (Formula)',
      title: 'Three capabilities. One connected ecosystem.',
      subtitle: "Businesses don't grow through marketing alone. They need the right story, the right technology, and the right people to bring it to life.",
      badge: 'THE CONNECTED ADVANTAGE',
      order: 3,
      content: {
        formulaTagline: 'The Mighty Warner Growth Formula',
        pillars: [
          { number: '01', title: 'PEOPLE', discipline: 'TALENT', desc: 'Engineers, strategists & leaders', color: '#10B981' },
          { number: '02', title: 'TECHNOLOGY', discipline: 'PLATFORMS', desc: 'Web apps, microservices & APIs', color: '#3B82F6' },
          { number: '03', title: 'GROWTH', discipline: 'MARKET TRACTION', desc: 'Brand positioning, SEO & pipelines', color: '#FF5E3A' },
        ],
        resultBanner: {
          badge: 'BUSINESS MOMENTUM',
          headline: 'Compounding Commercial Velocity',
          description: 'When talent, platforms, and growth engines share a single strategy, projects ship 2.5x faster with zero agency finger-pointing.',
        },
      },
    },
    {
      pageSlug: 'home',
      sectionKey: 'persona_selector',
      name: 'Persona Selector',
      title: 'Built around your commercial mandate.',
      subtitle: 'Select your role to discover how Mighty Warner aligns with your KPIs, team capacity, and quarterly deliverables.',
      badge: 'ROLE-TAILORED PERSPECTIVES',
      order: 5,
      content: {
        personas: [
          {
            id: 'ceo',
            roleTitle: 'CEO / Founder',
            category: 'Executive Leadership',
            color: '#38BDF8',
            headline: 'Unified commercial momentum with zero vendor friction.',
            primaryConcern: 'Fragmented agencies, slow time-to-market, and lack of accountability across brand, tech, and hiring.',
            solutionFocus: 'The connected ecosystem model providing Strategy + Technology + Talent under unified executive leadership.',
            recommendedCaseStudy: {
              title: 'Strata Financial: Complete Brand Repositioning & Growth Engine',
              slug: 'strata-financial-brand-transformation',
              metric: '$140M+ Pipeline Value Generated',
            },
            recommendedServiceHref: '/approach',
          },
          {
            id: 'cmo',
            roleTitle: 'CMO / VP of Growth',
            category: 'Marketing & Demand Gen',
            color: '#FF5E3A',
            headline: 'Make your brand impossible to ignore and turn traffic into pipeline.',
            primaryConcern: 'Rising CAC, outdated web experiences, and low conversion rates on high-intent campaigns.',
            solutionFocus: 'High-speed Next.js web applications, authority SEO topic clusters, and conversion funnel optimization.',
            recommendedCaseStudy: {
              title: 'Elevate Health: D2C Digital Growth & Conversion Optimization',
              slug: 'elevate-health-scale',
              metric: '-38% CAC Reduction with +74% Funnel Completion',
            },
            recommendedServiceHref: '/businesses/digital-growth',
          },
          {
            id: 'cto',
            roleTitle: 'CTO / VP of Engineering',
            category: 'Engineering & Architecture',
            color: '#3B82F6',
            headline: 'Architect high-throughput platforms and scale engineering capacity.',
            primaryConcern: 'Monolithic tech debt, slow sprint releases, and the grueling cycle of senior tech recruitment.',
            solutionFocus: 'Modern decoupled architectures (Next.js/Postgres) paired with plug-and-play senior SOW engineering pods.',
            recommendedCaseStudy: {
              title: 'Quantum Cloud Systems: SaaS Monolith to Microservices',
              slug: 'quantum-saas-platform-modernization',
              metric: '99.99% Uptime with -52% Infrastructure Overhead',
            },
            recommendedServiceHref: '/businesses/technology',
          },
          {
            id: 'cro',
            roleTitle: 'Head of People / Talent Leader',
            category: 'Talent Acquisition & HR',
            color: '#10B981',
            headline: 'Close engineering capability gaps without 90-day hiring lags.',
            primaryConcern: 'High recruiter commissions, low technical screening rigor, and unfulfilled urgent roadmaps.',
            solutionFocus: 'Vetted contingent talent, direct executive search, and managed SOW pods with milestone-guaranteed delivery.',
            recommendedCaseStudy: {
              title: 'AuraPay Global: Fintech Engineering Squad Deployment',
              slug: 'aurapay-fintech-pod-scaling',
              metric: '12 Engineers Deployed in 18 Days (Zero Delivery Slippage)',
            },
            recommendedServiceHref: '/businesses/talent-solutions',
          },
        ],
      },
    },
    {
      pageSlug: 'home',
      sectionKey: 'challenge_selector',
      name: 'Challenge Selector',
      title: 'Where is your business getting stuck?',
      subtitle: 'Identify your most critical bottleneck to see our recommended approach, capability stack, and proven solutions.',
      badge: 'DIAGNOSTIC TRIAGE',
      order: 6,
      content: {
        challenges: [
          {
            id: 'customers',
            label: 'I need more customers',
            recommendedVertical: 'Digital & Growth',
            theme: 'growth',
            color: '#FF5E3A',
            badge: 'Brand & Growth Engine',
            diagnosis: 'Your business lacks organic search visibility, high-converting digital touchpoints, or cohesive brand storytelling that turns casual visitors into qualified inbound enterprise pipeline.',
            capabilities: [
              'High-Performance Web Design & Next.js Development',
              'Top-Tier SEO & Topic Cluster Authority',
              'Conversion Rate Optimization (CRO) & Funnels',
              'Multi-Channel Performance Paid Media',
            ],
            ctaText: 'Explore Digital & Growth Solutions →',
            ctaHref: '/businesses/digital-growth',
          },
          {
            id: 'technology',
            label: 'I need better technology',
            recommendedVertical: 'Technology',
            theme: 'tech',
            color: '#3B82F6',
            badge: 'Software & Platform Architecture',
            diagnosis: 'Legacy software, monolithic bottlenecks, manual spreadsheet operations, or brittle integrations are choking your operational speed and limiting customer retention.',
            capabilities: [
              'Custom Web & Mobile Application Engineering',
              'High-Throughput Microservice Backends (NestJS/PostgreSQL)',
              'Enterprise API Gateways & System Automation',
              'Cloud Architecture & DevOps Optimization',
            ],
            ctaText: 'Explore Technology & Software Solutions →',
            ctaHref: '/businesses/technology',
          },
          {
            id: 'talent',
            label: 'I need the right people',
            recommendedVertical: 'Talent Solutions',
            theme: 'talent',
            color: '#10B981',
            badge: 'Talent Sourcing & Dedicated Pods',
            diagnosis: 'Ambitious roadmap demands are stalled by internal hiring delays, mismatched freelancer quality, or lack of niche senior technical specialists.',
            capabilities: [
              'Pre-Vetted Dedicated SOW Engineering Pods',
              'High-Impact Contingent Staffing Augmentation',
              'Executive Technical Search & Direct Hire',
              'Turnkey Talent Acquisition Operations (RPO)',
            ],
            ctaText: 'Explore Talent Solutions →',
            ctaHref: '/businesses/talent-solutions',
          },
          {
            id: 'everything',
            label: 'I need a complete transformation',
            recommendedVertical: 'Connected Ecosystem',
            theme: 'momentum',
            color: '#38BDF8',
            badge: 'Strategy • Technology • Talent',
            diagnosis: 'You are modernizing a legacy enterprise or building an ambitious category leader that demands synchronized brand elevation, custom technology, and dedicated execution teams.',
            capabilities: [
              'Unified Enterprise Commercial Roadmap',
              'Comprehensive Brand Repositioning & Web Experience',
              'Custom Scalable Software Infrastructure',
              'Embedded Engineering & Growth Delivery Pods',
            ],
            ctaText: 'Explore The Connected Ecosystem →',
            ctaHref: '/approach',
          },
        ],
      },
    },
    {
      pageSlug: 'home',
      sectionKey: 'before_after',
      name: 'Before / After Slider',
      title: 'Real transformations. Quantifiable impact.',
      subtitle: 'Compare client digital architectures and conversion performance before and after partnering with Mighty Warner.',
      badge: 'VERIFIED TRANSFORMATION',
      order: 8,
      content: {
        comparisonItems: [
          {
            id: 'strata',
            title: 'Strata Financial: Legacy Portal to Headless Engine',
            client: 'Strata Financial Group',
            vertical: 'Digital & Growth',
            beforeImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80',
            afterImage: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80',
            beforeMetrics: [
              { label: 'Page Load Speed', value: '4.8s (F Grade)' },
              { label: 'MQL Conversion Rate', value: '0.8%' },
              { label: 'Tech Stack', value: 'Monolithic WP 2015' },
            ],
            afterMetrics: [
              { label: 'Page Load Speed', value: '0.6s (99th Percentile)' },
              { label: 'MQL Conversion Rate', value: '2.9% (+210%)' },
              { label: 'Tech Stack', value: 'Next.js App Router + Tailwind' },
            ],
            summary: 'Transformed an outdated legacy portal into a high-speed wealth client acquisition engine.',
          },
          {
            id: 'quantum',
            title: 'Quantum Cloud: Monolithic PHP to Real-Time Microservices',
            client: 'Quantum Cloud Systems',
            vertical: 'Technology',
            beforeImage: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=80',
            afterImage: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80',
            beforeMetrics: [
              { label: 'System Uptime', value: '98.2% (Frequent Outages)' },
              { label: 'Telemetry Latency', value: '4,200ms' },
              { label: 'Infrastructure Cost', value: '$45,000 / mo' },
            ],
            afterMetrics: [
              { label: 'System Uptime', value: '99.99% (Zero Outages)' },
              { label: 'Telemetry Latency', value: '< 45ms' },
              { label: 'Infrastructure Cost', value: '$21,500 / mo (-52%)' },
            ],
            summary: 'Re-architected an unstable logistics platform into resilient event-driven cloud microservices.',
          },
        ],
      },
    },
    {
      pageSlug: 'home',
      sectionKey: 'method',
      name: 'The Mighty Warner Method',
      title: 'How we move businesses forward.',
      subtitle: 'A battle-tested 5-stage framework designed to de-risk investments, accelerate speed-to-market, and engineer sustainable business momentum.',
      badge: 'THE MIGHTY WARNER METHOD',
      order: 9,
      content: { steps: methodSteps },
    },
    {
      pageSlug: 'home',
      sectionKey: 'strategy_builder',
      name: '90-Day Strategy Blueprint Synthesizer',
      title: 'Build Your 90-Day Growth Strategy',
      subtitle: 'Select your primary commercial goal, target industry, and current bottleneck to generate an executive sprint blueprint.',
      badge: 'STRATEGY SYNTHESIZER',
      order: 10,
      content: {
        goalOptions,
        industryOptions,
        bottleneckOptions,
      },
    },
    {
      pageSlug: 'home',
      sectionKey: 'why_mw',
      name: 'Why Mighty Warner',
      title: 'Why ambitious companies build with us.',
      subtitle: 'We rejected the bloated agency model and fragmented vendor chains to create an integrated commercial growth partner.',
      badge: 'THE MIGHTY WARNER DIFFERENCE',
      order: 11,
      content: { coreValues },
    },
    {
      pageSlug: 'home',
      sectionKey: 'roi_calculator',
      name: 'ROI & Revenue Simulator',
      title: 'Calculate your projected revenue impact.',
      subtitle: 'Simulate how increasing digital traffic and optimizing conversion rates compounds pipeline and enterprise value.',
      badge: 'REVENUE MODELING',
      order: 12,
      content: {
        defaultVisitors: 25000,
        defaultConversionRate: 1.2,
        defaultDealSize: 8500,
        trafficLiftAssumption: 1.4, // +40%
        croLiftAssumption: 1.55,    // +55%
      },
    },
    {
      pageSlug: 'home',
      sectionKey: 'assessment_promo',
      name: 'Diagnostic Assessment Promo',
      title: 'How ready is your business for its next stage of growth?',
      subtitle: 'Take our quick 3-minute diagnostic across brand positioning, web performance, software scalability, and talent velocity to calculate your Business Momentum Score.',
      badge: 'SIGNATURE DIAGNOSTIC',
      ctaText: 'Start 3-Minute Diagnostic',
      ctaLink: '/assessment',
      order: 13,
      content: {
        trustSignals: [
          'Instant 0-100 Momentum Score',
          'Identify 3 Highest-Leverage Opportunities',
          'No Signup or Card Required',
          'Actionable Architecture Guidance',
        ],
      },
    },
    {
      pageSlug: 'home',
      sectionKey: 'about_preview',
      name: 'About Preview & Milestones',
      title: 'Building businesses since 2013.',
      subtitle: 'From our inception over a decade ago, Mighty Warner was engineered to dismantle the artificial divide between creative branding, deep software engineering, and talent scaling.',
      badge: 'OUR HERITAGE & VISION',
      ctaText: 'Learn More About Our Journey',
      ctaLink: '/about',
      order: 17,
      content: { milestones: companyMilestones },
    },
    {
      pageSlug: 'home',
      sectionKey: 'final_cta',
      name: 'Final CTA Banner',
      title: "What’s next for your business?",
      subtitle: "Maybe you need more customers. Better technology. The right people. Or a combination of all three. Let’s figure it out.",
      badge: 'YOUR GROWTH ACCELERATOR',
      ctaText: 'Start a Conversation',
      ctaLink: '/contact',
      order: 19,
      content: {
        slaNote: 'Guaranteed 24-Hour Executive Review & Response',
        secondaryCtaText: 'Explore Case Studies',
        secondaryCtaLink: '/work',
      },
    },
  ];

  for (const s of sectionsToSeed) {
    await prisma.siteSection.upsert({
      where: {
        pageSlug_sectionKey: {
          pageSlug: s.pageSlug,
          sectionKey: s.sectionKey,
        },
      },
      update: {
        name: s.name,
        title: s.title,
        subtitle: s.subtitle,
        badge: s.badge,
        ctaText: s.ctaText,
        ctaLink: s.ctaLink,
        order: s.order,
        content: s.content as any,
        isActive: true,
      },
      create: {
        pageSlug: s.pageSlug,
        sectionKey: s.sectionKey,
        name: s.name,
        title: s.title,
        subtitle: s.subtitle,
        badge: s.badge,
        ctaText: s.ctaText,
        ctaLink: s.ctaLink,
        order: s.order,
        content: s.content as any,
        isActive: true,
      },
    });
  }
  console.log(`✅ Seeded ${sectionsToSeed.length} Dynamic Site Sections`);

  // 12. Seed PageSeo Records for All Static and Dynamic Pages
  const staticSeoPages = [
    {
      path: '/',
      pageName: 'Home Page',
      metaTitle: 'Mighty Warner | Strategy • Technology • Talent Solutions',
      metaDescription: 'Mighty Warner unites Digital & Growth, Technology, and Talent Solutions under one connected ecosystem. Discover how we build brands, software platforms, and elite engineering teams.',
      metaKeywords: 'Mighty Warner, Digital Growth, Custom Software Development, Talent Solutions, Engineering Pods, Web Application Development, SEO & Performance Marketing, B2B Ecosystem',
      canonicalUrl: 'https://mightywarner.com',
      ogTitle: 'Mighty Warner | Strategy • Technology • Talent Solutions',
      ogDescription: 'Mighty Warner unites Digital & Growth, Technology, and Talent Solutions under one connected ecosystem.',
      ogImage: 'https://mightywarner.com/images/og/mighty-warner-og.jpg',
      headCode: `<script type="application/ld+json">\n{\n  "@context": "https://schema.org",\n  "@type": "Organization",\n  "name": "Mighty Warner",\n  "url": "https://mightywarner.com",\n  "logo": "https://mightywarner.com/images/mw-logo.webp",\n  "foundingDate": "2013",\n  "description": "One company. Multiple ways to move your business forward."\n}\n</script>`,
    },
    {
      path: '/about',
      pageName: 'About Us',
      metaTitle: 'About Mighty Warner | Building Businesses Since 2013',
      metaDescription: "Learn about Mighty Warner's journey from inception in 2013 to a global multi-disciplinary commercial partner across North America, EMEA, and APAC.",
      metaKeywords: 'About Mighty Warner, Leadership, Company History, Global Offices, Executive Team',
      canonicalUrl: 'https://mightywarner.com/about',
      ogTitle: 'About Mighty Warner | Building Businesses Since 2013',
      ogDescription: 'From inception in 2013 to an elite multidisciplinary growth engine.',
    },
    {
      path: '/approach',
      pageName: 'The Mighty Warner Method',
      metaTitle: 'Our Approach & Methodology | The Mighty Warner Method',
      metaDescription: 'Explore our battle-tested 5-stage framework (Discover, Define, Build, Activate, Optimize) designed to de-risk investments and compound commercial velocity.',
      metaKeywords: 'Mighty Warner Method, Growth Framework, Product Strategy, Software Architecture, Enterprise Delivery',
      canonicalUrl: 'https://mightywarner.com/approach',
    },
    {
      path: '/businesses',
      pageName: 'Businesses & Disciplines Overview',
      metaTitle: 'Core Business Verticals | Digital & Growth, Technology, Talent',
      metaDescription: "Explore Mighty Warner's three unified capabilities: Digital & Growth, Technology & Software Platforms, and Talent Solutions.",
      metaKeywords: 'Business Verticals, Digital Marketing, Software Engineering, Talent Solutions',
      canonicalUrl: 'https://mightywarner.com/businesses',
    },
    {
      path: '/businesses/digital-growth',
      pageName: 'Digital & Growth Vertical',
      metaTitle: 'Digital & Growth | High-Performance Brand & SEO Engine',
      metaDescription: 'Make your business impossible to ignore with category-defining brand identity, Next.js web applications, authority SEO, and paid performance.',
      metaKeywords: 'Brand Strategy, Web Design & Dev, SEO Topic Clusters, CRO, Performance Paid Ads',
      canonicalUrl: 'https://mightywarner.com/businesses/digital-growth',
    },
    {
      path: '/businesses/technology',
      pageName: 'Technology & Software Vertical',
      metaTitle: 'Technology & Software Platforms | Scalable Web & Cloud Architecture',
      metaDescription: 'Engineer scalable web applications, event-driven microservices, API integrations, and cloud platforms with sub-second performance.',
      metaKeywords: 'Custom Software, Web Apps, Microservices, Cloud Architecture, API Integrations',
      canonicalUrl: 'https://mightywarner.com/businesses/technology',
    },
    {
      path: '/businesses/talent-solutions',
      pageName: 'Talent Solutions Vertical',
      metaTitle: 'Talent Solutions & Engineering Pods | SOW & Direct Hire',
      metaDescription: 'Deploy dedicated senior engineering pods, contingent technical specialists, and executive hires to accelerate your roadmap with zero lag.',
      metaKeywords: 'SOW Dedicated Pods, Contingent Staffing, Technical Recruitment, Executive Search',
      canonicalUrl: 'https://mightywarner.com/businesses/talent-solutions',
    },
    {
      path: '/work',
      pageName: 'Selected Work & Case Studies',
      metaTitle: 'Featured Case Studies & Work | Mighty Warner Portfolio',
      metaDescription: 'Verified client case studies across fintech, enterprise SaaS, logistics, and digital commerce. Proven ROI, performance lifts, and architectural triumphs.',
      metaKeywords: 'Case Studies, Client Portfolio, Digital Transformation, Software Case Studies',
      canonicalUrl: 'https://mightywarner.com/work',
    },
    {
      path: '/insights',
      pageName: 'Insights & Thought Leadership',
      metaTitle: 'Insights & Strategic Perspectives | Mighty Warner',
      metaDescription: 'Actionable thought leadership on decoupled web architecture, organic search authority, and modern enterprise scaling.',
      metaKeywords: 'B2B Strategy, Engineering Insights, Organic Search Authority, Tech Articles',
      canonicalUrl: 'https://mightywarner.com/insights',
    },
    {
      path: '/contact',
      pageName: 'Contact & Global Desks',
      metaTitle: 'Start a Conversation | Contact Mighty Warner',
      metaDescription: 'Connect with our executive partners in Dubai, New York, London, Singapore, and Sydney. 24-hour response guarantee.',
      metaKeywords: 'Contact Mighty Warner, Global Offices, RFP Submission, Direct Inquiries',
      canonicalUrl: 'https://mightywarner.com/contact',
    },
    {
      path: '/assessment',
      pageName: 'Growth Diagnostic Assessment',
      metaTitle: '3-Minute Growth Diagnostic | Calculate Your Momentum Score',
      metaDescription: 'Take our rapid diagnostic assessment to benchmark your brand positioning, software stack, and talent readiness.',
      metaKeywords: 'Growth Diagnostic, Momentum Score, Business Audit, Digital Assessment',
      canonicalUrl: 'https://mightywarner.com/assessment',
    },
    {
      path: '/growth-lab',
      pageName: 'Interactive Growth Lab',
      metaTitle: 'Growth Lab & Simulation Engines | Mighty Warner',
      metaDescription: 'Interactive toolset including the 90-Day Strategy Blueprint synthesizer, ROI revenue impact simulator, and persona diagnostic.',
      metaKeywords: 'ROI Calculator, 90-Day Strategy Builder, Growth Simulation, Interactive Tools',
      canonicalUrl: 'https://mightywarner.com/growth-lab',
    },
  ];

  for (const p of staticSeoPages) {
    await prisma.pageSeo.upsert({
      where: { path: p.path },
      update: p,
      create: p,
    });
  }

  // Seed Dynamic Project Case Studies SEO
  for (const proj of projectsData) {
    const projectPath = `/work/${proj.slug}`;
    await prisma.pageSeo.upsert({
      where: { path: projectPath },
      update: {
        pageName: `Project: ${proj.title}`,
        metaTitle: `${proj.title} | Case Study | Mighty Warner`,
        metaDescription: proj.shortDescription,
        metaKeywords: proj.technologiesUsed ? proj.technologiesUsed.join(', ') : 'Case Study',
        canonicalUrl: `https://mightywarner.com/work/${proj.slug}`,
        ogTitle: proj.title,
        ogDescription: proj.shortDescription,
        ogImage: proj.heroImage,
        headCode: `<script type="application/ld+json">\n{\n  "@context": "https://schema.org",\n  "@type": "CreativeWork",\n  "headline": "${proj.title}",\n  "image": "${proj.heroImage}",\n  "author": "Mighty Warner",\n  "description": "${proj.shortDescription.replace(/"/g, '\\"')}"\n}\n</script>`,
      },
      create: {
        path: projectPath,
        pageName: `Project: ${proj.title}`,
        metaTitle: `${proj.title} | Case Study | Mighty Warner`,
        metaDescription: proj.shortDescription,
        metaKeywords: proj.technologiesUsed ? proj.technologiesUsed.join(', ') : 'Case Study',
        canonicalUrl: `https://mightywarner.com/work/${proj.slug}`,
        ogTitle: proj.title,
        ogDescription: proj.shortDescription,
        ogImage: proj.heroImage,
        headCode: `<script type="application/ld+json">\n{\n  "@context": "https://schema.org",\n  "@type": "CreativeWork",\n  "headline": "${proj.title}",\n  "image": "${proj.heroImage}",\n  "author": "Mighty Warner",\n  "description": "${proj.shortDescription.replace(/"/g, '\\"')}"\n}\n</script>`,
      },
    });
  }

  // Seed Dynamic Insights Articles SEO (with Article JSON-LD Schema like in the screenshot!)
  for (const ins of insightsData) {
    const insightPath = `/insights/${ins.slug}`;
    await prisma.pageSeo.upsert({
      where: { path: insightPath },
      update: {
        pageName: `Insight: ${ins.title}`,
        metaTitle: `${ins.title} | Mighty Warner Insights`,
        metaDescription: ins.excerpt,
        metaKeywords: ins.tags ? ins.tags.join(', ') : 'Insights, Strategy',
        canonicalUrl: `https://mightywarner.com/insights/${ins.slug}`,
        ogTitle: ins.title,
        ogDescription: ins.excerpt,
        ogImage: ins.coverImage,
        headCode: `<script type="application/ld+json">\n{\n  "@context": "https://schema.org",\n  "@type": "Article",\n  "mainEntityOfPage": {\n    "@type": "WebPage",\n    "@id": "https://mightywarner.com/insights/${ins.slug}"\n  },\n  "headline": "${ins.title.replace(/"/g, '\\"')}",\n  "image": "${ins.coverImage}",\n  "author": {\n    "@type": "Person",\n    "name": "${ins.author.name}"\n  },\n  "publisher": {\n    "@type": "Organization",\n    "name": "Mighty Warner",\n    "logo": {\n      "@type": "ImageObject",\n      "url": "https://mightywarner.com/images/mw-logo.webp"\n    }\n  },\n  "datePublished": "${ins.publishedAt}",\n  "description": "${ins.excerpt.replace(/"/g, '\\"')}"\n}\n</script>`,
      },
      create: {
        path: insightPath,
        pageName: `Insight: ${ins.title}`,
        metaTitle: `${ins.title} | Mighty Warner Insights`,
        metaDescription: ins.excerpt,
        metaKeywords: ins.tags ? ins.tags.join(', ') : 'Insights, Strategy',
        canonicalUrl: `https://mightywarner.com/insights/${ins.slug}`,
        ogTitle: ins.title,
        ogDescription: ins.excerpt,
        ogImage: ins.coverImage,
        headCode: `<script type="application/ld+json">\n{\n  "@context": "https://schema.org",\n  "@type": "Article",\n  "mainEntityOfPage": {\n    "@type": "WebPage",\n    "@id": "https://mightywarner.com/insights/${ins.slug}"\n  },\n  "headline": "${ins.title.replace(/"/g, '\\"')}",\n  "image": "${ins.coverImage}",\n  "author": {\n    "@type": "Person",\n    "name": "${ins.author.name}"\n  },\n  "publisher": {\n    "@type": "Organization",\n    "name": "Mighty Warner",\n    "logo": {\n      "@type": "ImageObject",\n      "url": "https://mightywarner.com/images/mw-logo.webp"\n    }\n  },\n  "datePublished": "${ins.publishedAt}",\n  "description": "${ins.excerpt.replace(/"/g, '\\"')}"\n}\n</script>`,
      },
    });
  }
  console.log('✅ Seeded PageSeo records for all Static and Dynamic pages');

  console.log('🎉 Database seed completed successfully! All platform content is live in Neon PostgreSQL.');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
