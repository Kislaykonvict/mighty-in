'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, Search, ArrowRight, Sparkles, Cpu, Users, Layers, Calculator, ShieldCheck, X } from 'lucide-react';

interface TerminalAction {
  id: string;
  title: string;
  description: string;
  category: string;
  icon: React.ComponentType<{ className?: string }>;
  action: () => void;
  shortcut?: string;
}

export function GrowthTerminal() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  const actions: TerminalAction[] = [
    {
      id: 'diagnostic',
      title: 'Run 3-Minute Business Momentum Diagnostic',
      description: 'Calculate your digital readiness and growth score (0-100)',
      category: 'Diagnostic',
      icon: Sparkles,
      shortcut: 'DIAG',
      action: () => {
        router.push('/growth-lab?tab=diagnostic');
        setIsOpen(false);
      },
    },
    {
      id: 'roi',
      title: 'Open Interactive ROI & Revenue Impact Simulator',
      description: 'Model compounding annual pipeline gains from traffic & CRO',
      category: 'Tools',
      icon: Calculator,
      shortcut: 'ROI',
      action: () => {
        router.push('/growth-lab?tab=roi');
        setIsOpen(false);
      },
    },
    {
      id: 'strategy',
      title: 'Synthesize 90-Day Strategy Blueprint',
      description: 'Generate customized sprint roadmap by goal & industry',
      category: 'Tools',
      icon: Layers,
      shortcut: 'STRAT',
      action: () => {
        router.push('/growth-lab?tab=strategy');
        setIsOpen(false);
      },
    },
    {
      id: 'before-after',
      title: 'View Before & After Transformation Showcase',
      description: 'Interactive split-screen comparison of legacy vs modernized stacks',
      category: 'Showcase',
      icon: Layers,
      action: () => {
        router.push('/growth-lab?tab=showcase');
        setIsOpen(false);
      },
    },
    {
      id: 'digital',
      title: 'Explore Digital & Growth Vertical',
      description: 'Branding, Web Design, Next.js Development, SEO, Paid Media',
      category: 'Businesses',
      icon: Sparkles,
      action: () => {
        router.push('/businesses/digital-growth');
        setIsOpen(false);
      },
    },
    {
      id: 'tech',
      title: 'Explore Technology & Software Vertical',
      description: 'Web & Mobile Applications, Microservices, APIs, Automation',
      category: 'Businesses',
      icon: Cpu,
      action: () => {
        router.push('/businesses/technology');
        setIsOpen(false);
      },
    },
    {
      id: 'talent',
      title: 'Explore Talent Solutions Vertical',
      description: 'SOW Dedicated Pods, Staff Augmentation, Direct Hire Search',
      category: 'Businesses',
      icon: Users,
      action: () => {
        router.push('/businesses/talent-solutions');
        setIsOpen(false);
      },
    },
    {
      id: 'work',
      title: 'Browse Verified Case Studies',
      description: 'Explore verified client outcomes across financial, tech & healthcare',
      category: 'Portfolio',
      icon: ArrowRight,
      action: () => {
        router.push('/work');
        setIsOpen(false);
      },
    },
    {
      id: 'offices',
      title: 'Global Office Hubs (3D Globe Visualization)',
      description: 'Explore our UAE, USA, Canada, and India hubs with live real-time clocks',
      category: 'Locations',
      icon: Layers,
      shortcut: 'GLOBE',
      action: () => {
        router.push('/#global-offices');
        setIsOpen(false);
      },
    },
    {
      id: 'contact',
      title: 'Start Strategic Consultation',
      description: 'Schedule a 30-minute discovery call with our partners',
      category: 'Action',
      icon: ArrowRight,
      action: () => {
        router.push('/contact');
        setIsOpen(false);
      },
    },
  ];

  const filtered = actions.filter(
    (a) =>
      a.title.toLowerCase().includes(query.toLowerCase()) ||
      a.description.toLowerCase().includes(query.toLowerCase()) ||
      a.category.toLowerCase().includes(query.toLowerCase())
  );

  const handleActionSelect = (action: TerminalAction) => {
    action.action();
  };

  const handleInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % Math.max(1, filtered.length));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filtered.length) % Math.max(1, filtered.length));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filtered[selectedIndex]) {
        handleActionSelect(filtered[selectedIndex]);
      }
    }
  };

  return (
    <>
      {/* Floating launcher trigger for mobile and desktop */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-40 p-3 rounded-full bg-[#0F1626]/90 hover:bg-[#151F36] border border-white/15 text-sky-400 shadow-2xl hover:scale-105 transition-all group flex items-center gap-2"
        aria-label="Open Mighty Warner Command Terminal (Ctrl+K)"
      >
        <Terminal className="w-5 h-5 text-sky-400" />
        <span className="hidden sm:inline-block text-xs font-mono font-bold text-slate-200 group-hover:text-white pr-1">
          Growth Lab (Ctrl+K)
        </span>
      </button>

      {/* Terminal Modal Dialog */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-md"
            />

            {/* Modal Dialog Body */}
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: -10 }}
              transition={{ duration: 0.18, ease: 'easeOut' }}
              className="relative w-full max-w-2xl rounded-2xl bg-[#0B101E] border border-white/15 shadow-2xl shadow-black/90 overflow-hidden z-10"
            >
              {/* Terminal Title Bar */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-[#080C14]">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                  <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                  <span className="text-xs font-mono text-slate-400 ml-2 font-bold">
                    mighty-warner-terminal://v2.4
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="hidden sm:inline-block px-2 py-0.5 rounded text-[10px] font-mono bg-white/5 text-slate-400">
                    ESC to close
                  </span>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-1 rounded text-slate-400 hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Command Input Prompt */}
              <div className="p-4 border-b border-white/10 flex items-center gap-3">
                <Search className="w-5 h-5 text-sky-400 shrink-0" />
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="Type a command or jump to tool (e.g. diagnostic, roi, strategy, tech)..."
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    setSelectedIndex(0);
                  }}
                  onKeyDown={handleInputKeyDown}
                  className="w-full bg-transparent text-white placeholder-slate-500 text-sm sm:text-base focus:outline-none font-sans"
                />
              </div>

              {/* Action List */}
              <div className="max-h-[360px] overflow-y-auto p-2 space-y-1">
                {filtered.length === 0 ? (
                  <div className="p-8 text-center text-xs font-mono text-slate-500">
                    No matching actions found. Try typing &ldquo;diagnostic&rdquo;, &ldquo;roi&rdquo;, or &ldquo;tech&rdquo;.
                  </div>
                ) : (
                  filtered.map((action, idx) => {
                    const isSelected = idx === selectedIndex;
                    const Icon = action.icon;

                    return (
                      <button
                        key={action.id}
                        type="button"
                        onClick={() => handleActionSelect(action)}
                        onMouseEnter={() => setSelectedIndex(idx)}
                        className={`w-full p-3 rounded-xl text-left flex items-center justify-between transition-colors ${
                          isSelected
                            ? 'bg-white/10 text-white'
                            : 'hover:bg-white/[0.04] text-slate-300'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                              isSelected
                                ? 'bg-sky-500 text-white'
                                : 'bg-white/5 text-slate-400'
                            }`}
                          >
                            <Icon className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="text-sm font-semibold text-white">
                              {action.title}
                            </div>
                            <div className="text-xs text-slate-400">
                              {action.description}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 text-slate-400 uppercase">
                            {action.category}
                          </span>
                          <ArrowRight
                            className={`w-4 h-4 text-sky-400 transition-transform ${
                              isSelected ? 'translate-x-0.5 opacity-100' : 'opacity-0'
                            }`}
                          />
                        </div>
                      </button>
                    );
                  })
                )}
              </div>

              {/* Terminal Footer */}
              <div className="p-3 bg-[#080C14] border-t border-white/10 flex items-center justify-between text-[11px] font-mono text-slate-500">
                <span>Use ↑↓ keys to navigate, Enter to select</span>
                <span>Mighty Warner Ecosystem Lab</span>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
