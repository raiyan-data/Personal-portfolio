import { useState, useEffect } from 'react';
import { Sun, Moon, Search, Menu, X, ArrowRight } from 'lucide-react';
import ScrollProgressBar from './ScrollProgressBar.tsx';
import Stack from './Stack.tsx';

interface NavbarProps {
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  onOpenSearch: () => void;
}

export default function Navbar({ theme, onToggleTheme, onOpenSearch }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<
    'home' | 'work' | 'roadmap' | 'how-i-work' | 'about'
  >('home');

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const sections: ('home' | 'work' | 'roadmap' | 'how-i-work' | 'about')[] = [
        'home',
        'work',
        'roadmap',
        'how-i-work',
        'about',
      ];
      const scrollPosition = scrollY + 160;

      if (scrollY < 240) {
        setActiveSection('home');
        return;
      }

      for (const section of sections) {
        const id = section === 'home' ? 'top' : section;
        const el = document.getElementById(id);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const navItems = [
    { label: 'Home', href: '#top', id: 'home' },
    { label: 'Work', href: '#work', id: 'work' },
    { label: 'Roadmap', href: '#roadmap', id: 'roadmap' },
    { label: 'How I work', href: '#how-i-work', id: 'how-i-work' },
    { label: 'About', href: '#about', id: 'about' },
  ] as const;

  return (
    <>
      {/* Header: sticky, 80px tall (64px on phone), items vertically centered */}
      <header className="sticky top-0 z-40 w-full h-[64px] min-[900px]:h-[var(--s-10)] bg-[var(--bg)] border-b border-[var(--rule)] relative select-none">
        <div className="content-container h-full">
          <div className="flex items-center justify-between min-[900px]:grid min-[900px]:grid-cols-[auto_1fr_auto] h-full w-full gap-[var(--s-4)]">
            {/* Left: 28px circle logo (left half --ink, right half --accent) + wordmark "Raiyan Islam" */}
            <div className="min-[900px]:justify-self-start flex items-center">
              <a
                href="#top"
                className="min-h-[44px] flex items-center gap-[var(--s-3)] shrink-0 swiss-focus group"
                aria-label="Raiyan Islam homepage"
              >
                <span
                  className="w-7 h-7 rounded-full overflow-hidden flex shrink-0 border border-[var(--rule)]"
                  aria-hidden="true"
                >
                  <span className="w-1/2 h-full bg-[var(--ink)] block" />
                  <span className="w-1/2 h-full bg-[var(--accent)] block" />
                </span>
                <span className="text-[17px] font-semibold text-[var(--ink)] tracking-tight whitespace-nowrap font-sans">
                  Raiyan Islam
                </span>
              </a>
            </div>

            {/* Center: nav Home, Work, Roadmap, How I work, About. Gaps 32px apart. Hidden under 900px */}
            <div className="justify-self-center hidden min-[900px]:flex items-center justify-center">
              <nav
                className="flex items-center gap-[var(--s-7)] font-mono-plex text-[13px] uppercase tracking-[0.08em] whitespace-nowrap"
                aria-label="Main navigation"
              >
                {navItems.map((item) => {
                  const isActive = activeSection === item.id;
                  return (
                    <a
                      key={item.id}
                      href={item.href}
                      className={`nav-link-draw whitespace-nowrap py-[var(--s-1)] swiss-focus ${
                        isActive
                          ? 'text-[var(--ink)] font-medium active'
                          : 'text-[var(--muted)] hover:text-[var(--ink)]'
                      }`}
                    >
                      {item.label}
                    </a>
                  );
                })}
              </nav>
            </div>

            {/* Right: Actions */}
            <div className="min-[900px]:justify-self-end flex items-center gap-[var(--s-2)] sm:gap-[var(--s-3)] whitespace-nowrap shrink-0">
              {/* Search button: 44px tap target */}
              <button
                type="button"
                onClick={onOpenSearch}
                className="w-[44px] h-[44px] flex items-center justify-center border border-[var(--rule)] rounded-[4px] text-[var(--ink)] hover:bg-[var(--ink)] hover:text-[var(--bg)] transition-colors duration-150 swiss-focus shrink-0"
                aria-label="Search site (Cmd/Ctrl+K)"
                title="Search site (Cmd/Ctrl+K)"
              >
                <Search size={16} strokeWidth={2} />
              </button>

              {/* Theme toggle: hidden under 900px (moves inside mobile menu) */}
              <button
                type="button"
                onClick={onToggleTheme}
                className="hidden min-[900px]:flex w-[44px] h-[44px] items-center justify-center border border-[var(--rule)] rounded-[4px] text-[var(--ink)] hover:bg-[var(--ink)] hover:text-[var(--bg)] transition-colors duration-150 swiss-focus shrink-0"
                aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
                title={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
              >
                {theme === 'dark' ? <Sun size={16} strokeWidth={2} /> : <Moon size={16} strokeWidth={2} />}
              </button>

              {/* "Contact me" button: hidden under 900px (moves inside mobile menu) */}
              <a
                href="#contact"
                className="btn-primary min-h-[44px] hidden min-[900px]:inline-flex shrink-0"
              >
                <span className="relative z-10">Contact me</span>
              </a>

              {/* Mobile menu button: under 900px only, 44px tap target */}
              <button
                type="button"
                onClick={() => setMobileMenuOpen(true)}
                className="min-[900px]:hidden w-[44px] h-[44px] flex items-center justify-center border border-[var(--rule)] rounded-[4px] text-[var(--ink)] hover:bg-[var(--ink)] hover:text-[var(--bg)] transition-colors duration-150 swiss-focus shrink-0"
                aria-label="Open mobile menu"
                aria-expanded={mobileMenuOpen}
              >
                <Menu size={18} strokeWidth={2} />
              </button>
            </div>
          </div>
        </div>

        {/* 2px scroll progress bar fixed on header bottom edge */}
        <ScrollProgressBar />
      </header>

      {/* Full-screen mobile menu overlay: safe area padding, scrollable container, settings never cut off */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-50 bg-[var(--bg)] text-[var(--ink)] min-[900px]:hidden overflow-y-auto overscroll-contain"
          role="dialog"
          aria-modal="true"
          aria-label="Mobile navigation"
        >
          <div className="min-h-full flex flex-col justify-between p-[var(--s-5)] sm:p-[var(--s-6)] pt-[max(var(--s-5),env(safe-area-inset-top))] pb-[max(var(--s-6),calc(var(--s-5)+env(safe-area-inset-bottom)))] pl-[max(var(--s-5),env(safe-area-inset-left))] pr-[max(var(--s-5),env(safe-area-inset-right))]">
            {/* Top Bar with brand and 44px Close button */}
            <div className="flex items-center justify-between pb-[var(--s-4)] border-b border-[var(--rule)] shrink-0">
              <div className="flex items-center gap-[var(--s-3)]">
                <span className="w-7 h-7 rounded-full overflow-hidden flex shrink-0 border border-[var(--rule)]" aria-hidden="true">
                  <span className="w-1/2 h-full bg-[var(--ink)] block" />
                  <span className="w-1/2 h-full bg-[var(--accent)] block" />
                </span>
                <span className="text-[17px] font-semibold text-[var(--ink)] tracking-tight">
                  Raiyan Islam
                </span>
              </div>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="w-[44px] h-[44px] flex items-center justify-center border border-[var(--rule)] rounded-[4px] text-[var(--ink)] hover:bg-[var(--ink)] hover:text-[var(--bg)] transition-colors duration-150 swiss-focus shrink-0"
                aria-label="Close mobile menu"
              >
                <X size={20} strokeWidth={2} />
              </button>
            </div>

            {/* Links */}
            <nav className="py-[var(--s-6)] flex flex-col gap-[var(--s-5)] my-auto shrink-0">
              {navItems.map((item) => {
                const isActive = activeSection === item.id;
                return (
                  <a
                    key={item.id}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`text-[28px] sm:text-[32px] font-semibold tracking-tight transition-colors duration-150 block ${
                      isActive
                        ? 'text-[var(--ink)] underline decoration-[var(--ink)] decoration-2 underline-offset-8'
                        : 'text-[var(--muted)] hover:text-[var(--ink)]'
                    }`}
                  >
                    {item.label}
                  </a>
                );
              })}
            </nav>

            {/* Bottom actions moved inside mobile menu: Theme toggle & Contact me button */}
            <div className="pt-[var(--s-5)] sm:pt-[var(--s-6)] border-t border-[var(--rule)] shrink-0 font-mono-plex text-[13px] mt-auto">
              <Stack gap={4}>
                {/* Theme Toggle row */}
                <div className="flex items-center justify-between">
                  <span className="label-mono">Theme mode</span>
                  <button
                    type="button"
                    onClick={onToggleTheme}
                    className="min-h-[44px] px-[var(--s-4)] flex items-center gap-[var(--s-2)] border border-[var(--rule)] rounded-[4px] text-[var(--ink)] hover:bg-[var(--ink)] hover:text-[var(--bg)] transition-colors duration-150 swiss-focus cursor-pointer"
                    aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
                  >
                    {theme === 'dark' ? <Sun size={16} strokeWidth={2} /> : <Moon size={16} strokeWidth={2} />}
                    <span className="capitalize">{theme} mode</span>
                  </button>
                </div>

                {/* "Contact me" primary button */}
                <a
                  href="#contact"
                  onClick={() => setMobileMenuOpen(false)}
                  className="btn-primary w-full h-[48px] text-[16px] flex items-center justify-center"
                >
                  <span className="relative z-10">Contact me</span>
                  <ArrowRight size={16} className="relative z-10" />
                </a>

                {/* Direct contact line */}
                <div className="pt-[var(--s-3)] border-t border-[var(--rule)] flex items-center justify-between text-[var(--muted)] text-[12px] sm:text-[13px]">
                  <span>rmhislam@gmail.com</span>
                  <span>Silver Spring, MD</span>
                </div>
              </Stack>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
