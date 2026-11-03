import React from 'react';

export interface ContactTopicOption {
  id: string;
  label: string;
  tagline: string;
  icon: string; // 'Sparkles' | 'Cpu' | 'Users' | 'Layers' | 'Code' | 'Rocket' | 'Globe' | 'ShieldCheck'
  color: string;
}

export interface DirectChannelsData {
  title: string;
  emailLabel: string;
  email: string;
  officesLabel: string;
  officesText: string;
  officesLink?: string;
  slaLabel: string;
  slaText: string;
}

export interface ConfidentialityGuaranteeData {
  title: string;
  description: string;
}

export interface ContactFormData {
  step1Heading: string;
  talentAudiencePrompt: string;
  talentEmployerLabel: string;
  talentCandidateLabel: string;
  step2Heading: string;
  nameLabel: string;
  namePlaceholder: string;
  emailLabel: string;
  emailPlaceholder: string;
  companyLabel: string;
  companyPlaceholder: string;
  phoneLabel: string;
  phonePlaceholder: string;
  step3Heading: string;
  messageLabel: string;
  messagePlaceholder: string;
  ndaText: string;
  submitButtonText: string;
  successBadge: string;
  successHeading: string;
  successMessage: string;
  returnHomeText: string;
  caseStudiesText: string;
}

export interface ContactSectionData {
  badge: string;
  title: string;
  highlightedTitle: string;
  description: string;
  topics: ContactTopicOption[];
  form: ContactFormData;
  directChannels: DirectChannelsData;
  confidentiality: ConfidentialityGuaranteeData;
  isActive: boolean;
}

export const defaultContactSectionData: ContactSectionData = {
  badge: 'INITIATE PARTNERSHIP',
  title: 'Let’s figure out what’s',
  highlightedTitle: 'next for your business.',
  description:
    'Tell us about your brand goals, software requirements, or talent needs. We will connect you directly with the relevant practice lead.',
  topics: [
    {
      id: 'digital-growth',
      label: 'Digital & Growth',
      tagline: 'Brand, Web, SEO & Acquisition',
      icon: 'Sparkles',
      color: '#FF5E3A',
    },
    {
      id: 'technology',
      label: 'Technology',
      tagline: 'Custom Web Apps, Platforms & APIs',
      icon: 'Cpu',
      color: '#3B82F6',
    },
    {
      id: 'talent-solutions',
      label: 'Talent Solutions',
      tagline: 'Contingent Staffing, Direct Hire & SOW',
      icon: 'Users',
      color: '#10B981',
    },
    {
      id: 'ecosystem',
      label: 'Connected Ecosystem',
      tagline: 'Strategy + Technology + Talent Combined',
      icon: 'Layers',
      color: '#38BDF8',
    },
  ],
  form: {
    step1Heading: '01. What can we help you move forward?',
    talentAudiencePrompt: 'I am reaching out as:',
    talentEmployerLabel: 'An Employer (Hiring)',
    talentCandidateLabel: 'A Candidate (Seeking Roles)',
    step2Heading: '02. Your Contact Information',
    nameLabel: 'Full Name',
    namePlaceholder: 'e.g. Sarah Jenkins',
    emailLabel: 'Work Email',
    emailPlaceholder: 's.jenkins@company.com',
    companyLabel: 'Company / Organization',
    companyPlaceholder: 'e.g. Acme Corp',
    phoneLabel: 'Phone Number (Optional)',
    phonePlaceholder: '+1 (555) 000-0000',
    step3Heading: '03. Project & Requirements Details',
    messageLabel: 'Brief Overview of Goals & Requirements',
    messagePlaceholder:
      'Tell us about the problem you are solving, your expected outcomes, or any specific constraints...',
    ndaText: '🔒 All inquiries protected under standard mutual NDA',
    submitButtonText: 'Submit Strategic Inquiry',
    successBadge: 'INQUIRY RECEIVED • REFERENCE #{referenceId}',
    successHeading: 'Thank you, {fullName}.',
    successMessage:
      'Our strategic leadership team has received your details for {companyName}. We are reviewing your requirements and will reach out within 24 business hours.',
    returnHomeText: 'Return to Homepage',
    caseStudiesText: 'Explore Case Studies',
  },
  directChannels: {
    title: 'DIRECT CHANNELS',
    emailLabel: 'General Inquiries',
    email: 'hello@mightywarner.com',
    officesLabel: 'Global Office Network',
    officesText: 'Global Offices (North America, APAC, EMEA)',
    officesLink: '/contact#global-offices',
    slaLabel: 'Guaranteed SLA',
    slaText: 'Initial response within 24 business hours',
  },
  confidentiality: {
    title: 'Confidentiality Guarantee',
    description:
      'We handle proprietary business strategies, source code discussions, and executive hiring searches under strict mutual non-disclosure agreements.',
  },
  isActive: true,
};
