export interface AboutStoryCard {
  id: string;
  badge?: string;
  title: string;
  paragraphs: string[];
  image: string;
  imageAlt: string;
}

export interface AboutStoryData {
  badge?: string;
  title: string;
  subtitle: string;
  cards: AboutStoryCard[];
  isActive?: boolean;
}

export const defaultAboutStoryData: AboutStoryData = {
  badge: 'OUR PHILOSOPHY',
  title: 'Our Philosophy & Craft',
  subtitle:
    'We rejected the bloated agency model in favor of an integrated commercial partner. We combine high-velocity engineering, human-in-the-loop AI workflows, and deliberate product strategy so visionary companies can build without operational compromise.',
  isActive: true,
  cards: [
    {
      id: 'depth-over-overhead',
      badge: '01 / SYSTEMIC DEPTH',
      title: 'Building with depth, not agency overhead',
      paragraphs: [
        'Traditional agencies bill for meetings and bloated account layers; we optimize for deployed business velocity. Every engagement is structured around senior multidisciplinary pods that work directly inside your codebase and product roadmap.',
        'By pairing full-stack Next.js engineering with dedicated AI automation pipelines, our teams build scalable digital architectures that perform seamlessly under commercial demand from day one.',
      ],
      image: '/images/about/story-engineer.jpg',
      imageAlt: 'Mighty Warner engineer developing scalable digital architecture in design studio',
    },
    {
      id: 'create-without-compromise',
      badge: '02 / UNCOMPROMISING CRAFT',
      title: 'A way to create without compromise',
      paragraphs: [
        'Great products live at the intersection of aesthetic distinction and rigorous systems design. Our teams bridge brand narrative with functional conversion architecture, crafting cohesive digital experiences that do not just look world-class—they convert and endure.',
        'Whether deploying tailored design tokens or modular interface systems, we empower your marketing and product teams to move at startup speed without ever diluting brand integrity or stability.',
      ],
      image: '/images/about/story-designer.jpg',
      imageAlt: 'Mighty Warner product designer refining brand systems and digital interfaces',
    },
  ],
};
