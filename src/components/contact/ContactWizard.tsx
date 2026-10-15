'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  Cpu,
  Users,
  Layers,
  CheckCircle2,
  ArrowRight,
  Send,
  Building,
  Mail,
  Phone,
  User,
  Globe,
  DollarSign,
  Clock,
  Briefcase,
} from 'lucide-react';
import { InquiryTopic, ContactRequest } from '@/types/contact';
import { contactApi } from '@/lib/api/contact';
import { Button } from '@/components/ui/Button';
import { analytics } from '@/lib/analytics';

const topicOptions = [
  {
    id: 'digital-growth' as InquiryTopic,
    label: 'Digital & Growth',
    tagline: 'Brand, Web, SEO & Acquisition',
    icon: Sparkles,
    color: '#FF5E3A',
    themeClass: 'hover:border-orange-500/50',
  },
  {
    id: 'technology' as InquiryTopic,
    label: 'Technology',
    tagline: 'Custom Web Apps, Platforms & APIs',
    icon: Cpu,
    color: '#3B82F6',
    themeClass: 'hover:border-blue-500/50',
  },
  {
    id: 'talent-solutions' as InquiryTopic,
    label: 'Talent Solutions',
    tagline: 'Contingent Staffing, Direct Hire & SOW',
    icon: Users,
    color: '#10B981',
    themeClass: 'hover:border-emerald-500/50',
  },
  {
    id: 'ecosystem' as InquiryTopic,
    label: 'Connected Ecosystem',
    tagline: 'Strategy + Technology + Talent Combined',
    icon: Layers,
    color: '#38BDF8',
    themeClass: 'hover:border-sky-500/50',
  },
];

