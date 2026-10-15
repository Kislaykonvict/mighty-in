import { Metadata } from 'next';
import { constructDynamicMetadata } from '@/lib/utils/seo';
import { CustomHeadCode } from '@/components/seo/CustomHeadCode';
import { HeroSection } from '@/components/hero/HeroSection';
import { TrustSection } from '@/components/trust/TrustSection';
import { EcosystemSection } from '@/components/ecosystem/EcosystemSection';
import { BusinessCardsSection } from '@/components/businesses/BusinessCardsSection';
import { PersonaSelector } from '@/components/interactive/PersonaSelector';
import { ChallengeSelector } from '@/components/challenge/ChallengeSelector';
import { WorkSection } from '@/components/work/WorkSection';
import { BeforeAfterSlider } from '@/components/interactive/BeforeAfterSlider';
import { MethodSection } from '@/components/method/MethodSection';
import { StrategyBuilder } from '@/components/interactive/StrategyBuilder';
import { WhySection } from '@/components/why/WhySection';
import { RoiCalculator } from '@/components/interactive/RoiCalculator';
import { AssessmentPromoSection } from '@/components/assessment/AssessmentPromoSection';
import { TestimonialsSection } from '@/components/testimonials/TestimonialsSection';
import { PeopleSection } from '@/components/people/PeopleSection';
import { GlobalOfficesSection } from '@/components/globe/GlobalOfficesSection';
import { AboutPreviewSection } from '@/components/about/AboutPreviewSection';
import { InsightsPreviewSection } from '@/components/insights/InsightsPreviewSection';
import { FinalCtaSection } from '@/components/cta/FinalCtaSection';
import { SectionContainer } from '@/components/layout/SectionContainer';

export async function generateMetadata(): Promise<Metadata> {
  return constructDynamicMetadata('/', {
    title: 'One Company. Multiple Ways to Move Your Business Forward',
    description:
      'Mighty Warner unites Digital & Growth, Technology, and Talent Solutions under one connected ecosystem. Discover how we build brands, software platforms, and elite engineering teams.',
    canonical: '/',
  });
}

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Dynamic SEO Custom Header Scripts, Meta Tags & Schema */}
      <CustomHeadCode path="/" />

      {/* 1. Attention: Signature Hero Narrative */}
      <HeroSection />

      {/* 2. Understanding: Verified Trust & Inception */}
      <TrustSection />

      {/* 3. Narrative Ecosystem: People + Tech + Growth = Momentum */}
      <EcosystemSection />

      {/* 4. Core Business Pillars: 3 Major Disciplines */}
      <BusinessCardsSection />

      {/* 5. Role-Tailored Perspectives: Persona Selector */}
      <SectionContainer width="default" paddingY="sm">
        <PersonaSelector />
      </SectionContainer>

      {/* 6. Self-Identification: Challenge Selector */}
      <ChallengeSelector />

      {/* 7. Proof: Verified Portfolio & Case Studies */}
      <WorkSection />

      {/* 8. Transformation Proof: Before / After Slider */}
      <SectionContainer width="default" paddingY="sm">
        <BeforeAfterSlider />
      </SectionContainer>

      {/* 9. Methodology: The Mighty Warner Method (5-Stage Framework) */}
      <MethodSection />

      {/* 10. Interactive 90-Day Strategy Blueprint Synthesizer */}
      <SectionContainer width="default" paddingY="sm">
        <StrategyBuilder />
      </SectionContainer>

      {/* 11. Differentiation: Why Mighty Warner */}
      <WhySection />

      {/* 12. Interactive Revenue & ROI Impact Simulator */}
      <SectionContainer width="default" paddingY="sm">
        <RoiCalculator />
      </SectionContainer>

      {/* 13. Signature Diagnostic Engagement: 3-Minute Growth Diagnostic */}
      <AssessmentPromoSection />

      {/* 14. Social Proof: Executive Endorsements & Reviews */}
      <TestimonialsSection />

      {/* 15. Multidisciplinary Culture: Leadership & People */}
      <PeopleSection />

      {/* 16. Global Footprint: Interactive 3D Globe with Pinpoint Offices */}
      <GlobalOfficesSection />

      {/* 17. Heritage: Since 2013 Timeline */}
      <AboutPreviewSection />

      {/* 17. Strategic Perspectives: Insights & Articles */}
      <InsightsPreviewSection />

      {/* 18. Conversion: Final What's Next CTA */}
      <FinalCtaSection />
    </div>
  );
}
