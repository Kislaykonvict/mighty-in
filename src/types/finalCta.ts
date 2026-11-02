export interface FinalCtaData {
  badge: string;
  title: string;
  subtitle: string;
  primaryCtaText: string;
  primaryCtaLink: string;
  secondaryCtaText: string;
  secondaryCtaLink: string;
  showSecondaryCta: boolean;
  guaranteeNote: string;
  isActive: boolean;
}

export const defaultFinalCtaData: FinalCtaData = {
  badge: 'YOUR GROWTH ACCELERATOR',
  title: 'What’s next for your business?',
  subtitle:
    '<p>Maybe you need more customers.</p><p>Better technology.</p><p>The right people.</p><p><strong>Or a combination of all three. Let’s figure it out.</strong></p>',
  primaryCtaText: 'Start a conversation',
  primaryCtaLink: '/contact',
  secondaryCtaText: 'Take the 3-minute assessment',
  secondaryCtaLink: '/assessment',
  showSecondaryCta: true,
  guaranteeNote:
    'Average initial strategic consultation booked within 24 business hours • Non-disclosure agreement guaranteed',
  isActive: true,
};