export function ContactWizard() {
  const searchParams = useSearchParams();
  const initialTopic = (searchParams.get('topic') as InquiryTopic) || 'digital-growth';
  const initialType = searchParams.get('type') || 'employer';

  const [topic, setTopic] = useState<InquiryTopic>(initialTopic);
  const [talentAudience, setTalentAudience] = useState<'employer' | 'candidate'>(
    initialType === 'candidate' ? 'candidate' : 'employer'
  );

  // Form Fields State
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [message, setMessage] = useState('');

  // Vertical-specific fields
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [marketingGoals, setMarketingGoals] = useState('');
  const [techProjectType, setTechProjectType] = useState('web-app');
  const [techTimeline, setTechTimeline] = useState('1-3-months');
  const [talentRoles, setTalentRoles] = useState('');
  const [talentModel, setTalentModel] = useState('sow');

  // Status State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [referenceId, setReferenceId] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    analytics.trackContactStart(topic);
  }, [topic]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!fullName || !email || !companyName) {
      setErrorMessage('Please complete all required fields (Name, Email, Company).');
      return;
    }

    setIsSubmitting(true);

    const payload: ContactRequest = {
      topic,
      fullName,
      email,
      phone,
      companyName,
      message,
      digitalDetails:
        topic === 'digital-growth'
          ? {
              websiteUrl,
              marketingChallenge: marketingGoals,
            }
          : undefined,
      technologyDetails:
        topic === 'technology'
          ? {
              projectType: techProjectType as any,
              timeline: techTimeline as any,
            }
          : undefined,
      talentDetails:
        topic === 'talent-solutions'
          ? {
              audienceType: talentAudience,
              targetRoles: talentRoles,
              requirementType: talentModel as any,
            }
          : undefined,
      submittedAt: new Date().toISOString(),
    };

    try {
      const response = await contactApi.submit(payload);
      if (response.success) {
        setIsSuccess(true);
        setReferenceId(response.referenceId || 'MW-CONFIRMED');
        analytics.trackContactSubmit(topic, companyName);
      } else {
        setErrorMessage(response.message || 'Submission failed. Please try again.');
      }
    } catch (err) {
      setErrorMessage('Network error occurred. Please try again or email us directly.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="p-8 sm:p-14 rounded-3xl bg-[#0F1626] border border-emerald-500/30 text-center space-y-6 shadow-2xl animate-fade-in">
        <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-8 h-8" />
        </div>

        <div>
          <div className="text-xs font-mono uppercase tracking-widest text-emerald-400 font-bold mb-2">
            INQUIRY RECEIVED • REFERENCE #{referenceId}
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-3">
            Thank you, {fullName}.
          </h2>
          <p className="text-slate-300 text-sm sm:text-base max-w-lg mx-auto leading-relaxed">
            Our strategic leadership team has received your details for{' '}
            <strong className="text-white">{companyName}</strong>. We are reviewing your requirements and will reach out within 24 business hours.
          </p>
        </div>

        <div className="pt-4 flex items-center justify-center gap-4">
          <Button
            href="/"
            variant="outline"
            size="md"
          >
            Return to Homepage
          </Button>

          <Button
            href="/work"
            variant="primary"
            size="md"
          >
            Explore Case Studies
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 sm:p-12 rounded-3xl bg-[#0F1626] border border-white/10 shadow-2xl relative">
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Step 1: Vertical Selection */}
        <div>
          <label className="block text-xs font-mono uppercase tracking-widest text-slate-400 mb-3 font-semibold">
            01. What can we help you move forward?
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {topicOptions.map((opt) => {
              const isSelected = topic === opt.id;
              const Icon = opt.icon;

              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setTopic(opt.id)}
                  className={`p-4 rounded-2xl text-left border transition-all duration-200 flex flex-col justify-between ${
                    isSelected
                      ? 'bg-white/10 border-white/40 text-white shadow-lg ring-1 ring-white/20'
                      : `bg-white/[0.02] border-white/8 ${opt.themeClass} text-slate-300`
                  }`}
                  style={{
                    borderColor: isSelected ? opt.color : undefined,
                  }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <Icon className="w-5 h-5" style={{ color: opt.color }} />
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: opt.color }}
                    />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-white mb-0.5">
                      {opt.label}
                    </div>
                    <div className="text-[11px] text-slate-400 leading-tight">
                      {opt.tagline}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Talent Audience Toggle if Talent is selected */}
        {topic === 'talent-solutions' && (
          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex flex-col sm:flex-row items-center justify-between gap-4">
            <span className="text-xs font-mono text-emerald-300 uppercase tracking-wider font-semibold">
              I am reaching out as:
            </span>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                type="button"
                onClick={() => setTalentAudience('employer')}
                className={`flex-1 sm:flex-none px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  talentAudience === 'employer'
                    ? 'bg-emerald-500 text-slate-950 shadow'
                    : 'bg-white/5 text-slate-300 hover:text-white'
                }`}
              >
                An Employer (Hiring)
              </button>
              <button
                type="button"
                onClick={() => setTalentAudience('candidate')}
                className={`flex-1 sm:flex-none px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  talentAudience === 'candidate'
                    ? 'bg-emerald-500 text-slate-950 shadow'
                    : 'bg-white/5 text-slate-300 hover:text-white'
                }`}
              >
                A Candidate (Seeking Roles)
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Core Contact Info */}
        <div className="space-y-4">
          <label className="block text-xs font-mono uppercase tracking-widest text-slate-400 font-semibold">
            02. Your Contact Information
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-slate-300 mb-1.5 font-medium">
                Full Name <span className="text-rose-400">*</span>
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Sarah Jenkins"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-400 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs text-slate-300 mb-1.5 font-medium">
                Work Email <span className="text-rose-400">*</span>
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  placeholder="s.jenkins@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-400 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs text-slate-300 mb-1.5 font-medium">
                Company / Organization <span className="text-rose-400">*</span>
              </label>
              <div className="relative">
                <Building className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Acme Corp"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-400 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs text-slate-300 mb-1.5 font-medium">
                Phone Number (Optional)
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="tel"
                  placeholder="+1 (555) 000-0000"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-400 transition-all"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Step 3: Dynamic Tailored Fields based on Selected Vertical */}
        <div className="space-y-4 pt-2 border-t border-white/8">
          <label className="block text-xs font-mono uppercase tracking-widest text-slate-400 font-semibold">
            03. Project & Requirements Details
          </label>

          {topic === 'digital-growth' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-slate-300 mb-1.5 font-medium">
                  Current Website URL (If applicable)
                </label>
                <div className="relative">
                  <Globe className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="url"
                    placeholder="https://yourcompany.com"
                    value={websiteUrl}
                    onChange={(e) => setWebsiteUrl(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-orange-400 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-slate-300 mb-1.5 font-medium">
                  Primary Marketing Objective
                </label>
                <input
                  type="text"
                  placeholder="e.g. Brand redesign, SEO organic rankings, Lead gen"
                  value={marketingGoals}
                  onChange={(e) => setMarketingGoals(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-orange-400 transition-all"
                />
              </div>
            </div>
          )}

          {topic === 'technology' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-slate-300 mb-1.5 font-medium">
                  Project Type
                </label>
                <select
                  value={techProjectType}
                  onChange={(e) => setTechProjectType(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#080C14] border border-white/10 text-white text-sm focus:outline-none focus:border-blue-400 transition-all"
                >
                  <option value="web-app">Custom Web Application</option>
                  <option value="mobile-app">Mobile App (iOS / Android)</option>
                  <option value="enterprise-platform">Enterprise SaaS / Cloud Platform</option>
                  <option value="api-automation">API Integration & Automation Mesh</option>
                  <option value="modernization">Legacy Code Modernization</option>
                </select>
              </div>

              <div>
                <label className="block text-xs text-slate-300 mb-1.5 font-medium">
                  Target Launch Timeline
                </label>
                <select
                  value={techTimeline}
                  onChange={(e) => setTechTimeline(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#080C14] border border-white/10 text-white text-sm focus:outline-none focus:border-blue-400 transition-all"
                >
                  <option value="immediate">Immediate / Next 30 Days</option>
                  <option value="1-3-months">1 to 3 Months</option>
                  <option value="3-6-months">3 to 6 Months</option>
                  <option value="exploring">Exploratory / Budget Planning</option>
                </select>
              </div>
            </div>
          )}

          {topic === 'talent-solutions' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-slate-300 mb-1.5 font-medium">
                  Engagement Model
                </label>
                <select
                  value={talentModel}
                  onChange={(e) => setTalentModel(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#080C14] border border-white/10 text-white text-sm focus:outline-none focus:border-emerald-400 transition-all"
                >
                  <option value="sow">Statement of Work (SOW) Pod</option>
                  <option value="contingent">Contingent Staff Augmentation</option>
                  <option value="direct-hire">Direct Hire / Executive Search</option>
                  <option value="rpo">Embedded Talent Acquisition (RPO)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs text-slate-300 mb-1.5 font-medium">
                  Target Roles / Technologies Needed
                </label>
                <input
                  type="text"
                  placeholder="e.g. Senior Full-Stack Node/React Engineers, DevOps"
                  value={talentRoles}
                  onChange={(e) => setTalentRoles(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-emerald-400 transition-all"
                />
              </div>
            </div>
          )}

          {/* General Message */}
          <div>
            <label className="block text-xs text-slate-300 mb-1.5 font-medium">
              Brief Overview of Goals & Requirements
            </label>
            <textarea
              rows={4}
              placeholder="Tell us about the problem you are solving, your expected outcomes, or any specific constraints..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-sky-400 transition-all resize-none"
            />
          </div>
        </div>

        {/* Error Feedback */}
        {errorMessage && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-medium">
            {errorMessage}
          </div>
        )}

        {/* Submit Button */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-white/8">
          <span className="text-xs font-mono text-slate-400">
            🔒 All inquiries protected under standard mutual NDA
          </span>

          <Button
            type="submit"
            variant="growth"
            size="lg"
            isLoading={isSubmitting}
            rightIcon={<Send className="w-4 h-4" />}
          >
            Submit Strategic Inquiry
          </Button>
        </div>
      </form>
    </div>
  );
}
