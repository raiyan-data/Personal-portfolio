/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useLayoutEffect } from 'react';
import Navbar from './components/Navbar.tsx';
import Hero from './components/Hero.tsx';
import WorkSection from './components/WorkSection.tsx';
import RoadmapSection from './components/RoadmapSection.tsx';
import HowIWorkSection from './components/HowIWorkSection.tsx';
import AboutSection from './components/AboutSection.tsx';
import ContactSection from './components/ContactSection.tsx';
import Footer from './components/Footer.tsx';
import CvModal from './components/CvModal.tsx';
import SearchModal from './components/SearchModal.tsx';
import LoadingScreen from './components/LoadingScreen.tsx';
import FloatingControls from './components/FloatingControls.tsx';

export default function App() {
  // Ensure scroll is at the top immediately before first layout paint
  useLayoutEffect(() => {
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }
    if (window.location.hash) {
      history.replaceState(null, '', window.location.pathname + window.location.search);
    }
    window.scrollTo(0, 0);
  }, []);

  // Guarantee page starts at top on load and pageshow (back/forward navigation)
  useEffect(() => {
    const handleResetScroll = () => {
      window.scrollTo(0, 0);
    };
    window.addEventListener('load', handleResetScroll);
    window.addEventListener('pageshow', handleResetScroll);
    return () => {
      window.removeEventListener('load', handleResetScroll);
      window.removeEventListener('pageshow', handleResetScroll);
    };
  }, []);

  const isFirstLoad = typeof window !== 'undefined'
    && !sessionStorage.getItem('portfolio_visited')
    && !window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const [heroStarted, setHeroStarted] = useState(!isFirstLoad);
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('theme');
      if (saved === 'dark' || saved === 'light') return saved;
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) return 'dark';
    }
    return 'light';
  });

  const [isCvOpen, setIsCvOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute('data-theme', theme);
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Global keyboard shortcut: Ctrl+K / Cmd+K to open search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const handleOpenCv = () => {
    setIsCvOpen(true);
  };

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--ink)] transition-colors duration-150">
      {/* Skip to content link: visible on keyboard focus as first element */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-[var(--s-4)] focus:left-[var(--s-4)] focus:z-50 focus:px-[var(--s-4)] focus:py-[var(--s-2)] focus:bg-[var(--ink)] focus:text-[var(--bg)] focus:border focus:border-[var(--rule)] focus:rounded-[4px] focus:font-mono-plex focus:text-[13px] swiss-focus"
      >
        Skip to content
      </a>

      {/* Loading animation on first load only (0 to 1.2s counter, 600ms curtain slide-up) */}
      <LoadingScreen
        onHeroStart={() => setHeroStarted(true)}
        onFinish={() => window.scrollTo(0, 0)}
      />

      {/* Sticky header with 1px bottom rule, housing absolute 2px scroll progress bar */}
      <Navbar
        theme={theme}
        onToggleTheme={toggleTheme}
        onOpenSearch={() => setIsSearchOpen(true)}
      />

      {/* Main Page Content */}
      <main id="main-content" tabIndex={-1} className="outline-none">
        <Hero
          heroStarted={heroStarted}
          isFirstLoad={isFirstLoad}
          onOpenCvModal={handleOpenCv}
        />
        <WorkSection />
        <RoadmapSection />
        <HowIWorkSection />
        <AboutSection />
        <ContactSection onOpenCvModal={handleOpenCv} />
      </main>

      {/* Footer */}
      <Footer onOpenCvModal={handleOpenCv} />

      {/* Floating Controls: Back-to-top after 600px & Floating contact button */}
      <FloatingControls />

      {/* Modals & Dialogs */}
      <CvModal
        isOpen={isCvOpen}
        onClose={() => setIsCvOpen(false)}
      />

      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />
    </div>
  );
}
