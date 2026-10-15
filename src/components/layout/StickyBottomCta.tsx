'use client';

import React, { useState, useEffect } from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { analytics } from '@/lib/analytics';

export function StickyBottomCta() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show after user has scrolled 300px
      setVisible(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!visible) return null;

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-30 p-3 bg-[#080C14]/90 backdrop-blur-xl border-t border-white/10 shadow-2xl animate-fade-in">
      <div className="flex items-center gap-3">
        <Button
          href="/assessment"
          variant="secondary"
          size="sm"
          className="flex-1 text-xs"
          leftIcon={<Sparkles className="w-3.5 h-3.5 text-sky-400" />}
          onClick={() => analytics.trackCtaClick('Diagnostic Mobile Bar', 'StickyBottomCta')}
        >
          Diagnostic
        </Button>

        <Button
          href="/contact"
          variant="growth"
          size="sm"
          className="flex-1 text-xs"
          rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
          onClick={() => analytics.trackCtaClick('Start Conversation Mobile Bar', 'StickyBottomCta')}
        >
          Start Conversation
        </Button>
      </div>
    </div>
  );
}
